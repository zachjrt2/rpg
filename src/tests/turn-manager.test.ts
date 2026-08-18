import { describe, it, expect } from 'vitest';
import { calculateTurnOrder, getNextTurn } from '../core/combat/turn-manager.ts';
import { createWarriorHero } from '../core/data/characters.ts';
import { createGoblinScout } from '../core/data/enemies.ts';
import { Mulberry32RNG } from '../core/rng/rng.ts';
import type { Combatant } from '../core/types/combat.ts';

describe('Turn Manager & Initiative', () => {
  it('orders combatants by speed and initiative rolls', () => {
    const hero = createWarriorHero();
    const goblin = createGoblinScout();
    const combatants: Record<string, Combatant> = {
      [hero.id]: hero,
      [goblin.id]: goblin,
    };
    const rng = new Mulberry32RNG(42);

    const order = calculateTurnOrder(combatants, rng);
    expect(order.length).toBe(2);
    expect(order).toContain(hero.id);
    expect(order).toContain(goblin.id);
  });

  it('cycles turns cleanly and increments round on completion', () => {
    const hero = createWarriorHero();
    const goblin = createGoblinScout();
    const combatants: Record<string, Combatant> = {
      [hero.id]: hero,
      [goblin.id]: goblin,
    };
    const turnOrder = [hero.id, goblin.id];

    // From turn 0 to turn 1
    const next1 = getNextTurn(turnOrder, 0, 1, combatants);
    expect(next1.nextIndex).toBe(1);
    expect(next1.nextRound).toBe(1);
    expect(next1.nextCombatantId).toBe(goblin.id);
    expect(next1.isNewRound).toBe(false);

    // From turn 1 to turn 0 (New Round 2)
    const next2 = getNextTurn(turnOrder, 1, 1, combatants);
    expect(next2.nextIndex).toBe(0);
    expect(next2.nextRound).toBe(2);
    expect(next2.nextCombatantId).toBe(hero.id);
    expect(next2.isNewRound).toBe(true);
  });

  it('skips dead combatants in turn cycle', () => {
    const hero = createWarriorHero();
    const goblin = createGoblinScout();
    goblin.isDead = true;
    goblin.currentHp = 0;

    const combatants: Record<string, Combatant> = {
      [hero.id]: hero,
      [goblin.id]: goblin,
    };
    const turnOrder = [hero.id, goblin.id];

    const next = getNextTurn(turnOrder, 0, 1, combatants);
    expect(next.nextCombatantId).toBe(hero.id);
  });
});
