import type { Combatant } from '../types/combat.ts';
import type { MonsterAffixType } from '../types/affixes.ts';
import { MONSTER_AFFIXES } from '../types/affixes.ts';
import type { IRandomNumberGenerator } from '../rng/rng.ts';

const ALL_AFFIXES: MonsterAffixType[] = ['MOLTEN', 'IRONCLAD', 'VOLTAIC', 'VAMPIRIC', 'PHANTOM'];

export function rollMonsterAffixes(
  isElite: boolean,
  isBoss: boolean,
  rng: IRandomNumberGenerator
): MonsterAffixType[] {
  if (isBoss) {
    // Boss gets 2 distinct affixes
    const first = rng.pickOne(ALL_AFFIXES);
    const remaining = ALL_AFFIXES.filter((a) => a !== first);
    const second = rng.pickOne(remaining);
    return [first, second];
  }

  if (isElite) {
    const first = rng.pickOne(ALL_AFFIXES);
    if (rng.rollChance(0.4)) {
      const remaining = ALL_AFFIXES.filter((a) => a !== first);
      return [first, rng.pickOne(remaining)];
    }
    return [first];
  }

  if (rng.rollChance(0.15)) {
    return [rng.pickOne(ALL_AFFIXES)];
  }

  return [];
}

export function applyAffixStatModifiers(
  monster: Combatant,
  affixes: MonsterAffixType[]
): Combatant {
  let physicalDefense = monster.derivedStats.physicalDefense;
  let evasion = monster.derivedStats.evasion;
  let speed = monster.derivedStats.speed;

  affixes.forEach((type) => {
    const def = MONSTER_AFFIXES[type];
    if (def?.statModifiers) {
      if (def.statModifiers.physicalDefensePercent) {
        physicalDefense = Math.round(physicalDefense * (1 + def.statModifiers.physicalDefensePercent / 100));
      }
      if (def.statModifiers.evasionFlat) {
        evasion = Math.min(75, evasion + def.statModifiers.evasionFlat);
      }
      if (def.statModifiers.speedFlat) {
        speed += def.statModifiers.speedFlat;
      }
    }
  });

  return {
    ...monster,
    derivedStats: {
      ...monster.derivedStats,
      physicalDefense,
      evasion,
      speed,
    },
  };
}

export function resolveAffixOnHit(
  attacker: Combatant,
  defender: Combatant,
  damageDealt: number,
  attackerAffixes: MonsterAffixType[] = [],
  defenderAffixes: MonsterAffixType[] = []
): {
  attackerNext: Combatant;
  defenderNext: Combatant;
  logs: string[];
} {
  let nextAttacker = { ...attacker };
  let nextDefender = { ...defender };
  const logs: string[] = [];

  if (damageDealt <= 0) {
    return { attackerNext: nextAttacker, defenderNext: nextDefender, logs };
  }

  // 1. Attacker VAMPIRIC
  if (attackerAffixes.includes('VAMPIRIC')) {
    const healAmount = Math.max(1, Math.round(damageDealt * 0.25));
    const healedHp = Math.min(nextAttacker.maxHp, nextAttacker.currentHp + healAmount);
    nextAttacker = { ...nextAttacker, currentHp: healedHp };
    logs.push(`🩸 [VAMPIRIC]: ${attacker.name} siphons +${healAmount} HP from the strike.`);
  }

  // 2. Attacker MOLTEN (inflict Burning DoT)
  if (attackerAffixes.includes('MOLTEN')) {
    const hasBurning = nextDefender.statusEffects.some((s) => s.type === 'BURNING');
    if (!hasBurning) {
      nextDefender = {
        ...nextDefender,
        statusEffects: [
          ...nextDefender.statusEffects,
          {
            id: `affix-burn-${Date.now()}`,
            type: 'BURNING',
            name: 'Molten Ignition',
            duration: 2,
            remainingTurns: 2,
            potency: 16,
          },
        ],
      };
      logs.push(`🔥 [MOLTEN]: ${defender.name} is ignited by searing flames!`);
    }
  }

  // 3. Defender VOLTAIC (Counter-spark)
  if (defenderAffixes.includes('VOLTAIC') && !nextDefender.isDead) {
    const shockDmg = 12;
    const attackerHp = Math.max(0, nextAttacker.currentHp - shockDmg);
    nextAttacker = {
      ...nextAttacker,
      currentHp: attackerHp,
      isDead: attackerHp === 0,
    };
    logs.push(`⚡ [VOLTAIC]: ${defender.name} discharges a counter-shock for ${shockDmg} Lightning damage!`);
  }

  return {
    attackerNext: nextAttacker,
    defenderNext: nextDefender,
    logs,
  };
}
