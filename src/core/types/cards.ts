import type { ElementType } from './abilities.ts';
import type { StatusEffectType } from './status-effects.ts';

export type CardType = 'ATTACK' | 'SKILL' | 'POWER';

export type CardRarity = 'BASIC' | 'COMMON' | 'UNCOMMON' | 'RARE';

export type CardTargetScope = 'SINGLE_ENEMY' | 'ALL_ENEMIES' | 'SELF';

export interface CardStatusApplication {
  effectId: StatusEffectType;
  chance: number;
  duration: number;
  potency: number;
}

export interface CombatCard {
  id: string;
  baseId: string;
  name: string;
  type: CardType;
  rarity: CardRarity;
  cost: number;               // Energy cost (0, 1, 2, 3)
  description: string;
  element?: ElementType;
  isUpgraded: boolean;
  damage?: number;
  block?: number;
  magicDamage?: number;
  heal?: number;
  drawCards?: number;
  gainEnergy?: number;
  statusEffects?: CardStatusApplication[];
  targetScope: CardTargetScope;
  exhausts?: boolean;         // Goes to exhaust pile when played
  retains?: boolean;          // Not discarded at end of turn
  classRestrictions?: string[];
  icon: string;
}

export interface DeckState {
  drawPile: CombatCard[];
  hand: CombatCard[];
  discardPile: CombatCard[];
  exhaustPile: CombatCard[];
  maxEnergy: number;
  currentEnergy: number;
  drawCountPerTurn: number;
  fullDeck: CombatCard[];     // Complete master collection for the run
}
