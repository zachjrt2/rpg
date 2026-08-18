import { describe, it, expect } from 'vitest';
import { executeItemAction } from '../core/combat/item-executor.ts';
import { ITEMS_CATALOG } from '../core/data/items.ts';
import { createWarriorHero } from '../core/data/characters.ts';
import { Mulberry32RNG } from '../core/rng/rng.ts';

describe('In-Combat Item Usage', () => {
  it('healing potion restores hero HP up to max', () => {
    const hero = createWarriorHero();
    hero.currentHp = 30; // Injured
    const potion = ITEMS_CATALOG['lesser-healing-potion'];
    const rng = new Mulberry32RNG(1);

    const result = executeItemAction(hero, hero, potion, 1, rng);

    expect(result.success).toBe(true);
    expect(result.nextTarget.currentHp).toBe(30 + potion.consumableEffect!.value);
  });

  it('elixir of insight draws combat cards', () => {
    const hero = createWarriorHero();
    const insightPotion = ITEMS_CATALOG['mana-draught']; // Elixir of Insight
    const rng = new Mulberry32RNG(1);

    const result = executeItemAction(hero, hero, insightPotion, 1, rng);

    expect(result.success).toBe(true);
    expect(result.cardsGained).toBe(2);
  });

  it('elixir of vigor restores combat energy', () => {
    const hero = createWarriorHero();
    const vigorPotion = ITEMS_CATALOG['elixir-of-vigor'];
    const rng = new Mulberry32RNG(1);

    const result = executeItemAction(hero, hero, vigorPotion, 1, rng);

    expect(result.success).toBe(true);
    expect(result.energyGained).toBe(3);
  });

  it('antidote cleanses poison status effect', () => {
    const hero = createWarriorHero();
    hero.statusEffects = [
      {
        id: 'status-1',
        type: 'POISON',
        name: 'Poison',
        duration: 3,
        remainingTurns: 3,
        potency: 15,
      },
    ];

    const antidote = ITEMS_CATALOG['antidote-vial'];
    const rng = new Mulberry32RNG(1);

    const result = executeItemAction(hero, hero, antidote, 1, rng);

    expect(result.success).toBe(true);
    expect(result.nextTarget.statusEffects.length).toBe(0);
  });
});
