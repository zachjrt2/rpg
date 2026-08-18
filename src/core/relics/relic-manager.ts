import type { Combatant } from '../types/combat.ts';
import type { RelicDefinition } from '../types/relics.ts';
import type { StatusEffectType } from '../types/status-effects.ts';
import type { ElementType } from '../types/abilities.ts';
import type { IRandomNumberGenerator } from '../rng/rng.ts';
import { RELICS_CATALOG } from '../data/relics.ts';

export function applyStartOfCombatRelics(
  heroes: Combatant[],
  relics: RelicDefinition[]
): Combatant[] {
  let shieldBonus = 0;
  let thornsBonus = 0;
  let strengthBonus = 0;
  let maxHpBonus = 0;

  relics.forEach((r) => {
    if (r.effect.startOfCombatShield) {
      shieldBonus += r.effect.startOfCombatShield;
    }
    if (r.effect.thornsReflectDamage) {
      thornsBonus += r.effect.thornsReflectDamage;
    }
    if (r.effect.startOfCombatStrength) {
      strengthBonus += r.effect.startOfCombatStrength;
    }
    if (r.effect.maxHpBonusFlat) {
      maxHpBonus += r.effect.maxHpBonusFlat;
    }
  });

  return heroes.map((hero) => {
    let updated = { ...hero };
    if (maxHpBonus > 0) {
      updated.maxHp += maxHpBonus;
      updated.currentHp = Math.min(updated.maxHp, updated.currentHp + maxHpBonus);
    }
    if (strengthBonus > 0) {
      updated.primaryStats = {
        ...updated.primaryStats,
        strength: updated.primaryStats.strength + strengthBonus,
      };
      updated.derivedStats = {
        ...updated.derivedStats,
        physicalAttack: updated.derivedStats.physicalAttack + strengthBonus * 2,
      };
    }
    if (shieldBonus > 0) {
      updated.shieldHp = (updated.shieldHp || 0) + shieldBonus;
    }
    if (thornsBonus > 0) {
      const existingThorns = updated.statusEffects.find((s) => s.type === 'THORNS');
      if (!existingThorns) {
        updated.statusEffects = [
          ...updated.statusEffects,
          {
            id: `thorns-relic-${Date.now()}`,
            type: 'THORNS',
            name: 'Thorns',
            duration: 99,
            remainingTurns: 99,
            potency: thornsBonus,
          },
        ];
      }
    }
    return updated;
  });
}

export function applyStartOfCombatEnemyRelics(
  enemies: Combatant[],
  relics: RelicDefinition[]
): Combatant[] {
  let vulnTurns = 0;
  let weakTurns = 0;

  relics.forEach((r) => {
    if (r.effect.startOfCombatEnemyVulnerableTurns) {
      vulnTurns = Math.max(vulnTurns, r.effect.startOfCombatEnemyVulnerableTurns);
    }
    if (r.effect.startOfCombatEnemyWeakenedTurns) {
      weakTurns = Math.max(weakTurns, r.effect.startOfCombatEnemyWeakenedTurns);
    }
  });

  if (vulnTurns === 0 && weakTurns === 0) return enemies;

  return enemies.map((enemy) => {
    const updatedEffects = [...enemy.statusEffects];
    if (vulnTurns > 0) {
      updatedEffects.push({
        id: `vuln-relic-${Date.now()}-${enemy.id}`,
        type: 'VULNERABLE',
        name: 'Vulnerable',
        duration: vulnTurns,
        remainingTurns: vulnTurns,
        potency: 1,
      });
    }
    if (weakTurns > 0) {
      updatedEffects.push({
        id: `weak-relic-${Date.now()}-${enemy.id}`,
        type: 'WEAKENED',
        name: 'Weakened',
        duration: weakTurns,
        remainingTurns: weakTurns,
        potency: 1,
      });
    }
    return {
      ...enemy,
      statusEffects: updatedEffects,
    };
  });
}

