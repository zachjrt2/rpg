import { describe, it, expect } from 'vitest';
import {
  rollMonsterAffixes,
  applyAffixStatModifiers,
  resolveAffixOnHit,
} from '../core/combat/affix-manager.ts';
import { createDarkMage, createGoblinScout } from '../core/data/enemies.ts';
import { createWarriorHero } from '../core/data/characters.ts';
import { Mulberry32RNG } from '../core/rng/rng.ts';

describe('Monster Affixes Engine', () => {
  it('rolls 2 guaranteed affixes for boss encounters', () => {
    const rng = new Mulberry32RNG(10);
    const affixes = rollMonsterAffixes(false, true, rng);
    expect(affixes.length).toBe(2);
  });

  it('applies Ironclad stat modifier to increase monster defense', () => {
    const monster = createDarkMage();
    const initialDef = monster.derivedStats.physicalDefense;

    const modified = applyAffixStatModifiers(monster, ['IRONCLAD']);
    expect(modified.derivedStats.physicalDefense).toBeGreaterThan(initialDef);
  });

  it('resolves Vampiric lifesteal and Voltaic counter-shock on hit', () => {
    const hero = createWarriorHero();
    const enemy = createGoblinScout();
    enemy.currentHp = 30;

    // Enemy is Vampiric and strikes hero
    const vampiricResult = resolveAffixOnHit(enemy, hero, 40, ['VAMPIRIC'], []);
    expect(vampiricResult.attackerNext.currentHp).toBeGreaterThan(30);

    // Hero strikes Voltaic enemy -> hero takes counter damage
    hero.currentHp = 100;
    const voltaicResult = resolveAffixOnHit(hero, enemy, 30, [], ['VOLTAIC']);
    expect(voltaicResult.attackerNext.currentHp).toBe(88); // 100 - 12
  });
});
