import type { Combatant, CombatAction } from '../types/combat.ts';
import type { IRandomNumberGenerator } from '../rng/rng.ts';

/**
 * Evaluates an enemy turn and determines the best action to take.
 * Pure deterministic AI logic driven by seedable RNG.
 */
export function decideEnemyAction(
  enemy: Combatant,
  combatants: Record<string, Combatant>,
  rng: IRandomNumberGenerator
): CombatAction {
  // Find valid living hero targets
  const aliveHeroes = Object.values(combatants).filter(
    (c) => c.type === 'HERO' && !c.isDead && c.currentHp > 0
  );

  if (aliveHeroes.length === 0) {
    return {
      type: 'PASS',
      actorId: enemy.id,
      targetId: enemy.id,
    };
  }

  // Target selection: Default to lowest HP hero, or random hero
  // For single hero (Milestone 1), it's the first hero
  const targetHero = aliveHeroes.reduce((lowest, current) =>
    current.currentHp < lowest.currentHp ? current : lowest
  );

  // Tactical logic: If enemy is critically low HP (< 25%), chance to defend
  const hpPercent = (enemy.currentHp / enemy.maxHp) * 100;
  if (hpPercent <= 25 && !enemy.isDefending && rng.rollChance(0.35)) {
    return {
      type: 'DEFEND',
      actorId: enemy.id,
      targetId: enemy.id,
    };
  }

  // Standard Attack
  return {
    type: 'ATTACK',
    actorId: enemy.id,
    targetId: targetHero.id,
  };
}
