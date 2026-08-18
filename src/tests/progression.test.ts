import { describe, it, expect } from 'vitest';
import {
  createInitialProgression,
  addExpToHero,
  allocateStatPoint,
  unlockSkillNode,
} from '../core/progression/progression-manager.ts';
import { createWarriorHero } from '../core/data/characters.ts';

describe('Progression and Leveling Engine', () => {
  it('levels up hero when enough EXP is earned, granting stat and skill points', () => {
    const hero = createWarriorHero();
    const progression = createInitialProgression();

    const result = addExpToHero(hero, progression, 150);

    expect(result.leveledUp).toBe(true);
    expect(result.hero.level).toBe(2);
    expect(result.progression.unallocatedStatPoints).toBe(3);
    expect(result.progression.unallocatedSkillPoints).toBe(1);
  });

  it('allocates stat point to Strength, increasing physical attack', () => {
    const hero = createWarriorHero();
    const progression = createInitialProgression();
    progression.unallocatedStatPoints = 1;

    const initialStrength = hero.primaryStats.strength;
    const initialAttack = hero.derivedStats.physicalAttack;

    const result = allocateStatPoint(hero, progression, 'strength');

    expect(result.hero.primaryStats.strength).toBe(initialStrength + 1);
    expect(result.hero.derivedStats.physicalAttack).toBeGreaterThan(initialAttack);
    expect(result.progression.unallocatedStatPoints).toBe(0);
  });

  it('unlocks talent node and grants active ability', () => {
    const hero = createWarriorHero();
    hero.level = 3;
    const progression = createInitialProgression();
    progression.unallocatedSkillPoints = 2;

    // Unlock prerequisite first
    const step1 = unlockSkillNode(hero, progression, 'warrior-heavy-strike');
    expect(step1.success).toBe(true);

    // Unlock whirlwind cleave
    const step2 = unlockSkillNode(step1.hero, step1.progression, 'warrior-whirlwind');
    expect(step2.success).toBe(true);
    expect(step2.hero.abilities).toContain('whirlwind-cleave');
  });
});
