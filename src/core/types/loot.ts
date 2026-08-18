import type { InventoryItemSlot } from './items.ts';

export interface LootDropEntry {
  itemId: string;
  chance: number; // 0.0 to 1.0
  minQty: number;
  maxQty: number;
}

export interface EnemyLootTable {
  enemyType: string;
  minGold: number;
  maxGold: number;
  exp: number;
  drops: LootDropEntry[];
}

export interface EncounterLootResult {
  gold: number;
  exp: number;
  items: InventoryItemSlot[];
}
