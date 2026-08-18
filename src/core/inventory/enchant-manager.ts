import type { Item } from '../types/items.ts';
import type { InventoryState } from '../types/inventory.ts';
import type { Combatant } from '../types/combat.ts';

export type WeaponEnchantmentType = 'IGNITION' | 'FROSTBITE' | 'SANGUINE' | 'VOLTAIC';

export interface EnchantmentRune {
  type: WeaponEnchantmentType;
  name: string;
  cost: number;
  description: string;
  icon: string;
}

export const ENCHANTMENT_RUNES: EnchantmentRune[] = [
  {
    type: 'IGNITION',
    name: 'Rune of Primordial Fire',
    cost: 100,
    description: 'Imbues weapon with searing flames, granting +15 Fire Attack power.',
    icon: '🔥',
  },
  {
    type: 'FROSTBITE',
    name: 'Rune of Glacial Shards',
    cost: 100,
    description: 'Imbues weapon with biting cold, granting +15 Ice Attack power.',
    icon: '❄️',
  },
  {
    type: 'SANGUINE',
    name: 'Rune of the Vampiric Fang',
    cost: 120,
    description: 'Infuses weapon with sanguine thirst, granting +12 Lifesteal healing on physical hits.',
    icon: '🩸',
  },
  {
    type: 'VOLTAIC',
    name: 'Rune of Crackling Thunder',
    cost: 110,
    description: 'Electrifies weapon edges, granting +10% Critical Strike Chance.',
    icon: '⚡',
  },
];

export interface EnchantResult {
  success: boolean;
  inventory: InventoryState;
  hero: Combatant;
  enchantedItem?: Item;
  message: string;
}

export function enchantWeapon(
  inventory: InventoryState,
  hero: Combatant,
  weapon: Item,
  rune: EnchantmentRune
): EnchantResult {
  if (inventory.gold < rune.cost) {
    return {
      success: false,
      inventory,
      hero,
      message: `Insufficient gold: requires ${rune.cost} Gold.`,
    };
  }

  if (weapon.slot !== 'MAIN_HAND' && weapon.slot !== 'OFF_HAND') {
    return {
      success: false,
      inventory,
      hero,
      message: 'Only weapons and shields can be enchanted with elemental runes.',
    };
  }

  const enchantedItem: Item = {
    ...weapon,
    name: `${weapon.name} (${rune.name.split(' ')[2]})`,
    description: `${weapon.description} [Enchanted with ${rune.name}]`,
    derivedStatBonuses: {
      ...weapon.derivedStatBonuses,
      physicalAttack: (weapon.derivedStatBonuses?.physicalAttack || 0) + 12,
      critChance: rune.type === 'VOLTAIC'
        ? (weapon.derivedStatBonuses?.critChance || 0) + 10
        : weapon.derivedStatBonuses?.critChance,
    },
  };

  const updatedInvItems = inventory.items.map((slot) =>
    slot.item.id === weapon.id ? { ...slot, item: enchantedItem } : slot
  );

  let updatedEquipment = { ...inventory.equipment };
  if (weapon.slot && inventory.equipment[weapon.slot]?.id === weapon.id) {
    updatedEquipment[weapon.slot] = enchantedItem;
  }

  const nextInventory: InventoryState = {
    ...inventory,
    gold: inventory.gold - rune.cost,
    items: updatedInvItems,
    equipment: updatedEquipment,
  };

  return {
    success: true,
    inventory: nextInventory,
    hero: {
      ...hero,
      derivedStats: {
        ...hero.derivedStats,
        physicalAttack: hero.derivedStats.physicalAttack + 12,
      },
    },
    enchantedItem,
    message: `Successfully imbued ${weapon.name} with ${rune.name}!`,
  };
}
