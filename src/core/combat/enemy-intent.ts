import type { EnemyIntent } from '../types/intent.ts';
import type { Combatant, CombatLogEntry, FloatingText } from '../types/combat.ts';
import type { IRandomNumberGenerator } from '../rng/rng.ts';
import { createLogEntry, createFloatingText } from './combat-events.ts';
import { applyStatusEffect } from './status-manager.ts';

type IntentStrategy = (enemy: Combatant, round: number, hpRatio: number, rng: IRandomNumberGenerator) => EnemyIntent | null;

const INTENT_STRATEGIES: Record<string, IntentStrategy> = {
  HEALER: (enemy, round, hpRatio) => {
    if (hpRatio <= 0.6) {
      return { type: 'HEAL', heal: Math.round(enemy.maxHp * 0.3), description: 'Chanting Primal Healing Salve (+30% HP)', icon: 'heart' };
    }
    const lightningDmg = Math.round(enemy.derivedStats.magicAttack * 1.4);
    return { type: 'ATTACK', damage: lightningDmg, statusEffect: 'SHOCKED', description: `Calling Lightning Bolt: ${lightningDmg} Lightning dmg + Shocked`, icon: 'zap' };
  },
  ENRAGER: (enemy, round, hpRatio) => {
    const isEmpowered = enemy.statusEffects.some((s) => s.type === 'EMPOWERED' && s.remainingTurns > 0);
    if (hpRatio <= 0.65 && !isEmpowered) {
      return { type: 'BUFF', description: 'Entering Blood Frenzy (+Empowered & Haste)', icon: 'flame' };
    }
    const frenzyDmg = Math.round(enemy.derivedStats.physicalAttack * (isEmpowered ? 1.6 : 1.25));
    return { type: 'ATTACK', damage: Math.max(4, frenzyDmg), description: `Wild Frenzy Cleave: ${frenzyDmg} heavy physical damage`, icon: 'swords' };
  },
  PACK_LEADER: (enemy, round) => {
    if (round % 3 === 1) {
      return { type: 'BUFF', block: 20, description: `Bellowing Battle Cry: Grants +20 Block & Empowered`, icon: 'shield' };
    }
    const cleaveDmg = Math.round(enemy.derivedStats.physicalAttack * 1.6);
    return { type: 'DEBUFF', damage: cleaveDmg, statusEffect: 'VULNERABLE', description: `Crushing Cleave: ${cleaveDmg} physical dmg + Vulnerable (+30% dmg taken)`, icon: 'swords' };
  },
  DEFENDER_FORTRESS: (enemy, round) => {
    if (enemy.shieldHp <= 0 || round % 2 === 1) {
      const blockVal = Math.round(enemy.derivedStats.physicalDefense * 1.5) + 15;
      return { type: 'DEFEND', block: blockVal, description: `Hardening into Stone Form: +${blockVal} Block & Thorns`, icon: 'shield' };
    }
    const slamDmg = Math.round(enemy.derivedStats.physicalAttack * 1.5);
    return { type: 'ATTACK', damage: slamDmg, description: `Earthshaking Heavy Slam: ${slamDmg} physical damage`, icon: 'sword' };
  },
  CROWD_CONTROLLER: (enemy, round) => {
    if (round % 3 === 1) {
      if (enemy.name.includes('Bandit') || enemy.name.includes('Shadow')) {
        return { type: 'DEBUFF', statusEffect: 'BLINDED', damage: 5, description: 'Hurls Smoke Bomb: 5 dmg + Blinded (40% miss chance)', icon: 'sparkles' };
      } else if (enemy.name.includes('Banshee') || enemy.name.includes('Specter')) {
        return { type: 'DEBUFF', statusEffect: 'WEAKENED', damage: 8, description: 'Piercing Banshee Screech: 8 dmg + Weakened (-30% attack power)', icon: 'shadow' };
      } else {
        return { type: 'DEBUFF', statusEffect: 'POISON', damage: 6, description: 'Spitting Sticky Web: 6 dmg + 10 Poison + Weakened', icon: 'poison' };
      }
    }
    const critStrikeDmg = Math.round(enemy.derivedStats.physicalAttack * 1.5);
    return { type: 'ATTACK', damage: critStrikeDmg, description: `Lethal Shadow Strike: ${critStrikeDmg} critical damage`, icon: 'swords' };
  },
  CORROSION_DRAINER: (enemy, round) => {
    if (round % 2 === 1) {
      const acidDmg = Math.round(enemy.derivedStats.magicAttack * 1.2);
      return { type: 'DEBUFF', damage: acidDmg, statusEffect: 'CORROSION', description: `Corrosive Bile Vomit: ${acidDmg} acid dmg + dissolves player Block`, icon: 'flask' };
    }
    const drainDmg = Math.round(enemy.derivedStats.magicAttack * 1.4);
    return { type: 'HEAL', damage: drainDmg, heal: drainDmg, description: `Soul Life Drain: Deals ${drainDmg} Void dmg and restores ${drainDmg} HP`, icon: 'sparkles' };
  },
  SPELLWEAVER: (enemy) => {
    if (enemy.name.includes('Frost') || enemy.name.includes('Ice')) {
      const iceDmg = Math.round(enemy.derivedStats.magicAttack * 1.4);
      return { type: 'DEBUFF', damage: iceDmg, statusEffect: 'FROZEN', description: `Glacial Ice Slam: ${iceDmg} Ice dmg + 1 turn Frozen`, icon: 'zap' };
    }
    const fireDmg = Math.round(enemy.derivedStats.magicAttack * 1.5);
    return { type: 'DEBUFF', damage: fireDmg, statusEffect: 'BURNING', description: `Dark Fireball: ${fireDmg} Fire Magic dmg + Burning`, icon: 'flame' };
  },
  CASTER: (enemy) => INTENT_STRATEGIES['SPELLWEAVER']!(enemy, 0, 0, null as any),
  AGGRESSIVE: (enemy) => {
    const biteDmg = Math.round(enemy.derivedStats.physicalAttack * 1.3);
    return { type: 'DEBUFF', damage: biteDmg, statusEffect: 'BLEEDING', description: `Feral Rend Bite: ${biteDmg} physical dmg + Bleeding`, icon: 'sword' };
  }
};

