import type {
  CombatState,
  Combatant,
  CombatAction,
  ActionExecutionResult,
  CombatLogEntry,
  FloatingText,
  CombatStatus,
} from '../types/combat.ts';
import type { IRandomNumberGenerator } from '../rng/rng.ts';
import { calculateTurnOrder, getNextTurn } from './turn-manager.ts';
import { calculatePhysicalDamage } from './damage-calculator.ts';
import { executeAbility } from './ability-executor.ts';
import { executeItemAction } from './item-executor.ts';
import { processTurnStartStatuses } from './status-manager.ts';
import { ABILITIES } from '../data/abilities.ts';
import { ITEMS_CATALOG } from '../data/items.ts';
import { createFloatingText, createLogEntry } from './combat-events.ts';

/**
 * Initializes a new combat state between player hero(es) and an enemy party lineup.
 * In 1v1 Pokemon style, the first enemy is active on the field, and subsequent monsters wait in the enemyQueue.
 */
export function createInitialCombatState(
  heroes: Combatant[],
  enemies: Combatant[],
  rng: IRandomNumberGenerator,
  seed: number = Date.now()
): CombatState {
  const combatants: Record<string, Combatant> = {};

  heroes.forEach((h) => {
    combatants[h.id] = {
      ...h,
      isDead: false,
      isDefending: false,
      abilityCooldowns: { ...(h.abilityCooldowns || {}) },
      statusEffects: [...(h.statusEffects || [])],
      shieldHp: h.shieldHp || 0,
    };
  });

  // Pokemon style: First enemy is active on the battlefield, remaining are queued
  const activeEnemy = enemies[0] || null;
  const enemyQueue: Combatant[] = enemies.slice(1);

  if (activeEnemy) {
    combatants[activeEnemy.id] = {
      ...activeEnemy,
      isDead: false,
      isDefending: false,
      abilityCooldowns: { ...(activeEnemy.abilityCooldowns || {}) },
      statusEffects: [...(activeEnemy.statusEffects || [])],
      shieldHp: activeEnemy.shieldHp || 0,
    };
  }

  const turnOrder = calculateTurnOrder(combatants, rng);
  const activeCombatantId = turnOrder[0] || '';

  const initialLogs: CombatLogEntry[] = [
    createLogEntry({
      round: 1,
      actorName: 'System',
      actionType: 'PASS',
      entryType: 'INFO',
      message: `⚔️ Encounter initiated! ${heroes.map((h) => h.name).join(', ')} VS ${activeEnemy?.name || 'Enemy'} (Lineup: ${enemies.length} monsters).`,
    }),
    createLogEntry({
      round: 1,
      actorName: 'System',
      actionType: 'PASS',
      entryType: 'ROUND',
      message: `Round 1 begins. Initiative order: ${turnOrder.map((id) => combatants[id]?.name).filter(Boolean).join(' → ')}.`,
    }),
  ];

  return {
    id: `combat-${Date.now()}`,
    round: 1,
    status: 'IN_PROGRESS',
    turnOrder,
    activeTurnIndex: 0,
    activeCombatantId,
    combatants,
    enemyQueue,
    selectedTargetId: activeEnemy ? activeEnemy.id : null,
    log: initialLogs,
    floatingTexts: [],
    seed,
  };
}

/**
 * Checks whether all heroes or all enemies (active + queue) have fallen.
 */
export function checkCombatOutcome(
  combatants: Record<string, Combatant>,
  enemyQueue: Combatant[] = []
): CombatStatus {
  const allHeroesDead = Object.values(combatants)
    .filter((c) => c.type === 'HERO')
    .every((c) => c.isDead || c.currentHp <= 0);

  if (allHeroesDead) {
    return 'DEFEAT';
  }

  const activeEnemiesDead = Object.values(combatants)
    .filter((c) => c.type === 'ENEMY')
    .every((c) => c.isDead || c.currentHp <= 0);

  if (activeEnemiesDead && enemyQueue.length === 0) {
    return 'VICTORY';
  }

  return 'IN_PROGRESS';
}

/**
 * Pure state transition function: Executes a single combat action (Attack, Ability, Item, Defend),
 * applies damage/defense/healing, checks outcomes, handles enemy queue replacement, and returns updated immutable state.
 */
