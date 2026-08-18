import type { Combatant } from '../types/combat.ts';
import type { IRandomNumberGenerator } from '../rng/rng.ts';
import { calculateDerivedStats } from '../stats/stat-calculator.ts';

export function createGoblinScout(id: string = 'enemy-1'): Combatant {
  const primaryStats = {
    strength: 4,
    dexterity: 5,
    intelligence: 2,
    vitality: 4,
    willpower: 3,
    luck: 5,
  };

  const level = 1;
  const derivedStats = calculateDerivedStats(primaryStats, level);

  return {
    id,
    name: 'Goblin Scout',
    type: 'ENEMY',
    className: 'Scout',
    level,
    primaryStats,
    derivedStats,
    currentHp: derivedStats.maxHp,
    maxHp: derivedStats.maxHp,
    currentMana: 30,
    maxMana: 30,
    isDefending: false,
    isDead: false,
    avatar: 'goblin-scout',
    description: 'A swift and feral woodland scout carrying a jagged bone dagger and rusty buckler.',
    aiType: 'BASIC_MELEE',
    abilities: ['power-strike'],
    abilityCooldowns: {},
    statusEffects: [],
    shieldHp: 0,
  };
}

export function createGoblinShaman(id: string = 'enemy-1'): Combatant {
  const primaryStats = {
    strength: 3,
    dexterity: 4,
    intelligence: 5,
    vitality: 3,
    willpower: 5,
    luck: 4,
  };

  const level = 1;
  const derivedStats = calculateDerivedStats(primaryStats, level);

  return {
    id,
    name: 'Goblin Shaman',
    type: 'ENEMY',
    className: 'Shaman',
    level,
    primaryStats,
    derivedStats,
    currentHp: derivedStats.maxHp,
    maxHp: derivedStats.maxHp,
    currentMana: 60,
    maxMana: 60,
    isDefending: false,
    isDead: false,
    avatar: 'goblin-shaman',
    description: 'An elder ritualist who channels woodland spirits to heal wounds and summon lightning.',
    aiType: 'HEALER',
    abilities: ['shaman-healing-salve', 'shaman-lightning-bolt'],
    abilityCooldowns: {},
    statusEffects: [],
    shieldHp: 0,
  };
}

export function createDarkMage(id: string = 'enemy-1'): Combatant {
  const primaryStats = {
    strength: 3,
    dexterity: 4,
    intelligence: 6,
    vitality: 3,
    willpower: 5,
    luck: 4,
  };

  const level = 1;
  const derivedStats = calculateDerivedStats(primaryStats, level);

  return {
    id,
    name: 'Cultist Evoker',
    type: 'ENEMY',
    className: 'Dark Mage',
    level,
    primaryStats,
    derivedStats,
    currentHp: derivedStats.maxHp,
    maxHp: derivedStats.maxHp,
    currentMana: 70,
    maxMana: 70,
    isDefending: false,
    isDead: false,
    avatar: 'dark-mage',
    description: 'A shadowy spellcaster who burns foes with foul flame and dark projectiles.',
    aiType: 'CASTER',
    abilities: ['fireball', 'dark-mage-shadow-bolt'],
    abilityCooldowns: {},
    statusEffects: [],
    shieldHp: 0,
  };
}

export function createDireWolf(id: string = 'enemy-1'): Combatant {
  const primaryStats = {
    strength: 5,
    dexterity: 6,
    intelligence: 2,
    vitality: 4,
    willpower: 3,
    luck: 5,
  };

  const level = 1;
  const derivedStats = calculateDerivedStats(primaryStats, level);

  return {
    id,
    name: 'Dire Wolf',
    type: 'ENEMY',
    className: 'Beast',
    level,
    primaryStats,
    derivedStats,
    currentHp: derivedStats.maxHp,
    maxHp: derivedStats.maxHp,
    currentMana: 30,
    maxMana: 30,
    isDefending: false,
    isDead: false,
    avatar: 'dire-wolf',
    description: 'A predatory alpha wolf with razor fangs that tear open bleeding wounds.',
    aiType: 'AGGRESSIVE',
    abilities: ['wolf-feral-bite'],
    abilityCooldowns: {},
    statusEffects: [],
    shieldHp: 0,
  };
}

