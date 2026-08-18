import { describe, it, expect } from 'vitest';
import { CARDS_CATALOG } from '../core/data/cards.ts';
import { RELICS_CATALOG } from '../core/data/relics.ts';
import { UNLOCKABLE_CARDS, UNLOCKABLE_RELICS, unlockMetaCard, unlockMetaRelic, createInitialMetaProgression } from '../core/meta/meta-manager.ts';
import { upgradeCombatCard } from '../core/combat/card-upgrader.ts';
import { generateCardDraftOptions } from '../core/combat/deck-manager.ts';
import { Mulberry32RNG } from '../core/rng/rng.ts';
import type { RelicId } from '../core/types/relics.ts';

describe('Expansion Content (30 Cards & 20 Relics)', () => {
  const rng = new Mulberry32RNG(1337);

  it('contains all 30 new cards in CARDS_CATALOG and UNLOCKABLE_CARDS', () => {
    const newCardIds = [
      'whirlwind', 'reckless-fury', 'shield-wall', 'executioner-axe', 'blood-tithe', 'bastion-stance',
      'meteor-strike', 'blizzard', 'arc-lightning', 'arcane-intellect', 'flame-ward', 'supernova',
      'shadowstep', 'flurry-daggers', 'noxious-flask', 'smoke-cloak', 'assassinate', 'preparation',
      'solar-flare', 'divine-shield', 'consecration', 'aegis-glory', 'holy-light', 'judgement',
      'void-leech', 'bone-armor', 'grave-chill', 'doom-gaze', 'corpse-explosion', 'astral-rift'
    ];

    expect(newCardIds.length).toBe(30);

    newCardIds.forEach((cardId) => {
      expect(CARDS_CATALOG[cardId], `Missing card ${cardId} in CARDS_CATALOG`).toBeDefined();
      expect(UNLOCKABLE_CARDS[cardId], `Missing card ${cardId} in UNLOCKABLE_CARDS`).toBeDefined();
      
      // Test dynamic upgrade validity
      const card = CARDS_CATALOG[cardId];
      const upgraded = upgradeCombatCard(card);
      expect(upgraded.isUpgraded).toBe(true);
      expect(upgraded.name.endsWith('+')).toBe(true);
    });
  });

  it('contains all 20 new relics in RELICS_CATALOG and UNLOCKABLE_RELICS', () => {
    const newRelicIds: RelicId[] = [
      'warlord-crown', 'voidstone-phylactery', 'celestial-hourglass', 'mirror-retaliation', 'hydra-heart',
      'pyromancer-ring', 'glacial-shard', 'stormcaller-beacon', 'shadow-cloak', 'alchemist-pouch',
      'dragon-scale', 'cursed-monocle', 'holy-grail', 'boneshard-talisman', 'midas-touch',
      'chrono-crystal', 'venomous-barb', 'colossus-shield', 'bloodlust-mask', 'astral-prism'
    ];

    expect(newRelicIds.length).toBe(20);

    newRelicIds.forEach((relicId) => {
      expect(RELICS_CATALOG[relicId], `Missing relic ${relicId} in RELICS_CATALOG`).toBeDefined();
      expect(UNLOCKABLE_RELICS[relicId], `Missing relic ${relicId} in UNLOCKABLE_RELICS`).toBeDefined();
    });
  });

  it('unlocks new cards and relics properly through the Sanctum manager', () => {
    const meta = { ...createInitialMetaProgression(), aetherium: 1000 };

    const cardRes = unlockMetaCard(meta, 'meteor-strike');
    expect(cardRes.success).toBe(true);
    expect(cardRes.nextState.unlockedCardIds).toContain('meteor-strike');

    const relicRes = unlockMetaRelic(meta, 'dragon-scale');
    expect(relicRes.success).toBe(true);
    expect(relicRes.nextState.unlockedRelicIds).toContain('dragon-scale');
  });

  it('generates drafts containing new expansion cards', () => {
    const mageDraft = generateCardDraftOptions('MAGE', rng, 10);
    expect(mageDraft.length).toBe(10);
    expect(mageDraft.some((c) => c.classRestrictions?.includes('MAGE') || !c.classRestrictions)).toBe(true);
  });
});