export function executeCombatAction(
  state: CombatState,
  action: CombatAction,
  rng: IRandomNumberGenerator
): ActionExecutionResult {
  const nextCombatants: Record<string, Combatant> = {};
  for (const [id, c] of Object.entries(state.combatants)) {
    nextCombatants[id] = {
      ...c,
      abilityCooldowns: { ...c.abilityCooldowns },
      statusEffects: [...c.statusEffects],
    };
  }

  const actor = nextCombatants[action.actorId];
  const target = nextCombatants[action.targetId];

  const newLogs: CombatLogEntry[] = [];
  const newFloats: FloatingText[] = [];

  if (!actor || actor.isDead) {
    return {
      nextState: state,
      logEntries: [],
      floatingTexts: [],
    };
  }

  let damageResult;

  // ==========================================
  // ACTION: ITEM
  // ==========================================
  if (action.type === 'ITEM' && action.itemId) {
    const item = ITEMS_CATALOG[action.itemId];
    if (item) {
      const itemTarget = target || actor;
      const itemResult = executeItemAction(actor, itemTarget, item, state.round, rng);

      nextCombatants[actor.id] = itemResult.nextActor;
      nextCombatants[itemTarget.id] = itemResult.nextTarget;

      newLogs.push(...itemResult.logs);
      newFloats.push(...itemResult.floatingTexts);
    }
  }

  // ==========================================
  // ACTION: ABILITY
  // ==========================================
  else if (action.type === 'ABILITY') {
    const ability = action.abilityId ? ABILITIES[action.abilityId] : null;
    if (ability) {
      const abilityTarget = target || actor;
      const abilityResult = executeAbility(actor, abilityTarget, ability, state.round, rng);

      nextCombatants[actor.id] = abilityResult.nextActor;
      nextCombatants[abilityTarget.id] = abilityResult.nextTarget;

      newLogs.push(...abilityResult.logs);
      newFloats.push(...abilityResult.floatingTexts);
      damageResult = abilityResult.damageResult;
    }
  }

  // ==========================================
  // ACTION: BASIC ATTACK
  // ==========================================
  else if (action.type === 'ATTACK' && target) {
    const dmg = calculatePhysicalDamage(actor, target, rng);
    damageResult = dmg;

    if (!dmg.isHit) {
      newFloats.push(createFloatingText(target.id, 'MISS', 'miss'));
      newLogs.push(
        createLogEntry({
          round: state.round,
          actorName: actor.name,
          targetName: target.name,
          actionType: 'ATTACK',
          entryType: 'MISS',
          isHit: false,
          isCrit: false,
          damage: 0,
          isDefended: false,
          isKilled: false,
          message: `${actor.name} attacks ${target.name}, but the strike misses!`,
        })
      );
    } else {
      // Shield Absorption Check
      let finalDamage = dmg.finalDamage;
      if (target.shieldHp > 0) {
        const absorbed = Math.min(target.shieldHp, finalDamage);
        target.shieldHp -= absorbed;
        finalDamage -= absorbed;
        dmg.shieldAbsorbed = absorbed;
        newFloats.push(createFloatingText(target.id, `ABSORB ${absorbed}`, 'buff'));
      }

      const nextHp = Math.max(0, target.currentHp - finalDamage);
      target.currentHp = nextHp;
      target.isDead = nextHp === 0;
      dmg.isKilled = target.isDead;

      const floatType = dmg.isCrit ? 'crit' : 'damage';
      newFloats.push(createFloatingText(target.id, `${dmg.isCrit ? 'CRIT ' : ''}${finalDamage}`, floatType));

      newLogs.push(
        createLogEntry({
          round: state.round,
          actorName: actor.name,
          targetName: target.name,
          actionType: 'ATTACK',
          entryType: dmg.isCrit ? 'CRIT' : 'DAMAGE',
          isHit: true,
          isCrit: dmg.isCrit,
          damage: finalDamage,
          isDefended: dmg.wasDefended,
          isKilled: target.isDead,
          message: `${actor.name} strikes ${target.name} for ${finalDamage} damage!${dmg.isCrit ? ' (Critical Hit!)' : ''}${target.isDead ? ` 💀 ${target.name} was slain!` : ''}`,
        })
      );
    }
  }

  // ==========================================
  // ACTION: DEFEND
  // ==========================================
  else if (action.type === 'DEFEND') {
    actor.isDefending = true;
    newFloats.push(createFloatingText(actor.id, 'GUARD', 'defend'));
    newLogs.push(
      createLogEntry({
        round: state.round,
        actorName: actor.name,
        actionType: 'DEFEND',
        entryType: 'DEFEND',
        message: `🛡️ ${actor.name} assumes a defensive guard stance (-50% damage taken).`,
        isDefended: true,
      })
    );
  }

  // ==========================================
  // POKEMON-STYLE ENEMY BENCH REPLACEMENT
  // ==========================================
  let nextEnemyQueue = [...state.enemyQueue];
  const activeEnemies = Object.values(nextCombatants).filter((c) => c.type === 'ENEMY');
  const allActiveEnemiesDead = activeEnemies.length > 0 && activeEnemies.every((c) => c.isDead || c.currentHp <= 0);

  if (allActiveEnemiesDead && nextEnemyQueue.length > 0) {
    const nextEnemy = nextEnemyQueue[0];
    nextEnemyQueue = nextEnemyQueue.slice(1);

    nextCombatants[nextEnemy.id] = {
      ...nextEnemy,
      isDead: false,
      isDefending: false,
      abilityCooldowns: { ...(nextEnemy.abilityCooldowns || {}) },
      statusEffects: [...(nextEnemy.statusEffects || [])],
      shieldHp: nextEnemy.shieldHp || 0,
    };

    newFloats.push(createFloatingText(nextEnemy.id, 'ENTERS ARENA', 'info'));
    newLogs.push(
      createLogEntry({
        round: state.round,
        actorName: 'System',
        actionType: 'PASS',
        entryType: 'INFO',
        message: `⚡ Hostile reinforced! ${nextEnemy.name} enters the arena! (${nextEnemyQueue.length} remaining in reserve)`,
      })
    );
  }

  // Check victory / defeat conditions
  const status = checkCombatOutcome(nextCombatants, nextEnemyQueue);
  if (status === 'VICTORY') {
    newLogs.push(
      createLogEntry({
        round: state.round,
        actorName: 'System',
        actionType: 'PASS',
        entryType: 'INFO',
        message: '🏆 VICTORY! All hostiles in the enemy lineup have been vanquished!',
      })
    );
  } else if (status === 'DEFEAT') {
    newLogs.push(
      createLogEntry({
        round: state.round,
        actorName: 'System',
        actionType: 'PASS',
        entryType: 'INFO',
        message: '💀 DEFEAT! You have fallen in battle!',
      })
    );
  }

  // Pick new selected target if current target died
  let nextSelectedTargetId = state.selectedTargetId;
  if (!nextSelectedTargetId || nextCombatants[nextSelectedTargetId]?.isDead) {
    const nextEnemy = Object.values(nextCombatants).find((c) => c.type === 'ENEMY' && !c.isDead && c.currentHp > 0);
    nextSelectedTargetId = nextEnemy ? nextEnemy.id : null;
  }

  // Recalculate turn order if a new combatant was introduced
  const turnOrder = Object.values(nextCombatants).some((c) => !state.turnOrder.includes(c.id))
    ? calculateTurnOrder(nextCombatants, rng)
    : state.turnOrder;

  const nextState: CombatState = {
    ...state,
    status,
    turnOrder,
    combatants: nextCombatants,
    enemyQueue: nextEnemyQueue,
    selectedTargetId: nextSelectedTargetId,
    log: [...state.log, ...newLogs],
    floatingTexts: [...state.floatingTexts, ...newFloats],
  };

  return {
    nextState,
    logEntries: newLogs,
    floatingTexts: newFloats,
    damageResult,
  };
}

