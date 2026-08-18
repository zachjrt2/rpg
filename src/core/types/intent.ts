import type { StatusEffectType } from './status-effects.ts';

export type EnemyIntentType = 'ATTACK' | 'DEFEND' | 'BUFF' | 'DEBUFF' | 'HEAL' | 'SPECIAL';

export interface EnemyIntent {
  type: EnemyIntentType;
  damage?: number;
  block?: number;
  heal?: number;
  statusEffect?: StatusEffectType;
  description: string;
  icon: string;
}
