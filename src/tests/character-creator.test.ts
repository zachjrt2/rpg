import { describe, it, expect } from 'vitest';
import { createHeroFromClass } from '../core/data/characters.ts';
import { CHARACTER_CLASSES } from '../core/data/classes.ts';

describe('Character Creator & Custom Class Loadouts', () => {
  it('creates custom hero with custom name and selected abilities', () => {
    const customAbilities = ['power-strike', 'whirlwind-cleave', 'reckless-cleave'];
    const hero = createHeroFromClass('WARRIOR', 'Kaelen Vanguard', 'hero-1', 1, customAbilities);

    expect(hero.name).toBe('Kaelen Vanguard');
    expect(hero.className).toBe('Warrior');
    expect(hero.abilities).toEqual(customAbilities);
  });

  it('creates advanced unlockable classes (Paladin, Necromancer, Berserker)', () => {
    const paladin = createHeroFromClass('PALADIN', 'Sir Galahad');
    expect(paladin.className).toBe('Paladin');
    expect(paladin.abilities).toContain('radiant-smite');

    const necromancer = createHeroFromClass('NECROMANCER', 'Lady Morrigan');
    expect(necromancer.className).toBe('Necromancer');
    expect(necromancer.abilities).toContain('soul-siphon');

    const berserker = createHeroFromClass('BERSERKER', 'Ragnar Storm');
    expect(berserker.className).toBe('Berserker');
    expect(berserker.abilities).toContain('blood-frenzy');
  });

  it('applies and preserves all 5 origin boons with meta upgrades', () => {
    const defaultHero = createHeroFromClass('WARRIOR', 'Standard Alden');

    // 1. Iron Constitution: +2 Vitality, +30 Max HP
    const tankHero = createHeroFromClass('WARRIOR', 'Iron Alden', 'hero-1', 1, undefined, 'iron-constitution');
    expect(tankHero.originBoon).toBe('iron-constitution');
    expect(tankHero.primaryStats.vitality).toBe(defaultHero.primaryStats.vitality + 2);
    expect(tankHero.maxHp).toBe(defaultHero.maxHp + (2 * 12) + 30); // 2 VIT * 12 + 30 extra HP = +54 HP

    // 2. Leyline Conduit: +2 Willpower, +25 Max Mana
    const manaHero = createHeroFromClass('MAGE', 'Mana Mage', 'hero-1', 1, undefined, 'leyline-conduit');
    expect(manaHero.originBoon).toBe('leyline-conduit');
    expect(manaHero.primaryStats.willpower).toBe(CHARACTER_CLASSES.MAGE.baseStats.willpower + 2);
    expect(manaHero.maxMana).toBe(CHARACTER_CLASSES.MAGE.baseStats.intelligence * 8 + (CHARACTER_CLASSES.MAGE.baseStats.willpower + 2) * 4 + 20 + 5 + 25);

    // 3. Fortune Favored: +3 Luck
    const luckyHero = createHeroFromClass('ROGUE', 'Lucky Rogue', 'hero-1', 1, undefined, 'fortune-favored');
    expect(luckyHero.originBoon).toBe('fortune-favored');
    expect(luckyHero.primaryStats.luck).toBe(CHARACTER_CLASSES.ROGUE.baseStats.luck + 3);

    // 4. Sharpened Edge: +2 Strength, +5 Physical Attack
    const strHero = createHeroFromClass('WARRIOR', 'Sharp Warrior', 'hero-1', 1, undefined, 'sharpened-edge');
    expect(strHero.originBoon).toBe('sharpened-edge');
    expect(strHero.primaryStats.strength).toBe(CHARACTER_CLASSES.WARRIOR.baseStats.strength + 2);
    expect(strHero.derivedStats.physicalAttack).toBeGreaterThanOrEqual(defaultHero.derivedStats.physicalAttack + 5);

    // 5. Spell Weaver: +2 Intelligence, +5 Magic Attack
    const intHero = createHeroFromClass('MAGE', 'Spell Mage', 'hero-1', 1, undefined, 'spell-weaver');
    expect(intHero.originBoon).toBe('spell-weaver');
    expect(intHero.primaryStats.intelligence).toBe(CHARACTER_CLASSES.MAGE.baseStats.intelligence + 2);
    expect(intHero.derivedStats.magicAttack).toBeGreaterThanOrEqual(5);
  });
});
