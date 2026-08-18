import type { Combatant } from '../types/combat.ts';
import type { IRandomNumberGenerator } from '../rng/rng.ts';
import { rollMonsterAffixes, applyAffixStatModifiers } from './affix-manager.ts';

/**
 * Dynamically scales enemy HP, Attack, Defense, and Affixes based on the current Dungeon Floor depth.
 * Implements compounding 2x scaling per floor so each stage represents a notable challenge spike,
 * making meta-progression upgrades vital for survival.
 */
export function scaleEnemyForFloor(
  enemy: Combatant,
  floorNumber: number,
  isElite: boolean,
  isBoss: boolean,
  rng: IRandomNumberGenerator,
  stepNumber: number = 0
): { enemy: Combatant; affixes: string[] } {
  // Compounding 2.0x HP scaling per floor depth, 1.8x ATK scaling, and stepped defense
  const floorHpMultiplier = Math.pow(2.0, Math.max(0, floorNumber - 1));
  const floorAtkMultiplier = Math.pow(1.8, Math.max(0, floorNumber - 1));
  const floorDefMultiplier = 1.0 + Math.max(0, floorNumber - 1) * 0.55;

  // Intra-floor step progression (+6% HP/ATK per step within the floor)
  const stepMultiplier = 1.0 + Math.min(4, Math.max(0, stepNumber)) * 0.06;

  const eliteHpMult = isElite ? 1.45 : 1.0;
  const eliteAtkMult = isElite ? 1.30 : 1.0;

  if (isBoss) {
    const bossAffixes = rollMonsterAffixes(floorNumber >= 2, true, rng);

    // Scale boss stats according to floor depth!
    const baseBossHp = enemy.maxHp;
    const scaledBossHp = Math.round(baseBossHp * floorHpMultiplier);

    const scaledBossDerived = {
      ...enemy.derivedStats,
      maxHp: scaledBossHp,
      physicalAttack: Math.round(enemy.derivedStats.physicalAttack * floorAtkMultiplier),
      magicAttack: Math.round(enemy.derivedStats.magicAttack * floorAtkMultiplier),
      physicalDefense: Math.round(enemy.derivedStats.physicalDefense * floorDefMultiplier),
      magicDefense: Math.round(enemy.derivedStats.magicDefense * floorDefMultiplier),
    };

    const scaledBoss: Combatant = {
      ...enemy,
      level: Math.max(enemy.level, floorNumber * 3),
      currentHp: scaledBossHp,
      maxHp: scaledBossHp,
      derivedStats: scaledBossDerived,
    };

    const modifiedBoss = applyAffixStatModifiers(scaledBoss, bossAffixes);
    return {
      enemy: modifiedBoss,
      affixes: bossAffixes,
    };
  }

  const baseHp = enemy.maxHp;
  const scaledMaxHp = Math.round(baseHp * floorHpMultiplier * stepMultiplier * eliteHpMult);

  const scaledDerived = {
    ...enemy.derivedStats,
    maxHp: scaledMaxHp,
    physicalAttack: Math.round(enemy.derivedStats.physicalAttack * floorAtkMultiplier * stepMultiplier * eliteAtkMult),
    magicAttack: Math.round(enemy.derivedStats.magicAttack * floorAtkMultiplier * stepMultiplier * eliteAtkMult),
    physicalDefense: Math.round(enemy.derivedStats.physicalDefense * floorDefMultiplier),
    magicDefense: Math.round(enemy.derivedStats.magicDefense * floorDefMultiplier),
  };

  // Roll floor-appropriate affixes (Floor 2 has higher chance, Floor 3+ guaranteed for elites)
  const affixes = rollMonsterAffixes(isElite || floorNumber >= 2, false, rng);

  const baseScaled: Combatant = {
    ...enemy,
    level: floorNumber,
    currentHp: scaledMaxHp,
    maxHp: scaledMaxHp,
    derivedStats: scaledDerived,
  };

  const modified = applyAffixStatModifiers(baseScaled, affixes);

  return {
    enemy: modified,
    affixes,
  };
}

