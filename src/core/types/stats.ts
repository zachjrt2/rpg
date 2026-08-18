/**
 * Core Stats Definition & Types
 */

export interface PrimaryStats {
  strength: number;     // Physical power, physical damage scaling
  dexterity: number;    // Accuracy, evasion, finesse weapon scaling, crit chance
  intelligence: number; // Magic power, mana pool scaling, magic defense
  vitality: number;     // HP scaling, physical defense
  willpower: number;    // Status resistance, mana regeneration, healing potency
  luck: number;         // Critical hit rate, loot quality, accuracy bonus
}

export interface DerivedStats {
  maxHp: number;
  maxMana: number;
  physicalAttack: number;
  magicAttack: number;
  physicalDefense: number;
  magicDefense: number;
  speed: number;
  accuracy: number;        // Percentage (e.g., 90 for 90%)
  evasion: number;         // Percentage (e.g., 5 for 5%)
  critChance: number;      // Percentage (e.g., 10 for 10%)
  critMultiplier: number;  // Multiplier (e.g., 1.5 for 150% damage)
}

export interface StatModifiers {
  strength?: number;
  dexterity?: number;
  intelligence?: number;
  vitality?: number;
  willpower?: number;
  luck?: number;
  physicalAttack?: number;
  magicAttack?: number;
  physicalDefense?: number;
  magicDefense?: number;
  speed?: number;
  accuracy?: number;
  evasion?: number;
  critChance?: number;
  critMultiplier?: number;
  maxHpBonus?: number;
  maxManaBonus?: number;
}
