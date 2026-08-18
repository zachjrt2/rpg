import type { CombatLogEntry, CombatLogType, ActionType, FloatingText } from '../types/combat.ts';

let eventCounter = 0;

export function createLogEntry(params: {
  round: number;
  actorName: string;
  targetName?: string;
  actionType: ActionType;
  entryType: CombatLogType;
  message: string;
  isHit?: boolean;
  isCrit?: boolean;
  damage?: number;
  heal?: number;
  isDefended?: boolean;
  isKilled?: boolean;
}): CombatLogEntry {
  eventCounter++;
  return {
    id: `log-${Date.now()}-${eventCounter}`,
    timestamp: Date.now(),
    round: params.round,
    actorName: params.actorName,
    targetName: params.targetName,
    actionType: params.actionType,
    entryType: params.entryType,
    message: params.message,
    isHit: params.isHit ?? true,
    isCrit: params.isCrit ?? false,
    damage: params.damage ?? 0,
    heal: params.heal,
    isDefended: params.isDefended ?? false,
    isKilled: params.isKilled ?? false,
  };
}

export function createFloatingText(
  targetId: string,
  text: string,
  type: 'damage' | 'crit' | 'miss' | 'defend' | 'heal' | 'buff' | 'status' | 'info'
): FloatingText {
  eventCounter++;
  return {
    id: `float-${Date.now()}-${eventCounter}`,
    targetId,
    text,
    type,
    createdAt: Date.now(),
  };
}
