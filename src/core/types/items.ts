import type { PrimaryStats, DerivedStats } from './stats.ts';
import type { StatusEffectType } from './status-effects.ts';

export type ItemRarity = 'COMMON' | 'UNCOMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';

export type ItemType = 'WEAPON' | 'ARMOR' | 'ACCESSORY' | 'CONSUMABLE';

export type ItemSlot =
  | 'MAIN_HAND'
  | 'OFF_HAND'
  | 'HEAD'
  | 'CHEST'
  | 'HANDS'
  | 'LEGS'
  | 'FEET'
  | 'RING_1'
  | 'RING_2';

export interface ConsumableEffect {
  type:
    | 'HEAL_HP'
    | 'HEAL_MANA'
    | 'RESTORE_ENERGY'
    | 'RESTORE_SHIELD'
    | 'CURE_STATUS'
    | 'APPLY_BUFF'
    | 'DAMAGE_ENEMY'
    | 'DRAW_CARDS';
  value: number;
  statusType?: StatusEffectType;
  duration?: number;
  damageElement?: 'FIRE' | 'ICE' | 'LIGHTNING' | 'PHYSICAL' | 'HOLY';
  statusDuration?: number;
  statusPotency?: number;
  cardsToDraw?: number;
}

export interface Item {
  id: string;
  name: string;
  description: string;
  type: ItemType;
  slot?: ItemSlot;
  rarity: ItemRarity;
  levelRequirement: number;
  primaryStatBonuses?: Partial<PrimaryStats>;
  derivedStatBonuses?: Partial<DerivedStats>;
  value: number; // Gold value
  icon: string;
  consumableEffect?: ConsumableEffect;
  isStackable?: boolean;
  upgradeLevel?: number;
}

export interface InventoryItemSlot {
  item: Item;
  quantity: number;
}