export function applyOnKillRelics(
  party: Combatant[],
  relics: RelicDefinition[],
  slainTarget?: Combatant
): { party: Combatant[]; healPercent: number; drawCards: number; energyGain: number } {
  let healPercent = 0;
  let drawCards = 0;
  let energyGain = 0;

  relics.forEach((r) => {
    if (r.effect.onKillPartyHealPercent) {
      healPercent += r.effect.onKillPartyHealPercent;
    }
    if (r.effect.onKillDrawCards) {
      drawCards += r.effect.onKillDrawCards;
    }
    if (r.effect.onKillEnergyGain) {
      energyGain += r.effect.onKillEnergyGain;
    }
    // Soul Harvester synergy: extra heal & draw if enemy had a status effect
    if (slainTarget && slainTarget.statusEffects.length > 0) {
      if (r.effect.statusKillHealPercent) {
        healPercent += r.effect.statusKillHealPercent;
      }
      if (r.effect.statusKillDrawCard) {
        drawCards += r.effect.statusKillDrawCard;
      }
    }
  });

  if (healPercent === 0 && drawCards === 0 && energyGain === 0) {
    return { party, healPercent: 0, drawCards: 0, energyGain: 0 };
  }

  const updatedParty = party.map((hero) => {
    if (hero.isDead) return hero;
    const healAmount = Math.round((hero.maxHp * healPercent) / 100);
    return {
      ...hero,
      currentHp: Math.min(hero.maxHp, hero.currentHp + healAmount),
    };
  });

  return { party: updatedParty, healPercent, drawCards, energyGain };
}

export function calculateDoTTickDamage(
  baseDmg: number,
  relics: RelicDefinition[] = []
): number {
  let multiplier = 0;
  relics.forEach((r) => {
    if (r.effect.dotPotencyMultiplierPercent) {
      multiplier += r.effect.dotPotencyMultiplierPercent;
    }
  });
  if (multiplier === 0) return baseDmg;
  return Math.round(baseDmg * (1 + multiplier / 100));
}

export interface RelicAttackSynergyResult {
  bonusDamageMultiplier: number;
  bonusFlatDamage: number;
  healHero: number;
  gainBlock: number;
  synergyLogs: string[];
}

export function calculateRelicAttackSynergies(
  _attacker: Combatant,
  target: Combatant,
  element: ElementType | undefined,
  relics: RelicDefinition[]
): RelicAttackSynergyResult {
  let bonusDamageMultiplier = 1.0;
  let bonusFlatDamage = 0;
  let healHero = 0;
  let gainBlock = 0;
  const synergyLogs: string[] = [];

  const targetHasBleed = target.statusEffects.some((s) => s.type === 'BLEEDING' && s.remainingTurns > 0);
  const targetHasBurn = target.statusEffects.some((s) => s.type === 'BURNING' && s.remainingTurns > 0);
  const targetHasShock = target.statusEffects.some((s) => s.type === 'SHOCKED' && s.remainingTurns > 0);

  relics.forEach((r) => {
    // Crimson Talisman synergy vs Bleeding
    if (r.id === 'crimson-talisman' && targetHasBleed) {
      if (r.effect.bleedBonusDmgPercent) {
        bonusDamageMultiplier += r.effect.bleedBonusDmgPercent / 100;
      }
      if (r.effect.bleedHitHeal) {
        healHero += r.effect.bleedHitHeal;
      }
      synergyLogs.push('🩸 [Crimson Talisman] empowers attack vs Bleeding (+40% dmg, +4 HP)!');
    }

    // Frostfire Prism synergy (Ice vs Burning)
    if (r.id === 'frostfire-prism' && targetHasBurn && element === 'ICE') {
      const steamDmg = r.effect.freezeOnBurnSteamDmg || 18;
      bonusFlatDamage += steamDmg;
      synergyLogs.push(`💠 [Frostfire Prism] Steam Explosion triggers for +${steamDmg} bonus damage!`);
    }

    // Thunderstone Coil synergy vs Shocked
    if (r.id === 'thunderstone-coil' && targetHasShock) {
      const block = r.effect.shockHitGainBlock || 6;
      gainBlock += block;
      synergyLogs.push(`⚡ [Thunderstone Coil] discharges shock for +${block} Block!`);
    }

    // Stormcaller's Beacon (+6 Lightning Damage)
    if (r.effect.lightningFlatBonusDmg && element === 'LIGHTNING') {
      bonusFlatDamage += r.effect.lightningFlatBonusDmg;
      synergyLogs.push(`🌩️ [Stormcaller's Beacon] amplifies Lightning card for +${r.effect.lightningFlatBonusDmg} damage!`);
    }

    // Glacial Shard (+10 Block on Ice damage)
    if (r.effect.freezeBonusBlock && element === 'ICE') {
      gainBlock += r.effect.freezeBonusBlock;
      synergyLogs.push(`❄️ [Glacial Everfrost Shard] shields you with +${r.effect.freezeBonusBlock} Block!`);
    }
  });

  return {
    bonusDamageMultiplier,
    bonusFlatDamage,
    healHero,
    gainBlock,
    synergyLogs,
  };
}

