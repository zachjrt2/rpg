import { describe, it, expect } from 'vitest';
import {
  createInitialMetaProgression,
  unlockMetaEquipment,
  purchaseMetaUpgrade,
  applyMetaUpgradesToHero,
} from '../core/meta/meta-manager.ts';
import { createHeroFromClass } from '../core/data/characters.ts';
import { createInitialInventory, addItemToInventory, equipItem } from '../core/inventory/inventory-manager.ts';
import { ITEMS_CATALOG } from '../core/data/items.ts';
import { calculateScaledCardValues } from '../core/combat/card-scaling.ts';
import { CARDS_CATALOG } from '../core/data/cards.ts';

describe('Permanent Armory & Sanctum Blessings Card Scaling', () => {
  it('initializes default unlocked equipment and bastion shield upgrade', () => {
    const meta = createInitialMetaProgression();
    expect(meta.unlockedEquipmentIds).toContain('iron-broadsword');
    expect(meta.unlockedEquipmentIds).toContain('tempered-cuirass');
    expect(meta.unlockedEquipmentIds).toContain('ring-of-evasion');
    expect(meta.upgradeRanks.bastion).toBe(0);
  });

  it('permanently unlocks rare and legendary armory items with Aetherium', () => {
    let meta = { ...createInitialMetaProgression(), aetherium: 120 };
    const result = unlockMetaEquipment(meta, 'sunfire-greatsword');

    expect(result.success).toBe(true);
    expect(result.nextState.unlockedEquipmentIds).toContain('sunfire-greatsword');
    expect(result.nextState.aetherium).toBe(120 - 100);
  });

  it('equips starter armory loadout items and boosts hero stats upon character creation', () => {
    let hero = createHeroFromClass('WARRIOR', 'Galahad', 'hero-1');
    let inventory = createInitialInventory();

    const newWeapon = ITEMS_CATALOG['steel-claymore'];
    inventory = addItemToInventory(inventory, newWeapon, 1);
    const res = equipItem(inventory, hero, newWeapon);
    inventory = res.inventory;
    hero = res.hero;

    expect(inventory.equipment.MAIN_HAND?.id).toBe('steel-claymore');
    // Steel claymore (+4 STR) + plated gauntlets (+1 STR) + iron greaves (+2 STR) = 14 + 7 = 21 STR
    expect(hero.primaryStats.strength).toBe(21);
  });

  it('Astral Bastion meta upgrade grants starting combat shield', () => {
    const hero = createHeroFromClass('WARRIOR', 'Aegis Warrior');
    let meta = { ...createInitialMetaProgression(), aetherium: 100 };
    const buyResult = purchaseMetaUpgrade(meta, 'bastion');

    expect(buyResult.success).toBe(true);
    expect(buyResult.nextState.upgradeRanks.bastion).toBe(1);

    const boostedHero = applyMetaUpgradesToHero(hero, buyResult.nextState);
    // Rank 1 Bastion grants 6 starting shield
    expect(boostedHero.shieldHp).toBe(6);
  });

  it('Sanctum Prowess and equipment attack power directly amplify card damage calculations', () => {
    const hero = createHeroFromClass('WARRIOR', 'Test Warrior');
    let meta = { ...createInitialMetaProgression(), aetherium: 150 };
    // Buy 2 ranks of prowess = +6 Base Attack
    meta = purchaseMetaUpgrade(meta, 'prowess').nextState;
    meta = purchaseMetaUpgrade(meta, 'prowess').nextState;

    const boostedHero = applyMetaUpgradesToHero(hero, meta);
    const strikeCard = CARDS_CATALOG['strike'];
    const scaled = calculateScaledCardValues(strikeCard, boostedHero);

    expect(scaled.damage).toBeDefined();
    // Base 6 + 7 stat scaling (14 STR, 10 DEX) + attack power bonus from Prowess
    expect(scaled.damage!.total).toBeGreaterThan(6 + 7);
    expect(scaled.damage!.statFormula).toContain('Atk Power');
  });
});