/**
 * Calculates and telegraphs the upcoming enemy intent for the next round
 */
export function calculateEnemyIntent(
  enemy: Combatant,
  _hero: Combatant,
  round: number,
  rng: IRandomNumberGenerator
): EnemyIntent {
  const hpRatio = enemy.currentHp / enemy.maxHp;
  const isBoss = enemy.avatar.includes('dragon') || enemy.avatar.includes('lich');

  // 1. Boss Special Cataclysm
  if (isBoss && round % 3 === 0) {
    const bigDmg = Math.round(enemy.derivedStats.physicalAttack * 1.8);
    return {
      type: 'SPECIAL',
      damage: bigDmg,
      description: 'Channeling Cataclysmic Strike',
      icon: 'flame',
    };
  }

  const strategy = INTENT_STRATEGIES[enemy.aiType];
  if (strategy) {
    const intent = strategy(enemy, round, hpRatio, rng);
    if (intent) return intent;
  }

  // Default Melee fallback
  const roll = rng.nextInt(1, 100);
  if (roll <= 60) {
    const rawDmg = Math.round(enemy.derivedStats.physicalAttack * rng.nextFloat(0.9, 1.15));
    return {
      type: 'ATTACK',
      damage: Math.max(3, rawDmg),
      description: `Striking for ${rawDmg} physical damage`,
      icon: 'sword',
    };
  } else if (roll <= 85) {
    const blockVal = Math.round(enemy.derivedStats.physicalDefense * 1.0) + 6;
    return {
      type: 'DEFEND',
      block: blockVal,
      description: `Guarding for ${blockVal} Block`,
      icon: 'shield',
    };
  } else {
    const dmg = Math.max(3, Math.round(enemy.derivedStats.physicalAttack * 0.8));
    return {
      type: 'DEBUFF',
      damage: dmg,
      statusEffect: 'BLEEDING',
      description: `Slashing for ${dmg} damage + Bleeding`,
      icon: 'sword',
    };
  }
}

export interface ExecuteEnemyIntentResult {
  nextEnemy: Combatant;
  nextHero: Combatant;
  logs: CombatLogEntry[];
  floatingTexts: FloatingText[];
}

/**
 * Executes the telegraphed enemy intent against the hero
 */
