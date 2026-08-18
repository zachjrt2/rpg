import { describe, it, expect } from 'vitest';
import { scaleEnemyForFloor } from '../core/combat/enemy-scaler.ts';
import { createGoblinScout } from '../core/data/enemies.ts';
import { createIgnisBoss } from '../core/data/bosses.ts';
import { Mulberry32RNG } from '../core/rng/rng.ts';

describe('2x Stage Difficulty Scaling Engine', () => {
  const rng = new Mulberry32RNG(42);

  it('scales regular enemy stats by 2x HP on Floor 2 and 4x on Floor 3', () => {
    const baseScout = createGoblinScout('test-scout');
    const baseHp = baseScout.maxHp;

    const floor1Result = scaleEnemyForFloor(baseScout, 1, false, false, rng, 0);
    expect(floor1Result.enemy.maxHp).toBe(baseHp);

    const floor2Result = scaleEnemyForFloor(baseScout, 2, false, false, rng, 0);
    expect(floor2Result.enemy.maxHp).toBe(baseHp * 2);

    const floor3Result = scaleEnemyForFloor(baseScout, 3, false, false, rng, 0);
    expect(floor3Result.enemy.maxHp).toBe(baseHp * 4);
  });

  it('scales boss stats dynamically across floors', () => {
    const baseBoss = createIgnisBoss('test-boss');
    const baseHp = baseBoss.maxHp; // 320

    const floor1Boss = scaleEnemyForFloor(baseBoss, 1, false, true, rng);
    expect(floor1Boss.enemy.maxHp).toBe(baseHp);

    const floor2Boss = scaleEnemyForFloor(baseBoss, 2, false, true, rng);
    expect(floor2Boss.enemy.maxHp).toBe(baseHp * 2); // 640

    const floor3Boss = scaleEnemyForFloor(baseBoss, 3, false, true, rng);
    expect(floor3Boss.enemy.maxHp).toBe(baseHp * 4); // 1280
  });

  it('applies step depth progression within a floor', () => {
    const baseScout = createGoblinScout('test-scout');
    const step0 = scaleEnemyForFloor(baseScout, 1, false, false, rng, 0);
    const step3 = scaleEnemyForFloor(baseScout, 1, false, false, rng, 3);

    expect(step3.enemy.maxHp).toBeGreaterThan(step0.enemy.maxHp);
  });
});