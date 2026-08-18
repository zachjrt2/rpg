import { describe, it, expect } from 'vitest';
import {
  applyStartOfCombatRelics,
  applyOnKillRelics,
  calculateRelicGoldBonus,
  calculateRelicManaCost,
  generateRelicDraftOptions,
} from '../core/relics/relic-manager.ts';
import { RELICS_CATALOG } from '../core/data/relics.ts';
import { createHeroFromClass } from '../core/data/characters.ts';
import { Mulberry32RNG } from '../core/rng/rng.ts';

describe('Relic Artifacts System', () => {
  it('should grant start of combat shield with Aegis of the Sunken King', () => {
    const hero = createHeroFromClass('WARRIOR');
    const aegis = RELICS_CATALOG['aegis-sunken-king'];

    const result = applyStartOfCombatRelics([hero], [aegis]);
    expect(result[0].shieldHp).toBe(50);
  });

  it('should heal entire party on kill with Vampire Bloodstone', () => {
    const hero1 = { ...createHeroFromClass('WARRIOR'), currentHp: 50, maxHp: 100 };
    const hero2 = { ...createHeroFromClass('MAGE'), currentHp: 30, maxHp: 80 };
    const bloodstone = RELICS_CATALOG['vampire-bloodstone'];

    const result = applyOnKillRelics([hero1, hero2], [bloodstone]);
    expect(result.party[0].currentHp).toBe(60); // 50 + 10
    expect(result.party[1].currentHp).toBe(38); // 30 + 8
  });

  it('should calculate gold bonus with Midas Pouch and mana discounts with Tome of Ley', () => {
    const midas = RELICS_CATALOG['midas-pouch'];
    const tome = RELICS_CATALOG['tome-ancient-ley'];

    const goldBonus = calculateRelicGoldBonus(100, [midas]);
    expect(goldBonus).toBe(140);

    const manaDiscount = calculateRelicManaCost(40, [tome]);
    expect(manaDiscount).toBe(30); // 40 - 25%
  });

  it('should generate 3 non-duplicate relic choices for elite and boss drafts', () => {
    const rng = new Mulberry32RNG(42);
    const eliteChoices = generateRelicDraftOptions(false, ['aegis-sunken-king'], rng);
    expect(eliteChoices.length).toBe(3);
    expect(eliteChoices.every((r) => r.id !== 'aegis-sunken-king')).toBe(true);

    const bossChoices = generateRelicDraftOptions(true, [], rng);
    expect(bossChoices.length).toBe(3);
    expect(bossChoices.every((r) => r.rarity === 'EPIC' || r.rarity === 'LEGENDARY')).toBe(true);
  });
});
