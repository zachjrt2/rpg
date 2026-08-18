import { describe, it, expect } from 'vitest';
import { applyStatusEffect, processTurnStartStatuses } from '../core/combat/status-manager.ts';
import { createWarriorHero } from '../core/data/characters.ts';
import { createGoblinScout } from '../core/data/enemies.ts';
import { Mulberry32RNG } from '../core/rng/rng.ts';

describe('Status Effects System', () => {
  it('applies Poison effect, ticks damage directly to HP (bypassing shield), and decays potency by 1 per round', () => {
    const hero = createWarriorHero();
    const goblin = createGoblinScout();
    goblin.shieldHp = 50; // Goblin has 50 Shield
    const rng = new Mulberry32RNG(42);

    const applyResult = applyStatusEffect(
      goblin,
      { effectId: 'POISON', chance: 1.0, duration: 5, potency: 10 },
      hero,
      rng
    );

    expect(applyResult.applied).toBe(true);
    expect(applyResult.target.statusEffects.length).toBe(1);

    const initialHp = applyResult.target.currentHp;
    // Turn 1 tick: 10 poison damage directly to HP (shield untouched), potency decays from 10 -> 9
    const tick1 = processTurnStartStatuses(applyResult.target, 1);

    expect(tick1.combatant.currentHp).toBe(initialHp - 10);
    expect(tick1.combatant.shieldHp).toBe(50); // Shield was pierced and remains 50!
    expect(tick1.combatant.statusEffects[0].potency).toBe(9);
    expect(tick1.combatant.statusEffects[0].remainingTurns).toBe(9);

    // Turn 2 tick: 9 poison damage, potency decays from 9 -> 8
    const tick2 = processTurnStartStatuses(tick1.combatant, 2);
    expect(tick2.combatant.currentHp).toBe(initialHp - 10 - 9);
    expect(tick2.combatant.statusEffects[0].potency).toBe(8);
    expect(tick2.combatant.statusEffects[0].remainingTurns).toBe(8);
  });

  it('applies Bleeding effect, ticks physical damage, and decays potency by 1 per round until natural expiry', () => {
    const hero = createWarriorHero();
    const goblin = createGoblinScout();
    const rng = new Mulberry32RNG(42);

    // Apply 3 Bleed (e.g. duration 1 from ability/card, but potency is 3)
    const applyResult = applyStatusEffect(
      goblin,
      { effectId: 'BLEEDING', chance: 1.0, duration: 1, potency: 3 },
      hero,
      rng
    );

    expect(applyResult.applied).toBe(true);
    const initialHp = goblin.currentHp;

    // Turn 1 tick: deals 3 bleed damage, decays to 2
    const tick1 = processTurnStartStatuses(applyResult.target, 1);
    expect(tick1.combatant.currentHp).toBe(initialHp - 3);
    expect(tick1.combatant.statusEffects[0].potency).toBe(2);
    expect(tick1.combatant.statusEffects[0].remainingTurns).toBe(2);

    // Turn 2 tick: deals 2 bleed damage, decays to 1
    const tick2 = processTurnStartStatuses(tick1.combatant, 2);
    expect(tick2.combatant.currentHp).toBe(initialHp - 3 - 2);
    expect(tick2.combatant.statusEffects[0].potency).toBe(1);
    expect(tick2.combatant.statusEffects[0].remainingTurns).toBe(1);

    // Turn 3 tick: deals 1 bleed damage, decays to 0 -> expires
    const tick3 = processTurnStartStatuses(tick2.combatant, 3);
    expect(tick3.combatant.currentHp).toBe(initialHp - 3 - 2 - 1);
    expect(tick3.combatant.statusEffects.length).toBe(0);
  });

  it('heals with Regeneration each round and decays potency by 1 until expiry', () => {
    const hero = createWarriorHero();
    hero.currentHp = 50; // Wounded hero (50/150 HP)
    const rng = new Mulberry32RNG(1);

    const applyResult = applyStatusEffect(
      hero,
      { effectId: 'REGENERATION', chance: 1.0, duration: 5, potency: 2 },
      hero,
      rng
    );

    // Turn 1: heals +2 HP (50 -> 52), potency decays from 2 -> 1
    const tick1 = processTurnStartStatuses(applyResult.target, 1);
    expect(tick1.combatant.currentHp).toBe(52);
    expect(tick1.combatant.statusEffects[0].potency).toBe(1);

    // Turn 2: heals +1 HP (52 -> 53), potency decays from 1 -> 0, effect expires!
    const tick2 = processTurnStartStatuses(tick1.combatant, 2);
    expect(tick2.combatant.currentHp).toBe(53);
    expect(tick2.combatant.statusEffects.length).toBe(0); // Naturally expired!
  });

  it('flags shouldSkipTurn when unit is Stunned', () => {
    const goblin = createGoblinScout();
    const hero = createWarriorHero();
    const rng = new Mulberry32RNG(1);

    const applyResult = applyStatusEffect(
      goblin,
      { effectId: 'STUNNED', chance: 1.0, duration: 1, potency: 1 },
      hero,
      rng
    );

    const tickResult = processTurnStartStatuses(applyResult.target, 2);
    expect(tickResult.shouldSkipTurn).toBe(true);
  });

  it('absorbs damage using Shield HP barrier before reducing health', () => {
    const hero = createWarriorHero();
    hero.shieldHp = 50;

    const initialHp = hero.currentHp;
    const incomingDmg = 30;
    const absorbed = Math.min(hero.shieldHp, incomingDmg);
    hero.shieldHp -= absorbed;
    const remainingDmg = incomingDmg - absorbed;
    hero.currentHp -= remainingDmg;

    expect(hero.shieldHp).toBe(20);
    expect(hero.currentHp).toBe(initialHp);
  });

  it('stacks Regeneration additively when applying Regrowth multiple times', () => {
    const hero = createWarriorHero();
    const rng = new Mulberry32RNG(1);

    // Apply first Regrowth (+8 Regen)
    const firstApply = applyStatusEffect(
      hero,
      { effectId: 'REGENERATION', chance: 1.0, duration: 8, potency: 8 },
      hero,
      rng
    );
    expect(firstApply.target.statusEffects[0].potency).toBe(8);
    expect(firstApply.target.statusEffects[0].remainingTurns).toBe(8);

    // Apply second Regrowth (+8 Regen) -> should stack to 16 Regen
    const secondApply = applyStatusEffect(
      firstApply.target,
      { effectId: 'REGENERATION', chance: 1.0, duration: 8, potency: 8 },
      hero,
      rng
    );
    expect(secondApply.target.statusEffects[0].potency).toBe(16);
    expect(secondApply.target.statusEffects[0].remainingTurns).toBe(16);
  });

  it('applies Burning effect, ticks fire damage, and decays potency by 1 per round until expiry', () => {
    const hero = createWarriorHero();
    const goblin = createGoblinScout();
    const rng = new Mulberry32RNG(42);

    const applyResult = applyStatusEffect(
      goblin,
      { effectId: 'BURNING', chance: 1.0, duration: 1, potency: 3 },
      hero,
      rng
    );

    expect(applyResult.applied).toBe(true);
    const initialHp = goblin.currentHp;

    // Turn 1 tick: 3 fire damage, decays to 2
    const tick1 = processTurnStartStatuses(applyResult.target, 1);
    expect(tick1.combatant.currentHp).toBe(initialHp - 3);
    expect(tick1.combatant.statusEffects[0].potency).toBe(2);
    expect(tick1.combatant.statusEffects[0].remainingTurns).toBe(2);

    // Turn 2 tick: 2 fire damage, decays to 1
    const tick2 = processTurnStartStatuses(tick1.combatant, 2);
    expect(tick2.combatant.currentHp).toBe(initialHp - 3 - 2);
    expect(tick2.combatant.statusEffects[0].potency).toBe(1);
    expect(tick2.combatant.statusEffects[0].remainingTurns).toBe(1);

    // Turn 3 tick: 1 fire damage, decays to 0 -> expires
    const tick3 = processTurnStartStatuses(tick2.combatant, 3);
    expect(tick3.combatant.currentHp).toBe(initialHp - 3 - 2 - 1);
    expect(tick3.combatant.statusEffects.length).toBe(0);
  });

  it('applies Frozen for 2 turns, skips turns, and ticks down by 1 each round until thawed', () => {
    const hero = createWarriorHero();
    const goblin = createGoblinScout();
    const rng = new Mulberry32RNG(42);

    const applyResult = applyStatusEffect(
      goblin,
      { effectId: 'FROZEN', chance: 1.0, duration: 2, potency: 1 },
      hero,
      rng
    );

    expect(applyResult.applied).toBe(true);
    expect(applyResult.target.statusEffects[0].remainingTurns).toBe(2);

    // Turn 1: should skip turn, remaining turns ticks down to 1
    const tick1 = processTurnStartStatuses(applyResult.target, 1);
    expect(tick1.shouldSkipTurn).toBe(true);
    expect(tick1.combatant.statusEffects[0].remainingTurns).toBe(1);
    expect(tick1.combatant.statusEffects[0].potency).toBe(1);

    // Turn 2: should skip turn, remaining turns ticks down to 0 -> expires
    const tick2 = processTurnStartStatuses(tick1.combatant, 2);
    expect(tick2.shouldSkipTurn).toBe(true);
    expect(tick2.combatant.statusEffects.length).toBe(0); // Thawed!
  });
});
