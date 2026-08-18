import type { Combatant } from '../types/combat.ts';
import { calculateDerivedStats } from '../stats/stat-calculator.ts';

export function createIgnisBoss(id: string = 'boss-1'): Combatant {
  const primaryStats = {
    strength: 18,
    dexterity: 12,
    intelligence: 16,
    vitality: 22,
    willpower: 15,
    luck: 12,
  };

  const level = 5;
  const derivedStats = calculateDerivedStats(primaryStats, level);

  return {
    id,
    name: 'Ignis the Fire Drake',
    type: 'ENEMY',
    className: 'Boss',
    level,
    primaryStats,
    derivedStats: {
      ...derivedStats,
      maxHp: 320,
      physicalAttack: 32,
      magicAttack: 28,
      physicalDefense: 22,
      magicDefense: 20,
    },
    currentHp: 320,
    maxHp: 320,
    currentMana: 120,
    maxMana: 120,
    isDefending: false,
    isDead: false,
    avatar: 'ignis-dragon',
    description: 'An ancient volcanic wyrm whose molten breath melts iron and flesh alike.',
    aiType: 'CASTER',
    abilities: ['ignis-fire-breath', 'ignis-tail-swipe', 'power-strike'],
    abilityCooldowns: {},
    statusEffects: [],
    shieldHp: 0,
  };
}

export function createLichBoss(id: string = 'boss-1'): Combatant {
  const primaryStats = {
    strength: 8,
    dexterity: 11,
    intelligence: 24,
    vitality: 18,
    willpower: 22,
    luck: 14,
  };

  const level = 5;
  const derivedStats = calculateDerivedStats(primaryStats, level);

  return {
    id,
    name: 'Malakor the Lich Lord',
    type: 'ENEMY',
    className: 'Boss',
    level,
    primaryStats,
    derivedStats: {
      ...derivedStats,
      maxHp: 280,
      magicAttack: 35,
      magicDefense: 26,
      physicalDefense: 16,
    },
    currentHp: 280,
    maxHp: 280,
    currentMana: 180,
    maxMana: 180,
    isDefending: false,
    isDead: false,
    avatar: 'lich-lord',
    description: 'An undead archmage who commands glacial oblivion and siphons mortal souls.',
    aiType: 'CASTER',
    abilities: ['lich-soul-drain', 'lich-frost-ruin', 'dark-mage-shadow-bolt'],
    abilityCooldowns: {},
    statusEffects: [],
    shieldHp: 0,
  };
}
