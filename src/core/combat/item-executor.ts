import type { Combatant, CombatLogEntry, FloatingText } from '../types/combat.ts';
import type { Item } from '../types/items.ts';
import type { IRandomNumberGenerator } from '../rng/rng.ts';
import { applyStatusEffect } from './status-manager.ts';
import { createLogEntry, createFloatingText } from './combat-events.ts';

export interface ItemExecutionResult {
  nextActor: Combatant;
  nextTarget: Combatant;
  logs: CombatLogEntry[];
  floatingTexts: FloatingText[];
  energyGained?: number;
  cardsGained?: number;
  success: boolean;
}

/**
 * Pure execution function for using consumable items during combat.
 */
export function executeItemAction(
  actor: Combatant,
  target: Combatant,
  item: Item,
  round: number,
  rng: IRandomNumberGenerator
): ItemExecutionResult {
  if (item.type !== 'CONSUMABLE' || !item.consumableEffect) {
    return {
      nextActor: actor,
      nextTarget: target,
      logs: [],
      floatingTexts: [],
      success: false,
    };
  }

  let nextTarget = { ...target, statusEffects: [...target.statusEffects] };
  let nextActor = { ...actor, statusEffects: [...actor.statusEffects] };
  const logs: CombatLogEntry[] = [];
  const floatingTexts: FloatingText[] = [];
  const effect = item.consumableEffect;
  let energyGained = 0;
  let cardsGained = 0;

  // ==========================================
  // 1. HEAL HP
  // ==========================================
  if (effect.type === 'HEAL_HP') {
    const healAmount = Math.min(nextActor.maxHp - nextActor.currentHp, effect.value);
    nextActor.currentHp += healAmount;

    floatingTexts.push(createFloatingText(nextActor.id, `+${healAmount} HP`, 'heal'));
    logs.push(
      createLogEntry({
        round,
        actorName: actor.name,
        targetName: nextActor.name,
        actionType: 'ITEM',
        entryType: 'HEAL',
        message: `🧪 ${actor.name} drinks [${item.name}], restoring +${healAmount} HP!`,
        heal: healAmount,
      })
    );
  }

  // ==========================================
  // 2. RESTORE ENERGY / MANA
  // ==========================================
  else if (effect.type === 'RESTORE_ENERGY' || effect.type === 'HEAL_MANA') {
    energyGained = effect.type === 'RESTORE_ENERGY' ? effect.value : Math.max(1, Math.round(effect.value / 40));
    nextActor.currentMana = Math.min(nextActor.maxMana, nextActor.currentMana + effect.value);

    floatingTexts.push(createFloatingText(nextActor.id, `+${energyGained} ENERGY`, 'buff'));
    logs.push(
      createLogEntry({
        round,
        actorName: actor.name,
        targetName: nextActor.name,
        actionType: 'ITEM',
        entryType: 'BUFF',
        message: `⚡ ${actor.name} drinks [${item.name}], gaining +${energyGained} Combat Energy!`,
      })
    );
  }

  // ==========================================
  // 3. RESTORE COMBAT SHIELD / BLOCK
  // ==========================================
  else if (effect.type === 'RESTORE_SHIELD') {
    nextActor.shieldHp = (nextActor.shieldHp || 0) + effect.value;

    floatingTexts.push(createFloatingText(nextActor.id, `+${effect.value} SHIELD`, 'defend'));
    logs.push(
      createLogEntry({
        round,
        actorName: actor.name,
        targetName: nextActor.name,
        actionType: 'ITEM',
        entryType: 'DEFEND',
        message: `🛡️ ${actor.name} quaffs [${item.name}], raising a +${effect.value} Block shield barrier!`,
      })
    );
  }

  // ==========================================
  // 4. CURE STATUS
  // ==========================================
  else if (effect.type === 'CURE_STATUS') {
    const cleansed = nextActor.statusEffects.filter(
      (s) =>
        s.type !== 'POISON' &&
        s.type !== 'BLEEDING' &&
        s.type !== 'BURNING' &&
        s.type !== 'CORROSION' &&
        s.type !== 'SHOCKED' &&
        s.type !== 'BLINDED'
    );
    nextActor.statusEffects = cleansed;

    floatingTexts.push(createFloatingText(nextActor.id, 'PURIFIED', 'buff'));
    logs.push(
      createLogEntry({
        round,
        actorName: actor.name,
        targetName: nextActor.name,
        actionType: 'ITEM',
        entryType: 'BUFF',
        message: `✨ ${actor.name} uses [${item.name}], cleansing all harmful debuffs and status ailments!`,
      })
    );
  }

  // ==========================================
  // 5. APPLY BUFF
  // ==========================================
  else if (effect.type === 'APPLY_BUFF' && effect.statusType) {
    const appResult = applyStatusEffect(
      nextActor,
      {
        effectId: effect.statusType,
        chance: 1.0,
        duration: effect.duration || 3,
        potency: effect.value,
      },
      actor,
      rng
    );

    if (appResult.applied) {
      nextActor = appResult.target;
      if (appResult.log) logs.push(appResult.log);
      if (appResult.float) floatingTexts.push(appResult.float);
    }
  }

  // ==========================================
  // 6. DAMAGE ENEMY (THROWABLE BOMBS & FLASKS)
  // ==========================================
  else if (effect.type === 'DAMAGE_ENEMY') {
    let damage = effect.value;
    let targetShield = nextTarget.shieldHp || 0;
    let targetHp = nextTarget.currentHp;

    if (damage > 0) {
      if (targetShield > 0) {
        if (targetShield >= damage) {
          targetShield -= damage;
          damage = 0;
        } else {
          damage -= targetShield;
          targetShield = 0;
        }
      }
      targetHp = Math.max(0, targetHp - damage);
    }

    nextTarget.shieldHp = targetShield;
    nextTarget.currentHp = targetHp;
    if (targetHp <= 0) {
      nextTarget.isDead = true;
    }

    if (effect.value > 0) {
      floatingTexts.push(createFloatingText(nextTarget.id, `💣 -${effect.value}`, 'damage'));
      logs.push(
        createLogEntry({
          round,
          actorName: actor.name,
          targetName: nextTarget.name,
          actionType: 'ITEM',
          entryType: 'DAMAGE',
          message: `💥 ${actor.name} hurls [${item.name}] at ${nextTarget.name}, dealing ${effect.value} ${effect.damageElement || 'elemental'} damage!`,
          damage: effect.value,
        })
      );
    }

    // Apply secondary status (Burning, Shocked, Corrosion, Blinded)
    if (effect.statusType) {
      const appResult = applyStatusEffect(
        nextTarget,
        {
          effectId: effect.statusType,
          chance: 1.0,
          duration: effect.statusDuration || 3,
          potency: effect.statusPotency || 10,
        },
        actor,
        rng
      );
      if (appResult.applied) {
        nextTarget = appResult.target;
        if (appResult.log) logs.push(appResult.log);
        if (appResult.float) floatingTexts.push(appResult.float);
      }
    }

    // Smoke bomb bonus shield
    if (item.id === 'smoke-bomb') {
      nextActor.shieldHp = (nextActor.shieldHp || 0) + 18;
      floatingTexts.push(createFloatingText(nextActor.id, '+18 SHIELD', 'defend'));
    }
  }

  // ==========================================
  // 7. DRAW CARDS (SCROLLS & ELIXIRS)
  // ==========================================
  else if (effect.type === 'DRAW_CARDS') {
    cardsGained = effect.cardsToDraw || effect.value || 2;
    floatingTexts.push(createFloatingText(nextActor.id, `+${cardsGained} CARDS`, 'buff'));
    logs.push(
      createLogEntry({
        round,
        actorName: actor.name,
        targetName: nextActor.name,
        actionType: 'ITEM',
        entryType: 'BUFF',
        message: `📜 ${actor.name} reads [${item.name}], immediately drawing +${cardsGained} cards!`,
      })
    );
  }

  if (actor.id === target.id) {
    nextTarget = nextActor;
  }

  return {
    nextActor,
    nextTarget,
    logs,
    floatingTexts,
    energyGained,
    cardsGained,
    success: true,
  };
}
