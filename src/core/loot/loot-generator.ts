import type { Combatant } from '../types/combat.ts';
import type { EncounterLootResult } from '../types/loot.ts';
import type { InventoryItemSlot } from '../types/items.ts';
import type { IRandomNumberGenerator } from '../rng/rng.ts';
import { ENEMY_LOOT_TABLES } from '../data/loot-tables.ts';
import { ITEMS_CATALOG } from '../data/items.ts';

/**
 * Deterministically generates encounter loot, gold, and exp drops
 * based on enemy loot tables and the player's Luck attribute.
 */
export function generateEncounterLoot(
  enemies: Combatant[],
  hero: Combatant,
  rng: IRandomNumberGenerator
): EncounterLootResult {
  const luckBonus = 1.0 + (hero.primaryStats.luck * 0.02); // e.g. +20% drop rate per 10 LUK

  let totalGold = 0;
  let totalExp = 0;
  const droppedItemsMap: Record<string, number> = {};

  enemies.forEach((enemy) => {
    const table = ENEMY_LOOT_TABLES[enemy.className] || ENEMY_LOOT_TABLES.Scout;

    // 1. Roll Gold with luck multiplier
    const baseGold = rng.nextInt(table.minGold, table.maxGold);
    totalGold += Math.round(baseGold * luckBonus);

    // 2. Add EXP
    totalExp += table.exp;

    // 3. Roll Item Drops
    table.drops.forEach((drop) => {
      const adjustedChance = Math.min(0.95, drop.chance * luckBonus);
      if (rng.rollChance(adjustedChance)) {
        const qty = rng.nextInt(drop.minQty, drop.maxQty);
        droppedItemsMap[drop.itemId] = (droppedItemsMap[drop.itemId] || 0) + qty;
      }
    });
  });

  const droppedItems: InventoryItemSlot[] = Object.entries(droppedItemsMap)
    .map(([itemId, quantity]) => {
      const item = ITEMS_CATALOG[itemId];
      return item ? { item, quantity } : null;
    })
    .filter((slot): slot is InventoryItemSlot => slot !== null);

  return {
    gold: totalGold,
    exp: totalExp,
    items: droppedItems,
  };
}
