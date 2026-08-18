import { describe, it, expect } from 'vitest';
import { Mulberry32RNG } from '../core/rng/rng.ts';
import { createInitialCombatState, advanceCombatTurn, checkCombatOutcome } from '../core/combat/combat-engine.ts';
import { processTurnStartStatuses } from '../core/combat/status-manager.ts';
import { createWarriorHero } from '../core/data/characters.ts';
import { createGoblinScout, createDarkMage } from '../core/data/enemies.ts';

describe('DoT Death Turn Handling and Soft Lock Prevention', () => {
  const rng = new Mulberry32RNG(12345);

  it('processes DoT poison damage at turn start and marks enemy as dead when lethal', () => {
    const enemy = createGoblinScout('goblin-1');
    enemy.currentHp = 10;
    enemy.statusEffects = [
      {
        id: 'status-poison-1',
        type: 'POISON',
        name: 'Poison',
        duration: 3,
        remainingTurns: 3,
        potency: 15,
        sourceId: 'hero-1',
        sourceName: 'Warrior',
      },
    ];

    const tickResult = processTurnStartStatuses(enemy, 1);
    expect(tickResult.combatant.currentHp).toBe(0);
    expect(tickResult.combatant.isDead).toBe(true);
    expect(tickResult.isKilled).toBe(true);
    expect(tickResult.logs.some((l) => l.message.toLowerCase().includes('poison'))).toBe(true);
  });

  it('advanceCombatTurn cleanly handles lethal DoT on active enemy and triggers VICTORY when no queue remains', () => {
    const hero = createWarriorHero();
    const enemy = createGoblinScout('goblin-1');
    enemy.currentHp = 8;
    enemy.statusEffects = [
      {
        id: 'status-poison-1',
        type: 'POISON',
        name: 'Poison',
        duration: 2,
        remainingTurns: 2,
        potency: 10,
        sourceId: hero.id,
        sourceName: hero.name,
      },
    ];

    let state = createInitialCombatState([hero], [enemy], rng);
    state.combatants[enemy.id] = enemy;
    state.activeCombatantId = hero.id;
    state.turnOrder = [hero.id, enemy.id];
    state.activeTurnIndex = 0;

    // Advance turn (hero ends turn -> advanceCombatTurn moves to enemy index 1)
    const nextState = advanceCombatTurn(state, rng);

    expect(nextState.combatants[enemy.id].isDead).toBe(true);
    expect(nextState.status).toBe('VICTORY');
    expect(checkCombatOutcome(nextState.combatants, nextState.enemyQueue)).toBe('VICTORY');
  });

  it('advanceCombatTurn cleanly handles lethal DoT on active enemy and swaps in next queued enemy', () => {
    const hero = createWarriorHero();
    const enemy1 = createGoblinScout('goblin-1');
    const enemy2 = createDarkMage('mage-2');
    enemy1.currentHp = 5;
    enemy1.statusEffects = [
      {
        id: 'status-burn-1',
        type: 'BURNING',
        name: 'Burning',
        duration: 2,
        remainingTurns: 2,
        potency: 10,
        sourceId: hero.id,
        sourceName: hero.name,
      },
    ];

    let state = createInitialCombatState([hero], [enemy1, enemy2], rng);
    state.combatants[enemy1.id] = enemy1;
    state.activeCombatantId = hero.id;
    state.turnOrder = [hero.id, enemy1.id];
    state.activeTurnIndex = 0;

    // Advance turn (hero ends turn -> advanceCombatTurn moves to enemy1 index 1)
    const nextState = advanceCombatTurn(state, rng);

    expect(nextState.combatants[enemy1.id].isDead).toBe(true);
    expect(nextState.combatants[enemy2.id]).toBeDefined();
    expect(nextState.combatants[enemy2.id].isDead).toBe(false);
    expect(nextState.enemyQueue.length).toBe(0);
    expect(nextState.status).toBe('IN_PROGRESS');
    expect(nextState.selectedTargetId).toBe(enemy2.id);
  });
});
