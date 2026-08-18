import type { Item, ItemSlot, InventoryItemSlot } from './items.ts';

export type EquipmentMap = Partial<Record<ItemSlot, Item>>;

export interface InventoryState {
  items: InventoryItemSlot[];
  equipment: EquipmentMap;
  gold: number;
  maxSlots: number;
}
