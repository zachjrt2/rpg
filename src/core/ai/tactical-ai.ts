import type { Combatant, CombatAction } from '../types/combat.ts';
import type { IRandomNumberGenerator } from '../rng/rng.ts';
import { ABILITIES } from '../data/abilities.ts';

type AiStrategy = (
  enemy: Combatant,
  lowestHpHero: Combatant,
  aliveHeroes: Combatant[],
  aliveAllies: Combatant[],
  getReadyAbility: (abilityId: string) => any,
  rng: IRandomNumberGenerator
) => CombatAction | null;

const AI_STRATEGIES: Record<string, AiStrategy> = {
  HEALER: (enemy, lowestHpHero, _, aliveAllies, getReadyAbility) => {
    const injuredAlly = aliveAllies.find((a) => (a.currentHp / a.maxHp) <= 0.6);
    if (injuredAlly) {
      const healAbility = enemy.abilities.map(getReadyAbility).find((a) => a && a.type === 'HEAL');
      if (healAbility) {
        return { type: 'ABILITY', actorId: enemy.id, targetId: injuredAlly.id, abilityId: healAbility.id };
      }
    }
    const damageAbility = enemy.abilities.map(getReadyAbility).find((a) => a && (a.type === 'MAGICAL' || a.type === 'PHYSICAL'));
    if (damageAbility) {
      return { type: 'ABILITY', actorId: enemy.id, targetId: lowestHpHero.id, abilityId: damageAbility.id };
    }
    return null;
  },
  CASTER: (enemy, lowestHpHero, _, __, getReadyAbility) => {
    const readyAbilities = enemy.abilities.map(getReadyAbility).filter((a): a is NonNullable<typeof a> => a !== null);
    if (readyAbilities.length > 0) {
      const spell = readyAbilities.sort((a, b) => b.powerMultiplier - a.powerMultiplier)[0];
      return { type: 'ABILITY', actorId: enemy.id, targetId: lowestHpHero.id, abilityId: spell.id };
    }
    return null;
  },
  AGGRESSIVE: (enemy, lowestHpHero, _, __, getReadyAbility) => {
    const attackAbility = enemy.abilities.map(getReadyAbility).find((a) => a && (a.type === 'PHYSICAL' || a.type === 'MAGICAL'));
    if (attackAbility) {
      return { type: 'ABILITY', actorId: enemy.id, targetId: lowestHpHero.id, abilityId: attackAbility.id };
    }
    return { type: 'ATTACK', actorId: enemy.id, targetId: lowestHpHero.id };
  },
  ENRAGER: (enemy, lowestHpHero, _, __, getReadyAbility) => {
    const hpRatio = enemy.currentHp / enemy.maxHp;
    const isEnraged = enemy.statusEffects.some((s) => s.type === 'EMPOWERED' && s.remainingTurns > 0);
    if (hpRatio <= 0.75 && !isEnraged) {
      const rageAbility = enemy.abilities.map(getReadyAbility).find((a) => a && a.type === 'BUFF');
      if (rageAbility) {
        return { type: 'ABILITY', actorId: enemy.id, targetId: enemy.id, abilityId: rageAbility.id };
      }
    }
    const attackAbility = enemy.abilities.map(getReadyAbility).find((a) => a && (a.type === 'PHYSICAL' || a.type === 'MAGICAL'));
    if (attackAbility) {
      return { type: 'ABILITY', actorId: enemy.id, targetId: lowestHpHero.id, abilityId: attackAbility.id };
    }
    return null;
  },
  PACK_LEADER: (enemy, lowestHpHero, _, aliveAllies, getReadyAbility) => {
    const hasUnbuffedAllies = aliveAllies.length > 1 && !aliveAllies.some((a) => a.statusEffects.some((s) => s.type === 'EMPOWERED'));
    if (hasUnbuffedAllies) {
      const buffAbility = enemy.abilities.map(getReadyAbility).find((a) => a && a.targetType === 'ALL_ALLIES');
      if (buffAbility) {
        return { type: 'ABILITY', actorId: enemy.id, targetId: enemy.id, abilityId: buffAbility.id };
      }
    }
    const cleaveAbility = enemy.abilities.map(getReadyAbility).find((a) => a && a.type === 'PHYSICAL');
    if (cleaveAbility) {
      return { type: 'ABILITY', actorId: enemy.id, targetId: lowestHpHero.id, abilityId: cleaveAbility.id };
    }
    return null;
  },
  CROWD_CONTROLLER: (enemy, lowestHpHero, _, __, getReadyAbility) => {
    const heroHasDebuff = lowestHpHero.statusEffects.some((s) => s.type === 'BLINDED' || s.type === 'WEAKENED' || s.type === 'SILENCED');
    if (!heroHasDebuff) {
      const debuffAbility = enemy.abilities.map(getReadyAbility).find((a) => a && (a.type === 'DEBUFF' || (a.statusEffects && a.statusEffects.length > 0)));
      if (debuffAbility) {
        return { type: 'ABILITY', actorId: enemy.id, targetId: lowestHpHero.id, abilityId: debuffAbility.id };
      }
    }
    const damageAbility = enemy.abilities.map(getReadyAbility).find((a) => a && (a.type === 'PHYSICAL' || a.type === 'MAGICAL'));
    if (damageAbility) {
      return { type: 'ABILITY', actorId: enemy.id, targetId: lowestHpHero.id, abilityId: damageAbility.id };
    }
    return null;
  },
  CORROSION_DRAINER: (enemy, lowestHpHero, _, __, getReadyAbility) => {
    if ((lowestHpHero.shieldHp || 0) > 0) {
      const acidAbility = enemy.abilities.map(getReadyAbility).find((a) => a && a.statusEffects?.some((s) => s.effectId === 'CORROSION'));
      if (acidAbility) {
        return { type: 'ABILITY', actorId: enemy.id, targetId: lowestHpHero.id, abilityId: acidAbility.id };
      }
    }
    const drainAbility = enemy.abilities.map(getReadyAbility).find((a) => a && (a.type === 'MAGICAL' || a.type === 'PHYSICAL'));
    if (drainAbility) {
      return { type: 'ABILITY', actorId: enemy.id, targetId: lowestHpHero.id, abilityId: drainAbility.id };
    }
    return null;
  },
  DEFENDER_FORTRESS: (enemy, lowestHpHero, _, __, getReadyAbility) => {
    if (enemy.shieldHp <= 0) {
      const fortifyAbility = enemy.abilities.map(getReadyAbility).find((a) => a && a.type === 'BUFF');
      if (fortifyAbility) {
        return { type: 'ABILITY', actorId: enemy.id, targetId: enemy.id, abilityId: fortifyAbility.id };
      }
    }
    const slamAbility = enemy.abilities.map(getReadyAbility).find((a) => a && (a.type === 'PHYSICAL' || a.type === 'MAGICAL'));
    if (slamAbility) {
      return { type: 'ABILITY', actorId: enemy.id, targetId: lowestHpHero.id, abilityId: slamAbility.id };
    }
    return null;
  },
  SPELLWEAVER: (enemy, lowestHpHero, _, __, getReadyAbility) => {
    const readySpells = enemy.abilities.map(getReadyAbility).filter((a): a is NonNullable<typeof a> => a !== null);
    if (readySpells.length > 0) {
      const bestSpell = readySpells.sort((a, b) => b.powerMultiplier - a.powerMultiplier)[0];
      return { type: 'ABILITY', actorId: enemy.id, targetId: lowestHpHero.id, abilityId: bestSpell.id };
    }
    return null;
  }
};

