import { describe, it, expect } from 'vitest';
import { CARDS_CATALOG } from '../core/data/cards.ts';
import { CLASS_BASIC_CARDS, createInitialDeck } from '../core/combat/deck-manager.ts';
import type { CharacterClassId } from '../core/types/classes.ts';

describe('Class-Specific Basic Cards', () => {
  const allClasses: CharacterClassId[] = [
    'WARRIOR', 'ROGUE', 'MAGE', 'CLERIC', 'RANGER', 'PALADIN', 'NECROMANCER', 'BERSERKER'
  ];

  it('provides distinct basic attack and defense cards for each class', () => {
    const attackIds = new Set<string>();
    const defendIds = new Set<string>();

    allClasses.forEach((classId) => {
      const basic = CLASS_BASIC_CARDS[classId];
      expect(basic).toBeDefined();
      expect(attackIds.has(basic.attackId)).toBe(false);
      expect(defendIds.has(basic.defendId)).toBe(false);

      attackIds.add(basic.attackId);
      defendIds.add(basic.defendId);

      const atkCard = CARDS_CATALOG[basic.attackId];
      const defCard = CARDS_CATALOG[basic.defendId];

      expect(atkCard, `Missing attack card definition: ${basic.attackId}`).toBeDefined();
      expect(defCard, `Missing defend card definition: ${basic.defendId}`).toBeDefined();
      expect(atkCard.rarity).toBe('BASIC');
      expect(defCard.rarity).toBe('BASIC');
      expect(atkCard.classRestrictions).toContain(classId);
      expect(defCard.classRestrictions).toContain(classId);

      // Verify + variants exist
      expect(CARDS_CATALOG[`${basic.attackId}+`]).toBeDefined();
      expect(CARDS_CATALOG[`${basic.defendId}+`]).toBeDefined();
    });

    expect(attackIds.size).toBe(8);
    expect(defendIds.size).toBe(8);
  });

  it('builds unique starter decks reflecting the specific class basics', () => {
    allClasses.forEach((classId) => {
      const deck = createInitialDeck(classId);
      const basic = CLASS_BASIC_CARDS[classId];
      
      const atkCardsInDeck = deck.fullDeck.filter((c) => c.baseId === basic.attackId);
      const defCardsInDeck = deck.fullDeck.filter((c) => c.baseId === basic.defendId);

      expect(atkCardsInDeck.length).toBe(4);
      expect(defCardsInDeck.length).toBe(4);
      expect(deck.fullDeck.length).toBe(10);
    });
  });
});