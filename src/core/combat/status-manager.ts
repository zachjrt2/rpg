import type { Combatant, CombatLogEntry, FloatingText } from '../types/combat.ts';
import type { StatusEffectApplication, ActiveStatusEffect, StatusEffectType } from '../types/status-effects.ts';
import type { IRandomNumberGenerator } from '../rng/rng.ts';
import { createLogEntry, createFloatingText } from './combat-events.ts';

let statusCounter = 0;

export function hasStatus(combatant: Combatant, type: StatusEffectType): boolean {
  return combatant.statusEffects.some((s) => s.type === type && s.remainingTurns > 0);
}

export function getStatus(combatant: Combatant, type: StatusEffectType): ActiveStatusEffect | undefined {
  return combatant.statusEffects.find((s) => s.type === type && s.remainingTurns > 0);
}

/**
 * Applies a status effect to a combatant, handling stacking and refreshing.
 */
export function applyStatusEffect(
  target: Combatant,
  application: StatusEffectApplication,
  source: Combatant,
  rng: IRandomNumberGenerator
): { applied: boolean; target: Combatant; log?: CombatLogEntry; float?: FloatingText } {
  // Check chance roll
  if (!rng.rollChance(application.chance)) {
    return { applied: false, target };
  }

  statusCounter++;
  const effectType = application.effectId;
  const potency = application.potency ?? 15;
  const duration = application.duration;

  // Handle Shielded immediately on combatant resource
  if (effectType === 'SHIELDED') {
    target.shieldHp = (target.shieldHp || 0) + potency;
  }

  const existingIndex = target.statusEffects.findIndex((s) => s.type === effectType);
  let updatedEffects = [...target.statusEffects];

  if (existingIndex >= 0) {
    // Refresh duration and stack potency
    const existing = updatedEffects[existingIndex];
    const isStackingPotency = ['REGENERATION', 'POISON', 'BLEEDING', 'BURNING', 'THORNS', 'CORROSION'].includes(effectType);

    const newPotency = isStackingPotency ? existing.potency + potency : Math.max(existing.potency, potency);
    const newRemainingTurns = effectType === 'REGENERATION'
      ? Math.max(existing.remainingTurns, newPotency)
      : Math.max(existing.remainingTurns, duration);

    updatedEffects[existingIndex] = {
      ...existing,
      remainingTurns: newRemainingTurns,
      potency: newPotency,
    };
  } else {
    // Add new status effect
    const initialDuration = effectType === 'REGENERATION' ? Math.max(duration, potency) : duration;
    const newEffect: ActiveStatusEffect = {
      id: `status-${Date.now()}-${statusCounter}`,
      type: effectType,
      name: effectType.charAt(0) + effectType.slice(1).toLowerCase(),
      duration: initialDuration,
      remainingTurns: initialDuration,
      potency,
      sourceId: source.id,
      sourceName: source.name,
    };
    updatedEffects.push(newEffect);
  }

  const updatedTarget = {
    ...target,
    statusEffects: updatedEffects,
  };

  const float = createFloatingText(target.id, `+${effectType}`, 'status');
  const log = createLogEntry({
    round: 1,
    actorName: source.name,
    targetName: target.name,
    actionType: 'ABILITY',
    entryType: 'DEBUFF',
    message: `${target.name} is afflicted with [${effectType}] for ${duration} turns!`,
  });

  return {
    applied: true,
    target: updatedTarget,
    log,
    float,
  };
}

/**
 * Processes all status ticks at the start of a combatant's turn:
 * DoTs (Burning, Poison, Bleed, Corrosion), HoTs (Regen), CC (Stun, Freeze), and duration expiration.
 */