// Aliases
AI_STRATEGIES['TACTICAL'] = AI_STRATEGIES['DEFENDER_FORTRESS'];

/**
 * Intelligent tactical decision-making AI for diverse enemy archetypes.
 */
export function decideTacticalEnemyAction(
  enemy: Combatant,
  combatants: Record<string, Combatant>,
  rng: IRandomNumberGenerator
): CombatAction {
  const aliveHeroes = Object.values(combatants).filter(
    (c) => c.type === 'HERO' && !c.isDead && c.currentHp > 0
  );

  const aliveAllies = Object.values(combatants).filter(
    (c) => c.type === 'ENEMY' && !c.isDead && c.currentHp > 0
  );

  if (aliveHeroes.length === 0) {
    return { type: 'PASS', actorId: enemy.id, targetId: enemy.id };
  }

  // Priority Hero Target (Lowest HP hero)
  const lowestHpHero = aliveHeroes.reduce((lowest, current) =>
    current.currentHp < lowest.currentHp ? current : lowest
  );

  // Helper to check if an ability is ready
  const getReadyAbility = (abilityId: string) => {
    const cd = enemy.abilityCooldowns[abilityId] ?? 0;
    const ability = ABILITIES[abilityId];
    if (ability && cd <= 0 && enemy.currentMana >= ability.cost.mana) {
      return ability;
    }
    return null;
  };

  const strategy = AI_STRATEGIES[enemy.aiType];
  if (strategy) {
    const action = strategy(enemy, lowestHpHero, aliveHeroes, aliveAllies, getReadyAbility, rng);
    if (action) return action;
  }

  // ==========================================
  // DEFAULT / BASIC MELEE (Goblin Scout, etc.)
  // ==========================================
  const readyAbility = enemy.abilities
    .map(getReadyAbility)
    .find((a) => a !== null);

  if (readyAbility && rng.rollChance(0.65)) {
    return {
      type: 'ABILITY',
      actorId: enemy.id,
      targetId: readyAbility.targetType === 'SELF' ? enemy.id : lowestHpHero.id,
      abilityId: readyAbility.id,
    };
  }

  // Low HP defense roll
  const hpPercent = (enemy.currentHp / enemy.maxHp) * 100;
  if (hpPercent <= 25 && !enemy.isDefending && rng.rollChance(0.35)) {
    return {
      type: 'DEFEND',
      actorId: enemy.id,
      targetId: enemy.id,
    };
  }

  return {
    type: 'ATTACK',
    actorId: enemy.id,
    targetId: lowestHpHero.id,
  };
}
