import { describe, it, expect } from 'vitest';
import { Mulberry32RNG } from '../core/rng/rng.ts';
import { createWarriorHero, createHeroFromClass } from '../core/data/characters.ts';
import { createGoblinScout } from '../core/data/enemies.ts';
import { RELICS_CATALOG } from '../core/data/relics.ts';
import {
  applyStartOfCombatRelics,
  applyStartOfCombatEnemyRelics,
  applyOnKillRelics,
  calculateDoTTickDamage,
  calculateRelicAttackSynergies,
  calculateRelicOnStatusApplied,
} from '../core/relics/relic-manager.ts';
import {
  applyStatusEffect,
  processTurnStartStatuses,
} from '../core/combat/status-manager.ts';
import {
  createInitialDeck,
  playCombatCard,
  instantiateCard,
} from '../core/combat/deck-manager.ts';
import { calculateScaledCardValues } from '../core/combat/card-scaling.ts';
import { executeEnemyIntent } from '../core/combat/enemy-intent.ts';

describe('Status Effects Variations & Mechanics', () => {
  const rng = new Mulberry32RNG(42);

  it('correctly processes Corrosion status tick, dealing damage and shredding shield', () => {
    const enemy = createGoblinScout('foe-1');
    enemy.shieldHp = 20;
    const hero = createWarriorHero('hero-1', 'Sir Alden');

    const appResult = applyStatusEffect(
      enemy,
      { effectId: 'CORROSION', chance: 1.0, duration: 3, potency: 6 },
      hero,
      rng
    );

    expect(appResult.applied).toBe(true);
    expect(appResult.target.statusEffects.some((s) => s.type === 'CORROSION')).toBe(true);

    const initialHp = appResult.target.currentHp;
    const tickResult = processTurnStartStatuses(appResult.target, 1);

    expect(tickResult.combatant.currentHp).toBe(initialHp - 6);
    expect(tickResult.combatant.shieldHp).toBe(20 - 12); // 6 * 2 shield shredded
  });

  it('amplifies DoT tick damage when Catalyst Vial relic is equipped', () => {
    const baseBurn = 10;
    const relics = [RELICS_CATALOG['catalyst-vial']];
    const amplified = calculateDoTTickDamage(baseBurn, relics);

    expect(amplified).toBe(15); // +50%
  });

  it('reflects Thorns damage when enemy attacks a Hero with Thorns', () => {
    const hero = createWarriorHero('hero-1', 'Sir Alden');
    hero.statusEffects = [
      {
        id: 'thorns-1',
        type: 'THORNS',
        name: 'Thorns',
        duration: 3,
        remainingTurns: 3,
        potency: 10,
      },
    ];

    const enemy = createGoblinScout('foe-1');
    const initialEnemyHp = enemy.currentHp;

    const result = executeEnemyIntent(
      enemy,
      hero,
      { type: 'ATTACK', damage: 8, description: 'Slash', icon: 'sword' },
      1,
      rng
    );

    expect(result.nextEnemy.currentHp).toBe(initialEnemyHp - 10);
  });

  it('applies Thorns and Shield from start of combat relics', () => {
    const hero = createWarriorHero('hero-1', 'Sir Alden');
    const relics = [RELICS_CATALOG['thornmail-core'], RELICS_CATALOG['sunken-aegis']];
    const ready = applyStartOfCombatRelics([hero], relics);

    expect(ready[0].shieldHp).toBe(15);
    expect(ready[0].statusEffects.some((s) => s.type === 'THORNS')).toBe(true);
  });
});