export function createSkeletonGuard(id: string = 'enemy-1'): Combatant {
  const primaryStats = {
    strength: 5,
    dexterity: 3,
    intelligence: 2,
    vitality: 6,
    willpower: 4,
    luck: 3,
  };

  const level = 1;
  const derivedStats = calculateDerivedStats(primaryStats, level);

  return {
    id,
    name: 'Skeleton Guard',
    type: 'ENEMY',
    className: 'Undead Guard',
    level,
    primaryStats,
    derivedStats,
    currentHp: derivedStats.maxHp,
    maxHp: derivedStats.maxHp,
    currentMana: 30,
    maxMana: 30,
    isDefending: false,
    isDead: false,
    avatar: 'skeleton-guard',
    description: 'An ancient animated skeleton clad in rusted iron plate, wielding a tower shield.',
    aiType: 'TACTICAL',
    abilities: ['shield-slam', 'iron-bulwark'],
    abilityCooldowns: {},
    statusEffects: [],
    shieldHp: 0,
  };
}

export function createGoblinBerserker(id: string = 'enemy-1'): Combatant {
  const primaryStats = { strength: 6, dexterity: 5, intelligence: 2, vitality: 5, willpower: 3, luck: 4 };
  const level = 1;
  const derivedStats = calculateDerivedStats(primaryStats, level);

  return {
    id,
    name: 'Goblin Berserker',
    type: 'ENEMY',
    className: 'Berserker',
    level,
    primaryStats,
    derivedStats,
    currentHp: derivedStats.maxHp,
    maxHp: derivedStats.maxHp,
    currentMana: 35,
    maxMana: 35,
    isDefending: false,
    isDead: false,
    avatar: 'goblin-berserker',
    description: 'A frantic goblin warrior wielding twin cleavers that enters a frenzy when wounded.',
    aiType: 'ENRAGER',
    abilities: ['berserker-blood-frenzy', 'power-strike'],
    abilityCooldowns: {},
    statusEffects: [],
    shieldHp: 0,
  };
}

export function createOrcWarlord(id: string = 'enemy-1'): Combatant {
  const primaryStats = { strength: 7, dexterity: 3, intelligence: 2, vitality: 8, willpower: 5, luck: 3 };
  const level = 1;
  const derivedStats = calculateDerivedStats(primaryStats, level);

  return {
    id,
    name: 'Orc Warlord',
    type: 'ENEMY',
    className: 'Warlord',
    level,
    primaryStats,
    derivedStats,
    currentHp: derivedStats.maxHp + 25,
    maxHp: derivedStats.maxHp + 25,
    currentMana: 50,
    maxMana: 50,
    isDefending: false,
    isDead: false,
    avatar: 'orc-warlord',
    description: 'A hulking warlord clad in heavy steel plates who commands allies and crushes guards.',
    aiType: 'PACK_LEADER',
    abilities: ['warlord-crushing-cleave', 'warlord-battle-cry', 'shield-slam'],
    abilityCooldowns: {},
    statusEffects: [],
    shieldHp: 20,
  };
}

export function createBanditShadowblade(id: string = 'enemy-1'): Combatant {
  const primaryStats = { strength: 4, dexterity: 7, intelligence: 3, vitality: 4, willpower: 3, luck: 7 };
  const level = 1;
  const derivedStats = calculateDerivedStats(primaryStats, level);

  return {
    id,
    name: 'Bandit Shadowblade',
    type: 'ENEMY',
    className: 'Assassin',
    level,
    primaryStats,
    derivedStats,
    currentHp: derivedStats.maxHp,
    maxHp: derivedStats.maxHp,
    currentMana: 40,
    maxMana: 40,
    isDefending: false,
    isDead: false,
    avatar: 'bandit-shadowblade',
    description: 'An opportunistic mercenary who uses blinding smoke grenades and lethal backstabs.',
    aiType: 'CROWD_CONTROLLER',
    abilities: ['bandit-smoke-bomb', 'bandit-backstab'],
    abilityCooldowns: {},
    statusEffects: [],
    shieldHp: 0,
  };
}

export function createCryptBanshee(id: string = 'enemy-1'): Combatant {
  const primaryStats = { strength: 2, dexterity: 5, intelligence: 7, vitality: 4, willpower: 6, luck: 4 };
  const level = 1;
  const derivedStats = calculateDerivedStats(primaryStats, level);

  return {
    id,
    name: 'Crypt Banshee',
    type: 'ENEMY',
    className: 'Specter',
    level,
    primaryStats,
    derivedStats,
    currentHp: derivedStats.maxHp,
    maxHp: derivedStats.maxHp,
    currentMana: 65,
    maxMana: 65,
    isDefending: false,
    isDead: false,
    avatar: 'crypt-banshee',
    description: 'A wailing spirit whose screech weakens attack damage and silences spellcasting.',
    aiType: 'CROWD_CONTROLLER',
    abilities: ['banshee-piercing-screech', 'dark-mage-shadow-bolt'],
    abilityCooldowns: {},
    statusEffects: [],
    shieldHp: 0,
  };
}

