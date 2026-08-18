import type { Combatant } from '../types/combat.ts';
import type { CharacterClassId } from '../types/classes.ts';
import { CHARACTER_CLASSES } from './classes.ts';
import { calculateDerivedStats } from '../stats/stat-calculator.ts';

export type OriginBoonId =
  | 'iron-constitution'
  | 'leyline-conduit'
  | 'fortune-favored'
  | 'sharpened-edge'
  | 'spell-weaver';

export interface OriginBoonDefinition {
  id: OriginBoonId;
  name: string;
  description: string;
  icon: string;
}

export const ORIGIN_BOONS: Record<OriginBoonId, OriginBoonDefinition> = {
  'iron-constitution': {
    id: 'iron-constitution',
    name: 'Iron Constitution',
    description: '+30 Maximum Health and +2 Vitality starting resilience.',
    icon: 'Heart',
  },
  'leyline-conduit': {
    id: 'leyline-conduit',
    name: 'Leyline Conduit',
    description: '+25 Maximum Mana and +2 Willpower mana recovery.',
    icon: 'Zap',
  },
  'fortune-favored': {
    id: 'fortune-favored',
    name: "Fortune's Favored",
    description: '+50 Starting Gold and +3 Luck attribute for critical hit chance.',
    icon: 'Sparkles',
  },
  'sharpened-edge': {
    id: 'sharpened-edge',
    name: 'Sharpened Edge',
    description: '+5 Base Physical Attack and +2 Strength prowess.',
    icon: 'Swords',
  },
  'spell-weaver': {
    id: 'spell-weaver',
    name: 'Spell Weaver',
    description: '+5 Base Magic Attack and +2 Intelligence spell scaling.',
    icon: 'Sparkles',
  },
};

import type { PrimaryStats } from '../types/stats.ts';

export function createHeroFromClass(
  classId: CharacterClassId = 'WARRIOR',
  name: string = 'Sir Alden',
  id: string = 'hero-1',
  level: number = 1,
  customAbilities?: string[],
  originBoon?: OriginBoonId,
  customPrimaryStats?: Partial<PrimaryStats>
): Combatant {
  const classDef = CHARACTER_CLASSES[classId] || CHARACTER_CLASSES.WARRIOR;
  const primaryStats = { ...classDef.baseStats };

  // Apply custom allocated primary stats from Character Creator
  if (customPrimaryStats) {
    if (customPrimaryStats.strength) primaryStats.strength += customPrimaryStats.strength;
    if (customPrimaryStats.dexterity) primaryStats.dexterity += customPrimaryStats.dexterity;
    if (customPrimaryStats.intelligence) primaryStats.intelligence += customPrimaryStats.intelligence;
    if (customPrimaryStats.vitality) primaryStats.vitality += customPrimaryStats.vitality;
    if (customPrimaryStats.willpower) primaryStats.willpower += customPrimaryStats.willpower;
    if (customPrimaryStats.luck) primaryStats.luck += customPrimaryStats.luck;
  }

  // Calculate stat growths for level > 1
  if (level > 1) {
    const levelsGained = level - 1;
    primaryStats.strength += classDef.statGrowths.strength * levelsGained;
    primaryStats.dexterity += classDef.statGrowths.dexterity * levelsGained;
    primaryStats.intelligence += classDef.statGrowths.intelligence * levelsGained;
    primaryStats.vitality += classDef.statGrowths.vitality * levelsGained;
    primaryStats.willpower += classDef.statGrowths.willpower * levelsGained;
    primaryStats.luck += classDef.statGrowths.luck * levelsGained;
  }

  // Apply Origin Boon stat enhancements
  let extraHp = 0;
  let extraMana = 0;
  let extraAtk = 0;
  let extraMatk = 0;

  if (originBoon === 'iron-constitution') {
    primaryStats.vitality += 2;
    extraHp += 30;
  } else if (originBoon === 'leyline-conduit') {
    primaryStats.willpower += 2;
    extraMana += 25;
  } else if (originBoon === 'fortune-favored') {
    primaryStats.luck += 3;
  } else if (originBoon === 'sharpened-edge') {
    primaryStats.strength += 2;
    extraAtk += 5;
  } else if (originBoon === 'spell-weaver') {
    primaryStats.intelligence += 2;
    extraMatk += 5;
  }

  const derivedStats = calculateDerivedStats(primaryStats, level);
  derivedStats.maxHp += extraHp;
  derivedStats.maxMana += extraMana;
  derivedStats.physicalAttack += extraAtk;
  derivedStats.magicAttack += extraMatk;

  const startingAbilities = customAbilities && customAbilities.length > 0
    ? [...customAbilities]
    : [...classDef.initialAbilities];

  return {
    id,
    name,
    type: 'HERO',
    className: classDef.name,
    classId: classDef.id,
    level,
    primaryStats,
    derivedStats,
    currentHp: derivedStats.maxHp,
    maxHp: derivedStats.maxHp,
    currentMana: derivedStats.maxMana,
    maxMana: derivedStats.maxMana,
    isDefending: false,
    isDead: false,
    avatar: classDef.avatar,
    description: classDef.description,
    abilities: startingAbilities,
    abilityCooldowns: {},
    statusEffects: [],
    shieldHp: 0,
    originBoon,
  };
}

export function createWarriorHero(id: string = 'hero-1', name: string = 'Sir Alden'): Combatant {
  return createHeroFromClass('WARRIOR', name, id);
}
