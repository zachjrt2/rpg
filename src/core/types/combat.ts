import type { PrimaryStats, DerivedStats } from './stats.ts';
import type { ActiveStatusEffect } from './status-effects.ts';

export type CombatantType = 'HERO' | 'ENEMY';

export interface Combatant {
  id: string;
  name: string;
  type: CombatantType;
  className: string;
  classId?: string;
  level: number;
  currentHp: number;
  maxHp: number;
  currentMana: number;
  maxMana: number;
  primaryStats: PrimaryStats;
  derivedStats: DerivedStats;
  isDefending: boolean;
  isDead: boolean;
  avatar: string;
  description?: string;
  aiType?:
    | 'BASIC_MELEE'
    | 'AGGRESSIVE'
    | 'TACTICAL'
    | 'CASTER'
    | 'HEALER'
    | 'ENRAGER'
    | 'DEFENDER_FORTRESS'
    | 'CORROSION_DRAINER'
    | 'SPELLWEAVER'
    | 'CROWD_CONTROLLER'
    | 'PACK_LEADER';
  abilities: string[]; // List of ability IDs available to combatant
  abilityCooldowns: Record<string, number>; // abilityId -> remaining cooldown rounds
  statusEffects: ActiveStatusEffect[];
  shieldHp: number; // Temporary absorption shield
  posture?: number; // Current stagger/posture meter
  maxPosture?: number; // Max stagger/posture meter
  originBoon?: string; // Origin Boon ID chosen during character creation
}

export type ActionType = 'ATTACK' | 'DEFEND' | 'ABILITY' | 'ITEM' | 'PASS';

export interface CombatAction {
  type: ActionType;
  actorId: string;
  targetId: string;
  abilityId?: string;
  itemId?: string;
}

export type CombatStatus = 'IN_PROGRESS' | 'VICTORY' | 'DEFEAT' | 'FLED';

export type CombatLogType =
  | 'ACTION'
  | 'DAMAGE'
  | 'CRIT'
  | 'MISS'
  | 'DEFEND'
  | 'HEAL'
  | 'BUFF'
  | 'DEBUFF'
  | 'STATUS_TICK'
  | 'STATUS_EXPIRE'
  | 'DEFEAT'
  | 'INFO'
  | 'ROUND';

export interface CombatLogEntry {
  id: string;
  round: number;
  timestamp: number;
  actorName: string;
  targetName?: string;
  actionType: ActionType;
  isHit: boolean;
  isCrit: boolean;
  damage: number;
  heal?: number;
  isDefended: boolean;
  isKilled: boolean;
  message: string;
  entryType: CombatLogType;
}

export interface FloatingText {
  id: string;
  targetId: string;
  text: string;
  type: 'damage' | 'crit' | 'miss' | 'defend' | 'heal' | 'buff' | 'status' | 'info';
  createdAt: number;
}

export interface CombatState {
  id: string;
  round: number;
  status: CombatStatus;
  turnOrder: string[]; // Combatant IDs ordered by initiative
  activeTurnIndex: number;
  activeCombatantId: string;
  combatants: Record<string, Combatant>;
  enemyQueue: Combatant[]; // Queued bench monsters to be sent out when active enemy dies (Pokemon style)
  selectedTargetId: string | null;
  log: CombatLogEntry[];
  floatingTexts: FloatingText[];
  seed: number;
}

export interface DamageCalculationResult {
  hitChance: number;
  isHit: boolean;
  critChance: number;
  isCrit: boolean;
  rawDamage: number;
  mitigatedDamage: number;
  finalDamage: number;
  wasDefended: boolean;
  isKilled: boolean;
  shieldAbsorbed?: number;
  isGlancingBlow?: boolean;
}

export interface ActionExecutionResult {
  nextState: CombatState;
  logEntries: CombatLogEntry[];
  floatingTexts: FloatingText[];
  damageResult?: DamageCalculationResult;
}
