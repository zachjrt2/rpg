import type { Combatant, CombatLogEntry, FloatingText, DamageCalculationResult } from '../types/combat.ts';
import type { Ability } from '../types/abilities.ts';
import type { IRandomNumberGenerator } from '../rng/rng.ts';
import { applyStatusEffect, hasStatus } from './status-manager.ts';
import { createLogEntry, createFloatingText } from './combat-events.ts';

export interface AbilityExecutionResult {
  nextActor: Combatant;
  nextTarget: Combatant;
  logs: CombatLogEntry[];
  floatingTexts: FloatingText[];
  damageResult?: DamageCalculationResult;
  success: boolean;
}

/**
 * Pure execution function for tactical character & enemy abilities.
 */
export function executeAbility(
  actor: Combatant,
  target: Combatant,
  ability: Ability,
  round: number,
  rng: IRandomNumberGenerator
): AbilityExecutionResult {
  // Validate Mana
  if (actor.currentMana < ability.cost.mana) {
    return {
      nextActor: actor,
      nextTarget: target,
      logs: [
        createLogEntry({
          round,
          actorName: actor.name,
          actionType: 'ABILITY',
          entryType: 'INFO',
          message: `${actor.name} lacks sufficient mana to cast [${ability.name}] (Requires ${ability.cost.mana} MP, has ${actor.currentMana} MP)!`,
        }),
      ],
      floatingTexts: [createFloatingText(actor.id, 'NO MANA', 'info')],
      success: false,
    };
  }

  // Validate Silence
  if (hasStatus(actor, 'SILENCED')) {
    return {
      nextActor: actor,
      nextTarget: target,
      logs: [
        createLogEntry({
          round,
          actorName: actor.name,
          actionType: 'ABILITY',
          entryType: 'INFO',
          message: `${actor.name} is [SILENCED] and cannot cast abilities!`,
        }),
      ],
      floatingTexts: [createFloatingText(actor.id, 'SILENCED', 'status')],
      success: false,
    };
  }

  // Deduct Mana and set Cooldown
  let nextActor: Combatant = {
    ...actor,
    currentMana: Math.max(0, actor.currentMana - ability.cost.mana),
    abilityCooldowns: {
      ...actor.abilityCooldowns,
      [ability.id]: ability.cooldown,
    },
  };

  let nextTarget: Combatant = { ...target };
  const logs: CombatLogEntry[] = [];
  const floatingTexts: FloatingText[] = [];

  // ========================================================
  // 1. HEALING ABILITY
  // ========================================================
  if (ability.type === 'HEAL') {
    const willScaling = actor.primaryStats.willpower * 2.2;
    const rawHeal = (ability.baseFlatPower ?? 40) + willScaling * ability.powerMultiplier;
    const variance = rng.nextFloat(0.92, 1.08);
    const finalHeal = Math.round(rawHeal * variance);

    const actualHealed = Math.min(nextTarget.maxHp - nextTarget.currentHp, finalHeal);
    nextTarget.currentHp += actualHealed;

    floatingTexts.push(createFloatingText(nextTarget.id, `+${actualHealed} HP`, 'heal'));
    logs.push(
      createLogEntry({
        round,
        actorName: actor.name,
        targetName: nextTarget.name,
        actionType: 'ABILITY',
        entryType: 'HEAL',
        message: `✨ ${actor.name} casts [${ability.name}], restoring +${actualHealed} HP to ${nextTarget.name}!`,
        heal: actualHealed,
      })
    );

    // Apply any attached buffs (e.g. Regeneration)
    if (ability.statusEffects) {
      for (const effectApp of ability.statusEffects) {
        const appResult = applyStatusEffect(nextTarget, effectApp, actor, rng);
        if (appResult.applied) {
          nextTarget = appResult.target;
          if (appResult.log) logs.push(appResult.log);
          if (appResult.float) floatingTexts.push(appResult.float);
        }
      }
    }

    return {
      nextActor,
      nextTarget,
      logs,
      floatingTexts,
      success: true,
    };
  }

  // ========================================================
  // 2. BUFF ABILITY (e.g. Iron Bulwark, Shadow Veil, Divine Aegis)
  // ========================================================
  if (ability.type === 'BUFF') {
    logs.push(
      createLogEntry({
        round,
        actorName: actor.name,
        targetName: nextTarget.name,
        actionType: 'ABILITY',
        entryType: 'BUFF',
        message: `🛡️ ${actor.name} channels [${ability.name}]!`,
      })
    );

    if (ability.statusEffects) {
      for (const effectApp of ability.statusEffects) {
        const appResult = applyStatusEffect(nextTarget, effectApp, actor, rng);
        if (appResult.applied) {
          nextTarget = appResult.target;
          if (appResult.log) logs.push(appResult.log);
          if (appResult.float) floatingTexts.push(appResult.float);
        }
      }
    }

    return {
      nextActor,
      nextTarget,
      logs,
      floatingTexts,
      success: true,
    };
  }

  // ========================================================
  // 3. DAMAGE ABILITY (PHYSICAL / MAGICAL)
  // ========================================================
  const hitChance = Math.min(98, Math.max(15, ability.accuracy + (actor.derivedStats.accuracy - target.derivedStats.evasion) * 0.5));
  const isHit = rng.rollChance(hitChance / 100);

  if (!isHit) {
    floatingTexts.push(createFloatingText(target.id, 'MISS', 'miss'));
    logs.push(
      createLogEntry({
        round,
        actorName: actor.name,
        targetName: target.name,
        actionType: 'ABILITY',
        entryType: 'MISS',
        message: `${actor.name}'s [${ability.name}] missed ${target.name}!`,
        isHit: false,
      })
    );

    return {
      nextActor,
      nextTarget,
      logs,
      floatingTexts,
      success: true,
      damageResult: {
        hitChance,
        isHit: false,
        critChance: 0,
        isCrit: false,
        rawDamage: 0,
        mitigatedDamage: 0,
        finalDamage: 0,
        wasDefended: target.isDefending,
        isKilled: false,
      },
    };
  }

  // Calculate Base Damage
  const isMagical = ability.type === 'MAGICAL';
  const baseStat = isMagical ? actor.derivedStats.magicAttack : actor.derivedStats.physicalAttack;
  const flatPower = ability.baseFlatPower ?? 0;
  const rawBase = baseStat * ability.powerMultiplier + flatPower;

  // Crit Check
  const critChance = Math.min(75, Math.max(1, actor.derivedStats.critChance + ability.critBonus));
  const isCrit = rng.rollChance(critChance / 100);
  const critMult = isCrit ? actor.derivedStats.critMultiplier : 1.0;

  // Variance (±8%)
  const variance = rng.nextFloat(0.92, 1.08);
  const rawDamage = rawBase * critMult * variance;

  // Defense mitigation
  const defense = isMagical ? target.derivedStats.magicDefense : target.derivedStats.physicalDefense;
  const defenseReduction = defense / (defense + 60);
  let mitigatedDamage = rawDamage * (1 - defenseReduction);

  if (target.isDefending) {
    mitigatedDamage *= 0.5;
  }

  let finalDamage = Math.max(1, Math.round(mitigatedDamage));

  // Shield Absorption
  let absorbedByShield = 0;
  if (nextTarget.shieldHp > 0) {
    absorbedByShield = Math.min(nextTarget.shieldHp, finalDamage);
    nextTarget.shieldHp -= absorbedByShield;
    finalDamage -= absorbedByShield;
    floatingTexts.push(createFloatingText(nextTarget.id, `ABSORBED ${absorbedByShield}`, 'buff'));
  }

  // Apply to HP
  nextTarget.currentHp = Math.max(0, nextTarget.currentHp - finalDamage);
  const isKilled = nextTarget.currentHp <= 0;
  if (isKilled) {
    nextTarget.isDead = true;
  }

  // Floating text
  if (isCrit) {
    floatingTexts.push(createFloatingText(nextTarget.id, `CRIT! -${finalDamage}`, 'crit'));
  } else if (finalDamage > 0) {
    floatingTexts.push(createFloatingText(nextTarget.id, `-${finalDamage}`, 'damage'));
  }

  // Log entry
  let hitMsg = isMagical
    ? `⚡ ${actor.name} invokes [${ability.name}] dealing ${finalDamage} ${ability.element} damage to ${nextTarget.name}!`
    : `⚔️ ${actor.name} executes [${ability.name}] dealing ${finalDamage} physical damage to ${nextTarget.name}!`;

  if (isCrit) {
    hitMsg = `💥 CRITICAL STRIKE! ` + hitMsg;
  }
  if (absorbedByShield > 0) {
    hitMsg += ` (${absorbedByShield} absorbed by shield barrier)`;
  }

  logs.push(
    createLogEntry({
      round,
      actorName: actor.name,
      targetName: nextTarget.name,
      actionType: 'ABILITY',
      entryType: isCrit ? 'CRIT' : 'DAMAGE',
      message: hitMsg,
      isHit: true,
      isCrit,
      damage: finalDamage,
      isDefended: target.isDefending,
      isKilled,
    })
  );

  if (isKilled) {
    logs.push(
      createLogEntry({
        round,
        actorName: nextTarget.name,
        actionType: 'PASS',
        entryType: 'DEFEAT',
        message: `☠️ ${nextTarget.name} was vanquished!`,
        isKilled: true,
      })
    );
  }

  // Apply Status Effects on Hit (e.g. Burning, Frozen, Stunned, Poison, Bleed)
  if (!isKilled && ability.statusEffects) {
    for (const effectApp of ability.statusEffects) {
      const appResult = applyStatusEffect(nextTarget, effectApp, actor, rng);
      if (appResult.applied) {
        nextTarget = appResult.target;
        if (appResult.log) logs.push(appResult.log);
        if (appResult.float) floatingTexts.push(appResult.float);
      }
    }
  }

  return {
    nextActor,
    nextTarget,
    logs,
    floatingTexts,
    damageResult: {
      hitChance,
      isHit: true,
      critChance,
      isCrit,
      rawDamage: Math.round(rawDamage),
      mitigatedDamage: Math.round(mitigatedDamage),
      finalDamage,
      wasDefended: target.isDefending,
      isKilled,
      shieldAbsorbed: absorbedByShield,
    },
    success: true,
  };
}
