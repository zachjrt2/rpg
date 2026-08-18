import type { Combatant } from '../types/combat.ts';
import type { PrimaryStats, DerivedStats } from '../types/stats.ts';
import type { Item, ItemSlot, InventoryItemSlot } from '../types/items.ts';
import type { InventoryState, EquipmentMap } from '../types/inventory.ts';
import { ITEMS_CATALOG } from '../data/items.ts';
import { calculateDerivedStats } from '../stats/stat-calculator.ts';

/**
 * Creates the starting inventory for the hero.
 */
export function createInitialInventory(): InventoryState {
  const starterEquipment: EquipmentMap = {
    MAIN_HAND: ITEMS_CATALOG['iron-broadsword'],
    HEAD: ITEMS_CATALOG['steel-visor-helm'],
    CHEST: ITEMS_CATALOG['tempered-cuirass'],
    HANDS: ITEMS_CATALOG['plated-gauntlets'],
    LEGS: ITEMS_CATALOG['iron-greaves'],
    FEET: ITEMS_CATALOG['reinforced-sabatons'],
    RING_1: ITEMS_CATALOG['ring-of-evasion'],
  };

  const starterItems: InventoryItemSlot[] = [
    { item: ITEMS_CATALOG['lesser-healing-potion'], quantity: 3 },
    { item: ITEMS_CATALOG['mana-draught'], quantity: 2 },
    { item: ITEMS_CATALOG['antidote-vial'], quantity: 1 },
    { item: ITEMS_CATALOG['steel-claymore'], quantity: 1 },
    { item: ITEMS_CATALOG['staff-of-arcane-ruin'], quantity: 1 },
  ];

  return {
    items: starterItems,
    equipment: starterEquipment,
    gold: 75,
    maxSlots: 24,
  };
}

/**
 * Recalculates all primary and derived stats for a hero taking equipped gear into account.
 */
export function calculateHeroStatsWithEquipment(
  baseHero: Combatant,
  equipment: EquipmentMap
): Combatant {
  // 1. Calculate combined primary stats
  const totalPrimaryStats: PrimaryStats = { ...baseHero.primaryStats };

  Object.values(equipment).forEach((item) => {
    if (item && item.primaryStatBonuses) {
      if (item.primaryStatBonuses.strength) totalPrimaryStats.strength += item.primaryStatBonuses.strength;
      if (item.primaryStatBonuses.dexterity) totalPrimaryStats.dexterity += item.primaryStatBonuses.dexterity;
      if (item.primaryStatBonuses.intelligence) totalPrimaryStats.intelligence += item.primaryStatBonuses.intelligence;
      if (item.primaryStatBonuses.vitality) totalPrimaryStats.vitality += item.primaryStatBonuses.vitality;
      if (item.primaryStatBonuses.willpower) totalPrimaryStats.willpower += item.primaryStatBonuses.willpower;
      if (item.primaryStatBonuses.luck) totalPrimaryStats.luck += item.primaryStatBonuses.luck;
    }
  });

  // 2. Calculate base derived stats from total primary stats
  const calculatedDerived = calculateDerivedStats(totalPrimaryStats, baseHero.level);
  const totalDerivedStats: DerivedStats = { ...calculatedDerived };

  // 3. Add flat and percentage derived stat bonuses from equipment
  Object.values(equipment).forEach((item) => {
    if (item && item.derivedStatBonuses) {
      const b = item.derivedStatBonuses;
      if (b.maxHp) totalDerivedStats.maxHp += b.maxHp;
      if (b.maxMana) totalDerivedStats.maxMana += b.maxMana;
      if (b.physicalAttack) totalDerivedStats.physicalAttack += b.physicalAttack;
      if (b.physicalDefense) totalDerivedStats.physicalDefense += b.physicalDefense;
      if (b.magicAttack) totalDerivedStats.magicAttack += b.magicAttack;
      if (b.magicDefense) totalDerivedStats.magicDefense += b.magicDefense;
      if (b.speed) totalDerivedStats.speed += b.speed;
      if (b.accuracy) totalDerivedStats.accuracy = Math.min(100, totalDerivedStats.accuracy + b.accuracy);
      if (b.evasion) totalDerivedStats.evasion = Math.min(80, totalDerivedStats.evasion + b.evasion);
      if (b.critChance) totalDerivedStats.critChance = Math.min(85, totalDerivedStats.critChance + b.critChance);
      if (b.critMultiplier) totalDerivedStats.critMultiplier += b.critMultiplier;
    }
  });

  // 4. Adjust current HP and Mana if max was increased
  const currentHp = Math.min(baseHero.currentHp, totalDerivedStats.maxHp);
  const currentMana = Math.min(baseHero.currentMana, totalDerivedStats.maxMana);

  return {
    ...baseHero,
    primaryStats: totalPrimaryStats,
    derivedStats: totalDerivedStats,
    maxHp: totalDerivedStats.maxHp,
    maxMana: totalDerivedStats.maxMana,
    currentHp: Math.max(1, currentHp),
    currentMana,
  };
}

