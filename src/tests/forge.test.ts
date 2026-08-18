import { describe, it, expect } from 'vitest';
import { getUpgradeCost, upgradeItem } from '../core/inventory/forge-manager.ts';
import { createInitialInventory } from '../core/inventory/inventory-manager.ts';
import { createWarriorHero } from '../core/data/characters.ts';
import { ITEMS_CATALOG } from '../core/data/items.ts';

describe('Blacksmith Forge Engine', () => {
  it('calculates upgrade cost dynamically based on item base value and level', () => {
    const sword = { ...ITEMS_CATALOG['iron-broadsword'], upgradeLevel: 0 };
    const cost0 = getUpgradeCost(sword);
    expect(cost0).toBeGreaterThan(0);

    const sword1 = { ...ITEMS_CATALOG['iron-broadsword'], upgradeLevel: 1 };
    const cost1 = getUpgradeCost(sword1);
    expect(cost1).toBeGreaterThan(cost0);
  });

  it('upgrades equipped weapon to +1, increasing hero physical attack and deducting gold', () => {
    const hero = createWarriorHero();
    const inventory = createInitialInventory();
    inventory.gold = 500;

    const equippedSword = inventory.equipment['MAIN_HAND']!;
    const initialAtk = hero.derivedStats.physicalAttack;

    const result = upgradeItem(inventory, hero, equippedSword);

    expect(result.success).toBe(true);
    expect(result.upgradedItem.upgradeLevel).toBe(1);
    expect(result.upgradedItem.name).toContain('+1');
    expect(result.hero.derivedStats.physicalAttack).toBeGreaterThan(initialAtk);
    expect(result.inventory.gold).toBeLessThan(500);
  });
});
