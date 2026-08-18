import { describe, it, expect } from 'vitest';
import {
  createInitialCombatState,
  executeCombatAction,
  advanceCombatTurn,
} from '../core/combat/combat-engine.ts';
import { createWarriorHero } from '../core/data/characters.ts';
import { createGoblinScout } from '../core/data/enemies.ts';
import { Mulberry32RNG } from '../core/rng/rng.ts';

describe('Combat Engine State Transitions', () => {
  it('initializes battle with valid state and logging', () => {
    const hero = createWarriorHero();
    const goblin = createGoblinScout();
    const rng = new Mulberry32RNG(999);

    const state = createInitialCombatState([hero], [goblin], rng);

    expect(state.status).toBe('IN_PROGRESS');
    expect(state.round).toBe(1);
    expect(state.turnOrder.length).toBe(2);
    expect(state.log.length).toBeGreaterThanOrEqual(2);
    expect(state.selectedTargetId).toBe(goblin.id);
  });

  it('handles attack action and updates HP and logs correctly', () => {
    const hero = createWarriorHero();
    const goblin = createGoblinScout();
    const rng = new Mulberry32RNG(1337);

    const state = createInitialCombatState([hero], [goblin], rng);
    const initialGoblinHp = state.combatants[goblin.id].currentHp;

    const action = {
      type: 'ATTACK' as const,
      actorId: hero.id,
      targetId: goblin.id,
    };

    const result = executeCombatAction(state, action, rng);

    expect(result.nextState.combatants[goblin.id].currentHp).toBeLessThanOrEqual(initialGoblinHp);
    expect(result.logEntries.length).toBeGreaterThan(0);
    expect(result.floatingTexts.length).toBeGreaterThan(0);
  });

  it('handles defend action by setting isDefending flag', () => {
    const hero = createWarriorHero();
    const goblin = createGoblinScout();
    const rng = new Mulberry32RNG(100);

    const state = createInitialCombatState([hero], [goblin], rng);
    const action = {
      type: 'DEFEND' as const,
      actorId: hero.id,
      targetId: hero.id,
    };

    const result = executeCombatAction(state, action, rng);
    expect(result.nextState.combatants[hero.id].isDefending).toBe(true);
  });

  it('declares VICTORY when all enemies are slain', () => {
    const hero = createWarriorHero();
    const goblin = createGoblinScout();
    goblin.currentHp = 1; // 1 HP so any hit defeats it
    const rng = new Mulberry32RNG(42);

    const state = createInitialCombatState([hero], [goblin], rng);
    state.combatants[goblin.id].currentHp = 1;

    const action = {
      type: 'ATTACK' as const,
      actorId: hero.id,
      targetId: goblin.id,
    };

    const result = executeCombatAction(state, action, rng);

    if (result.damageResult?.isHit) {
      expect(result.nextState.status).toBe('VICTORY');
      expect(result.nextState.combatants[goblin.id].isDead).toBe(true);
    }
  });

  it('resets defense stance when combatant starts their own turn', () => {
    const hero = createWarriorHero();
    const goblin = createGoblinScout();
    const rng = new Mulberry32RNG(888);

    const state = createInitialCombatState([hero], [goblin], rng);
    state.combatants[hero.id].isDefending = true;
    state.turnOrder = [goblin.id, hero.id];
    state.activeTurnIndex = 0;
    state.activeCombatantId = goblin.id;

    // Advance turn to hero
    const nextState = advanceCombatTurn(state, rng);

    expect(nextState.activeCombatantId).toBe(hero.id);
    expect(nextState.combatants[hero.id].isDefending).toBe(false);
  });
});
