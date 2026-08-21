import type { Combatant } from '../types/combat.ts';
import type { ElementType } from '../types/abilities.ts';

export interface ElementalReactionResult {
  hasReaction: boolean;
  reactionName?: string;
  bonusDamage: number;
  logMessage?: string;
  cleansedStatusId?: string;
}

export function checkElementalReaction(
  defender: Combatant,
  abilityElement: ElementType,
  attackerMagicAttack: number,
  attackerPhysicalAttack: number = 0
): ElementalReactionResult {
  const isFrozen = defender.statusEffects.some((s) => s.type === 'FROZEN');
  const isBurning = defender.statusEffects.some((s) => s.type === 'BURNING');
  const poisonEffect = defender.statusEffects.find((s) => s.type === 'POISON');
  const isStunned = defender.statusEffects.some((s) => s.type === 'STUNNED');
  const isShocked = defender.statusEffects.some((s) => s.type === 'SHOCKED');

  // 1. THERMAL SHOCK: Fire vs Frozen OR Ice vs Burning
  if ((isFrozen && abilityElement === 'FIRE') || (isBurning && abilityElement === 'ICE')) {
    const bonusDmg = Math.round(attackerMagicAttack * 1.4) + 20;
    return {
      hasReaction: true,
      reactionName: 'THERMAL_SHOCK',
      bonusDamage: bonusDmg,
      logMessage: `💥 [REACTION: THERMAL SHOCK]: Drastic temperature shift detonates for +${bonusDmg} Shatter damage!`,
    };
  }

  // 2. VENOM COMBUSTION: Fire vs Poison
  if (poisonEffect && abilityElement === 'FIRE') {
    const bonusDmg = Math.round((poisonEffect.potency || 15) * 2.5);
    return {
      hasReaction: true,
      reactionName: 'VENOM_COMBUSTION',
      bonusDamage: bonusDmg,
      logMessage: `💥 [REACTION: VENOM COMBUSTION]: Flames ignite lethal neurotoxins, exploding for +${bonusDmg} Toxic Fire damage!`,
    };
  }

  // 3. OVERWHELM GUARD BREAK: Physical vs Stunned
  if (isStunned && abilityElement === 'PHYSICAL') {
    const bonusDmg = 25;
    return {
      hasReaction: true,
      reactionName: 'GUARD_BREAK',
      bonusDamage: bonusDmg,
      logMessage: `💥 [REACTION: GUARD BREAK]: Direct strike crushes stunned posture for +${bonusDmg} True damage!`,
    };
  }

  // 4. SHATTER: Physical vs Frozen
  if (isFrozen && abilityElement === 'PHYSICAL') {
    const bonusDmg = Math.round(attackerPhysicalAttack * 1.5) + 30;
    return {
      hasReaction: true,
      reactionName: 'SHATTER',
      bonusDamage: bonusDmg,
      cleansedStatusId: 'FROZEN',
      logMessage: `💥 [REACTION: SHATTER]: Heavy physical strike shatters the frozen target for +${bonusDmg} True damage!`,
    };
  }

  // 5. SUPERCONDUCT: Physical vs Shocked
  if (isShocked && abilityElement === 'PHYSICAL') {
    const bonusDmg = Math.round(attackerPhysicalAttack * 0.8) + 15;
    return {
      hasReaction: true,
      reactionName: 'SUPERCONDUCT',
      bonusDamage: bonusDmg,
      logMessage: `💥 [REACTION: SUPERCONDUCT]: Lightning arcs through the strike, bypassing defenses for +${bonusDmg} bonus damage!`,
    };
  }

  // 6. OVERLOAD: Fire vs Shocked
  if (isShocked && abilityElement === 'FIRE') {
    const bonusDmg = Math.round(attackerMagicAttack * 1.8) + 25;
    return {
      hasReaction: true,
      reactionName: 'OVERLOAD',
      bonusDamage: bonusDmg,
      logMessage: `💥 [REACTION: OVERLOAD]: Fire ignites the lingering electricity in a massive explosion for +${bonusDmg} damage!`,
    };
  }

  return {
    hasReaction: false,
    bonusDamage: 0,
  };
}
