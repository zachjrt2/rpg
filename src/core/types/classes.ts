import type { PrimaryStats } from './stats.ts';

export type CharacterClassId =
  | 'WARRIOR'
  | 'ROGUE'
  | 'MAGE'
  | 'CLERIC'
  | 'RANGER'
  | 'PALADIN'
  | 'NECROMANCER'
  | 'BERSERKER';

export interface CharacterClassDefinition {
  id: CharacterClassId;
  name: string;
  role: string;
  description: string;
  baseStats: PrimaryStats;
  statGrowths: PrimaryStats;
  initialAbilities: string[]; // Ability IDs
  selectableAbilities?: string[]; // All abilities available in character creator
  avatar: string;
  isUnlockedByDefault?: boolean;
}
