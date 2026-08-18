import type { PrimaryStats, DerivedStats, StatModifiers } from '../types/stats.ts';

/**
 * Calculates derived stats from primary stats, level, and optional modifier overlays.
 */
export function calculateDerivedStats(
  base: PrimaryStats,
  level: number = 1,
  modifiers: StatModifiers = {}
): DerivedStats {
  const str = Math.max(1, base.strength + (modifiers.strength ?? 0));
  const dex = Math.max(1, base.dexterity + (modifiers.dexterity ?? 0));
  const int = Math.max(1, base.intelligence + (modifiers.intelligence ?? 0));
  const vit = Math.max(1, base.vitality + (modifiers.vitality ?? 0));
  const wil = Math.max(1, base.willpower + (modifiers.willpower ?? 0));
  const luk = Math.max(1, base.luck + (modifiers.luck ?? 0));

  // Max HP = Base 50 + (Vitality * 12) + (Level * 10) + bonuses
  const maxHp = Math.floor(50 + vit * 12 + level * 10 + (modifiers.maxHpBonus ?? 0));

  // Max Mana = Base 20 + (Intelligence * 8) + (Willpower * 4) + (Level * 5) + bonuses
  const maxMana = Math.floor(20 + int * 8 + wil * 4 + level * 5 + (modifiers.maxManaBonus ?? 0));

  // Physical Attack = (Strength * 2.2) + (Dexterity * 0.8) + bonuses
  const physicalAttack = Math.floor(str * 2.2 + dex * 0.8 + (modifiers.physicalAttack ?? 0));

  // Magic Attack = (Intelligence * 2.5) + (Willpower * 0.5) + bonuses
  const magicAttack = Math.floor(int * 2.5 + wil * 0.5 + (modifiers.magicAttack ?? 0));

  // Physical Defense = (Vitality * 1.5) + (Strength * 0.5) + bonuses
  const physicalDefense = Math.floor(vit * 1.5 + str * 0.5 + (modifiers.physicalDefense ?? 0));

  // Magic Defense = (Willpower * 1.8) + (Intelligence * 0.6) + bonuses
  const magicDefense = Math.floor(wil * 1.8 + int * 0.6 + (modifiers.magicDefense ?? 0));

  // Speed = 10 + (Dexterity * 1.2) + (Luck * 0.3) + bonuses
  const speed = Math.floor(10 + dex * 1.2 + luk * 0.3 + (modifiers.speed ?? 0));

  // Accuracy % = 85 + (Dexterity * 0.8) + (Luck * 0.4) + bonuses
  const accuracy = Math.min(100, Math.max(20, Math.floor(85 + dex * 0.8 + luk * 0.4 + (modifiers.accuracy ?? 0))));

  // Evasion % = (Dexterity * 0.5) + (Luck * 0.3) + bonuses
  const evasion = Math.min(60, Math.max(0, Math.floor(dex * 0.5 + luk * 0.3 + (modifiers.evasion ?? 0))));

  // Critical Chance % = 5 + (Dexterity * 0.4) + (Luck * 0.8) + bonuses
  const critChance = Math.min(75, Math.max(1, Math.floor(5 + dex * 0.4 + luk * 0.8 + (modifiers.critChance ?? 0))));

  // Critical Multiplier = 1.5 + (Dexterity * 0.01) + bonuses
  const critMultiplier = Number((1.5 + dex * 0.01 + (modifiers.critMultiplier ?? 0)).toFixed(2));

  return {
    maxHp,
    maxMana,
    physicalAttack,
    magicAttack,
    physicalDefense,
    magicDefense,
    speed,
    accuracy,
    evasion,
    critChance,
    critMultiplier,
  };
}
