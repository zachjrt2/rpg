/**
 * Status Effects Type System
 */

export type StatusEffectType =
  | 'BURNING'      // Fire DoT at start of turn
  | 'POISON'       // Nature DoT at start of turn (% max HP)
  | 'BLEEDING'     // Physical DoT on turn, reduces physical defense
  | 'STUNNED'      // Skips turn entirely
  | 'FROZEN'       // Cannot act physically, takes +25% physical damage
  | 'SILENCED'     // Cannot cast spells/abilities
  | 'WEAKENED'     // Deals 30% less damage
  | 'HASTE'        // +40% Speed
  | 'REGENERATION' // Heals at start of turn
  | 'SHIELDED'     // Absorbs incoming damage up to shield value
  | 'VULNERABLE'   // Takes +30% increased damage from all attacks
  | 'SHOCKED'      // Discharges +8 bonus Lightning damage whenever struck
  | 'BLINDED'      // Accuracy reduced by 40% (chance to miss attacks)
  | 'CORROSION'    // Acid DoT that dissolves target Block and armor
  | 'THORNS'       // Reflects damage back to attacker when struck
  | 'EMPOWERED';   // Deals +4 flat bonus damage on attacks

export interface StatusEffectApplication {
  effectId: StatusEffectType;
  chance: number;       // Probability 0.0 - 1.0
  duration: number;     // Number of rounds/turns
  potency?: number;     // Base damage/healing or stat value per turn
  sourceId?: string;    // Actor ID that applied this effect
}

export interface ActiveStatusEffect {
  id: string;
  type: StatusEffectType;
  name: string;
  duration: number;
  remainingTurns: number;
  potency: number;
  sourceId?: string;
  sourceName?: string;
}
