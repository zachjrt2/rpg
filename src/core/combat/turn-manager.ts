import type { Combatant } from '../types/combat.ts';
import type { IRandomNumberGenerator } from '../rng/rng.ts';

export interface InitiativeResult {
  combatantId: string;
  initiativeScore: number;
}

/**
 * Calculates dynamic initiative turn order based on combatant speed, primary stats, and controlled RNG roll.
 */
export function calculateTurnOrder(
  combatants: Record<string, Combatant>,
  rng: IRandomNumberGenerator
): string[] {
  const aliveCombatants = Object.values(combatants).filter((c) => !c.isDead && c.currentHp > 0);

  const scored: InitiativeResult[] = aliveCombatants.map((c) => {
    // Speed base + 1d10 initiative roll + Luck tie-breaker fraction
    const roll = rng.nextInt(1, 10);
    const luckBonus = c.primaryStats.luck * 0.1;
    const isHeroBonus = c.type === 'HERO' ? 0.01 : 0; // Slight hero tie-breaker
    const score = c.derivedStats.speed + roll + luckBonus + isHeroBonus;
    return {
      combatantId: c.id,
      initiativeScore: score,
    };
  });

  // Sort descending by initiative
  scored.sort((a, b) => b.initiativeScore - a.initiativeScore);

  return scored.map((s) => s.combatantId);
}

/**
 * Advances to the next alive combatant in the turn queue.
 * Increments round number if all combatants took their turn.
 */
export function getNextTurn(
  turnOrder: string[],
  currentIndex: number,
  round: number,
  combatants: Record<string, Combatant>
): { nextIndex: number; nextRound: number; nextCombatantId: string; isNewRound: boolean } {
  // Filter for valid alive combatants
  const aliveIds = turnOrder.filter((id) => combatants[id] && !combatants[id].isDead && combatants[id].currentHp > 0);

  if (aliveIds.length === 0) {
    return {
      nextIndex: 0,
      nextRound: round,
      nextCombatantId: '',
      isNewRound: false,
    };
  }

  let nextIndex = currentIndex + 1;
  let nextRound = round;
  let isNewRound = false;

  if (nextIndex >= turnOrder.length) {
    nextIndex = 0;
    nextRound = round + 1;
    isNewRound = true;
  }

  // Find the next alive combatant in circular fashion
  let searchCount = 0;
  while (searchCount < turnOrder.length) {
    const candidateId = turnOrder[nextIndex];
    const candidate = combatants[candidateId];
    if (candidate && !candidate.isDead && candidate.currentHp > 0) {
      return {
        nextIndex,
        nextRound,
        nextCombatantId: candidateId,
        isNewRound,
      };
    }

    nextIndex++;
    if (nextIndex >= turnOrder.length) {
      nextIndex = 0;
      nextRound++;
      isNewRound = true;
    }
    searchCount++;
  }

  // Fallback to first alive
  return {
    nextIndex: 0,
    nextRound,
    nextCombatantId: aliveIds[0],
    isNewRound,
  };
}
