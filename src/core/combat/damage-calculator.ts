import type { Combatant, DamageCalculationResult } from '../types/combat.ts';
import type { IRandomNumberGenerator } from '../rng/rng.ts';

export interface DamageOptions {
  bonusPowerMultiplier?: number;
  guaranteedHit?: boolean;
  guaranteedCrit?: boolean;
  armorPenetration?: number; // 0.0 to 1.0
}

/**
 * Deterministic multi-step damage calculation engine.
 * 1. Accuracy Check (Hit vs Miss)
 * 2. Base Damage Calculation with Stat Scaling
 * 3. Critical Hit Evaluation
 * 4. Armor & Physical Defense Mitigation
 * 5. Defending Stance Mitigation (50% damage reduction)
 * 6. Controlled Random Damage Variance (±8%)
 * 7. Minimum Damage Floor & Knockout Evaluation
 */
export function calculatePhysicalDamage(
  attacker: Combatant,
  target: Combatant,
  rng: IRandomNumberGenerator,
  options: DamageOptions = {}
): DamageCalculationResult {
  const {
    bonusPowerMultiplier = 1.0,
    guaranteedHit = false,
    guaranteedCrit = false,
    armorPenetration = 0.0,
  } = options;

  // Step 1: Accuracy & Evasion
  const attackerAcc = attacker.derivedStats.accuracy;
  const targetEva = target.derivedStats.evasion;
  const rawHitChance = attackerAcc - targetEva;
  const hitChance = Math.min(98, Math.max(15, rawHitChance));
  
  const roll = rng.nextFloat(0, 1);
  const threshold = hitChance / 100;
  let isHit = guaranteedHit || roll <= threshold;
  let isGlancingBlow = false;

  // Glancing Blow: missed by up to 15%
  if (!isHit && roll <= threshold + 0.15) {
    isHit = true;
    isGlancingBlow = true;
  }

  if (!isHit) {
    return {
      hitChance,
      isHit: false,
      critChance: 0,
      isCrit: false,
      rawDamage: 0,
      mitigatedDamage: 0,
      finalDamage: 0,
      wasDefended: target.isDefending,
      isKilled: false,
    };
  }

  // Step 2: Base Damage
  const baseAttack = attacker.derivedStats.physicalAttack * bonusPowerMultiplier;

  // Step 3: Critical Hit
  const critChance = Math.min(75, Math.max(1, attacker.derivedStats.critChance));
  const isCrit = guaranteedCrit || rng.rollChance(critChance / 100);
  const critMult = isCrit ? attacker.derivedStats.critMultiplier : 1.0;

  // Step 4: Damage Variance (±8%)
  const variance = rng.nextFloat(0.92, 1.08);
  const rawDamage = baseAttack * critMult * variance;

  // Step 5: Armor & Defense Mitigation with Armor Penetration
  const def = Math.max(0, target.derivedStats.physicalDefense * (1 - armorPenetration));
  const defenseReduction = def / (def + 60); // Asymptotic armor curve
  let mitigatedDamage = rawDamage * (1 - defenseReduction);

  // Apply Glancing Blow reduction (50% less damage)
  if (isGlancingBlow) {
    mitigatedDamage *= 0.5;
  }

  // Step 6: Defending Stance Reduction (50% less damage taken)
  const wasDefended = target.isDefending;
  if (wasDefended) {
    mitigatedDamage *= 0.5;
  }

  // Step 7: Final Floor
  const finalDamage = Math.max(1, Math.round(mitigatedDamage));
  const isKilled = target.currentHp - finalDamage <= 0;

  return {
    hitChance,
    isHit: true,
    critChance,
    isCrit,
    rawDamage: Math.round(rawDamage),
    mitigatedDamage: Math.round(mitigatedDamage),
    finalDamage,
    wasDefended,
    isKilled,
    isGlancingBlow,
  };
}
