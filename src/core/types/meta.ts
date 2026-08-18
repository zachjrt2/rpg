import type { CharacterClassId } from './classes.ts';

export type MetaUpgradeId =
  | 'attunement'     // +Starting Attribute Points
  | 'might'          // +Base Strength
  | 'agility'        // +Base Dexterity
  | 'mind'           // +Base Intelligence
  | 'vitality'       // +Base Vitality
  | 'willpower'      // +Base Willpower
  | 'vigor'          // +Max HP
  | 'bastion'        // +Starting Combat Shield / Aegis
  | 'prowess'        // +Base Physical/Magic Attack
  | 'gold'           // +Starting Gold
  | 'fortune'        // +Starting Luck
  | 'capacity'       // +Starting Potion Capacity
  | 'transcendence'  // +Turn 1 Card Draw
  | 'wellspring'     // +Turn 1 Max Energy
  | 'reroll'         // +Free Card Draft Rerolls
  | 'reaping'        // +% Bonus Soul Shards
  | 'crit'           // +% Critical Strike Chance
  | 'relic_slots'    // +Starting Relic Selection Loadout Capacity
  | 'card_mastery'   // +Starting Signature Card Choices Capacity
  | 'celestial_core' // +Permanent Max Energy (3 -> 4, 4 -> 5)
  | 'phoenix';       // Revive once per run

export interface MetaUpgradeDefinition {
  id: MetaUpgradeId;
  name: string;
  description: string;
  iconName: string;
  maxRank: number;
  baseCost: number;
  costMultiplier: number;
  customCosts?: number[];
  bonusPerRank: {
    maxHp?: number;
    startingShield?: number;
    baseAttack?: number;
    startingGold?: number;
    luck?: number;
    potionCapacity?: number;
    startingStatPoints?: number;
    strength?: number;
    dexterity?: number;
    intelligence?: number;
    vitality?: number;
    willpower?: number;
    cardDraw?: number;
    maxEnergy?: number;
    startingEnergy?: number;
    draftRerolls?: number;
    shardMultiplier?: number;
    critChance?: number;
    relicSlots?: number;
    starterCards?: number;
    reviveChance?: number;
  };
}

export interface UnlockableRelicDefinition {
  relicId: string;
  name: string;
  rarity: string;
  cost: number;
  description: string;
}

export interface UnlockableEquipmentDefinition {
  itemId: string;
  name: string;
  slot: string;
  rarity: string;
  cost: number;
  description: string;
}

export interface MetaProgressionState {
  aetherium: number;                 // Total unspent Soul Shard meta-currency
  lifetimeAetherium: number;         // Total Aetherium collected across all runs
  unlockedClasses: CharacterClassId[];
  upgradeRanks: Record<MetaUpgradeId, number>;
  unlockedRelicIds: string[];        // Permanently unlocked starting relics in Astral Reliquary
  unlockedCardIds: string[];         // Permanently unlocked card IDs in Astral Archive
  unlockedEquipmentIds: string[];    // Permanently unlocked equipment IDs in Astral Armory
  totalRunsStarted: number;
  totalRunsWon: number;
  highestFloorReached: number;
  totalMonstersSlain: number;
  victoriesCount: number;
}