/**
 * Adds an item to the player's inventory bag.
 */
export function addItemToInventory(
  inventory: InventoryState,
  item: Item,
  quantity: number = 1
): InventoryState {
  if (quantity <= 0) return inventory;

  const nextItems = [...inventory.items];
  const existingIndex = nextItems.findIndex((slot) => slot.item.id === item.id);

  if (item.isStackable && existingIndex >= 0) {
    nextItems[existingIndex] = {
      ...nextItems[existingIndex],
      quantity: nextItems[existingIndex].quantity + quantity,
    };
  } else {
    if (nextItems.length >= inventory.maxSlots) {
      return inventory; // Bag full
    }
    nextItems.push({ item, quantity });
  }

  return {
    ...inventory,
    items: nextItems,
  };
}

/**
 * Removes an item from the player's inventory bag.
 */
export function removeItemFromInventory(
  inventory: InventoryState,
  itemId: string,
  quantity: number = 1
): InventoryState {
  const nextItems: InventoryItemSlot[] = [];

  for (const slot of inventory.items) {
    if (slot.item.id === itemId) {
      const remaining = slot.quantity - quantity;
      if (remaining > 0) {
        nextItems.push({ item: slot.item, quantity: remaining });
      }
    } else {
      nextItems.push(slot);
    }
  }

  return {
    ...inventory,
    items: nextItems,
  };
}

/**
 * Equips an item from the inventory bag to an equipment slot.
 */
export function equipItem(
  inventory: InventoryState,
  hero: Combatant,
  item: Item
): { inventory: InventoryState; hero: Combatant } {
  if (!item.slot) return { inventory, hero };

  const targetSlot: ItemSlot = item.slot;
  const currentEquipped = inventory.equipment[targetSlot];

  // 1. Remove 1x item from bag
  let nextInventory = removeItemFromInventory(inventory, item.id, 1);

  // 2. If slot already had an item, add it back to bag
  if (currentEquipped) {
    nextInventory = addItemToInventory(nextInventory, currentEquipped, 1);
  }

  // 3. Update equipment map
  const nextEquipment: EquipmentMap = {
    ...nextInventory.equipment,
    [targetSlot]: item,
  };

  nextInventory = {
    ...nextInventory,
    equipment: nextEquipment,
  };

  // 4. Recalculate hero stats with new gear
  const updatedHero = calculateHeroStatsWithEquipment(hero, nextEquipment);

  return {
    inventory: nextInventory,
    hero: updatedHero,
  };
}

/**
 * Unequips an item from an equipment slot and returns it to the inventory bag.
 */
export function unequipItem(
  inventory: InventoryState,
  hero: Combatant,
  slot: ItemSlot
): { inventory: InventoryState; hero: Combatant } {
  const currentEquipped = inventory.equipment[slot];
  if (!currentEquipped) return { inventory, hero };

  // 1. Add unequipped item to bag
  let nextInventory = addItemToInventory(inventory, currentEquipped, 1);

  // 2. Remove from equipment map
  const nextEquipment: EquipmentMap = { ...nextInventory.equipment };
  delete nextEquipment[slot];

  nextInventory = {
    ...nextInventory,
    equipment: nextEquipment,
  };

  // 3. Recalculate hero stats
  const updatedHero = calculateHeroStatsWithEquipment(hero, nextEquipment);

  return {
    inventory: nextInventory,
    hero: updatedHero,
  };
}
