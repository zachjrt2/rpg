import { describe, it, expect } from 'vitest';
import { generateCardDraftOptions } from '../core/combat/deck-manager.ts';
import { Mulberry32RNG } from '../core/rng/rng.ts';

describe('Card Draft Reward System', () => {
  const rng = new Mulberry32RNG(4567);

  it('should generate 3 draftable cards matching player class or neutral cards', () => {
    const mageDraft = generateCardDraftOptions('MAGE', rng, 3);
    expect(mageDraft.length).toBe(3);

    mageDraft.forEach((card) => {
      expect(card.rarity).not.toBe('BASIC');
      expect(card.isUpgraded).toBe(false);
      if (card.classRestrictions) {
        expect(card.classRestrictions).toContain('MAGE');
      }
    });
  });

  it('should generate unique card instances with distinct IDs', () => {
    const rogueDraft = generateCardDraftOptions('ROGUE', rng, 3);
    const ids = new Set(rogueDraft.map((c) => c.id));
    expect(ids.size).toBe(3);
  });
});
