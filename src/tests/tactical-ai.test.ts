import { describe, it, expect } from 'vitest';
import { decideTacticalEnemyAction } from '../core/ai/tactical-ai.ts';
import { createGoblinShaman, createDarkMage, createDireWolf } from '../core/data/enemies.ts';
import { createWarriorHero } from '../core/data/characters.ts';
import { Mulberry32RNG } from '../core/rng/rng.ts';

describe('Tactical Enemy AI', () => {
  it('Shaman prioritizes casting healing salve when an ally is critically injured', () => {
    const shaman = createGoblinShaman('shaman-1');
    const hero = createWarriorHero('hero-1');
    shaman.currentHp = 20; // 20/144 HP -> Injured

    const combatants = {
      [shaman.id]: shaman,
      [hero.id]: hero,
    };
    const rng = new Mulberry32RNG(42);

    const action = decideTacticalEnemyAction(shaman, combatants, rng);

    expect(action.type).toBe('ABILITY');
    expect(action.abilityId).toBe('shaman-healing-salve');
    expect(action.targetId).toBe(shaman.id);
  });

  it('Dark Mage casts offensive spell against hero', () => {
    const darkMage = createDarkMage('mage-1');
    const hero = createWarriorHero('hero-1');

    const combatants = {
      [darkMage.id]: darkMage,
      [hero.id]: hero,
    };
    const rng = new Mulberry32RNG(77);

    const action = decideTacticalEnemyAction(darkMage, combatants, rng);

    expect(action.type).toBe('ABILITY');
    expect(['fireball', 'dark-mage-shadow-bolt']).toContain(action.abilityId);
    expect(action.targetId).toBe(hero.id);
  });

  it('Dire Wolf targets hero with savage bite', () => {
    const wolf = createDireWolf('wolf-1');
    const hero = createWarriorHero('hero-1');

    const combatants = {
      [wolf.id]: wolf,
      [hero.id]: hero,
    };
    const rng = new Mulberry32RNG(123);

    const action = decideTacticalEnemyAction(wolf, combatants, rng);

    expect(action.type === 'ABILITY' || action.type === 'ATTACK').toBe(true);
    expect(action.targetId).toBe(hero.id);
  });
});
