import type { CombatCard, DeckState } from '../types/cards.ts';
import type { Combatant, CombatLogEntry, FloatingText } from '../types/combat.ts';
import type { CharacterClassId } from '../types/classes.ts';
import type { IRandomNumberGenerator } from '../rng/rng.ts';
import { CARDS_CATALOG } from '../data/cards.ts';
import { createLogEntry, createFloatingText } from './combat-events.ts';
import { applyStatusEffect } from './status-manager.ts';

let cardInstanceCounter = 0;

export function instantiateCard(baseId: string): CombatCard {
  cardInstanceCounter++;
  const baseCard = CARDS_CATALOG[baseId] || CARDS_CATALOG['strike'];
  return {
    ...baseCard,
    id: `${baseCard.id}-${Date.now()}-${cardInstanceCounter}`,
  };
}

export const CLASS_BASIC_CARDS: Record<CharacterClassId, { attackId: string; defendId: string }> = {
  WARRIOR: { attackId: 'warrior-strike', defendId: 'warrior-defend' },
  ROGUE: { attackId: 'rogue-strike', defendId: 'rogue-defend' },
  MAGE: { attackId: 'mage-strike', defendId: 'mage-defend' },
  CLERIC: { attackId: 'cleric-strike', defendId: 'cleric-defend' },
  RANGER: { attackId: 'ranger-strike', defendId: 'ranger-defend' },
  PALADIN: { attackId: 'paladin-strike', defendId: 'paladin-defend' },
  NECROMANCER: { attackId: 'necromancer-strike', defendId: 'necromancer-defend' },
  BERSERKER: { attackId: 'berserker-strike', defendId: 'berserker-defend' },
};

/**
 * Creates initial starter deck based on chosen class and optional selected starter cards
 */
export function createInitialDeck(
  classId: CharacterClassId,
  selectedStarterCardIds?: string[],
  initialMaxEnergy: number = 3
): DeckState {
  const basicCards = CLASS_BASIC_CARDS[classId] || { attackId: 'strike', defendId: 'defend' };
  const starterCardIds: string[] = [
    basicCards.attackId,
    basicCards.attackId,
    basicCards.attackId,
    basicCards.attackId,
    basicCards.defendId,
    basicCards.defendId,
    basicCards.defendId,
    basicCards.defendId,
  ];

  if (selectedStarterCardIds && selectedStarterCardIds.length > 0) {
    starterCardIds.push(...selectedStarterCardIds);
  } else {
    // Add 2 class-specific signature starter cards by default
    switch (classId) {
      case 'WARRIOR':
        starterCardIds.push('power-cleave', 'shield-slam');
        break;
      case 'ROGUE':
        starterCardIds.push('quick-slash', 'poison-dart');
        break;
      case 'MAGE':
        starterCardIds.push('fireball', 'frost-lance');
        break;
      case 'CLERIC':
        starterCardIds.push('holy-smite', 'prayer-heal');
        break;
      case 'RANGER':
        starterCardIds.push('aimed-shot', 'arrow-barrage');
        break;
      case 'PALADIN':
        starterCardIds.push('radiant-smite', 'aegis-ward');
        break;
      case 'NECROMANCER':
        starterCardIds.push('soul-siphon', 'bone-barrier');
        break;
      case 'BERSERKER':
        starterCardIds.push('blood-slash', 'frenzy-rage');
        break;
      default:
        starterCardIds.push('power-cleave', 'shield-slam');
    }
  }

  const fullDeck = starterCardIds.map((id) => instantiateCard(id));

  return {
    drawPile: [...fullDeck],
    hand: [],
    discardPile: [],
    exhaustPile: [],
    maxEnergy: initialMaxEnergy,
    currentEnergy: initialMaxEnergy,
    drawCountPerTurn: 5,
    fullDeck: [...fullDeck],
  };
}

/**
 * Pure Fisher-Yates array shuffle
 */
