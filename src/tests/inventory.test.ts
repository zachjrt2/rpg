import { describe, it, expect } from 'vitest';
import {
  createInitialInventory,
  equipItem,
  unequipItem,
  addItemToInventory,
  removeItemFromInventory,
} from '../core/inventory/inventory-manager.ts';
import { createWarriorHero } from '../core/data/characters.ts';
import { ITEMS_CATALOG } from '../core/data/items.ts';

describe('Inventory & Equipment Manager', () => {
  it('equips a weapon and increases physical attack rating', () => {
    const hero = createWarriorHero();
    const inventory = createInitialInventory();
    const claymore = ITEMS_CATALOG['steel-claymore'];

    const initialAttack = hero.derivedStats.physicalAttack;
    const result = equipItem(inventory, hero, claymore);

    expect(result.inventory.equipment.MAIN_HAND?.id).toBe('steel-claymore');
    expect(result.hero.derivedStats.physicalAttack).toBeGreaterThan(initialAttack);
  });

  it('unequips gear, restores stats and moves item to bag', () => {
    const hero = createWarriorHero();
    const inventory = createInitialInventory();

    const initialBagCount = inventory.items.length;
    const result = unequipItem(inventory, hero, 'MAIN_HAND');

    expect(result.inventory.equipment.MAIN_HAND).toBeUndefined();
    expect(result.inventory.items.length).toBe(initialBagCount + 1);
  });

  it('stacks consumable items properly', () => {
    const inventory = createInitialInventory();
    const potion = ITEMS_CATALOG['lesser-healing-potion'];

    const initialQty = inventory.items.find((i) => i.item.id === potion.id)?.quantity || 0;
    const updated = addItemToInventory(inventory, potion, 3);
    const newQty = updated.items.find((i) => i.item.id === potion.id)?.quantity;

    expect(newQty).toBe(initialQty + 3);
  });

  it('removes item quantity from inventory', () => {
    const inventory = createInitialInventory();
    const potion = ITEMS_CATALOG['lesser-healing-potion'];

    const initialQty = inventory.items.find((i) => i.item.id === potion.id)?.quantity || 0;
    const updated = removeItemFromInventory(inventory, potion.id, 1);
    const newQty = updated.items.find((i) => i.item.id === potion.id)?.quantity;

    expect(newQty).toBe(initialQty - 1);
  });
});
