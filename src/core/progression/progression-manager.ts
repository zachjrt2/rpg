import type { Combatant } from '../types/combat.ts';
import type { PrimaryStats } from '../types/stats.ts';
import type { ProgressionState } from '../types/progression.ts';
import { CLASS_SKILL_TREES } from '../data/skill-trees.ts';
import { calculateDerivedStats } from '../stats/stat-calculator.ts';

export function getExpRequiredForLevel(level: number): number {
  return Math.round(100 * Math.pow(level, 1.5));
}

export function createInitialProgression(): ProgressionState {
  return {
    currentExp: 0,
    expToNextLevel: getExpRequiredForLevel(1),
    unallocatedStatPoints: 0,
    unallocatedSkillPoints: 0,
    unlockedSkillNodeIds: [],
  };
}

/**
 * Adds experience points, handling multi-level jumps and stat/skill point awards.
 */
export function addExpToHero(
  hero: Combatant,
  progression: ProgressionState,
  expGained: number
): {
  hero: Combatant;
  progression: ProgressionState;
  leveledUp: boolean;
  levelsGained: number;
} {
  let currentExp = progression.currentExp + expGained;
  let level = hero.level;
  let expToNext = progression.expToNextLevel;
  let unallocatedStatPoints = progression.unallocatedStatPoints;
  let unallocatedSkillPoints = progression.unallocatedSkillPoints;
  let levelsGained = 0;

  while (currentExp >= expToNext) {
    currentExp -= expToNext;
    level += 1;
    levelsGained += 1;
    unallocatedStatPoints += 3;
    unallocatedSkillPoints += 1;
    expToNext = getExpRequiredForLevel(level);
  }

  const leveledUp = levelsGained > 0;
  const derivedStats = calculateDerivedStats(hero.primaryStats, level);

  const updatedHero: Combatant = {
    ...hero,
    level,
    derivedStats,
    maxHp: derivedStats.maxHp,
    maxMana: derivedStats.maxMana,
    currentHp: leveledUp ? derivedStats.maxHp : Math.min(hero.currentHp, derivedStats.maxHp),
    currentMana: leveledUp ? derivedStats.maxMana : Math.min(hero.currentMana, derivedStats.maxMana),
  };

  const updatedProgression: ProgressionState = {
    ...progression,
    currentExp,
    expToNextLevel: expToNext,
    unallocatedStatPoints,
    unallocatedSkillPoints,
  };

  return {
    hero: updatedHero,
    progression: updatedProgression,
    leveledUp,
    levelsGained,
  };
}

/**
 * Allocates an unspent stat point to a primary attribute.
 */
export function allocateStatPoint(
  hero: Combatant,
  progression: ProgressionState,
  stat: keyof PrimaryStats
): { hero: Combatant; progression: ProgressionState } {
  if (progression.unallocatedStatPoints <= 0) {
    return { hero, progression };
  }

  const updatedPrimaryStats: PrimaryStats = {
    ...hero.primaryStats,
    [stat]: (hero.primaryStats[stat] ?? 0) + 1,
  };

  const derivedStats = calculateDerivedStats(updatedPrimaryStats, hero.level);

  const updatedHero: Combatant = {
    ...hero,
    primaryStats: updatedPrimaryStats,
    derivedStats,
    maxHp: derivedStats.maxHp,
    maxMana: derivedStats.maxMana,
  };

  const updatedProgression: ProgressionState = {
    ...progression,
    unallocatedStatPoints: progression.unallocatedStatPoints - 1,
  };

  return {
    hero: updatedHero,
    progression: updatedProgression,
  };
}

/**
 * Unlocks a talent node in the class skill tree.
 */
export function unlockSkillNode(
  hero: Combatant,
  progression: ProgressionState,
  nodeId: string
): { hero: Combatant; progression: ProgressionState; success: boolean } {
  if (progression.unallocatedSkillPoints <= 0) {
    return { hero, progression, success: false };
  }

  if (progression.unlockedSkillNodeIds.includes(nodeId)) {
    return { hero, progression, success: false };
  }

  const tree = CLASS_SKILL_TREES[hero.classId || 'WARRIOR'];
  if (!tree) return { hero, progression, success: false };

  const node = tree.nodes.find((n) => n.id === nodeId);
  if (!node) return { hero, progression, success: false };

  if (hero.level < node.requiredLevel) {
    return { hero, progression, success: false };
  }

  if (node.prerequisiteNodeId && !progression.unlockedSkillNodeIds.includes(node.prerequisiteNodeId)) {
    return { hero, progression, success: false };
  }

  const nextAbilities = [...hero.abilities];
  if (node.unlocksAbilityId && !nextAbilities.includes(node.unlocksAbilityId)) {
    nextAbilities.push(node.unlocksAbilityId);
  }

  const nextPrimary: PrimaryStats = { ...hero.primaryStats };
  if (node.statBonus) {
    if (node.statBonus.strength) nextPrimary.strength += node.statBonus.strength;
    if (node.statBonus.dexterity) nextPrimary.dexterity += node.statBonus.dexterity;
    if (node.statBonus.intelligence) nextPrimary.intelligence += node.statBonus.intelligence;
    if (node.statBonus.vitality) nextPrimary.vitality += node.statBonus.vitality;
    if (node.statBonus.willpower) nextPrimary.willpower += node.statBonus.willpower;
    if (node.statBonus.luck) nextPrimary.luck += node.statBonus.luck;
  }

  const derived = calculateDerivedStats(nextPrimary, hero.level);

  const updatedHero: Combatant = {
    ...hero,
    primaryStats: nextPrimary,
    derivedStats: derived,
    abilities: nextAbilities,
  };

  const updatedProgression: ProgressionState = {
    ...progression,
    unallocatedSkillPoints: progression.unallocatedSkillPoints - 1,
    unlockedSkillNodeIds: [...progression.unlockedSkillNodeIds, nodeId],
  };

  return {
    hero: updatedHero,
    progression: updatedProgression,
    success: true,
  };
}