export function createPlagueAbomination(id: string = 'enemy-1'): Combatant {
  const primaryStats = { strength: 6, dexterity: 3, intelligence: 3, vitality: 9, willpower: 4, luck: 2 };
  const level = 1;
  const derivedStats = calculateDerivedStats(primaryStats, level);

  return {
    id,
    name: 'Plague Abomination',
    type: 'ENEMY',
    className: 'Monstrosity',
    level,
    primaryStats,
    derivedStats,
    currentHp: derivedStats.maxHp + 30,
    maxHp: derivedStats.maxHp + 30,
    currentMana: 40,
    maxMana: 40,
    isDefending: false,
    isDead: false,
    avatar: 'plague-abomination',
    description: 'A bloated toxic construct that vomits corrosive bile to melt player shields.',
    aiType: 'CORROSION_DRAINER',
    abilities: ['abomination-acid-vomit', 'power-strike'],
    abilityCooldowns: {},
    statusEffects: [],
    shieldHp: 0,
  };
}

export function createVoidWraith(id: string = 'enemy-1'): Combatant {
  const primaryStats = { strength: 4, dexterity: 6, intelligence: 6, vitality: 4, willpower: 6, luck: 5 };
  const level = 1;
  const derivedStats = calculateDerivedStats(primaryStats, level);

  return {
    id,
    name: 'Void Wraith',
    type: 'ENEMY',
    className: 'Wraith',
    level,
    primaryStats,
    derivedStats,
    currentHp: derivedStats.maxHp,
    maxHp: derivedStats.maxHp,
    currentMana: 60,
    maxMana: 60,
    isDefending: false,
    isDead: false,
    avatar: 'void-wraith',
    description: 'A rift stalker that drains life essence to restore HP while shocking the player.',
    aiType: 'CORROSION_DRAINER',
    abilities: ['wraith-soul-drain', 'dark-mage-shadow-bolt'],
    abilityCooldowns: {},
    statusEffects: [],
    shieldHp: 0,
  };
}

export function createVenomousBroodmother(id: string = 'enemy-1'): Combatant {
  const primaryStats = { strength: 4, dexterity: 6, intelligence: 4, vitality: 5, willpower: 4, luck: 6 };
  const level = 1;
  const derivedStats = calculateDerivedStats(primaryStats, level);

  return {
    id,
    name: 'Venomous Broodmother',
    type: 'ENEMY',
    className: 'Arachnid',
    level,
    primaryStats,
    derivedStats,
    currentHp: derivedStats.maxHp,
    maxHp: derivedStats.maxHp,
    currentMana: 45,
    maxMana: 45,
    isDefending: false,
    isDead: false,
    avatar: 'spider-broodmother',
    description: 'A giant arachnid that shoots toxic webbing to slow, poison, and weaken prey.',
    aiType: 'CROWD_CONTROLLER',
    abilities: ['spider-web-bind', 'wolf-feral-bite'],
    abilityCooldowns: {},
    statusEffects: [],
    shieldHp: 0,
  };
}

export function createFrostElemental(id: string = 'enemy-1'): Combatant {
  const primaryStats = { strength: 5, dexterity: 3, intelligence: 7, vitality: 6, willpower: 6, luck: 3 };
  const level = 1;
  const derivedStats = calculateDerivedStats(primaryStats, level);

  return {
    id,
    name: 'Frost Elemental',
    type: 'ENEMY',
    className: 'Elemental',
    level,
    primaryStats,
    derivedStats,
    currentHp: derivedStats.maxHp + 15,
    maxHp: derivedStats.maxHp + 15,
    currentMana: 60,
    maxMana: 60,
    isDefending: false,
    isDead: false,
    avatar: 'frost-elemental',
    description: 'A crystalline behemoth that slams glaciers down to freeze targets solid.',
    aiType: 'SPELLWEAVER',
    abilities: ['frost-golem-glacier-slam', 'iron-bulwark'],
    abilityCooldowns: {},
    statusEffects: [],
    shieldHp: 15,
  };
}

