import type { Combatant, CombatAction } from '../types/combat.ts';
import type { IRandomNumberGenerator } from '../rng/rng.ts';
import { ABILITIES } from '../data/abilities.ts';

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

  // ==========================================
  // 1. HEALER AI (e.g. Goblin Shaman)
  // ==========================================
  if (enemy.aiType === 'HEALER') {
    // Check if self or any ally is below 60% HP
    const injuredAlly = aliveAllies.find((a) => (a.currentHp / a.maxHp) <= 0.6);
    if (injuredAlly) {
      const healAbility = enemy.abilities
        .map(getReadyAbility)
        .find((a) => a && a.type === 'HEAL');

      if (healAbility) {
        return {
          type: 'ABILITY',
          actorId: enemy.id,
          targetId: injuredAlly.id,
          abilityId: healAbility.id,
        };
      }
    }

    // Cast offensive damage spells
    const damageAbility = enemy.abilities
      .map(getReadyAbility)
      .find((a) => a && (a.type === 'MAGICAL' || a.type === 'PHYSICAL'));

    if (damageAbility) {
      return {
        type: 'ABILITY',
        actorId: enemy.id,
        targetId: lowestHpHero.id,
        abilityId: damageAbility.id,
      };
    }
  }

  // ==========================================
  // 2. CASTER AI (e.g. Dark Mage)
  // ==========================================
  if (enemy.aiType === 'CASTER') {
    const readyAbilities = enemy.abilities
      .map(getReadyAbility)
      .filter((a): a is NonNullable<typeof a> => a !== null);

    if (readyAbilities.length > 0) {
      // Pick highest power spell
      const spell = readyAbilities.sort((a, b) => b.powerMultiplier - a.powerMultiplier)[0];
      return {
        type: 'ABILITY',
        actorId: enemy.id,
        targetId: lowestHpHero.id,
        abilityId: spell.id,
      };
    }
  }

  // ==========================================
  // 3. AGGRESSIVE PREDATOR AI (e.g. Dire Wolf)
  // ==========================================
  if (enemy.aiType === 'AGGRESSIVE') {
    const attackAbility = enemy.abilities
      .map(getReadyAbility)
      .find((a) => a && (a.type === 'PHYSICAL' || a.type === 'MAGICAL'));

    if (attackAbility) {
      return {
        type: 'ABILITY',
        actorId: enemy.id,
        targetId: lowestHpHero.id,
        abilityId: attackAbility.id,
      };
    }

    return {
      type: 'ATTACK',
      actorId: enemy.id,
      targetId: lowestHpHero.id,
    };
  }

  // ==========================================
  // 4. ENRAGER AI (e.g. Goblin Berserker)
  // ==========================================
  if (enemy.aiType === 'ENRAGER') {
    const hpRatio = enemy.currentHp / enemy.maxHp;
    const isEnraged = enemy.statusEffects.some((s) => s.type === 'EMPOWERED' && s.remainingTurns > 0);

    // Buff self if wounded and not yet enraged
    if (hpRatio <= 0.75 && !isEnraged) {
      const rageAbility = enemy.abilities.map(getReadyAbility).find((a) => a && a.type === 'BUFF');
      if (rageAbility) {
        return { type: 'ABILITY', actorId: enemy.id, targetId: enemy.id, abilityId: rageAbility.id };
      }
    }

    // Heavy reckless attack
    const attackAbility = enemy.abilities.map(getReadyAbility).find((a) => a && (a.type === 'PHYSICAL' || a.type === 'MAGICAL'));
    if (attackAbility) {
      return { type: 'ABILITY', actorId: enemy.id, targetId: lowestHpHero.id, abilityId: attackAbility.id };
    }
  }

  // ==========================================
  // 5. PACK LEADER AI (e.g. Orc Warlord)
  // ==========================================
  if (enemy.aiType === 'PACK_LEADER') {
    // Buff squad if multiple allies alive and not yet buffed
    const hasUnbuffedAllies = aliveAllies.length > 1 && !aliveAllies.some((a) => a.statusEffects.some((s) => s.type === 'EMPOWERED'));
    if (hasUnbuffedAllies) {
      const buffAbility = enemy.abilities.map(getReadyAbility).find((a) => a && a.targetType === 'ALL_ALLIES');
      if (buffAbility) {
        return { type: 'ABILITY', actorId: enemy.id, targetId: enemy.id, abilityId: buffAbility.id };
      }
    }

    // Execute crushing cleaves
    const cleaveAbility = enemy.abilities.map(getReadyAbility).find((a) => a && a.type === 'PHYSICAL');
    if (cleaveAbility) {
      return { type: 'ABILITY', actorId: enemy.id, targetId: lowestHpHero.id, abilityId: cleaveAbility.id };
    }
  }

  // ==========================================
  // 6. CROWD CONTROLLER AI (e.g. Banshee, Shadowblade, Broodmother)
  // ==========================================
  if (enemy.aiType === 'CROWD_CONTROLLER') {
    // Check if hero already has debuff
    const heroHasDebuff = lowestHpHero.statusEffects.some((s) => s.type === 'BLINDED' || s.type === 'WEAKENED' || s.type === 'SILENCED');
    if (!heroHasDebuff) {
      const debuffAbility = enemy.abilities.map(getReadyAbility).find((a) => a && (a.type === 'DEBUFF' || (a.statusEffects && a.statusEffects.length > 0)));
      if (debuffAbility) {
        return { type: 'ABILITY', actorId: enemy.id, targetId: lowestHpHero.id, abilityId: debuffAbility.id };
      }
    }

    // Follow up with heavy strike / shadow bolt
    const damageAbility = enemy.abilities.map(getReadyAbility).find((a) => a && (a.type === 'PHYSICAL' || a.type === 'MAGICAL'));
    if (damageAbility) {
      return { type: 'ABILITY', actorId: enemy.id, targetId: lowestHpHero.id, abilityId: damageAbility.id };
    }
  }

  // ==========================================
  // 7. CORROSION & DRAINER AI (e.g. Abomination, Void Wraith)
  // ==========================================
  if (enemy.aiType === 'CORROSION_DRAINER') {
    // If hero has active shield, prioritize corrosion bile
    if ((lowestHpHero.shieldHp || 0) > 0) {
      const acidAbility = enemy.abilities.map(getReadyAbility).find((a) => a && a.statusEffects?.some((s) => s.effectId === 'CORROSION'));
      if (acidAbility) {
        return { type: 'ABILITY', actorId: enemy.id, targetId: lowestHpHero.id, abilityId: acidAbility.id };
      }
    }

    // Drain life or cast poison
    const drainAbility = enemy.abilities.map(getReadyAbility).find((a) => a && (a.type === 'MAGICAL' || a.type === 'PHYSICAL'));
    if (drainAbility) {
      return { type: 'ABILITY', actorId: enemy.id, targetId: lowestHpHero.id, abilityId: drainAbility.id };
    }
  }

  // ==========================================
  // 8. DEFENDER FORTRESS AI (e.g. Gargoyle, Skeleton Guard)
  // ==========================================
  if (enemy.aiType === 'DEFENDER_FORTRESS' || enemy.aiType === 'TACTICAL') {
    // If shield is depleted, fortify
    if (enemy.shieldHp <= 0) {
      const fortifyAbility = enemy.abilities.map(getReadyAbility).find((a) => a && a.type === 'BUFF');
      if (fortifyAbility) {
        return { type: 'ABILITY', actorId: enemy.id, targetId: enemy.id, abilityId: fortifyAbility.id };
      }
    }

    // Stun or heavy slam
    const slamAbility = enemy.abilities.map(getReadyAbility).find((a) => a && (a.type === 'PHYSICAL' || a.type === 'MAGICAL'));
    if (slamAbility) {
      return { type: 'ABILITY', actorId: enemy.id, targetId: lowestHpHero.id, abilityId: slamAbility.id };
    }
  }

  // ==========================================
  // 9. SPELLWEAVER AI (e.g. Frost Elemental)
  // ==========================================
  if (enemy.aiType === 'SPELLWEAVER') {
    const readySpells = enemy.abilities.map(getReadyAbility).filter((a): a is NonNullable<typeof a> => a !== null);
    if (readySpells.length > 0) {
      const bestSpell = readySpells.sort((a, b) => b.powerMultiplier - a.powerMultiplier)[0];
      return { type: 'ABILITY', actorId: enemy.id, targetId: lowestHpHero.id, abilityId: bestSpell.id };
    }
  }

  // ==========================================
  // 10. DEFAULT / BASIC MELEE (Goblin Scout, etc.)
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
