import type { Combatant } from './combat.ts';
import type { ProgressionState } from './progression.ts';
import type { EquipmentMap } from './inventory.ts';

export type PartyPosition = 'FRONTLINE' | 'BACKLINE';

export interface PartyMember {
  hero: Combatant;
  position: PartyPosition;
  progression: ProgressionState;
  equipment: EquipmentMap;
}

export interface PartyState {
  activeMembers: PartyMember[]; // 1 to 3 active heroes in battle
  reserveMembers: PartyMember[]; // Bench heroes
  maxActiveSize: number;
}
