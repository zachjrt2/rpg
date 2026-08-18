import { describe, it, expect } from 'vitest';
import { createInitialCombatState, executeCombatAction, checkCombatOutcome } from '../core/combat/combat-engine.ts';
import { createWarriorHero } from '../core/data/characters.ts';
import { createGoblinScout, createGoblinShaman } from '../core/data/enemies.ts';
import { Mulberry32RNG } from '../core/rng/rng.ts';

describe('Pokemon-Style 1v1 Combat & Enemy Bench Queue', () => {
  it('initializes 1v1 combat with active enemy and queued reserve bench', () => {
    const rng = new Mulberry32RNG(123);
    const hero = createWarriorHero();
    const enemy1 = createGoblinScout('foe-1');
    const enemy2 = createGoblinShaman('foe-2');

    const combat = createInitialCombatState([hero], [enemy1, enemy2], rng);

    // Active combatants should contain hero and enemy1
    expect(combat.combatants['hero-1']).toBeDefined();
    expect(combat.combatants['foe-1']).toBeDefined();
    expect(combat.combatants['foe-2']).toBeUndefined();

    // Enemy2 should be waiting in the enemy queue bench
    expect(combat.enemyQueue.length).toBe(1);
    expect(combat.enemyQueue[0].id).toBe('foe-2');
    expect(combat.status).toBe('IN_PROGRESS');
  });

  it('sends out the next queued enemy when the active enemy is defeated', () => {
    const rng = new Mulberry32RNG(123);
    const hero = createWarriorHero();
    const enemy1 = { ...createGoblinScout('foe-1'), currentHp: 5 }; // Low HP
    const enemy2 = createGoblinShaman('foe-2');

    let combat = createInitialCombatState([hero], [enemy1, enemy2], rng);

    // Hero attacks foe-1 and defeats it
    const action = {
      type: 'ATTACK' as const,
      actorId: hero.id,
      targetId: enemy1.id,
    };

    const result = executeCombatAction(combat, action, rng);

    // enemy1 should be dead
    expect(result.nextState.combatants['foe-1'].isDead).toBe(true);

    // enemy2 should now be sent onto the battlefield
    expect(result.nextState.combatants['foe-2']).toBeDefined();
    expect(result.nextState.combatants['foe-2'].isDead).toBe(false);
    expect(result.nextState.enemyQueue.length).toBe(0);
    expect(result.nextState.status).toBe('IN_PROGRESS');
  });

  it('triggers VICTORY only when all enemies in the squad and queue are defeated', () => {
    const enemy1 = { ...createGoblinScout('foe-1'), isDead: true, currentHp: 0 };
    const enemy2 = createGoblinShaman('foe-2');

    // With enemy2 in queue, should remain IN_PROGRESS
    expect(checkCombatOutcome({ 'foe-1': enemy1, 'hero-1': createWarriorHero() }, [enemy2])).toBe('IN_PROGRESS');

    // When queue is empty and active is dead, triggers VICTORY
    expect(checkCombatOutcome({ 'foe-1': enemy1, 'hero-1': createWarriorHero() }, [])).toBe('VICTORY');
  });
});
