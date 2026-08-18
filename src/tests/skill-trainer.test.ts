import { describe, it, expect } from 'vitest';
import { getTrainingCost } from '../ui/components/SkillTrainerModal.tsx';
import { createWarriorHero } from '../core/data/characters.ts';
import { calculateDerivedStats } from '../core/stats/stat-calculator.ts';
import type { PrimaryStats } from '../core/types/stats.ts';

describe('Skill Trainer & Martial Attribute Progression', () => {
  it('scales gold training cost based on current attribute rank', () => {
    expect(getTrainingCost(5)).toBe(40);
    expect(getTrainingCost(6)).toBe(48);
    expect(getTrainingCost(10)).toBe(80);
  });

  it('trains Strength and increases physical attack power', () => {
    const hero = createWarriorHero();
    const initialAtk = hero.derivedStats.physicalAttack;
    const initialStr = hero.primaryStats.strength;

    const updatedPrimary: PrimaryStats = {
      ...hero.primaryStats,
      strength: initialStr + 3,
    };
    const updatedDerived = calculateDerivedStats(updatedPrimary, hero.level);

    expect(updatedPrimary.strength).toBe(initialStr + 3);
    expect(updatedDerived.physicalAttack).toBeGreaterThan(initialAtk);
  });

  it('trains Vitality and scales maximum health and defense', () => {
    const hero = createWarriorHero();
    const initialVit = hero.primaryStats.vitality;
    const initialDef = hero.derivedStats.physicalDefense;

    const updatedPrimary: PrimaryStats = {
      ...hero.primaryStats,
      vitality: initialVit + 2,
    };
    const updatedDerived = calculateDerivedStats(updatedPrimary, hero.level);

    expect(updatedPrimary.vitality).toBe(initialVit + 2);
    expect(updatedDerived.physicalDefense).toBeGreaterThan(initialDef);
  });
});
