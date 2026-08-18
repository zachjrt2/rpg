import { describe, it, expect } from 'vitest';
import { enchantWeapon, ENCHANTMENT_RUNES } from '../core/inventory/enchant-manager.ts';
import { createHeroFromClass } from '../core/data/characters.ts';
import { createInitialInventory } from '../core/inventory/inventory-manager.ts';
import { ITEMS_CATALOG } from '../core/data/items.ts';

describe('Weapon Enchanting System', () => {
  it('should enchant weapon with ignition rune when player has sufficient gold', () => {
    const hero = createHeroFromClass('WARRIOR');
    let inventory = createInitialInventory();
    inventory.gold = 300;
    const sword = ITEMS_CATALOG['iron-broadsword'];

    const fireRune = ENCHANTMENT_RUNES[0];
    const result = enchantWeapon(inventory, hero, sword, fireRune);

    expect(result.success).toBe(true);
    expect(result.inventory.gold).toBe(200);
    expect(result.enchantedItem?.name).toContain('Primordial');
  });

  it('should fail enchanting if player does not have enough gold', () => {
    const hero = createHeroFromClass('WARRIOR');
    let inventory = createInitialInventory();
    inventory.gold = 10;
    const sword = ITEMS_CATALOG['iron-broadsword'];

    const fireRune = ENCHANTMENT_RUNES[0];
    const result = enchantWeapon(inventory, hero, sword, fireRune);

    expect(result.success).toBe(false);
    expect(result.message).toContain('Insufficient gold');
  });
});
