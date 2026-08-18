import type { Combatant } from '../types/combat.ts';
import type { PrimaryStats, DerivedStats } from '../types/stats.ts';
import type { Item } from '../types/items.ts';
import type { InventoryState } from '../types/inventory.ts';
import { calculateHeroStatsWithEquipment } from './inventory-manager.ts';

export const MAX_UPGRADE_LEVEL = 5;

export function getUpgradeCost(item: Item): number {
  const currentLvl = item.upgradeLevel || 0;
  return Math.round(item.value * 0.6 * Math.pow(1.5, currentLvl));
}

export function upgradeItem(
  inventory: InventoryState,
  hero: Combatant,
  item: Item
): {
  inventory: InventoryState;
  hero: Combatant;
  upgradedItem: Item;
  success: boolean;
} {
  const currentLvl = item.upgradeLevel || 0;
  if (currentLvl >= MAX_UPGRADE_LEVEL) {
    return { inventory, hero, upgradedItem: item, success: false };
  }

  const cost = getUpgradeCost(item);
  if (inventory.gold < cost) {
    return { inventory, hero, upgradedItem: item, success: false };
  }

  const nextLvl = currentLvl + 1;
  const multiplier = 1.25;

  // Scale primary stat bonuses
  const nextPrimary: Partial<PrimaryStats> = {};
  if (item.primaryStatBonuses) {
    Object.entries(item.primaryStatBonuses).forEach(([key, val]) => {
      if (val !== undefined) {
        nextPrimary[key as keyof PrimaryStats] = Math.round(val * multiplier) || val + 1;
      }
    });
  }

  // Scale derived stat bonuses
  const nextDerived: Partial<DerivedStats> = {};
  if (item.derivedStatBonuses) {
    Object.entries(item.derivedStatBonuses).forEach(([key, val]) => {
      if (val !== undefined) {
        nextDerived[key as keyof DerivedStats] = Math.round(val * multiplier) || val + 1;
      }
    });
  }

  const baseName = item.name.replace(/\s\+\d+$/, '');
  const upgradedItem: Item = {
    ...item,
    name: `${baseName} +${nextLvl}`,
    upgradeLevel: nextLvl,
    primaryStatBonuses: nextPrimary,
    derivedStatBonuses: nextDerived,
    value: Math.round(item.value * 1.3),
  };

  // Update in inventory equipment or bag items
  let nextEquipment = { ...inventory.equipment };
  let isEquipped = false;

  if (item.slot && nextEquipment[item.slot]?.id === item.id) {
    nextEquipment = {
      ...nextEquipment,
      [item.slot]: upgradedItem,
    };
    isEquipped = true;
  }

  const nextItems = inventory.items.map((slot) => {
    if (slot.item.id === item.id) {
      return { ...slot, item: upgradedItem };
    }
    return slot;
  });

  const nextInventory: InventoryState = {
    ...inventory,
    gold: inventory.gold - cost,
    equipment: nextEquipment,
    items: nextItems,
  };

  const nextHero = isEquipped
    ? calculateHeroStatsWithEquipment(hero, nextEquipment)
    : hero;

  return {
    inventory: nextInventory,
    hero: nextHero,
    upgradedItem,
    success: true,
  };
}