export function createGargoyleSentinel(id: string = 'enemy-1'): Combatant {
  const primaryStats = { strength: 6, dexterity: 3, intelligence: 3, vitality: 8, willpower: 7, luck: 3 };
  const level = 1;
  const derivedStats = calculateDerivedStats(primaryStats, level);

  return {
    id,
    name: 'Gargoyle Sentinel',
    type: 'ENEMY',
    className: 'Gargoyle',
    level,
    primaryStats,
    derivedStats,
    currentHp: derivedStats.maxHp + 20,
    maxHp: derivedStats.maxHp + 20,
    currentMana: 45,
    maxMana: 45,
    isDefending: false,
    isDead: false,
    avatar: 'gargoyle-sentinel',
    description: 'A stone guardian that hardens into granite (high Block + Thorns) then executes heavy slams.',
    aiType: 'DEFENDER_FORTRESS',
    abilities: ['gargoyle-stone-fortress', 'shield-slam', 'power-strike'],
    abilityCooldowns: {},
    statusEffects: [],
    shieldHp: 25,
  };
}

export const ENEMY_FACTORIES = [
  createGoblinScout,
  createGoblinShaman,
  createGoblinBerserker,
  createDarkMage,
  createDireWolf,
  createSkeletonGuard,
  createOrcWarlord,
  createBanditShadowblade,
  createCryptBanshee,
  createPlagueAbomination,
  createVoidWraith,
  createVenomousBroodmother,
  createFrostElemental,
  createGargoyleSentinel,
];

export function getRandomEnemy(rng: IRandomNumberGenerator, id: string = 'enemy-1'): Combatant {
  const factory = rng.pickOne(ENEMY_FACTORIES);
  return factory(id);
}

/**
 * Generates thematic, diverse enemy squads based on dungeon floor depth and node encounter type
 */
export function generateSquadForNode(
  floor: number,
  isElite: boolean,
  isBoss: boolean,
  bossId: string | undefined,
  rng: IRandomNumberGenerator
): Combatant[] {
  if (isBoss) {
    const boss = bossId === 'lich-lord' ? createLichBoss() : createIgnisBoss();
    const minionFactory = bossId === 'lich-lord' ? createCryptBanshee : createCultistEvoker;
    return [boss, minionFactory('boss-minion-1')];
  }

  if (isElite) {
    const eliteComps = [
      () => [createOrcWarlord('elite-1'), createGoblinShaman('elite-2')],
      () => [createGargoyleSentinel('elite-1'), createFrostElemental('elite-2')],
      () => [createPlagueAbomination('elite-1'), createCryptBanshee('elite-2')],
      () => [createVoidWraith('elite-1'), createBanditShadowblade('elite-2')],
      () => [createSkeletonGuard('elite-1'), createDarkMage('elite-2'), createGoblinBerserker('elite-3')],
    ];
    const compFactory = rng.pickOne(eliteComps);
    return compFactory();
  }

  // Normal encounters - Tiered by floor depth
  if (floor === 1) {
    const floor1Comps = [
      () => [createGoblinScout('foe-1'), createDireWolf('foe-2')],
      () => [createGoblinScout('foe-1'), createGoblinShaman('foe-2')],
      () => [createGoblinBerserker('foe-1'), createGoblinScout('foe-2')],
      () => [createVenomousBroodmother('foe-1'), createDireWolf('foe-2')],
      () => [createBanditShadowblade('foe-1'), createGoblinScout('foe-2')],
      () => [createSkeletonGuard('foe-1'), createDarkMage('foe-2')],
    ];
    return rng.pickOne(floor1Comps)();
  } else if (floor === 2) {
    const floor2Comps = [
      () => [createOrcWarlord('foe-1'), createGoblinShaman('foe-2')],
      () => [createCryptBanshee('foe-1'), createSkeletonGuard('foe-2')],
      () => [createPlagueAbomination('foe-1'), createVenomousBroodmother('foe-2')],
      () => [createFrostElemental('foe-1'), createDarkMage('foe-2')],
      () => [createBanditShadowblade('foe-1'), createGoblinBerserker('foe-2')],
      () => [createGargoyleSentinel('foe-1'), createDireWolf('foe-2')],
    ];
    return rng.pickOne(floor2Comps)();
  } else {
    // Floor 3+ Deep Abyss
    const floor3Comps = [
      () => [createVoidWraith('foe-1'), createCryptBanshee('foe-2')],
      () => [createOrcWarlord('foe-1'), createGoblinBerserker('foe-2'), createGoblinShaman('foe-3')],
      () => [createFrostElemental('foe-1'), createGargoyleSentinel('foe-2')],
      () => [createPlagueAbomination('foe-1'), createVoidWraith('foe-2')],
      () => [createBanditShadowblade('foe-1'), createCryptBanshee('foe-2'), createDarkMage('foe-3')],
    ];
    return rng.pickOne(floor3Comps)();
  }
}

// Aliases for backward compatibility
export const createCultistEvoker = createDarkMage;
import { createIgnisBoss, createLichBoss } from './bosses.ts';
