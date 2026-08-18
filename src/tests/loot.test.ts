import { describe, it, expect } from 'vitest';
import { generateEncounterLoot } from '../core/loot/loot-generator.ts';
import { createGoblinScout, createDarkMage } from '../core/data/enemies.ts';
import { createWarriorHero } from '../core/data/characters.ts';
import { Mulberry32RNG } from '../core/rng/rng.ts';

describe('Loot Drop Engine', () => {
  it('generates gold and EXP spoils after victory', () => {
    const goblin = createGoblinScout();
    const hero = createWarriorHero();
    const rng = new Mulberry32RNG(42);

    const spoils = generateEncounterLoot([goblin], hero, rng);

    expect(spoils.gold).toBeGreaterThan(0);
    expect(spoils.exp).toBeGreaterThan(0);
    expect(Array.isArray(spoils.items)).toBe(true);
  });

  it('high Luck stat yields more gold on average', () => {
    const mage = createDarkMage();
    const normalHero = createWarriorHero();
    normalHero.primaryStats.luck = 5;

    const luckyHero = createWarriorHero();
    luckyHero.primaryStats.luck = 50;

    const rng1 = new Mulberry32RNG(100);
    const rng2 = new Mulberry32RNG(100);

    const normalSpoils = generateEncounterLoot([mage], normalHero, rng1);
    const luckySpoils = generateEncounterLoot([mage], luckyHero, rng2);

    expect(luckySpoils.gold).toBeGreaterThanOrEqual(normalSpoils.gold);
  });
});