describe('Relic Synergies with Status Effects', () => {
  it('Brimstone Censer grants block when applying Burning', () => {
    const relics = [RELICS_CATALOG['brimstone-censer']];
    const trigger = calculateRelicOnStatusApplied('BURNING', relics);

    expect(trigger.gainBlock).toBe(8);
  });

  it('Viper Venomfang grants +6 poison burst damage and +1 energy on Poison application', () => {
    const relics = [RELICS_CATALOG['viper-fang']];
    const trigger = calculateRelicOnStatusApplied('POISON', relics);

    expect(trigger.bonusDamage).toBe(6);
    expect(trigger.gainEnergy).toBe(1);
  });

  it('Crimson Talisman deals +40% bonus damage and heals hero when attacking Bleeding enemy', () => {
    const hero = createWarriorHero('hero-1', 'Sir Alden');
    const enemy = createGoblinScout('foe-1');
    enemy.statusEffects = [
      {
        id: 'bleed-1',
        type: 'BLEEDING',
        name: 'Bleeding',
        duration: 2,
        remainingTurns: 2,
        potency: 5,
      },
    ];

    const relics = [RELICS_CATALOG['crimson-talisman']];
    const synergy = calculateRelicAttackSynergies(hero, enemy, 'PHYSICAL', relics);

    expect(synergy.bonusDamageMultiplier).toBe(1.4);
    expect(synergy.healHero).toBe(4);
  });

  it('Frostfire Prism triggers Steam Explosion when Ice strikes a Burning enemy', () => {
    const hero = createWarriorHero('hero-1', 'Sir Alden');
    const enemy = createGoblinScout('foe-1');
    enemy.statusEffects = [
      {
        id: 'burn-1',
        type: 'BURNING',
        name: 'Burning',
        duration: 2,
        remainingTurns: 2,
        potency: 6,
      },
    ];

    const relics = [RELICS_CATALOG['frostfire-prism']];
    const synergy = calculateRelicAttackSynergies(hero, enemy, 'ICE', relics);

    expect(synergy.bonusFlatDamage).toBe(18);
  });

  it('Cursed Skull applies Vulnerable and Weakened to enemies at start of combat', () => {
    const enemies = [createGoblinScout('foe-1'), createGoblinScout('foe-2')];
    const relics = [RELICS_CATALOG['cursed-skull']];

    const debuffed = applyStartOfCombatEnemyRelics(enemies, relics);

    expect(debuffed[0].statusEffects.some((s) => s.type === 'VULNERABLE')).toBe(true);
    expect(debuffed[0].statusEffects.some((s) => s.type === 'WEAKENED')).toBe(true);
  });

  it('Soul Harvester restores HP and draws extra card on defeating afflicted enemy', () => {
    const hero = createWarriorHero('hero-1', 'Sir Alden');
    hero.currentHp = 50;
    hero.maxHp = 100;

    const enemy = createGoblinScout('foe-1');
    enemy.statusEffects = [
      { id: 'poison-1', type: 'POISON', name: 'Poison', duration: 1, remainingTurns: 1, potency: 5 },
    ];

    const relics = [RELICS_CATALOG['soul-harvester']];
    const result = applyOnKillRelics([hero], relics, enemy);

    expect(result.party[0].currentHp).toBe(65); // +15% Max HP
    expect(result.drawCards).toBe(1);
  });
});

describe('Synergistic Card Mechanics', () => {
  const rng = new Mulberry32RNG(999);

  it('Combustion deals bonus damage against Burning target', () => {
    const hero = createWarriorHero('hero-1', 'Sir Alden');
    const enemy = createGoblinScout('foe-1');
    enemy.statusEffects = [
      { id: 'burn-1', type: 'BURNING', name: 'Burning', duration: 2, remainingTurns: 2, potency: 6 },
    ];
    enemy.currentHp = 60;
    enemy.shieldHp = 0;

    let deck = createInitialDeck('MAGE');
    const combustionCard = instantiateCard('combustion');
    deck.hand = [combustionCard];
    deck.currentEnergy = 3;

    const result = playCombatCard(deck, combustionCard.id, hero, enemy, 1, rng, []);

    expect(result.success).toBe(true);
    const scaled = calculateScaledCardValues(combustionCard, hero);
    // scaled magic damage + 10 combustion burn bonus
    expect(result.nextTarget.currentHp).toBe(60 - ((scaled.magicDamage?.total || 14) + 10));
  });

  it('Venom Strike restores +1 energy when target is Poisoned', () => {
    const hero = createHeroFromClass('ROGUE', 'Valerie', 'hero-1');
    const enemy = createGoblinScout('foe-1');
    enemy.statusEffects = [
      { id: 'poison-1', type: 'POISON', name: 'Poison', duration: 2, remainingTurns: 2, potency: 6 },
    ];

    let deck = createInitialDeck('ROGUE');
    const venomCard = instantiateCard('venom-strike');
    deck.hand = [venomCard];
    deck.currentEnergy = 2; // costs 1 -> 2 - 1 + 1 refund = 2

    const result = playCombatCard(deck, venomCard.id, hero, enemy, 1, rng, []);

    expect(result.success).toBe(true);
    expect(result.nextDeck.currentEnergy).toBe(2);
  });

  it('Rupture grants 8 Block and applies Vulnerable against Bleeding target', () => {
    const hero = createWarriorHero('hero-1', 'Sir Alden');
    hero.shieldHp = 0;
    const enemy = createGoblinScout('foe-1');
    enemy.statusEffects = [
      { id: 'bleed-1', type: 'BLEEDING', name: 'Bleeding', duration: 2, remainingTurns: 2, potency: 4 },
    ];

    let deck = createInitialDeck('WARRIOR');
    const ruptureCard = instantiateCard('rupture');
    deck.hand = [ruptureCard];
    deck.currentEnergy = 2;

    const result = playCombatCard(deck, ruptureCard.id, hero, enemy, 1, rng, []);

    expect(result.success).toBe(true);
    expect(result.nextHero.shieldHp).toBe(8);
    expect(result.nextTarget.statusEffects.some((s) => s.type === 'VULNERABLE')).toBe(true);
  });
});
