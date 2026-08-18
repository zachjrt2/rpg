import { describe, it, expect } from 'vitest';
import { calculateScaledCardValues } from '../core/combat/card-scaling.ts';
import { CARDS_CATALOG } from '../core/data/cards.ts';
import { createHeroFromClass } from '../core/data/characters.ts';
import { createInitialDeck, playCombatCard } from '../core/combat/deck-manager.ts';
import { createGoblinScout } from '../core/data/enemies.ts';
import { Mulberry32RNG } from '../core/rng/rng.ts';
import {
  createInitialMetaProgression,
  purchaseMetaUpgrade,
} from '../core/meta/meta-manager.ts';

describe('Character Stat Card Scaling & Hover Math', () => {
  const rng = new Mulberry32RNG(4567);

  it('calculates physical damage scaling based on STR and DEX', () => {
    const hero = createHeroFromClass('WARRIOR', 'Test Warrior', 'hero-1', 1, [], undefined, {
      strength: 4, // 14 base + 4 = 18 STR
      dexterity: 2, // 10 base + 2 = 12 DEX
    });

    const strikeCard = CARDS_CATALOG['strike'];
    const scaled = calculateScaledCardValues(strikeCard, hero);

    expect(scaled.damage).toBeDefined();
    expect(scaled.damage?.base).toBe(6);
    // statBonus = floor(18 * 0.4 + 12 * 0.2) = 9; atkPower = floor(48 * 0.25) = 12 -> total bonus = 21
    expect(scaled.damage?.bonus).toBe(21);
    expect(scaled.damage?.total).toBe(27);
    expect(scaled.damage?.statFormula).toContain('18 STR, 12 DEX');
  });

  it('calculates magic damage scaling based on INT and WIL', () => {
    const hero = createHeroFromClass('MAGE', 'Test Mage', 'hero-1', 1, [], undefined, {
      intelligence: 6, // 17 base + 6 = 23 INT
      willpower: 5,    // 13 base + 5 = 18 WIL
    });

    const fireball = CARDS_CATALOG['fireball'];
    const scaled = calculateScaledCardValues(fireball, hero);

    expect(scaled.magicDamage).toBeDefined();
    expect(scaled.magicDamage?.base).toBe(16);
    // statBonus = floor(23 * 0.5 + 18 * 0.2) = 15; spellPower = floor(65.5 * 0.25) = 16 -> total bonus = 31
    expect(scaled.magicDamage?.bonus).toBe(31);
    expect(scaled.magicDamage?.total).toBe(47);
    expect(scaled.magicDamage?.statFormula).toContain('23 INT, 18 WIL');
  });

  it('calculates block scaling based on VIT and STR', () => {
    const hero = createHeroFromClass('WARRIOR', 'Tank Warrior', 'hero-1', 1, [], undefined, {
      vitality: 5, // 14 base + 5 = 19 VIT
      strength: 6, // 14 base + 6 = 20 STR
    });

    const defendCard = CARDS_CATALOG['defend'];
    const scaled = calculateScaledCardValues(defendCard, hero);

    expect(scaled.block).toBeDefined();
    expect(scaled.block?.base).toBe(6);
    // statBonus = floor(19 * 0.4 + 20 * 0.1) = 9; guardPower = floor(38.5 * 0.2) = 7 -> total bonus = 16
    expect(scaled.block?.bonus).toBe(16);
    expect(scaled.block?.total).toBe(22);
    expect(scaled.block?.statFormula).toContain('19 VIT, 20 STR');
  });

  it('applies scaled damage in playCombatCard execution', () => {
    const hero = createHeroFromClass('WARRIOR', 'Test Warrior', 'hero-1', 1, [], undefined, {
      strength: 10, // 24 STR, 10 DEX
    });

    const enemy = createGoblinScout();
    const initialHp = enemy.currentHp;
    let deck = createInitialDeck('WARRIOR');
    const strikeCard = deck.fullDeck.find((c) => c.baseId === 'warrior-strike')!;
    deck = { ...deck, hand: [strikeCard], currentEnergy: 3 };

    const result = playCombatCard(deck, strikeCard.id, hero, enemy, 1, rng);
    expect(result.success).toBe(true);
    const scaled = calculateScaledCardValues(strikeCard, hero);
    expect(result.nextTarget.currentHp).toBe(initialHp - scaled.damage!.total);
  });

  it('supports Astral Attunement meta-progression upgrades', () => {
    const meta = { ...createInitialMetaProgression(), aetherium: 150 };
    const result = purchaseMetaUpgrade(meta, 'attunement');

    expect(result.success).toBe(true);
    expect(result.nextState.upgradeRanks.attunement).toBe(1);
    expect(result.nextState.aetherium).toBe(150 - 15);
  });
});
