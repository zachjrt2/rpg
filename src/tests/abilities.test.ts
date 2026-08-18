import { describe, it, expect } from 'vitest';
import { executeAbility } from '../core/combat/ability-executor.ts';
import { ABILITIES } from '../core/data/abilities.ts';
import { createHeroFromClass } from '../core/data/characters.ts';
import { createGoblinScout } from '../core/data/enemies.ts';
import { Mulberry32RNG } from '../core/rng/rng.ts';

describe('Ability Execution System', () => {
  it('deducts mana and sets ability cooldown on cast', () => {
    const mage = createHeroFromClass('MAGE');
    const goblin = createGoblinScout();
    const fireball = ABILITIES['fireball'];
    const rng = new Mulberry32RNG(42);

    const initialMana = mage.currentMana;
    const result = executeAbility(mage, goblin, fireball, 1, rng);

    expect(result.success).toBe(true);
    expect(result.nextActor.currentMana).toBe(initialMana - fireball.cost.mana);
    expect(result.nextActor.abilityCooldowns[fireball.id]).toBe(fireball.cooldown);
  });

  it('restores health when casting healing abilities', () => {
    const cleric = createHeroFromClass('CLERIC');
    cleric.currentHp = 50; // Injured
    const holyLight = ABILITIES['holy-light'];
    const rng = new Mulberry32RNG(100);

    const result = executeAbility(cleric, cleric, holyLight, 1, rng);

    expect(result.success).toBe(true);
    expect(result.nextTarget.currentHp).toBeGreaterThan(50);
  });

  it('fails to cast if caster has insufficient mana', () => {
    const mage = createHeroFromClass('MAGE');
    mage.currentMana = 5; // Not enough for fireball (25)
    const fireball = ABILITIES['fireball'];
    const goblin = createGoblinScout();
    const rng = new Mulberry32RNG(123);

    const result = executeAbility(mage, goblin, fireball, 1, rng);

    expect(result.success).toBe(false);
    expect(result.nextActor.currentMana).toBe(5);
  });

  it('applies Burning status effect on Fireball hit', () => {
    const mage = createHeroFromClass('MAGE');
    const goblin = createGoblinScout();
    const fireball = ABILITIES['fireball'];
    // Fixed seed that passes hit and chance
    const rng = new Mulberry32RNG(999);

    const result = executeAbility(mage, goblin, fireball, 1, rng);

    expect(result.success).toBe(true);
    const hasBurning = result.nextTarget.statusEffects.some((s) => s.type === 'BURNING');
    expect(hasBurning).toBe(true);
  });
});
