import { describe, it, expect } from 'vitest';
import {
  createGoblinBerserker,
  createGoblinShaman,
  createOrcWarlord,
  createCryptBanshee,
  createPlagueAbomination,
  createGargoyleSentinel,
  generateSquadForNode,
  ENEMY_FACTORIES,
} from '../core/data/enemies.ts';
import { decideTacticalEnemyAction } from '../core/ai/tactical-ai.ts';
import { calculateEnemyIntent } from '../core/combat/enemy-intent.ts';
import { createWarriorHero } from '../core/data/characters.ts';
import { Mulberry32RNG } from '../core/rng/rng.ts';

describe('Enemy Variety & Tactical AI Archetypes', () => {
  const rng = new Mulberry32RNG(42);

  it('instantiates all 14 distinct enemy archetypes with customized AI and stats', () => {
    expect(ENEMY_FACTORIES.length).toBe(14);

    const instances = ENEMY_FACTORIES.map((factory, index) => factory(`test-enemy-${index}`));
    expect(instances.length).toBe(14);

    const names = new Set(instances.map((e) => e.name));
    expect(names.size).toBe(14);

    const avatars = new Set(instances.map((e) => e.avatar));
    expect(avatars.size).toBe(14);

    instances.forEach((enemy) => {
      expect(enemy.currentHp).toBeGreaterThan(0);
      expect(enemy.aiType).toBeDefined();
      expect(enemy.abilities.length).toBeGreaterThan(0);
    });
  });

  it('generates diverse squads for normal, elite, and boss nodes across floors', () => {
    // Floor 1
    const f1Squad = generateSquadForNode(1, false, false, undefined, rng);
    expect(f1Squad.length).toBeGreaterThanOrEqual(2);

    // Floor 2
    const f2Squad = generateSquadForNode(2, false, false, undefined, rng);
    expect(f2Squad.length).toBeGreaterThanOrEqual(2);

    // Floor 3+
    const f3Squad = generateSquadForNode(3, false, false, undefined, rng);
    expect(f3Squad.length).toBeGreaterThanOrEqual(2);

    // Elite
    const eliteSquad = generateSquadForNode(2, true, false, undefined, rng);
    expect(eliteSquad.length).toBeGreaterThanOrEqual(2);

    // Boss
    const bossSquad = generateSquadForNode(3, false, true, 'lich-lord', rng);
    expect(bossSquad.length).toBe(2);
    expect(bossSquad[0].name).toContain('Malakor');
  });

  it('handles specialized tactical AI decision-making', () => {
    const hero = createWarriorHero('hero-1');
    const combatants = { [hero.id]: hero };

    // Berserker enrage
    const berserker = createGoblinBerserker('foe-1');
    berserker.currentHp = Math.round(berserker.maxHp * 0.5); // 50% HP
    const action = decideTacticalEnemyAction(berserker, { ...combatants, [berserker.id]: berserker }, rng);
    expect(action.type).toBe('ABILITY');

    // Pack leader
    const warlord = createOrcWarlord('foe-2');
    const shaman = createGoblinShaman('foe-3');
    const wlAction = decideTacticalEnemyAction(warlord, { ...combatants, [warlord.id]: warlord, [shaman.id]: shaman }, rng);
    expect(wlAction.type).toBe('ABILITY');
  });

  it('telegraphs archetype-specific intents correctly', () => {
    const hero = createWarriorHero('hero-1');

    const banshee = createCryptBanshee('foe-b');
    const intentBanshee = calculateEnemyIntent(banshee, hero, 1, rng);
    expect(intentBanshee.statusEffect).toBe('WEAKENED');

    const abomination = createPlagueAbomination('foe-a');
    const intentAbom = calculateEnemyIntent(abomination, hero, 1, rng);
    expect(intentAbom.statusEffect).toBe('CORROSION');

    const gargoyle = createGargoyleSentinel('foe-g');
    const intentGargoyle = calculateEnemyIntent(gargoyle, hero, 1, rng);
    expect(intentGargoyle.type).toBe('DEFEND');
    expect(intentGargoyle.block).toBeGreaterThan(15);
  });
});