export function calculateRelicOnStatusApplied(
  effectType: StatusEffectType,
  relics: RelicDefinition[]
): { gainBlock: number; bonusDamage: number; gainEnergy: number; synergyLogs: string[] } {
  let gainBlock = 0;
  let bonusDamage = 0;
  let gainEnergy = 0;
  const synergyLogs: string[] = [];

  relics.forEach((r) => {
    if (r.id === 'brimstone-censer' && effectType === 'BURNING') {
      const block = r.effect.burnGainBlock || 8;
      gainBlock += block;
      synergyLogs.push(`🔥 [Brimstone Censer] grants +${block} Block on Burn application!`);
    }

    if (r.id === 'viper-fang' && effectType === 'POISON') {
      const dmg = r.effect.poisonApplyBonusDmg || 6;
      bonusDamage += dmg;
      if (r.effect.poisonGainEnergyOnce) {
        gainEnergy += 1;
      }
      synergyLogs.push(`🐍 [Viper's Venomfang] triggers +${dmg} instant poison burst and +1 Energy!`);
    }

    if (r.id === 'glacial-shard' && effectType === 'FROZEN') {
      const block = r.effect.freezeBonusBlock || 10;
      gainBlock += block;
      synergyLogs.push(`❄️ [Glacial Everfrost Shard] grants +${block} Block on Frost application!`);
    }
  });

  return { gainBlock, bonusDamage, gainEnergy, synergyLogs };
}

export function calculateRelicGoldBonus(
  baseGold: number,
  relics: RelicDefinition[]
): number {
  let bonusPercent = 0;
  relics.forEach((r) => {
    if (r.effect.goldMultiplierPercent) {
      bonusPercent += r.effect.goldMultiplierPercent;
    }
    if (r.effect.extraGoldPercent) {
      bonusPercent += r.effect.extraGoldPercent;
    }
  });

  if (bonusPercent === 0) return baseGold;
  return Math.round(baseGold * (1 + bonusPercent / 100));
}

export function calculateRelicManaCost(
  baseManaCost: number,
  relics: RelicDefinition[]
): number {
  let discountPercent = 0;
  relics.forEach((r) => {
    if (r.effect.manaCostReductionPercent) {
      discountPercent += r.effect.manaCostReductionPercent;
    }
  });

  if (discountPercent === 0) return baseManaCost;
  return Math.max(0, Math.round(baseManaCost * (1 - discountPercent / 100)));
}

/**
 * Generates 3 non-duplicate relic choices for Elite and Boss reward drafts
 */
export function generateRelicDraftOptions(
  isBoss: boolean,
  currentRelicIds: string[],
  rng: IRandomNumberGenerator,
  count: number = 3
): RelicDefinition[] {
  const allRelics = Object.values(RELICS_CATALOG);
  const unownedRelics = allRelics.filter((r) => !currentRelicIds.includes(r.id));

  let pool: RelicDefinition[];
  if (isBoss) {
    const bossPool = unownedRelics.filter((r) => r.rarity === 'LEGENDARY' || r.rarity === 'EPIC');
    pool = bossPool.length >= count ? bossPool : unownedRelics;
  } else {
    const elitePool = unownedRelics.filter((r) => r.rarity === 'RARE' || r.rarity === 'EPIC' || r.rarity === 'UNCOMMON');
    pool = elitePool.length >= count ? elitePool : unownedRelics;
  }

  if (pool.length === 0) return [];
  const copy = [...pool];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = rng.nextInt(0, i);
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, Math.min(count, copy.length));
}