/**
 * Advances turn order to the next combatant in the queue.
 * Handles DoT ticks, HoT heals, Mana recovery, and cooldown decrements for the active combatant.
 */
export function advanceCombatTurn(
  state: CombatState,
  _rng: IRandomNumberGenerator
): CombatState {
  if (state.status !== 'IN_PROGRESS') {
    return state;
  }

  const { nextIndex, nextRound, nextCombatantId, isNewRound } = getNextTurn(
    state.turnOrder,
    state.activeTurnIndex,
    state.round,
    state.combatants
  );

  const nextCombatants: Record<string, Combatant> = {};
  for (const [id, c] of Object.entries(state.combatants)) {
    nextCombatants[id] = {
      ...c,
      abilityCooldowns: { ...c.abilityCooldowns },
      statusEffects: [...c.statusEffects],
    };
  }

  const newLogs: CombatLogEntry[] = [];
  const newFloats: FloatingText[] = [];

  const activeActor = nextCombatants[nextCombatantId];
  if (activeActor && !activeActor.isDead) {
    // Reset defend stance at start of turn
    if (activeActor.isDefending) {
      activeActor.isDefending = false;
    }

    // Decrement ability cooldowns
    for (const [abilityId, cd] of Object.entries(activeActor.abilityCooldowns)) {
      if (cd > 0) {
        activeActor.abilityCooldowns[abilityId] = cd - 1;
      }
    }

    // Passive turn mana recovery (5% of max mana, min 3)
    if (activeActor.currentMana < activeActor.maxMana) {
      const manaRecovery = Math.max(3, Math.round(activeActor.maxMana * 0.05));
      activeActor.currentMana = Math.min(activeActor.maxMana, activeActor.currentMana + manaRecovery);
    }

    // Status effect ticks (Poison, Burn, Bleed, Regen)
    if (activeActor.statusEffects.length > 0) {
      const tickResult = processTurnStartStatuses(activeActor, nextRound);
      nextCombatants[activeActor.id] = tickResult.combatant;
      newLogs.push(...tickResult.logs);
      newFloats.push(...tickResult.floatingTexts);
    }
  }

  if (isNewRound) {
    newLogs.push(
      createLogEntry({
        round: nextRound,
        actorName: 'System',
        actionType: 'PASS',
        entryType: 'ROUND',
        message: `--- Round ${nextRound} begins ---`,
      })
    );
  }

  // Check if active enemy died from DoT and handle Pokemon queue reinforcement
  let nextEnemyQueue = [...state.enemyQueue];
  const activeEnemies = Object.values(nextCombatants).filter((c) => c.type === 'ENEMY');
  const allActiveEnemiesDead = activeEnemies.length > 0 && activeEnemies.every((c) => c.isDead || c.currentHp <= 0);

  if (allActiveEnemiesDead && nextEnemyQueue.length > 0) {
    const nextEnemy = nextEnemyQueue[0];
    nextEnemyQueue = nextEnemyQueue.slice(1);

    nextCombatants[nextEnemy.id] = {
      ...nextEnemy,
      isDead: false,
      isDefending: false,
      abilityCooldowns: { ...(nextEnemy.abilityCooldowns || {}) },
      statusEffects: [...(nextEnemy.statusEffects || [])],
      shieldHp: nextEnemy.shieldHp || 0,
    };

    newFloats.push(createFloatingText(nextEnemy.id, 'ENTERS ARENA', 'info'));
    newLogs.push(
      createLogEntry({
        round: nextRound,
        actorName: 'System',
        actionType: 'PASS',
        entryType: 'INFO',
        message: `⚡ Hostile reinforced! ${nextEnemy.name} enters the arena! (${nextEnemyQueue.length} remaining in reserve)`,
      })
    );
  }

  const status = checkCombatOutcome(nextCombatants, nextEnemyQueue);
  if (status === 'VICTORY') {
    newLogs.push(
      createLogEntry({
        round: nextRound,
        actorName: 'System',
        actionType: 'PASS',
        entryType: 'INFO',
        message: '🏆 VICTORY! All hostiles in the enemy lineup have been vanquished!',
      })
    );
  } else if (status === 'DEFEAT') {
    newLogs.push(
      createLogEntry({
        round: nextRound,
        actorName: 'System',
        actionType: 'PASS',
        entryType: 'INFO',
        message: '💀 DEFEAT! You have fallen in battle!',
      })
    );
  }

  // Ensure valid selected target
  let nextSelectedTargetId = state.selectedTargetId;
  if (!nextSelectedTargetId || nextCombatants[nextSelectedTargetId]?.isDead) {
    const availableEnemy = Object.values(nextCombatants).find((c) => c.type === 'ENEMY' && !c.isDead && c.currentHp > 0);
    nextSelectedTargetId = availableEnemy ? availableEnemy.id : null;
  }

  return {
    ...state,
    round: nextRound,
    status,
    activeTurnIndex: nextIndex,
    activeCombatantId: nextCombatantId,
    combatants: nextCombatants,
    enemyQueue: nextEnemyQueue,
    selectedTargetId: nextSelectedTargetId,
    log: [...state.log, ...newLogs],
    floatingTexts: [...state.floatingTexts, ...newFloats],
  };
}
