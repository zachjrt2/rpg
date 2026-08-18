import type { EnemyLootTable } from '../types/loot.ts';

export const ENEMY_LOOT_TABLES: Record<string, EnemyLootTable> = {
  Scout: {
    enemyType: 'Scout',
    minGold: 22,
    maxGold: 45,
    exp: 50,
    drops: [
      { itemId: 'lesser-healing-potion', chance: 0.7, minQty: 1, maxQty: 2 },
      { itemId: 'iron-broadsword', chance: 0.25, minQty: 1, maxQty: 1 },
      { itemId: 'plated-gauntlets', chance: 0.2, minQty: 1, maxQty: 1 },
      { itemId: 'venomous-kris', chance: 0.08, minQty: 1, maxQty: 1 },
    ],
  },
  Shaman: {
    enemyType: 'Shaman',
    minGold: 35,
    maxGold: 65,
    exp: 75,
    drops: [
      { itemId: 'mana-draught', chance: 0.75, minQty: 1, maxQty: 2 },
      { itemId: 'antidote-vial', chance: 0.5, minQty: 1, maxQty: 1 },
      { itemId: 'sapphire-seal-ring', chance: 0.22, minQty: 1, maxQty: 1 },
      { itemId: 'staff-of-arcane-ruin', chance: 0.07, minQty: 1, maxQty: 1 },
    ],
  },
  'Dark Mage': {
    enemyType: 'Dark Mage',
    minGold: 45,
    maxGold: 80,
    exp: 85,
    drops: [
      { itemId: 'mana-draught', chance: 0.7, minQty: 1, maxQty: 2 },
      { itemId: 'greater-healing-potion', chance: 0.35, minQty: 1, maxQty: 1 },
      { itemId: 'robes-of-the-archmage', chance: 0.2, minQty: 1, maxQty: 1 },
      { itemId: 'crown-of-the-sun-king', chance: 0.05, minQty: 1, maxQty: 1 },
    ],
  },
  Beast: {
    enemyType: 'Beast',
    minGold: 25,
    maxGold: 50,
    exp: 60,
    drops: [
      { itemId: 'lesser-healing-potion', chance: 0.55, minQty: 1, maxQty: 1 },
      { itemId: 'elixir-of-haste', chance: 0.3, minQty: 1, maxQty: 1 },
      { itemId: 'ring-of-evasion', chance: 0.2, minQty: 1, maxQty: 1 },
      { itemId: 'boots-of-the-wind-strider', chance: 0.06, minQty: 1, maxQty: 1 },
    ],
  },
  'Undead Guard': {
    enemyType: 'Undead Guard',
    minGold: 45,
    maxGold: 90,
    exp: 95,
    drops: [
      { itemId: 'steel-claymore', chance: 0.3, minQty: 1, maxQty: 1 },
      { itemId: 'shield-of-the-lion', chance: 0.22, minQty: 1, maxQty: 1 },
      { itemId: 'dragonscale-hauberk', chance: 0.12, minQty: 1, maxQty: 1 },
      { itemId: 'sunfire-greatsword', chance: 0.05, minQty: 1, maxQty: 1 },
    ],
  },
};
