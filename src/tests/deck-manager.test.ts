import { describe, it, expect } from 'vitest';
import {
  createInitialDeck,
  drawCards,
  startTurnDeck,
  endTurnDeck,
  playCombatCard,
  addCardToDeck,
  removeCardFromDeck,
  upgradeCardInDeck,
} from '../core/combat/deck-manager.ts';
import { createWarriorHero } from '../core/data/characters.ts';
import { createGoblinScout } from '../core/data/enemies.ts';
import { Mulberry32RNG } from '../core/rng/rng.ts';
import { CARDS_CATALOG } from '../core/data/cards.ts';
import { calculateScaledCardValues } from '../core/combat/card-scaling.ts';

describe('Deck Manager', () => {
  const rng = new Mulberry32RNG(12345);

  it('should initialize a 10-card starter deck with class unique basic and signature cards', () => {
    const warriorDeck = createInitialDeck('WARRIOR');
    expect(warriorDeck.fullDeck.length).toBe(10);
    expect(warriorDeck.maxEnergy).toBe(3);
    expect(warriorDeck.drawCountPerTurn).toBe(5);

    const names = warriorDeck.fullDeck.map((c) => c.name);
    expect(names.filter((n) => n === 'Heavy Slash').length).toBe(4);
    expect(names.filter((n) => n === 'Iron Guard').length).toBe(4);
    expect(names.includes('Power Cleave')).toBe(true);
    expect(names.includes('Shield Slam')).toBe(true);
  });

  it('should draw cards from draw pile and reshuffle discard when depleted', () => {
    let deck = createInitialDeck('WARRIOR');
    expect(deck.hand.length).toBe(0);

    deck = drawCards(deck, 5, rng);
    expect(deck.hand.length).toBe(5);
    expect(deck.drawPile.length).toBe(5);

    // Draw remaining 5
    deck = drawCards(deck, 5, rng);
    expect(deck.hand.length).toBe(10);
    expect(deck.drawPile.length).toBe(0);

    // End turn -> 10 discarded
    deck = endTurnDeck(deck);
    expect(deck.hand.length).toBe(0);
    expect(deck.discardPile.length).toBe(10);

    // Draw again -> triggers reshuffle
    deck = drawCards(deck, 4, rng);
    expect(deck.hand.length).toBe(4);
    expect(deck.drawPile.length).toBe(6);
    expect(deck.discardPile.length).toBe(0);
  });

  it('should play attack card, consume energy, deal damage and move to discard', () => {
    let deck = createInitialDeck('WARRIOR');
    deck = startTurnDeck(deck, rng);
    expect(deck.hand.length).toBe(5);

    const testCard = deck.hand[0];
    expect(testCard).toBeDefined();

    const hero = createWarriorHero();
    const enemy = createGoblinScout();
    const initialEnemyHp = enemy.currentHp;
    const initialEnergy = deck.currentEnergy;

    const result = playCombatCard(deck, testCard.id, hero, enemy, 1, rng);

    expect(result.success).toBe(true);
    expect(result.nextDeck.currentEnergy).toBe(initialEnergy - testCard.cost + (testCard.gainEnergy || 0));
    if (testCard.damage) {
      const scaled = calculateScaledCardValues(testCard, hero);
      expect(result.nextTarget.currentHp).toBe(initialEnemyHp - (scaled.damage?.total || testCard.damage));
    }
    expect(result.nextDeck.discardPile.some((c) => c.id === testCard.id)).toBe(true);
  });

  it('should support card additions, removals, and upgrades', () => {
    let deck = createInitialDeck('MAGE');
    expect(deck.fullDeck.length).toBe(10);

    const fireball = CARDS_CATALOG['fireball'];
    deck = addCardToDeck(deck, fireball);
    expect(deck.fullDeck.length).toBe(11);

    const cardToUpgrade = deck.fullDeck[0];
    deck = upgradeCardInDeck(deck, cardToUpgrade.id);
    const upgraded = deck.fullDeck.find((c) => c.id === cardToUpgrade.id);
    expect(upgraded?.isUpgraded).toBe(true);
    expect(upgraded?.name).toContain('+');

    deck = removeCardFromDeck(deck, cardToUpgrade.id);
    expect(deck.fullDeck.length).toBe(10);
  });

  it('should initialize custom starter deck with selected cards from Character Creator', () => {
    const customDeck = createInitialDeck('WARRIOR', ['reckless-frenzy', 'spiked-barrier', 'rupture']);
    expect(customDeck.fullDeck.length).toBe(11); // 4 strikes + 4 defends + 3 chosen cards

    const names = customDeck.fullDeck.map((c) => c.name);
    expect(names.includes('Reckless Frenzy')).toBe(true);
    expect(names.includes('Spiked Barrier')).toBe(true);
    expect(names.includes('Rupture')).toBe(true);
  });
});