export function executeEnemyIntent(
  enemy: Combatant,
  hero: Combatant,
  intent: EnemyIntent,
  round: number,
  rng: IRandomNumberGenerator
): ExecuteEnemyIntentResult {
  let nextEnemy = { ...enemy };
  let nextHero = { ...hero };
  const logs: CombatLogEntry[] = [];
  const floatingTexts: FloatingText[] = [];

  // Reset defend stance
  nextEnemy.isDefending = false;

  // 1. Block
  if (intent.block && intent.block > 0) {
    nextEnemy.shieldHp = (nextEnemy.shieldHp || 0) + intent.block;
    floatingTexts.push(createFloatingText(enemy.id, `BLOCK +${intent.block}`, 'buff'));
    logs.push(
      createLogEntry({
        round,
        actorName: enemy.name,
        actionType: 'DEFEND',
        entryType: 'DEFEND',
        message: `🛡️ ${enemy.name} shields up for ${intent.block} Block!`,
      })
    );
  }

  // 2. Heal
  if (intent.heal && intent.heal > 0) {
    const healAmount = Math.min(nextEnemy.maxHp - nextEnemy.currentHp, intent.heal);
    nextEnemy.currentHp += healAmount;
    floatingTexts.push(createFloatingText(enemy.id, `HEAL +${healAmount}`, 'heal'));
    logs.push(
      createLogEntry({
        round,
        actorName: enemy.name,
        actionType: 'ABILITY',
        entryType: 'HEAL',
        message: `✨ ${enemy.name} casts healing restorative for +${healAmount} HP!`,
      })
    );
  }

  // 3. Attack Damage
  if (intent.damage && intent.damage > 0) {
    let incomingDamage = intent.damage;

    // Check Blinded on Enemy
    const enemyIsBlinded = nextEnemy.statusEffects.some((s) => s.type === 'BLINDED' && s.remainingTurns > 0);
    const enemyMissed = enemyIsBlinded && rng.rollChance(0.4);

    if (enemyMissed) {
      floatingTexts.push(createFloatingText(enemy.id, 'BLIND MISS', 'miss'));
      logs.push(
        createLogEntry({
          round,
          actorName: enemy.name,
          actionType: 'ATTACK',
          entryType: 'MISS',
          message: `👁️ ${enemy.name} is [BLINDED] and swings wildly, missing ${hero.name}!`,
        })
      );
    } else {
      // Weakened on Enemy
      if (nextEnemy.statusEffects.some((s) => s.type === 'WEAKENED' && s.remainingTurns > 0)) {
        incomingDamage = Math.round(incomingDamage * 0.7);
      }

      // Vulnerable on Hero
      if (nextHero.statusEffects.some((s) => s.type === 'VULNERABLE' && s.remainingTurns > 0)) {
        incomingDamage = Math.round(incomingDamage * 1.3);
        floatingTexts.push(createFloatingText(hero.id, 'VULNERABLE +30%', 'crit'));
      }

      // Hero Block / Shield Absorption
      if (nextHero.shieldHp > 0) {
        const absorbed = Math.min(nextHero.shieldHp, incomingDamage);
        nextHero.shieldHp -= absorbed;
        incomingDamage -= absorbed;
        floatingTexts.push(createFloatingText(hero.id, `ABSORB ${absorbed}`, 'buff'));
      }

      const nextHp = Math.max(0, nextHero.currentHp - incomingDamage);
      nextHero.currentHp = nextHp;
      nextHero.isDead = nextHp === 0;

      floatingTexts.push(createFloatingText(hero.id, `${incomingDamage}`, 'damage'));
      logs.push(
        createLogEntry({
          round,
          actorName: enemy.name,
          targetName: hero.name,
          actionType: 'ATTACK',
          entryType: 'DAMAGE',
          isHit: true,
          isCrit: false,
          damage: incomingDamage,
          isDefended: false,
          isKilled: nextHero.isDead,
          message: `⚔️ ${enemy.name} strikes ${hero.name} for ${incomingDamage} damage!${nextHero.isDead ? ` 💀 ${hero.name} was defeated!` : ''}`,
        })
      );

      // Hero Thorns reflection back to enemy
      const heroThorns = nextHero.statusEffects.find((s) => s.type === 'THORNS' && s.remainingTurns > 0);
      if (heroThorns && heroThorns.potency > 0) {
        const reflect = heroThorns.potency;
        nextEnemy.currentHp = Math.max(0, nextEnemy.currentHp - reflect);
        nextEnemy.isDead = nextEnemy.currentHp === 0;
        floatingTexts.push(createFloatingText(enemy.id, `THORNS -${reflect}`, 'damage'));
        logs.push(
          createLogEntry({
            round,
            actorName: hero.name,
            targetName: enemy.name,
            actionType: 'PASS',
            entryType: 'DAMAGE',
            message: `🌵 ${hero.name}'s [THORNS] reflect ${reflect} damage back to ${enemy.name}!${nextEnemy.isDead ? ` 💀 ${enemy.name} was slain by thorns!` : ''}`,
          })
        );
      }
    }
  }

  // 4. Status Debuff (Poison, Weakened, etc.)
  if (intent.statusEffect) {
    const pot = intent.statusEffect === 'POISON'
      ? Math.max(6, Math.round(enemy.derivedStats.physicalAttack * 0.6) + 3)
      : 8;
    const app = {
      effectId: intent.statusEffect,
      chance: 1.0,
      duration: 5,
      potency: pot,
    };
    const res = applyStatusEffect(nextHero, app, nextEnemy, rng);
    if (res.applied) {
      nextHero = res.target;
      if (res.log) logs.push(res.log);
      if (res.float) floatingTexts.push(res.float);
    }
  }

  return {
    nextEnemy,
    nextHero,
    logs,
    floatingTexts,
  };
}
