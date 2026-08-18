import type { StatusEffectApplication } from './status-effects.ts';

export type AbilityType = 'PHYSICAL' | 'MAGICAL' | 'HEAL' | 'BUFF' | 'DEBUFF';

export type ElementType = 'PHYSICAL' | 'FIRE' | 'ICE' | 'LIGHTNING' | 'HOLY' | 'SHADOW' | 'NATURE';

export type TargetScope = 'SINGLE_ENEMY' | 'ALL_ENEMIES' | 'SINGLE_ALLY' | 'ALL_ALLIES' | 'SELF';

export interface AbilityResourceCost {
  mana: number;
}

export interface Ability {
  id: string;
  name: string;
  description: string;
  type: AbilityType;
  element: ElementType;
  cost: AbilityResourceCost;
  targetType: TargetScope;
  powerMultiplier: number; // Multiplier for ATK (Physical) or INT (Magical) or WIL (Heal)
  baseFlatPower?: number;
  accuracy: number;        // Base accuracy %
  critBonus: number;       // Flat bonus to crit chance %
  cooldown: number;        // Cooldown in turn rounds
  statusEffects?: StatusEffectApplication[];
  classRestrictions?: string[];
  levelRequirement: number;
  icon: string;
}