export function shuffleCards(cards: CombatCard[], rng: IRandomNumberGenerator): CombatCard[] {
  const array = [...cards];
  for (let i = array.length - 1; i > 0; i--) {
    const j = rng.nextInt(0, i);
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}

/**
 * Draws N cards from draw pile into hand, reshuffling discard pile if empty
 */
export function drawCards(
  deckState: DeckState,
  count: number,
  rng: IRandomNumberGenerator
): DeckState {
  let drawPile = [...deckState.drawPile];
  let discardPile = [...deckState.discardPile];
  const hand = [...deckState.hand];

  for (let i = 0; i < count; i++) {
    if (drawPile.length === 0) {
      if (discardPile.length === 0) break;
      drawPile = shuffleCards(discardPile, rng);
      discardPile = [];
    }
    const drawn = drawPile.pop();
    if (drawn) {
      hand.push(drawn);
    }
  }

  return {
    ...deckState,
    drawPile,
    discardPile,
    hand,
  };
}

/**
 * Begins player turn: resets energy and draws 5 cards
 */
export function startTurnDeck(
  deckState: DeckState,
  rng: IRandomNumberGenerator
): DeckState {
  let state = {
    ...deckState,
    currentEnergy: deckState.maxEnergy,
  };

  if (state.drawPile.length === 0 && state.discardPile.length === 0 && state.hand.length === 0) {
    state.drawPile = shuffleCards(state.fullDeck.map((c) => ({ ...c })), rng);
  }

  return drawCards(state, state.drawCountPerTurn, rng);
}

/**
 * Ends player turn: discards non-retaining hand cards
 */
export function endTurnDeck(deckState: DeckState): DeckState {
  const retained: CombatCard[] = [];
  const discarded: CombatCard[] = [...deckState.discardPile];

  for (const card of deckState.hand) {
    if (card.retains) {
      retained.push(card);
    } else {
      discarded.push(card);
    }
  }

  return {
    ...deckState,
    hand: retained,
    discardPile: discarded,
  };
}

export interface PlayCardResult {
  nextDeck: DeckState;
  nextHero: Combatant;
  nextTarget: Combatant;
  logs: CombatLogEntry[];
  floatingTexts: FloatingText[];
  success: boolean;
}

import type { RelicDefinition } from '../types/relics.ts';
import {
  calculateRelicAttackSynergies,
  calculateRelicOnStatusApplied,
} from '../relics/relic-manager.ts';
import { calculateScaledCardValues } from './card-scaling.ts';

/**
 * Plays a card from hand, applying damage, block, heals, draw, status effects, and relic synergies
 */
export function playCombatCard(
  deckState: DeckState,
  cardId: string,
  hero: Combatant,
  target: Combatant,
  round: number,
  rng: IRandomNumberGenerator,
  relics: RelicDefinition[] = []
): PlayCardResult {
  const cardIndex = deckState.hand.findIndex((c) => c.id === cardId);
  if (cardIndex < 0) {
    return {
      nextDeck: deckState,
      nextHero: hero,
      nextTarget: target,
      logs: [],
      floatingTexts: [],
      success: false,
    };
  }

  const card = deckState.hand[cardIndex];

  // Validate Energy
  if (deckState.currentEnergy < card.cost) {
    return {
      nextDeck: deckState,
      nextHero: hero,
      nextTarget: target,
      logs: [
        createLogEntry({
          round,
          actorName: hero.name,
          actionType: 'PASS',
          entryType: 'INFO',
          message: `Not enough Energy to play [${card.name}] (Costs ⚡${card.cost}, have ⚡${deckState.currentEnergy})!`,
        }),
      ],
      floatingTexts: [createFloatingText(hero.id, 'NO ENERGY', 'info')],
      success: false,
    };
  }

  let nextHero = { ...hero };
  let nextTarget = { ...target };
  const logs: CombatLogEntry[] = [];
  const floatingTexts: FloatingText[] = [];
  let bonusEnergyFromSynergy = 0;

  // Calculate stat-scaled values for this card
  const scaled = calculateScaledCardValues(card, hero);

  // Check Blinded status on Hero
  const isBlinded = nextHero.statusEffects.some((s) => s.type === 'BLINDED' && s.remainingTurns > 0);
  const missedFromBlind = isBlinded && card.type === 'ATTACK' && rng.rollChance(0.4);

  if (missedFromBlind) {
    floatingTexts.push(createFloatingText(hero.id, 'BLIND MISS', 'miss'));
    logs.push(
      createLogEntry({
        round,
        actorName: hero.name,
        actionType: 'ATTACK',
        entryType: 'MISS',
        message: `👁️ ${hero.name} attacks while [BLINDED] and completely misses!`,
      })
    );
  }

  // 1. Apply Block (with stat scaling)
  if (scaled.block && scaled.block.total > 0) {
    const blockVal = scaled.block.total;
    nextHero.shieldHp = (nextHero.shieldHp || 0) + blockVal;
    floatingTexts.push(createFloatingText(hero.id, `BLOCK +${blockVal}`, 'buff'));
    logs.push(
      createLogEntry({
        round,
        actorName: hero.name,
        actionType: 'DEFEND',
        entryType: 'DEFEND',
        message: `🛡️ ${hero.name} plays [${card.name}] and gains ${blockVal} Block!`,
      })
    );
  }

  // 2. Apply Physical / Magic Damage with Stat Scaling, Status & Relic Synergies
  let totalDmg = (scaled.damage?.total || 0) + (scaled.magicDamage?.total || 0);

  if (totalDmg > 0 && !missedFromBlind) {
    // Card-specific status bonuses
    const targetHasBurn = nextTarget.statusEffects.some((s) => s.type === 'BURNING' && s.remainingTurns > 0);
    const targetHasPoison = nextTarget.statusEffects.some((s) => s.type === 'POISON' && s.remainingTurns > 0);
    const targetHasBleed = nextTarget.statusEffects.some((s) => s.type === 'BLEEDING' && s.remainingTurns > 0);
    const targetHasFreeze = nextTarget.statusEffects.some((s) => s.type === 'FROZEN' && s.remainingTurns > 0);
    const targetHasVuln = nextTarget.statusEffects.some((s) => s.type === 'VULNERABLE' && s.remainingTurns > 0);
    const heroIsWeak = nextHero.statusEffects.some((s) => s.type === 'WEAKENED' && s.remainingTurns > 0);
    const heroIsEmpowered = nextHero.statusEffects.some((s) => s.type === 'EMPOWERED' && s.remainingTurns > 0);
    const targetHasShock = nextTarget.statusEffects.some((s) => s.type === 'SHOCKED' && s.remainingTurns > 0);

    // Card synergies
    if (card.baseId === 'combustion' && targetHasBurn) {
      totalDmg += 10;
      floatingTexts.push(createFloatingText(target.id, 'COMBUST +10', 'crit'));
      logs.push(createLogEntry({ round, actorName: hero.name, actionType: 'ATTACK', entryType: 'CRIT', message: `🔥 [Combustion] ignites burning target for +10 bonus damage!` }));
    }

    if (card.baseId === 'venom-strike' && targetHasPoison) {
      bonusEnergyFromSynergy += 1;
      floatingTexts.push(createFloatingText(hero.id, '+1 ENERGY', 'buff'));
      logs.push(createLogEntry({ round, actorName: hero.name, actionType: 'ABILITY', entryType: 'INFO', message: `🐍 [Venom Strike] exploits poison and restores +1 Energy!` }));
    }

    if (card.baseId === 'rupture' && targetHasBleed) {
      nextHero.shieldHp = (nextHero.shieldHp || 0) + 8;
      floatingTexts.push(createFloatingText(hero.id, 'BLOCK +8', 'buff'));
      const vulnApp = { effectId: 'VULNERABLE' as const, chance: 1.0, duration: 2, potency: 1 };
      const vRes = applyStatusEffect(nextTarget, vulnApp, nextHero, rng);
      if (vRes.applied) nextTarget = vRes.target;
      logs.push(createLogEntry({ round, actorName: hero.name, actionType: 'ATTACK', entryType: 'DEBUFF', message: `🩸 [Rupture] tears bleeding wound, granting +8 Block and inflicts [VULNERABLE]!` }));
    }

    if (card.baseId === 'shatter-ice' && targetHasFreeze) {
      totalDmg += 14;
      floatingTexts.push(createFloatingText(target.id, 'SHATTER +14', 'crit'));
      logs.push(createLogEntry({ round, actorName: hero.name, actionType: 'ATTACK', entryType: 'CRIT', message: `❄️ [Shatter Ice] shatters frozen foe for +14 massive critical bonus damage!` }));
    }

    // Status modifiers
    if (heroIsEmpowered) {
      totalDmg += 4;
      floatingTexts.push(createFloatingText(hero.id, 'EMPOWER +4', 'buff'));
    }

    if (heroIsWeak) {
      totalDmg = Math.round(totalDmg * 0.7);
    }

    if (targetHasVuln) {
      totalDmg = Math.round(totalDmg * 1.3);
      floatingTexts.push(createFloatingText(target.id, 'VULNERABLE +30%', 'crit'));
    }

    // Relic synergies
    const relicSynergy = calculateRelicAttackSynergies(hero, nextTarget, card.element, relics);
    totalDmg = Math.round(totalDmg * relicSynergy.bonusDamageMultiplier) + relicSynergy.bonusFlatDamage;

    if (relicSynergy.healHero > 0) {
      const healAmt = Math.min(nextHero.maxHp - nextHero.currentHp, relicSynergy.healHero);
      nextHero.currentHp += healAmt;
      floatingTexts.push(createFloatingText(hero.id, `+${healAmt} HP`, 'heal'));
    }

    if (relicSynergy.gainBlock > 0) {
      nextHero.shieldHp = (nextHero.shieldHp || 0) + relicSynergy.gainBlock;
      floatingTexts.push(createFloatingText(hero.id, `BLOCK +${relicSynergy.gainBlock}`, 'buff'));
    }

    relicSynergy.synergyLogs.forEach((msg) => {
      logs.push(createLogEntry({ round, actorName: hero.name, actionType: 'ABILITY', entryType: 'INFO', message: msg }));
    });

    // Shock discharge on hit
    if (targetHasShock) {
      totalDmg += 8;
      floatingTexts.push(createFloatingText(target.id, 'SHOCK +8', 'damage'));
      logs.push(createLogEntry({ round, actorName: hero.name, actionType: 'ATTACK', entryType: 'DAMAGE', message: `⚡ [SHOCKED] discharges +8 electric damage on impact!` }));
    }

    let finalDamage = Math.max(1, totalDmg);

    // Target Shield Mitigation
    if (nextTarget.shieldHp > 0) {
      const absorbed = Math.min(nextTarget.shieldHp, finalDamage);
      nextTarget.shieldHp -= absorbed;
      finalDamage -= absorbed;
      floatingTexts.push(createFloatingText(target.id, `ABSORB ${absorbed}`, 'buff'));
    }

    const nextHp = Math.max(0, nextTarget.currentHp - finalDamage);
    nextTarget.currentHp = nextHp;
    nextTarget.isDead = nextHp === 0;

    floatingTexts.push(createFloatingText(target.id, `${finalDamage}`, 'damage'));
    logs.push(
      createLogEntry({
        round,
        actorName: hero.name,
        targetName: target.name,
        actionType: 'ATTACK',
        entryType: 'DAMAGE',
        isHit: true,
        isCrit: false,
        damage: finalDamage,
        isDefended: false,
        isKilled: nextTarget.isDead,
        message: `⚔️ ${hero.name} plays [${card.name}] dealing ${finalDamage} damage to ${target.name}!${nextTarget.isDead ? ` 💀 ${target.name} was slain!` : ''}`,
      })
    );

    // Target Thorns reflection
    const targetThorns = nextTarget.statusEffects.find((s) => s.type === 'THORNS' && s.remainingTurns > 0);
    if (targetThorns && targetThorns.potency > 0) {
      const reflectDmg = targetThorns.potency;
      nextHero.currentHp = Math.max(0, nextHero.currentHp - reflectDmg);
      nextHero.isDead = nextHero.currentHp === 0;
      floatingTexts.push(createFloatingText(hero.id, `THORNS -${reflectDmg}`, 'damage'));
      logs.push(
        createLogEntry({
          round,
          actorName: target.name,
          targetName: hero.name,
          actionType: 'PASS',
          entryType: 'DAMAGE',
          message: `🌵 ${target.name}'s [THORNS] reflect ${reflectDmg} damage back to ${hero.name}!`,
        })
      );
    }
  }

  // 3. Apply Heals (with stat scaling)
  if (scaled.heal && scaled.heal.total > 0) {
    const healAmount = Math.min(nextHero.maxHp - nextHero.currentHp, scaled.heal.total);
    nextHero.currentHp += healAmount;
    floatingTexts.push(createFloatingText(hero.id, `HEAL +${healAmount}`, 'heal'));
    logs.push(
      createLogEntry({
        round,
        actorName: hero.name,
        actionType: 'ABILITY',
        entryType: 'HEAL',
        message: `✨ ${hero.name} plays [${card.name}] healing for ${healAmount} HP!`,
      })
    );
  }

  // 4. Apply Status Effects & Relic Application Triggers
  if (card.statusEffects) {
    for (const app of card.statusEffects) {
      const effectTarget = card.targetScope === 'SELF' ? nextHero : nextTarget;
      const res = applyStatusEffect(effectTarget, app, nextHero, rng);
      if (res.applied) {
        if (card.targetScope === 'SELF') {
          nextHero = res.target;
        } else {
          nextTarget = res.target;
        }
        if (res.log) logs.push(res.log);
        if (res.float) floatingTexts.push(res.float);

        // Relic on-status-applied triggers (Brimstone Censer, Viper Fang)
        const relicApp = calculateRelicOnStatusApplied(app.effectId, relics);
        if (relicApp.gainBlock > 0) {
          nextHero.shieldHp = (nextHero.shieldHp || 0) + relicApp.gainBlock;
          floatingTexts.push(createFloatingText(hero.id, `BLOCK +${relicApp.gainBlock}`, 'buff'));
        }
        if (relicApp.bonusDamage > 0 && !nextTarget.isDead) {
          nextTarget.currentHp = Math.max(0, nextTarget.currentHp - relicApp.bonusDamage);
          nextTarget.isDead = nextTarget.currentHp === 0;
          floatingTexts.push(createFloatingText(nextTarget.id, `POISON -${relicApp.bonusDamage}`, 'damage'));
        }
        if (relicApp.gainEnergy > 0) {
          bonusEnergyFromSynergy += relicApp.gainEnergy;
          floatingTexts.push(createFloatingText(hero.id, '+1 ENERGY', 'buff'));
        }
        relicApp.synergyLogs.forEach((msg) => {
          logs.push(createLogEntry({ round, actorName: hero.name, actionType: 'ABILITY', entryType: 'INFO', message: msg }));
        });
      }
    }
  }

  // Remove played card from hand
  const newHand = deckState.hand.filter((_, i) => i !== cardIndex);
  let newDiscard = [...deckState.discardPile];
  let newExhaust = [...deckState.exhaustPile];

  if (card.exhausts) {
    newExhaust.push(card);
    floatingTexts.push(createFloatingText(hero.id, 'EXHAUST', 'info'));
  } else {
    newDiscard.push(card);
  }

  let nextDeck: DeckState = {
    ...deckState,
    currentEnergy: Math.max(0, deckState.currentEnergy - card.cost + (card.gainEnergy || 0) + bonusEnergyFromSynergy),
    hand: newHand,
    discardPile: newDiscard,
    exhaustPile: newExhaust,
  };

  // Card Draw effect
  if (card.drawCards && card.drawCards > 0) {
    nextDeck = drawCards(nextDeck, card.drawCards, rng);
  }

  return {
    nextDeck,
    nextHero,
    nextTarget,
    logs,
    floatingTexts,
    success: true,
  };
}

/**
 * Generates 3 draftable cards after victory
 */
export function generateCardDraftOptions(
  classId: CharacterClassId,
  rng: IRandomNumberGenerator,
  count: number = 3
): CombatCard[] {
  const eligibleCards = Object.values(CARDS_CATALOG).filter(
    (c) =>
      !c.isUpgraded &&
      c.rarity !== 'BASIC' &&
      (!c.classRestrictions || c.classRestrictions.includes(classId))
  );

  const shuffled = shuffleCards(eligibleCards, rng);
  return shuffled.slice(0, count).map((c) => instantiateCard(c.baseId));
}

/**
 * Adds a new card to the run master deck
 */
export function addCardToDeck(deckState: DeckState, card: CombatCard): DeckState {
  return {
    ...deckState,
    fullDeck: [...deckState.fullDeck, card],
    discardPile: [...deckState.discardPile, card],
  };
}

/**
 * Removes a card from the run master deck
 */
export function removeCardFromDeck(deckState: DeckState, cardId: string): DeckState {
  return {
    ...deckState,
    fullDeck: deckState.fullDeck.filter((c) => c.id !== cardId),
    drawPile: deckState.drawPile.filter((c) => c.id !== cardId),
    hand: deckState.hand.filter((c) => c.id !== cardId),
    discardPile: deckState.discardPile.filter((c) => c.id !== cardId),
  };
}

/**
 * Upgrades a card in the master deck collection
 */
export function upgradeCardInDeck(deckState: DeckState, cardId: string): DeckState {
  const upgradeTarget = (c: CombatCard) => {
    if (c.id !== cardId) return c;
    return {
      ...c,
      name: `${c.name}+`,
      isUpgraded: true,
      damage: c.damage ? c.damage + 4 : undefined,
      block: c.block ? c.block + 4 : undefined,
      magicDamage: c.magicDamage ? c.magicDamage + 5 : undefined,
      heal: c.heal ? c.heal + 4 : undefined,
    };
  };

  return {
    ...deckState,
    fullDeck: deckState.fullDeck.map(upgradeTarget),
    drawPile: deckState.drawPile.map(upgradeTarget),
    hand: deckState.hand.map(upgradeTarget),
    discardPile: deckState.discardPile.map(upgradeTarget),
  };
}
