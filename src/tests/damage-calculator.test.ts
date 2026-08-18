import { describe, it, expect } from 'vitest';
import { calculatePhysicalDamage } from '../core/combat/damage-calculator.ts';
import { createWarriorHero } from '../core/data/characters.ts';
import { createGoblinScout } from '../core/data/enemies.ts';
import { Mulberry32RNG } from '../core/rng/rng.ts';

describe('Damage Calculator', () => {
  it('calculates deterministic damage for attacker vs target with fixed seed', () => {
    const hero = createWarriorHero();
    const goblin = createGoblinScout();
    const rng = new Mulberry32RNG(777);

    const result = calculatePhysicalDamage(hero, goblin, rng);

    expect(result.isHit).toBe(true);
    expect(result.finalDamage).toBeGreaterThan(0);
    expect(result.finalDamage).toBeLessThanOrEqual(hero.derivedStats.physicalAttack * 2);
  });

  it('guarantees critical hit and increases damage when guaranteedCrit is set', () => {
    const hero = createWarriorHero();
    const goblin = createGoblinScout();
    const rng1 = new Mulberry32RNG(100);
    const rng2 = new Mulberry32RNG(100);

    const normalResult = calculatePhysicalDamage(hero, goblin, rng1, { guaranteedHit: true });
    const critResult = calculatePhysicalDamage(hero, goblin, rng2, { guaranteedHit: true, guaranteedCrit: true });

    expect(critResult.isCrit).toBe(true);
    expect(critResult.finalDamage).toBeGreaterThan(normalResult.finalDamage);
  });

  it('reduces damage by 50% when target is in defending stance', () => {
    const hero = createWarriorHero();
    const goblin = createGoblinScout();
    const rng1 = new Mulberry32RNG(555);
    const rng2 = new Mulberry32RNG(555);

    const unshielded = calculatePhysicalDamage(hero, goblin, rng1, { guaranteedHit: true });
    
    goblin.isDefending = true;
    const shielded = calculatePhysicalDamage(hero, goblin, rng2, { guaranteedHit: true });

    expect(shielded.wasDefended).toBe(true);
    expect(shielded.finalDamage).toBeLessThan(unshielded.finalDamage);
    expect(Math.abs(shielded.finalDamage - Math.round(unshielded.finalDamage / 2))).toBeLessThanOrEqual(1);
  });

  it('correctly reports knockout when damage exceeds remaining HP', () => {
    const hero = createWarriorHero();
    const goblin = createGoblinScout();
    goblin.currentHp = 5; // Low HP
    const rng = new Mulberry32RNG(123);

    const result = calculatePhysicalDamage(hero, goblin, rng, { guaranteedHit: true });

    expect(result.isKilled).toBe(true);
  });
});
