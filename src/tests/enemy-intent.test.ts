import { describe, it, expect } from 'vitest';
import { calculateEnemyIntent, executeEnemyIntent } from '../core/combat/enemy-intent.ts';
import { createGoblinScout } from '../core/data/enemies.ts';
import { createWarriorHero } from '../core/data/characters.ts';
import { Mulberry32RNG } from '../core/rng/rng.ts';

describe('Enemy Intent Engine', () => {
  const rng = new Mulberry32RNG(999);

  it('should calculate valid telegraphed intent for hostile', () => {
    const enemy = createGoblinScout();
    const hero = createWarriorHero();

    const intent = calculateEnemyIntent(enemy, hero, 1, rng);
    expect(intent).toBeDefined();
    expect(['ATTACK', 'DEFEND', 'DEBUFF', 'HEAL', 'SPECIAL']).toContain(intent.type);
    expect(intent.description.length).toBeGreaterThan(0);
  });

  it('should execute attack intent and apply damage with shield mitigation', () => {
    const enemy = createGoblinScout();
    const hero = createWarriorHero();
    hero.shieldHp = 10;
    const initialHp = hero.currentHp;

    const attackIntent = {
      type: 'ATTACK' as const,
      damage: 18,
      description: 'Striking for 18 damage',
      icon: 'sword',
    };

    const result = executeEnemyIntent(enemy, hero, attackIntent, 1, rng);

    // 18 damage - 10 shield = 8 hp loss
    expect(result.nextHero.shieldHp).toBe(0);
    expect(result.nextHero.currentHp).toBe(initialHp - 8);
    expect(result.logs.length).toBeGreaterThan(0);
  });

  it('should execute defend intent and add block to enemy', () => {
    const enemy = createGoblinScout();
    const hero = createWarriorHero();

    const defendIntent = {
      type: 'DEFEND' as const,
      block: 15,
      description: 'Guarding for 15 Block',
      icon: 'shield',
    };

    const result = executeEnemyIntent(enemy, hero, defendIntent, 1, rng);
    expect(result.nextEnemy.shieldHp).toBe(15);
  });

  it('should fully absorb starter enemy attack intent when player blocks with 18 Block', () => {
    const enemy = createGoblinScout();
    const hero = createWarriorHero();
    hero.shieldHp = 18; // 3 x Defend (6 Block each)
    const initialHp = hero.currentHp;

    const intent = calculateEnemyIntent(enemy, hero, 1, rng);
    // If attack or debuff, damage should be <= 18
    if (intent.damage) {
      expect(intent.damage).toBeLessThanOrEqual(18);
      const result = executeEnemyIntent(enemy, hero, intent, 1, rng);
      expect(result.nextHero.currentHp).toBe(initialHp); // 0 damage through shield!
      expect(result.nextHero.shieldHp).toBe(18 - intent.damage);
    }
  });
});
