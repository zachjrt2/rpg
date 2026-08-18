import type { RelicId } from './relics.ts';
import type { Item } from './items.ts';

export interface DungeonEventChoice {
  id: string;
  label: string;
  description: string;
  cost?: {
    gold?: number;
    hpPercent?: number;
    manaPercent?: number;
  };
  reward: {
    gold?: number;
    hpPercent?: number;
    manaPercent?: number;
    relicId?: RelicId;
    item?: Item;
    attackBonusFlat?: number;
  };
  risk?: {
    chance: number; // 0.0 to 1.0 probability
    failureMessage: string;
    damageAmount?: number;
    poisonDuration?: number;
  };
}

export interface DungeonEventDefinition {
  id: string;
  title: string;
  story: string;
  avatarIcon: string;
  choices: DungeonEventChoice[];
}
