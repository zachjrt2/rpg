import { describe, it, expect } from 'vitest';
import {
  createInitialMetaProgression,
  purchaseMetaUpgrade,
  unlockMetaClass,
  unlockMetaCard,
  unlockMetaRelic,
  calculateRunAetheriumReward,
  applyMetaUpgradesToHero,
} from '../core/meta/meta-manager.ts';
import { createWarriorHero } from '../core/data/characters.ts';

describe('Roguelite Meta-Progression & Astral Sanctum', () => {
  it('initializes with default meta progression state', () => {
    const meta = createInitialMetaProgression();
    expect(meta.aetherium).toBe(0);
    expect(meta.unlockedClasses).toContain('WARRIOR');
    expect(meta.unlockedClasses).not.toContain('PALADIN');
    expect(meta.upgradeRanks.vigor).toBe(0);
  });

  it('calculates run aetherium reward correctly', () => {
    const reward = calculateRunAetheriumReward(3, 8, true, true);
    // (3*25 + 8*10 + 60 + 150) * 1.5^2 = 365 * 2.25 = 821
    expect(reward).toBe(821);
  });

  it('purchases meta upgrade when player has sufficient Aetherium', () => {
    const meta = { ...createInitialMetaProgression(), aetherium: 100 };
    const result = purchaseMetaUpgrade(meta, 'vigor');

    expect(result.success).toBe(true);
    expect(result.nextState.upgradeRanks.vigor).toBe(1);
    expect(result.nextState.aetherium).toBe(75); // 100 - 25
  });

  it('fails purchase when player lacks Aetherium', () => {
    const meta = { ...createInitialMetaProgression(), aetherium: 10 };
    const result = purchaseMetaUpgrade(meta, 'vigor');

    expect(result.success).toBe(false);
    expect(result.nextState.upgradeRanks.vigor).toBe(0);
  });

  it('unlocks advanced class in Astral Sanctum', () => {
    const meta = { ...createInitialMetaProgression(), aetherium: 100 };
    const result = unlockMetaClass(meta, 'PALADIN');

    expect(result.success).toBe(true);
    expect(result.nextState.unlockedClasses).toContain('PALADIN');
    expect(result.nextState.aetherium).toBe(20); // 100 - 80
  });

  it('applies meta upgrades to hero starting stats', () => {
    const meta = {
      ...createInitialMetaProgression(),
      upgradeRanks: {
        ...createInitialMetaProgression().upgradeRanks,
        vigor: 2, // +30 HP
        bastion: 1, // +6 Shield
        prowess: 1, // +3 ATK
        fortune: 1, // +2 LUK
      },
    };

    const baseHero = createWarriorHero();
    const boostedHero = applyMetaUpgradesToHero(baseHero, meta);

    expect(boostedHero.maxHp).toBe(baseHero.maxHp + 30);
    expect(boostedHero.currentHp).toBe(baseHero.maxHp + 30);
    expect(boostedHero.shieldHp).toBe(6);
    expect(boostedHero.primaryStats.luck).toBe(baseHero.primaryStats.luck + 2);
  });

  it('applies core primary stat blessings (Might, Agility, Mind, Vitality, Willpower) to hero', () => {
    const meta = {
      ...createInitialMetaProgression(),
      upgradeRanks: {
        ...createInitialMetaProgression().upgradeRanks,
        attunement: 1, // +2 Stat Points in Creator
        might: 2,      // +4 STR
        agility: 1,    // +2 DEX
        mind: 1,       // +2 INT
        vitality: 2,   // +4 VIT
        willpower: 1,  // +2 WIL
        transcendence: 1,
      },
    };

    const baseHero = createWarriorHero();
    const boostedHero = applyMetaUpgradesToHero(baseHero, meta);

    expect(boostedHero.primaryStats.strength).toBe(baseHero.primaryStats.strength + 4);
    expect(boostedHero.primaryStats.dexterity).toBe(baseHero.primaryStats.dexterity + 2);
    expect(boostedHero.primaryStats.intelligence).toBe(baseHero.primaryStats.intelligence + 2);
    expect(boostedHero.primaryStats.vitality).toBe(baseHero.primaryStats.vitality + 4);
    expect(boostedHero.primaryStats.willpower).toBe(baseHero.primaryStats.willpower + 2);
  });

  it('unlocks cards in the Astral Sanctum Card Archive', () => {
    const meta = { ...createInitialMetaProgression(), aetherium: 100 };
    const result = unlockMetaCard(meta, 'combustion');

    expect(result.success).toBe(true);
    expect(result.nextState.unlockedCardIds).toContain('combustion');
    expect(result.nextState.aetherium).toBe(100 - 35);
  });

  it('fails card unlock when player lacks Aetherium', () => {
    const meta = { ...createInitialMetaProgression(), aetherium: 10 };
    const result = unlockMetaCard(meta, 'combustion');

    expect(result.success).toBe(false);
    expect(result.nextState.unlockedCardIds).not.toContain('combustion');
  });

  it('purchases expanded talent upgrades (wellspring, reroll, reaping, crit, phoenix)', () => {
    const meta = { ...createInitialMetaProgression(), aetherium: 500 };
    const r1 = purchaseMetaUpgrade(meta, 'wellspring');
    expect(r1.success).toBe(true);
    expect(r1.nextState.upgradeRanks.wellspring).toBe(1);

    const r2 = purchaseMetaUpgrade(r1.nextState, 'phoenix');
    expect(r2.success).toBe(true);
    expect(r2.nextState.upgradeRanks.phoenix).toBe(1);

    const r3 = purchaseMetaUpgrade(r2.nextState, 'relic_slots');
    expect(r3.success).toBe(true);
    expect(r3.nextState.upgradeRanks.relic_slots).toBe(1);
  });

  it('handles expensive Astral Energy Core upgrades (4,000 for 3->4 energy, 15,000 for 4->5 energy)', () => {
    const meta = { ...createInitialMetaProgression(), aetherium: 20000 };

    // Rank 1: costs 4,000 Aetherium
    const r1 = purchaseMetaUpgrade(meta, 'celestial_core');
    expect(r1.success).toBe(true);
    expect(r1.nextState.upgradeRanks.celestial_core).toBe(1);
    expect(r1.nextState.aetherium).toBe(16000);

    // Rank 2: costs 15,000 Aetherium
    const r2 = purchaseMetaUpgrade(r1.nextState, 'celestial_core');
    expect(r2.success).toBe(true);
    expect(r2.nextState.upgradeRanks.celestial_core).toBe(2);
    expect(r2.nextState.aetherium).toBe(1000);

    // Max rank reached (Rank 2)
    const r3 = purchaseMetaUpgrade(r2.nextState, 'celestial_core');
    expect(r3.success).toBe(false);
    expect(r3.nextState.upgradeRanks.celestial_core).toBe(2);
  });

  it('unlocks starting relics in the Astral Sanctum Reliquary', () => {
    const meta = { ...createInitialMetaProgression(), aetherium: 100 };
    const result = unlockMetaRelic(meta, 'aegis-sunken-king');

    expect(result.success).toBe(true);
    expect(result.nextState.unlockedRelicIds).toContain('aegis-sunken-king');
    expect(result.nextState.aetherium).toBe(100 - 35);
  });

  it('fails relic unlock when player lacks Aetherium', () => {
    const meta = { ...createInitialMetaProgression(), aetherium: 10 };
    const result = unlockMetaRelic(meta, 'aegis-sunken-king');

    expect(result.success).toBe(false);
    expect(result.nextState.unlockedRelicIds).not.toContain('aegis-sunken-king');
  });

  it('purchases Astral Attunement to grant +1 starting attribute point per rank', () => {
    const meta = { ...createInitialMetaProgression(), aetherium: 50 };
    const result = purchaseMetaUpgrade(meta, 'attunement');

    expect(result.success).toBe(true);
    expect(result.nextState.upgradeRanks.attunement).toBe(1);
    expect(result.nextState.aetherium).toBe(35); // 50 - 15
  });

  it('purchases Astral Deck Mastery and Relic Attunement Pouch upgrades', () => {
    const meta = { ...createInitialMetaProgression(), aetherium: 150 };
    const cardResult = purchaseMetaUpgrade(meta, 'card_mastery');
    expect(cardResult.success).toBe(true);
    expect(cardResult.nextState.upgradeRanks.card_mastery).toBe(1);
    expect(cardResult.nextState.aetherium).toBe(150 - 40);

    const relicResult = purchaseMetaUpgrade(cardResult.nextState, 'relic_slots');
    expect(relicResult.success).toBe(true);
    expect(relicResult.nextState.upgradeRanks.relic_slots).toBe(1);
    expect(relicResult.nextState.aetherium).toBe(110 - 45);
  });
});