export function processTurnStartStatuses(
  combatant: Combatant,
  round: number,
  dotMultiplier: number = 1.0
): {
  combatant: Combatant;
  logs: CombatLogEntry[];
  floatingTexts: FloatingText[];
  shouldSkipTurn: boolean;
  isKilled: boolean;
} {
  let currentHp = combatant.currentHp;
  let shieldHp = combatant.shieldHp || 0;
  let isDead = combatant.isDead;
  let shouldSkipTurn = false;
  const logs: CombatLogEntry[] = [];
  const floatingTexts: FloatingText[] = [];

  const remainingEffects: ActiveStatusEffect[] = [];

  for (const effect of combatant.statusEffects) {
    if (effect.remainingTurns <= 0) continue;

    // DoT: Burning
    if (effect.type === 'BURNING') {
      const rawBurn = Math.max(1, effect.potency);
      const burnDmg = Math.round(rawBurn * dotMultiplier);
      currentHp = Math.max(0, currentHp - burnDmg);
      floatingTexts.push(createFloatingText(combatant.id, `BURN -${burnDmg}`, 'damage'));
      logs.push(
        createLogEntry({
          round,
          actorName: combatant.name,
          actionType: 'PASS',
          entryType: 'STATUS_TICK',
          message: `🔥 ${combatant.name} suffers ${burnDmg} Fire damage from [BURNING]!`,
        })
      );
    }
    // DoT: Poison (Bypasses shield entirely, ticks for current potency, decays by 1)
    else if (effect.type === 'POISON') {
      const rawPoison = Math.max(1, effect.potency);
      const poisonDmg = Math.round(rawPoison * dotMultiplier);
      currentHp = Math.max(0, currentHp - poisonDmg);
      floatingTexts.push(createFloatingText(combatant.id, `POISON -${poisonDmg}`, 'damage'));
      logs.push(
        createLogEntry({
          round,
          actorName: combatant.name,
          actionType: 'PASS',
          entryType: 'STATUS_TICK',
          message: `🧪 ${combatant.name} suffers ${poisonDmg} Poison damage (pierces shield)!`,
        })
      );
    }

    // DoT: Bleeding
    else if (effect.type === 'BLEEDING') {
      const rawBleed = Math.max(1, effect.potency);
      const bleedDmg = Math.round(rawBleed * dotMultiplier);
      currentHp = Math.max(0, currentHp - bleedDmg);
      floatingTexts.push(createFloatingText(combatant.id, `BLEED -${bleedDmg}`, 'damage'));
      logs.push(
        createLogEntry({
          round,
          actorName: combatant.name,
          actionType: 'PASS',
          entryType: 'STATUS_TICK',
          message: `🩸 ${combatant.name} suffers ${bleedDmg} Bleed damage from [BLEEDING]!`,
        })
      );
    }

    // DoT & Acid Shred: Corrosion
    else if (effect.type === 'CORROSION') {
      const acidDmg = Math.max(1, Math.round(effect.potency * dotMultiplier));
      currentHp = Math.max(0, currentHp - acidDmg);
      const shieldShred = Math.min(shieldHp, effect.potency * 2);
      shieldHp -= shieldShred;
      floatingTexts.push(createFloatingText(combatant.id, `CORRODE -${acidDmg}`, 'damage'));
      if (shieldShred > 0) {
        floatingTexts.push(createFloatingText(combatant.id, `SHIELD -${shieldShred}`, 'info'));
      }
      logs.push(
        createLogEntry({
          round,
          actorName: combatant.name,
          actionType: 'PASS',
          entryType: 'STATUS_TICK',
          message: `🧪 ${combatant.name} is dissolved by [CORROSION], taking ${acidDmg} acid damage${shieldShred > 0 ? ` and losing ${shieldShred} Block` : ''}!`,
        })
      );
    }

    // HoT: Regeneration (Heals for potency, decays by 1 each round)
    else if (effect.type === 'REGENERATION') {
      const healAmount = Math.min(combatant.maxHp - currentHp, effect.potency);
      if (healAmount > 0) {
        currentHp += healAmount;
        floatingTexts.push(createFloatingText(combatant.id, `+${healAmount}`, 'heal'));
        logs.push(
          createLogEntry({
            round,
            actorName: combatant.name,
            actionType: 'PASS',
            entryType: 'HEAL',
            message: `✨ ${combatant.name} regenerates +${healAmount} HP from [REGENERATION].`,
            heal: healAmount,
          })
        );
      }
    }

    // CC: Stunned
    else if (effect.type === 'STUNNED') {
      shouldSkipTurn = true;
      floatingTexts.push(createFloatingText(combatant.id, 'STUNNED', 'status'));
      logs.push(
        createLogEntry({
          round,
          actorName: combatant.name,
          actionType: 'PASS',
          entryType: 'INFO',
          message: `⚡ ${combatant.name} is [STUNNED] and unable to act this turn!`,
        })
      );
    }

    // CC: Frozen
    else if (effect.type === 'FROZEN') {
      shouldSkipTurn = true;
      floatingTexts.push(createFloatingText(combatant.id, 'FROZEN', 'status'));
      logs.push(
        createLogEntry({
          round,
          actorName: combatant.name,
          actionType: 'PASS',
          entryType: 'INFO',
          message: `❄️ ${combatant.name} is [FROZEN] in solid ice and cannot move!`,
        })
      );
    }

    // Decrement duration and decay potency for Poison & Regeneration
    let turnsLeft = effect.remainingTurns - 1;
    let nextPotency = effect.potency;

    if (effect.type === 'POISON' || effect.type === 'REGENERATION') {
      nextPotency = Math.max(0, effect.potency - 1);
      if (nextPotency === 0) {
        turnsLeft = 0;
      }
    }

    if (turnsLeft > 0 && nextPotency > 0) {
      remainingEffects.push({ ...effect, potency: nextPotency, remainingTurns: turnsLeft });
    } else {
      logs.push(
        createLogEntry({
          round,
          actorName: combatant.name,
          actionType: 'PASS',
          entryType: 'STATUS_EXPIRE',
          message: `[${effect.type}] on ${combatant.name} has expired.`,
        })
      );
      // If shield expired, clear shield HP
      if (effect.type === 'SHIELDED') {
        combatant.shieldHp = 0;
      }
    }
  }

  // Check death from DoTs
  if (currentHp <= 0) {
    isDead = true;
    logs.push(
      createLogEntry({
        round,
        actorName: combatant.name,
        actionType: 'PASS',
        entryType: 'DEFEAT',
        message: `☠️ ${combatant.name} succumbed to status ailments and fell!`,
        isKilled: true,
      })
    );
  }

  const updatedCombatant: Combatant = {
    ...combatant,
    currentHp,
    shieldHp,
    isDead,
    statusEffects: remainingEffects,
  };

  return {
    combatant: updatedCombatant,
    logs,
    floatingTexts,
    shouldSkipTurn,
    isKilled: isDead,
  };
}
