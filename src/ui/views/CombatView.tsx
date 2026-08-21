import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { CombatState, Combatant, CombatLogEntry, FloatingText } from '../../core/types/combat.ts';
import type { PrimaryStats } from '../../core/types/stats.ts';
import type { CharacterClassId } from '../../core/types/classes.ts';
import type { Item } from '../../core/types/items.ts';
import type { ProgressionState } from '../../core/types/progression.ts';
import type { DungeonState } from '../../core/types/dungeon.ts';
import type { EncounterLootResult } from '../../core/types/loot.ts';
import type { MonsterAffixType } from '../../core/types/affixes.ts';
import type { RelicDefinition } from '../../core/types/relics.ts';
import type { DungeonEventDefinition, DungeonEventChoice } from '../../core/types/events.ts';
import type { MetaProgressionState, MetaUpgradeId } from '../../core/types/meta.ts';
import type { OriginBoonId } from '../../core/data/characters.ts';
import type { CombatCard, DeckState } from '../../core/types/cards.ts';
import type { EnemyIntent } from '../../core/types/intent.ts';

import {
  createInitialCombatState,
  advanceCombatTurn,
  checkCombatOutcome,
} from '../../core/combat/combat-engine.ts';
import { processTurnStartStatuses } from '../../core/combat/status-manager.ts';
import { createHeroFromClass, createWarriorHero } from '../../core/data/characters.ts';
import { createGoblinScout, generateSquadForNode } from '../../core/data/enemies.ts';
import { Mulberry32RNG } from '../../core/rng/rng.ts';
import { soundFx } from '../audio/sound-system.ts';


import {
  createInitialProgression,
  allocateStatPoint,
  unlockSkillNode,
  addExpToHero,
} from '../../core/progression/progression-manager.ts';
import { calculateDerivedStats } from '../../core/stats/stat-calculator.ts';
import {
  createInitialDungeonState,
  selectDungeonNode,
  completeDungeonNode,
  advanceToNextDungeonFloor,
} from '../../core/dungeon/dungeon-generator.ts';
import { generateEncounterLoot } from '../../core/loot/loot-generator.ts';
import { scaleEnemyForFloor } from '../../core/combat/enemy-scaler.ts';
import type { RelicId } from '../../core/types/relics.ts';
import { RELICS_CATALOG } from '../../core/data/relics.ts';
import { ITEMS_CATALOG } from '../../core/data/items.ts';
import {
  applyStartOfCombatRelics,
  applyStartOfCombatEnemyRelics,
  applyOnKillRelics,
  calculateRelicGoldBonus,
  generateRelicDraftOptions,
} from '../../core/relics/relic-manager.ts';
import {
  purchaseMetaUpgrade,
  unlockMetaClass,
  unlockMetaCard,
  unlockMetaRelic,
  applyMetaUpgradesToHero,
  calculateRunAetheriumReward,
} from '../../core/meta/meta-manager.ts';
import {
  createInitialDeck,
  startTurnDeck,
  endTurnDeck,
  playCombatCard,
  generateCardDraftOptions,
  addCardToDeck,
  drawCards,
} from '../../core/combat/deck-manager.ts';
import { executeItemAction } from '../../core/combat/item-executor.ts';
import { calculateEnemyIntent, executeEnemyIntent } from '../../core/combat/enemy-intent.ts';
import { DUNGEON_EVENTS } from '../../core/data/events.ts';
import {
  saveGame,
  loadGame,
  deleteSave,
  saveMetaProgression,
  loadMetaProgression,
  type GameSaveData,
} from '../../core/storage/save-system.ts';

import { CombatantCard } from '../components/CombatantCard.tsx';
import { CardHand } from '../components/CardHand.tsx';
import { ConsumablesQuickBar } from '../components/ConsumablesQuickBar.tsx';
import { CombatLog } from '../components/CombatLog.tsx';
import { VictoryModal } from '../components/VictoryModal.tsx';
import { DefeatModal } from '../components/DefeatModal.tsx';
import { Header } from '../components/Header.tsx';
import { ClassSelectorModal } from '../components/ClassSelectorModal.tsx';
import { ShopModal } from '../components/ShopModal.tsx';
import { LevelUpModal } from '../components/LevelUpModal.tsx';
import { SkillTreeModal } from '../components/SkillTreeModal.tsx';
import { CampfireModal } from '../components/CampfireModal.tsx';
import { ShrineModal } from '../components/ShrineModal.tsx';
import { SkillTrainerModal } from '../components/SkillTrainerModal.tsx';
import { SettingsModal } from '../components/SettingsModal.tsx';
import { CodexModal } from '../components/CodexModal.tsx';
import { RelicBar } from '../components/RelicBar.tsx';
import { DungeonEventModal } from '../components/DungeonEventModal.tsx';
import { TutorialModal } from '../components/TutorialModal.tsx';
import { CharacterCreatorModal } from '../components/CharacterCreatorModal.tsx';
import { SanctumModal } from '../components/SanctumModal.tsx';
import { CardDraftModal } from '../components/CardDraftModal.tsx';
import { RelicDraftModal } from '../components/RelicDraftModal.tsx';
import { DeckViewModal } from '../components/DeckViewModal.tsx';
import { BattleVfxOverlay, type ActiveVfx, type BattleVfxType } from '../components/BattleVfxOverlay.tsx';
import { TravelTransitionOverlay } from '../components/TravelTransitionOverlay.tsx';
import { DungeonGroundTrack } from '../components/DungeonGroundTrack.tsx';
import { upgradeCombatCard } from '../../core/combat/card-upgrader.ts';
import { DungeonMapView } from './DungeonMapView.tsx';
import { useModals } from '../hooks/useModals.ts';

export const CombatView: React.FC = () => {
  const [rng] = useState(() => new Mulberry32RNG(Date.now()));

  // Persistent Roguelite Meta-Progression State
  const [metaProgression, setMetaProgression] = useState<MetaProgressionState>(() => loadMetaProgression());

  // Load Saved Game or Initialize
  const savedData = useRef(loadGame());

  // Active Hero (1 Dedicated Player Champion)
  const [hero, setHero] = useState<Combatant>(() => {
    if (savedData.current?.hero) {
      return savedData.current.hero;
    }
    const initialMeta = loadMetaProgression();
    const baseHero = createWarriorHero('hero-1', 'Sir Alden Dawnseeker');
    return applyMetaUpgradesToHero(baseHero, initialMeta);
  });

  const [progression, setProgression] = useState<ProgressionState>(() =>
    savedData.current ? savedData.current.progression : createInitialProgression()
  );

  const [gold, setGold] = useState<number>(() =>
    savedData.current
      ? (savedData.current.gold ?? savedData.current.inventory?.gold ?? 0)
      : 0
  );
  const [potions, setPotions] = useState<Item[]>(() =>
    savedData.current?.potions ?? []
  );

  const [dungeon, setDungeon] = useState<DungeonState>(() =>
    savedData.current ? savedData.current.dungeon : createInitialDungeonState(rng)
  );

  // Active Relic Passives
  const [relics, setRelics] = useState<RelicDefinition[]>([
    RELICS_CATALOG['aegis-sunken-king'],
    RELICS_CATALOG['vampire-bloodstone'],
    RELICS_CATALOG['brimstone-censer'],
  ]);

  // Deck State Engine
  const [deckState, setDeckState] = useState<DeckState>(() => {
    const meta = savedData.current?.metaProgression ?? loadMetaProgression();
    const baseEnergy = 3 + (meta.upgradeRanks?.celestial_core || 0);
    return createInitialDeck((hero.classId as CharacterClassId) || 'WARRIOR', undefined, baseEnergy);
  });

  const [activeDungeonEvent, setActiveDungeonEvent] = useState<DungeonEventDefinition | null>(null);
  const [isDungeonMapActive, setIsDungeonMapActive] = useState<boolean>(true);
  const [enemyAffixes, setEnemyAffixes] = useState<Record<string, MonsterAffixType[]>>({});
  const [activeVfx, setActiveVfx] = useState<ActiveVfx | null>(null);

  // Active 1v1 Combat State (Player Hero VS Active Enemy + Queued Bench)
  const [combatState, setCombatState] = useState<CombatState>(() => {
    const starterEnemy = createGoblinScout();
    return createInitialCombatState([hero], [starterEnemy], rng);
  });

  // Telegraphed Enemy Intent
  const [enemyIntent, setEnemyIntent] = useState<EnemyIntent | null>(null);

  // Card & Relic Draft Reward state
  const [draftCards, setDraftCards] = useState<CombatCard[] | null>(null);
  const [draftRelics, setDraftRelics] = useState<{ isBoss: boolean; relics: RelicDefinition[] } | null>(null);
  const [victoryLoot, setVictoryLoot] = useState<EncounterLootResult | null>(null);


  const {
    isClassSelectorOpen, setIsClassSelectorOpen,
    isShopOpen, setIsShopOpen,
    isLevelUpOpen, setIsLevelUpOpen,
    isSkillTreeOpen, setIsSkillTreeOpen,
    isCampfireOpen, setIsCampfireOpen,
    isShrineOpen, setIsShrineOpen,
    isTrainerOpen, setIsTrainerOpen,
    isSettingsOpen, setIsSettingsOpen,
    isCodexOpen, setIsCodexOpen,
    isSanctumOpen, setIsSanctumOpen,
    isDeckViewOpen, setIsDeckViewOpen,
    isCombatLogOpen, setIsCombatLogOpen,
    isTutorialOpen, setIsTutorialOpen,
    isCharacterCreatorOpen, setIsCharacterCreatorOpen
  } = useModals(!savedData.current);
  const [hitAnimatingId, setHitAnimatingId] = useState<string | null>(null);

  const [isEnemyTransitioning, setIsEnemyTransitioning] = useState<boolean>(false);

  const activeCombatant = combatState.combatants[combatState.activeCombatantId] || hero;
  const heroUnit = combatState.combatants[hero.id] || hero;
  const isPlayerTurn = combatState.status === 'IN_PROGRESS' && activeCombatant?.type === 'HERO' && !isEnemyTransitioning;

  const activeEnemy = Object.values(combatState.combatants).find((c) => c.type === 'ENEMY' && !c.isDead) ||
    Object.values(combatState.combatants).find((c) => c.type === 'ENEMY') || null;

  const [screenShake, setScreenShake] = useState<'light' | 'heavy' | null>(null);
  const [isMarching, setIsMarching] = useState<boolean>(false);
  const [travelTransition, setTravelTransition] = useState<{
    active: boolean;
    destinationName: string;
    floorTitle: string;
    nodeId: string;
  } | null>(null);

  const [windowWidth, setWindowWidth] = useState<number>(() => (typeof window !== 'undefined' ? window.innerWidth : 1024));

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < 768;

  const triggerScreenShake = useCallback((type: 'light' | 'heavy') => {
    setScreenShake(type);
    setTimeout(() => setScreenShake(null), 400);
  }, []);

  const triggerMarch = useCallback(() => {
    setIsMarching(true);
    setTimeout(() => setIsMarching(false), 1200);
  }, []);

  const triggerVfx = useCallback((type: BattleVfxType, targetId: string, damage?: number) => {
    setActiveVfx({ id: `vfx-${Date.now()}`, type, targetId, damage });
    const duration = type === 'DEATH_EXPLOSION' ? 1000 : 600;
    setTimeout(() => setActiveVfx(null), duration);
  }, []);

  // Save persistent meta progression whenever it changes
  useEffect(() => {
    saveMetaProgression(metaProgression);
  }, [metaProgression]);

  // Auto-Save after state changes
  useEffect(() => {
    saveGame({
      version: 3,
      timestamp: Date.now(),
      saveName: `${hero.name} Run`,
      hero,
      progression,
      gold,
      potions,
      dungeon,
      battlesWon: 1,
      battlesLost: 0,
      metaProgression,
    });
  }, [hero, progression, gold, potions, dungeon, metaProgression]);

  // Clear floating texts automatically
  useEffect(() => {
    if (combatState.floatingTexts.length > 0) {
      const timer = setTimeout(() => {
        setCombatState((prev) => ({ ...prev, floatingTexts: [] }));
      }, 1400);
      return () => clearTimeout(timer);
    }
  }, [combatState.floatingTexts.length]);

  // Dynamic Background Music (BGM) Controller:
  // - FIGHT music: Plays strictly when actively battling in combat (!isDungeonMapActive && combatState.status === 'IN_PROGRESS' && no active modal)
  // - SHOP music: Plays during all other times (dungeon exploration, shop, sanctum, character creation, victory/rewards, rest sites)
  useEffect(() => {
    const isModalOpen =
      isCharacterCreatorOpen ||
      isSanctumOpen ||
      isShopOpen ||
      isCampfireOpen ||
      isShrineOpen ||
      isLevelUpOpen ||
      isCodexOpen ||
      isSkillTreeOpen ||
      isTrainerOpen ||
      isSettingsOpen ||
      Boolean(activeDungeonEvent) ||
      Boolean(victoryLoot);

    const inActiveFight = !isDungeonMapActive && combatState.status === 'IN_PROGRESS' && !isModalOpen;
    if (inActiveFight) {
      soundFx.playBgm('FIGHT');
    } else {
      soundFx.playBgm('SHOP');
    }
  }, [
    isDungeonMapActive,
    combatState.status,
    isCharacterCreatorOpen,
    isSanctumOpen,
    isShopOpen,
    isCampfireOpen,
    isShrineOpen,
    isLevelUpOpen,
    isCodexOpen,
    isSkillTreeOpen,
    isTrainerOpen,
    isSettingsOpen,
    activeDungeonEvent,
    victoryLoot,
  ]);

  // Helper to handle all Victory rewards, loot, card drafting, Aetherium, and EXP
  const triggerVictoryRewards = useCallback(
    (nextCombatants: Record<string, Combatant>) => {
      const defeatedEnemies = Object.values(nextCombatants).filter((c) => c.type === 'ENEMY');
      const loot = generateEncounterLoot(defeatedEnemies, hero, rng);
      loot.gold = calculateRelicGoldBonus(loot.gold, relics);
      setVictoryLoot(loot);

      const currentNode = dungeon.currentNodeId ? dungeon.floor.nodes[dungeon.currentNodeId] : null;
      const isElite = currentNode?.type === 'ELITE';
      const isBoss = currentNode?.type === 'BOSS';
      const shardReward = isBoss ? 50 : isElite ? 25 : 15;

      // Grant Aetherium & record monsters slain
      setMetaProgression((m) => ({
        ...m,
        aetherium: m.aetherium + shardReward,
        lifetimeAetherium: m.lifetimeAetherium + shardReward,
        totalMonstersSlain: m.totalMonstersSlain + defeatedEnemies.length,
      }));

      const expResult = addExpToHero(hero, progression, loot.exp);
      setHero(expResult.hero);
      setProgression(expResult.progression);
      soundFx.playVictory();
      soundFx.playCoinJingle();
      if (expResult.leveledUp) {
        setIsLevelUpOpen(true);
      }
    },
    [hero, rng, relics, progression, dungeon]
  );

  // Handles multi-phase enemy death:
  // Phase 1 (0.0s - 2.0s): Explode where enemy was with explosion.wav & visual death explosion
  // Phase 2 (2.0s - 4.0s): Wait 2 seconds before spawning next enemy with walk.wav, or signal finish round with walk.wav
  const handleProcessEnemyDeath = useCallback(
    (
      deadEnemy: Combatant,
      currentCombatants: Record<string, Combatant>,
      currentEnemyQueue: Combatant[],
      currentHero: Combatant,
      currentDeck: DeckState,
      additionalLogs: CombatLogEntry[] = [],
      additionalFloatingTexts: FloatingText[] = []
    ) => {
      // 1. Play death explosion sound & visual explosion
      soundFx.playExplosion();
      triggerScreenShake('heavy');
      triggerVfx('DEATH_EXPLOSION', deadEnemy.id, 50);
      setIsEnemyTransitioning(true);
      setEnemyIntent(null);

      // On-Kill Relic Processing (Vampire Bloodstone, Necrotic Urn, Soul Harvester)
      let nextHeroState = currentHero;
      let nextDeckState = currentDeck;
      const killRelics = applyOnKillRelics([nextHeroState], relics, deadEnemy);
      if (killRelics.party[0]) {
        nextHeroState = killRelics.party[0];
        setHero(nextHeroState);
      }
      if (killRelics.energyGain > 0 || killRelics.drawCards > 0) {
        soundFx.playVictory();
        let nextDraw = [...nextDeckState.drawPile];
        let nextHand = [...nextDeckState.hand];
        for (let i = 0; i < killRelics.drawCards; i++) {
          if (nextDraw.length > 0) {
            const drawn = nextDraw.pop()!;
            nextHand.push(drawn);
          }
        }
        nextDeckState = {
          ...nextDeckState,
          currentEnergy: nextDeckState.currentEnergy + killRelics.energyGain,
          hand: nextHand,
          drawPile: nextDraw,
        };
        setDeckState(nextDeckState);
      }

      const updatedCombatants: Record<string, Combatant> = {
        ...currentCombatants,
        [deadEnemy.id]: { ...deadEnemy, isDead: true, currentHp: 0 },
        [hero.id]: nextHeroState,
      };

      setCombatState((prev) => ({
        ...prev,
        combatants: updatedCombatants,
        log: [...prev.log, ...additionalLogs],
        floatingTexts: [...prev.floatingTexts, ...additionalFloatingTexts],
      }));

      // Phase 1: 1-second visual explosion
      setTimeout(() => {
        if (currentEnemyQueue.length > 0) {
          // Phase 2: Wait 1 second before next enemy spawns
          setTimeout(() => {
            // Signal to walk and step forward
            soundFx.playWalk();
            triggerMarch();

            const nextMon = currentEnemyQueue[0];
            const remainingQueue = currentEnemyQueue.slice(1);
            const nextActiveCombatants: Record<string, Combatant> = {
              ...updatedCombatants,
              [nextMon.id]: {
                ...nextMon,
                isDead: false,
                isDefending: false,
                abilityCooldowns: {},
                statusEffects: [],
                shieldHp: 0,
              },
            };

            setCombatState((prev) => ({
              ...prev,
              combatants: nextActiveCombatants,
              enemyQueue: remainingQueue,
              activeCombatantId: hero.id,
              selectedTargetId: nextMon.id,
            }));

            // Reset deck hand for next turn
            setDeckState(startTurnDeck(nextDeckState, rng));
            setIsEnemyTransitioning(false);
          }, 1000);
        } else {
          // All enemies in the room defeated: Signal to walk and finish the round
          soundFx.playWalk();
          triggerMarch();

          const status = checkCombatOutcome(updatedCombatants, []);
          if (status === 'VICTORY') {
            triggerVictoryRewards(updatedCombatants);
          }

          setCombatState((prev) => ({
            ...prev,
            status: 'VICTORY',
            activeCombatantId: hero.id,
          }));

          setIsEnemyTransitioning(false);
        }
      }, 1000);
    },
    [hero.id, relics, rng, triggerScreenShake, triggerVfx, triggerMarch, triggerVictoryRewards]
  );

  // Calculate & Telegraph Enemy Intent when it is player turn
  useEffect(() => {
    if (combatState.status === 'IN_PROGRESS' && activeEnemy && isPlayerTurn && !enemyIntent) {
      const intent = calculateEnemyIntent(activeEnemy, hero, combatState.round, rng);
      setEnemyIntent(intent);
    }
  }, [combatState.status, isPlayerTurn, activeEnemy, hero, combatState.round, rng, enemyIntent]);

  // Handle Enemy Turn Execution (including turn-start DoTs, Stun/Freeze CC, Intent execution, and Death/Victory handling)
  useEffect(() => {
    if (combatState.status !== 'IN_PROGRESS' || isPlayerTurn || isEnemyTransitioning) {
      return;
    }

    // Safety fallback: If there is no active enemy or active enemy is already dead
    if (!activeEnemy || activeEnemy.isDead || activeEnemy.currentHp <= 0) {
      return;
    }

    const timer = setTimeout(() => {
      // 1. Process Status Effects (Poison, Burn, Bleed, Corrosion, Stun, Freeze)
      const tickResult = processTurnStartStatuses(activeEnemy, combatState.round);
      const enemyAfterTick = tickResult.combatant;

      // Enemy DIED from DoTs (Poison, Burn, Bleed, Corrosion)
      if (enemyAfterTick.isDead || enemyAfterTick.currentHp <= 0) {
        handleProcessEnemyDeath(
          enemyAfterTick,
          {
            ...combatState.combatants,
            [activeEnemy.id]: enemyAfterTick,
            [hero.id]: hero,
          },
          combatState.enemyQueue,
          hero,
          deckState,
          tickResult.logs,
          tickResult.floatingTexts
        );
        return;
      }

      // 2. Enemy is STUNNED or FROZEN - Skip Action
      if (tickResult.shouldSkipTurn) {
        setCombatState((prev) => {
          const nextCombatants = {
            ...prev.combatants,
            [activeEnemy.id]: enemyAfterTick,
          };
          return {
            ...prev,
            combatants: nextCombatants,
            log: [...prev.log, ...tickResult.logs],
            floatingTexts: [...prev.floatingTexts, ...tickResult.floatingTexts],
          };
        });

        // Clear intent and pass turn back to player
        setEnemyIntent(null);
        setDeckState((prev) => startTurnDeck(prev, rng));
        setCombatState((prev) => advanceCombatTurn(prev, rng));
        return;
      }

      // 3. Enemy is ALIVE and CAN ACT - Execute Intent
      const intent = enemyIntent || calculateEnemyIntent(enemyAfterTick, hero, combatState.round, rng);

      if (intent.type === 'ATTACK' || intent.type === 'DEBUFF' || intent.type === 'SPECIAL') {
        soundFx.playAttack();
        setHitAnimatingId(hero.id);
        const isHeavy = (intent.damage && intent.damage >= 14) || intent.type === 'SPECIAL';
        triggerScreenShake(isHeavy ? 'heavy' : 'light');
        triggerVfx(intent.type === 'SPECIAL' ? 'FIRE' : 'SLASH', hero.id, intent.damage || 8);
        setTimeout(() => setHitAnimatingId(null), 450);
      } else if (intent.type === 'DEFEND') {
        soundFx.playDefend();
      } else if (intent.type === 'HEAL') {
        soundFx.playHeal();
        triggerVfx('HOLY', activeEnemy.id, 10);
      }

      const execResult = executeEnemyIntent(enemyAfterTick, hero, intent, combatState.round, rng);

      // Check if Hero shield broke
      if (hero.shieldHp > 0 && execResult.nextHero.shieldHp <= 0) {
        soundFx.playShieldBreak();
        triggerVfx('SHIELD_BREAK', hero.id);
      }

      setHero(execResult.nextHero);
      setCombatState((prev) => {
        const nextCombatants = {
          ...prev.combatants,
          [activeEnemy.id]: execResult.nextEnemy,
          [hero.id]: execResult.nextHero,
        };

        let nextEnemyQueue = [...prev.enemyQueue];

        // If enemy died from Thorns / retaliation during attack
        if (execResult.nextEnemy.isDead) {
          if (nextEnemyQueue.length > 0) {
            const nextMon = nextEnemyQueue[0];
            nextEnemyQueue = nextEnemyQueue.slice(1);
            nextCombatants[nextMon.id] = {
              ...nextMon,
              isDead: false,
              isDefending: false,
              abilityCooldowns: {},
              statusEffects: [],
              shieldHp: 0,
            };
          }
        }

        const status = checkCombatOutcome(nextCombatants, nextEnemyQueue);
        if (status === 'VICTORY') {
          triggerVictoryRewards(nextCombatants);
        }

        return {
          ...prev,
          status,
          combatants: nextCombatants,
          enemyQueue: nextEnemyQueue,
          selectedTargetId: Object.values(nextCombatants).find((c) => c.type === 'ENEMY' && !c.isDead)?.id || null,
          log: [...prev.log, ...tickResult.logs, ...execResult.logs],
          floatingTexts: [...prev.floatingTexts, ...tickResult.floatingTexts, ...execResult.floatingTexts],
        };
      });

      // Clear executed intent and start next player turn
      setEnemyIntent(null);

      // Start Player Turn: Reset Energy & Draw Cards with SFX
      soundFx.playTurnStart();
      soundFx.playCardDraw();
      setDeckState((prev) => startTurnDeck(prev, rng));

      // Advance round
      setCombatState((prev) => advanceCombatTurn(prev, rng));
    }, 750);

    return () => clearTimeout(timer);
  }, [
    combatState.status,
    isPlayerTurn,
    activeEnemy,
    hero,
    combatState.round,
    enemyIntent,
    rng,
    relics,
    deckState,
    triggerVfx,
    triggerScreenShake,
    triggerVictoryRewards,
  ]);

  // Player Plays a Card
  const handlePlayCard = useCallback(
    (card: CombatCard) => {
      if (!isPlayerTurn || !activeEnemy || activeEnemy.isDead) return;

      const result = playCombatCard(deckState, card.id, hero, activeEnemy, combatState.round, rng, relics);

      if (!result.success) return;

      soundFx.playCardPlay(card.type);

      // Trigger Screen Shake & VFX based on card type & power
      if (card.type === 'ATTACK') {
        setHitAnimatingId(activeEnemy.id);
        const hasBleed = card.statusEffects?.some((s) => s.effectId === 'BLEEDING');
        const isHeavyAttack = (card.damage && card.damage >= 14) || hasBleed;
        triggerScreenShake(isHeavyAttack ? 'heavy' : 'light');

        const initialTargetHealth = activeEnemy.currentHp + (activeEnemy.shieldHp || 0);
        const nextTargetHealth = result.nextTarget.currentHp + (result.nextTarget.shieldHp || 0);
        const damageDealt = Math.max(1, initialTargetHealth - nextTargetHealth) || card.damage || card.magicDamage || 8;

        if (card.element === 'FIRE') {
          triggerVfx('FIRE', activeEnemy.id, damageDealt);
        } else if (card.element === 'ICE') {
          triggerVfx('FROST', activeEnemy.id, damageDealt);
        } else if (card.element === 'LIGHTNING') {
          triggerVfx('SHOCK', activeEnemy.id, damageDealt);
        } else if (hasBleed) {
          triggerVfx('BLEED', activeEnemy.id, damageDealt);
        } else {
          triggerVfx('SLASH', activeEnemy.id, damageDealt);
        }
        setTimeout(() => setHitAnimatingId(null), 400);
      } else if (card.type === 'SKILL' && card.heal) {
        soundFx.playHeal();
        triggerVfx('HOLY', hero.id, card.heal);
      } else if (card.type === 'SKILL' && card.block) {
        soundFx.playDefend();
      } else if (card.type === 'POWER') {
        triggerVfx('BUFF_AURA', hero.id, 12);
      }

      // Check Shield Break
      if (activeEnemy.shieldHp > 0 && result.nextTarget.shieldHp <= 0) {
        soundFx.playShieldBreak();
        triggerVfx('SHIELD_BREAK', activeEnemy.id);
      }

      let nextHeroState = result.nextHero;
      let nextDeckState = result.nextDeck;

      // On-Kill Relic Processing (Vampire Bloodstone, Necrotic Urn, Soul Harvester)
      if (result.nextTarget.isDead) {
        const killRelics = applyOnKillRelics([nextHeroState], relics, result.nextTarget);
        if (killRelics.party[0]) {
          nextHeroState = killRelics.party[0];
        }
        if (killRelics.energyGain > 0 || killRelics.drawCards > 0) {
          soundFx.playVictory();
          let nextDraw = [...nextDeckState.drawPile];
          let nextHand = [...nextDeckState.hand];
          for (let i = 0; i < killRelics.drawCards; i++) {
            if (nextDraw.length > 0) {
              const drawn = nextDraw.pop()!;
              nextHand.push(drawn);
            }
          }
          nextDeckState = {
            ...nextDeckState,
            currentEnergy: nextDeckState.currentEnergy + killRelics.energyGain,
            hand: nextHand,
            drawPile: nextDraw,
          };
        }
      }

      setDeckState(nextDeckState);
      setHero(nextHeroState);

      // Enemy Defeated: Trigger 2-second explosion and delayed reserve spawn
      if (result.nextTarget.isDead) {
        handleProcessEnemyDeath(
          result.nextTarget,
          {
            ...combatState.combatants,
            [hero.id]: nextHeroState,
            [activeEnemy.id]: result.nextTarget,
          },
          combatState.enemyQueue,
          nextHeroState,
          nextDeckState,
          result.logs,
          result.floatingTexts
        );
        return;
      }

      setCombatState((prev) => {
        const nextCombatants = {
          ...prev.combatants,
          [hero.id]: nextHeroState,
          [activeEnemy.id]: result.nextTarget,
        };

        const status = checkCombatOutcome(nextCombatants, prev.enemyQueue);
        if (status === 'VICTORY') {
          triggerVictoryRewards(nextCombatants);
        }

        return {
          ...prev,
          status,
          combatants: nextCombatants,
          selectedTargetId: Object.values(nextCombatants).find((c) => c.type === 'ENEMY' && !c.isDead)?.id || null,
          log: [...prev.log, ...result.logs],
          floatingTexts: [...prev.floatingTexts, ...result.floatingTexts],
        };
      });
    },
    [isPlayerTurn, activeEnemy, deckState, hero, combatState.round, rng, relics, triggerVfx, triggerScreenShake, handleProcessEnemyDeath, triggerVictoryRewards]
  );

  // Player Ends Turn
  const handleEndTurn = useCallback(() => {
    if (!isPlayerTurn) return;

    soundFx.playClick();
    const discardedDeck = endTurnDeck(deckState);
    setDeckState(discardedDeck);

    // Pass turn to enemy
    setCombatState((prev) => ({
      ...prev,
      activeCombatantId: activeEnemy ? activeEnemy.id : prev.activeCombatantId,
    }));
  }, [isPlayerTurn, deckState, activeEnemy]);

  const executeEnterDungeonCombat = (nodeId: string) => {
    const node = dungeon.floor.nodes[nodeId];
    if (!node) return;

    // Build dynamic thematic enemy squad
    const isBoss = node.type === 'BOSS';
    const isElite = node.type === 'ELITE';
    const enemySquad: Combatant[] = generateSquadForNode(
      dungeon.currentFloor,
      isElite,
      isBoss,
      node.bossId,
      rng
    );

    // Apply Dynamic Floor Scaling & Monster Affixes
    const newAffixes: Record<string, MonsterAffixType[]> = {};
    const configuredSquad = enemySquad.map((mon) => {
      const scaleResult = scaleEnemyForFloor(mon, dungeon.currentFloor, isElite, isBoss, rng, node.step || 0);
      newAffixes[mon.id] = scaleResult.affixes as MonsterAffixType[];
      return scaleResult.enemy;
    });

    setEnemyAffixes(newAffixes);

    // Field 1 Hero with Relics - Clear combat-only status effects and reset temporary shield to baseline meta Bastion
    const startingBastionShield = (metaProgression.upgradeRanks?.bastion || 0) * 6;
    const freshHero: Combatant = {
      ...hero,
      statusEffects: [],
      shieldHp: startingBastionShield,
      abilityCooldowns: {},
    };
    setHero(freshHero);

    const readyHero = applyStartOfCombatRelics([freshHero], relics)[0];
    const readySquad = applyStartOfCombatEnemyRelics(configuredSquad, relics);
    const newCombat = createInitialCombatState([readyHero], readySquad, rng);
    setCombatState(newCombat);

    // Reset fresh deck for battle and play start audio
    const baseMaxEnergy = 3 + (metaProgression.upgradeRanks?.celestial_core || 0);
    const turnOneBonus = (metaProgression.upgradeRanks?.wellspring || 0);
    const freshBattleDeck = startTurnDeck(
      {
        ...deckState,
        maxEnergy: baseMaxEnergy,
        currentEnergy: baseMaxEnergy + turnOneBonus,
        drawPile: [...deckState.fullDeck],
        hand: [],
        discardPile: [],
        exhaustPile: [],
      },
      rng
    );
    setDeckState(freshBattleDeck);

    soundFx.playTurnStart();
    soundFx.playCardDraw();

    // Initial Enemy Intent
    const firstIntent = calculateEnemyIntent(readySquad[0], readyHero, 1, rng);
    setEnemyIntent(firstIntent);

    setIsDungeonMapActive(false);
  };

  // Dungeon: Select and Enter Node with Travel Transition
  const handleSelectDungeonNode = (nodeId: string) => {
    const updatedDungeon = selectDungeonNode(dungeon, nodeId);
    setDungeon(updatedDungeon);

    const node = updatedDungeon.floor.nodes[nodeId];
    if (!node) return;

    if (node.type === 'CAMPFIRE') {
      soundFx.playClick();
      setIsCampfireOpen(true);
      return;
    }

    if (node.type === 'SHRINE') {
      soundFx.playClick();
      setIsShrineOpen(true);
      return;
    }

    if (node.type === 'EVENT') {
      soundFx.playClick();
      const randomEvent = DUNGEON_EVENTS[Math.floor(Math.random() * DUNGEON_EVENTS.length)];
      setActiveDungeonEvent(randomEvent);
      return;
    }

    if (node.type === 'SHOP') {
      soundFx.playClick();
      setIsShopOpen(true);
      return;
    }

    // Trigger Bouncing / Marching Travel Transition
    soundFx.playWalk();
    setTravelTransition({
      active: true,
      destinationName: node.name,
      floorTitle: dungeon.floor.name,
      nodeId,
    });
  };

  // Dungeon Event Resolution
  const handleSelectEventChoice = (choice: DungeonEventChoice) => {
    soundFx.playVictory();

    if (choice.cost?.gold) {
      setGold((prev) => Math.max(0, prev - choice.cost!.gold!));
    }

    if (choice.reward.relicId) {
      const acquiredRelic = RELICS_CATALOG[choice.reward.relicId];
      if (acquiredRelic && !relics.some((r) => r.id === acquiredRelic.id)) {
        setRelics((prev) => [...prev, acquiredRelic]);
      }
    }

    if (choice.reward.gold) {
      setGold((prev) => prev + choice.reward.gold!);
    }

    if (choice.reward.hpPercent) {
      setHero((prev) => ({
        ...prev,
        currentHp: Math.min(prev.maxHp, prev.currentHp + Math.round((prev.maxHp * choice.reward.hpPercent!) / 100)),
      }));
    }

    if (dungeon.currentNodeId) {
      setDungeon((prev) => completeDungeonNode(prev, prev.currentNodeId!));
    }
    setActiveDungeonEvent(null);
  };

  // Campfire Actions
  const handleCampfireRestHp = () => {
    soundFx.playHeal();
    setHero((prev) => ({
      ...prev,
      currentHp: Math.min(prev.maxHp, prev.currentHp + Math.round(prev.maxHp * 0.5)),
    }));
    if (dungeon.currentNodeId) {
      setDungeon((prev) => completeDungeonNode(prev, prev.currentNodeId!));
    }
    setIsCampfireOpen(false);
  };

  const handleCampfireMeditateMana = () => {
    soundFx.playMagicSpell();
    setHero((prev) => ({ ...prev, currentMana: prev.maxMana }));
    if (dungeon.currentNodeId) {
      setDungeon((prev) => completeDungeonNode(prev, prev.currentNodeId!));
    }
    setIsCampfireOpen(false);
  };

  const handleCampfireSharpenWeapon = () => {
    soundFx.playClick();
    setHero((prev) => ({ ...prev, shieldHp: (prev.shieldHp || 0) + 100 }));
    if (dungeon.currentNodeId) {
      setDungeon((prev) => completeDungeonNode(prev, prev.currentNodeId!));
    }
    setIsCampfireOpen(false);
  };

  const handleCampfireUpgradeCard = (card: CombatCard) => {
    soundFx.playVictory();
    const upgraded = upgradeCombatCard(card);
    setDeckState((prev) => {
      const nextFullDeck = prev.fullDeck.map((c) => (c.id === card.id ? upgraded : c));
      return {
        ...prev,
        fullDeck: nextFullDeck,
        drawPile: prev.drawPile.map((c) => (c.id === card.id ? upgraded : c)),
        hand: prev.hand.map((c) => (c.id === card.id ? upgraded : c)),
        discardPile: prev.discardPile.map((c) => (c.id === card.id ? upgraded : c)),
      };
    });
    if (dungeon.currentNodeId) {
      setDungeon((prev) => completeDungeonNode(prev, prev.currentNodeId!));
    }
    setIsCampfireOpen(false);
  };

  // Shrine Action
  const handleShrineBlessing = () => {
    soundFx.playVictory();
    setHero((prev) => ({
      ...prev,
      currentHp: Math.min(prev.maxHp, prev.currentHp + 50),
      shieldHp: (prev.shieldHp || 0) + 80,
    }));
    setGold((prev) => prev + 40);
    if (dungeon.currentNodeId) {
      setDungeon((prev) => completeDungeonNode(prev, prev.currentNodeId!));
    }
    setIsShrineOpen(false);
  };

  // Progression: Stat Point Allocation
  const handleAllocateStat = (stat: keyof PrimaryStats) => {
    soundFx.playClick();
    const result = allocateStatPoint(hero, progression, stat);
    setProgression(result.progression);
    setHero(result.hero);
  };

  // Progression: Skill Tree Unlock
  const handleUnlockSkillNode = (nodeId: string) => {
    soundFx.playMagicSpell();
    const result = unlockSkillNode(hero, progression, nodeId);
    if (result.success) {
      setProgression(result.progression);
      setHero(result.hero);
    }
  };

  // Martial Skill Trainer: Spend gold to train attributes
  const handleTrainAttribute = (statKey: keyof PrimaryStats, cost: number) => {
    if (gold < cost) return;
    const updatedPrimary: PrimaryStats = {
      ...hero.primaryStats,
      [statKey]: (hero.primaryStats[statKey] || 0) + 1,
    };
    const updatedDerived = calculateDerivedStats(updatedPrimary, hero.level);
    let updatedMaxHp = hero.maxHp;
    let updatedHp = hero.currentHp;
    if (statKey === 'vitality') {
      updatedMaxHp += 8;
      updatedHp += 8;
    }
    setGold((prev) => prev - cost);
    setHero((prev) => ({
      ...prev,
      primaryStats: updatedPrimary,
      derivedStats: updatedDerived,
      maxHp: updatedMaxHp,
      currentHp: updatedHp,
    }));
  };

  // Consumables: Use Potion / Elixir / Bomb / Scroll (Combat Quick-Bar)
  const handleUseConsumable = useCallback(
    (item: Item, index: number) => {
      // Remove the potion at the given index from the belt
      setPotions((prev) => prev.filter((_, i) => i !== index));

      // Out-of-combat use (dungeon map or campfire)
      if (isDungeonMapActive || combatState.status !== 'IN_PROGRESS') {
        if (item.consumableEffect?.type === 'HEAL_HP') {
          soundFx.playHeal();
          setHero((prev) => ({
            ...prev,
            currentHp: Math.min(prev.maxHp, prev.currentHp + item.consumableEffect!.value),
          }));
        } else if (item.consumableEffect?.type === 'CURE_STATUS') {
          soundFx.playHeal();
          setHero((prev) => ({
            ...prev,
            statusEffects: prev.statusEffects.filter(
              (s) =>
                s.type !== 'POISON' &&
                s.type !== 'BLEEDING' &&
                s.type !== 'BURNING' &&
                s.type !== 'CORROSION'
            ),
          }));
        }
        return;
      }

      // In-combat use — only allowed on player turn
      if (!isPlayerTurn) return;

      // (Potion was already removed from belt at start of handler)

      // Execute item action (actor = hero, target = enemy for bombs/debuffs, hero for heals/shields)
      const itemResult = executeItemAction(
        hero,
        activeEnemy || hero,
        item,
        combatState.round,
        rng
      );

      // Sound and Visual FX
      const heroId = hero.id;
      const enemyId = activeEnemy?.id ?? hero.id;
      if (item.consumableEffect?.type === 'HEAL_HP') {
        soundFx.playHeal();
        triggerVfx('HOLY', heroId);
      } else if (item.consumableEffect?.type === 'RESTORE_SHIELD') {
        soundFx.playHeal();
        triggerVfx('HOLY', heroId, item.consumableEffect.value);
      } else if (item.consumableEffect?.type === 'RESTORE_ENERGY' || item.consumableEffect?.type === 'HEAL_MANA') {
        soundFx.playMagicSpell();
        triggerVfx('HOLY', heroId);
      } else if (item.consumableEffect?.type === 'DAMAGE_ENEMY' && enemyId) {
        soundFx.playAttack();
        triggerVfx(
          item.consumableEffect.damageElement === 'FIRE' ? 'FIRE' : 'LIGHTNING',
          enemyId,
          item.consumableEffect.value
        );
      } else if (item.consumableEffect?.type === 'DRAW_CARDS') {
        soundFx.playMagicSpell();
        triggerVfx('HOLY', heroId, 8);
      } else {
        soundFx.playHeal();
        triggerVfx('HOLY', heroId, item.consumableEffect?.value || 10);
      }

      // Apply hero stats update
      setHero(itemResult.nextActor);

      // Energy gain
      if (itemResult.energyGained) {
        setDeckState((prev) => ({
          ...prev,
          currentEnergy: Math.min(prev.maxEnergy + 2, prev.currentEnergy + itemResult.energyGained!),
        }));
      }

      // Card draw
      if (itemResult.cardsGained) {
        setDeckState((prev) => drawCards(prev, itemResult.cardsGained!, rng));
      }

      // Update combat state (hero + enemy combatants, logs, floating texts)
      setCombatState((prev) => {
        const nextCombatants = {
          ...prev.combatants,
          [hero.id]: itemResult.nextActor,
        };
        // Update enemy if it was a target (bomb/flask)
        if (activeEnemy && itemResult.nextTarget.id === activeEnemy.id) {
          nextCombatants[activeEnemy.id] = itemResult.nextTarget;
        }

        return {
          ...prev,
          combatants: nextCombatants,
          log: [...prev.log, ...itemResult.logs],
          floatingTexts: [...prev.floatingTexts, ...itemResult.floatingTexts],
        };
      });

      // Handle enemy killed by throwable bomb
      if (
        activeEnemy &&
        itemResult.nextTarget.id === activeEnemy.id &&
        (itemResult.nextTarget.isDead || itemResult.nextTarget.currentHp <= 0)
      ) {
        soundFx.playDefeat();

        // Apply on-kill relics
        const killResult = applyOnKillRelics([hero], relics, itemResult.nextTarget);
        if (killResult.party[0]) setHero(killResult.party[0]);

        // Queue next monster or trigger victory
        setCombatState((prev) => {
          const nextCombatants = { ...prev.combatants, [activeEnemy.id]: itemResult.nextTarget };
          const nextQueue = [...prev.enemyQueue];
          if (nextQueue.length > 0) {
            const nextMon = nextQueue.shift()!;
            nextCombatants[nextMon.id] = { ...nextMon, isDead: false, isDefending: false, statusEffects: [], shieldHp: 0 };
            triggerMarch();
            setDeckState((d) => startTurnDeck(d, rng));
            setEnemyIntent(null);
            return {
              ...prev,
              combatants: nextCombatants,
              enemyQueue: nextQueue,
              activeCombatantId: hero.id,
              selectedTargetId: nextMon.id,
            };
          } else {
            triggerVictoryRewards(nextCombatants);
            return { ...prev, combatants: nextCombatants, status: 'VICTORY' };
          }
        });
      }
    },
    [
      isDungeonMapActive,
      combatState,
      isPlayerTurn,
      hero,
      activeEnemy,
      relics,
      rng,
      triggerVfx,
      triggerVictoryRewards,
    ]
  );

  // Shop: Purchase Card / Relic / Potion / Services
  const handleShopBuyCard = (card: CombatCard, cost: number) => {
    if (gold < cost) return;
    soundFx.playClick();
    setGold((prev) => prev - cost);
    setDeckState((prev) => ({
      ...prev,
      fullDeck: [...prev.fullDeck, card],
      drawPile: [...prev.drawPile, card],
    }));
  };

  const handleShopBuyRelic = (relicId: string, cost: number) => {
    if (gold < cost) return;
    soundFx.playClick();
    const relic = RELICS_CATALOG[relicId as RelicId];
    if (relic && !relics.some((r) => r.id === relic.id)) {
      setGold((prev) => prev - cost);
      setRelics((prev) => [...prev, relic]);
    }
  };

  const handleShopBuyPotion = (potion: Item, cost: number) => {
    if (gold < cost) return;
    soundFx.playClick();
    setGold((prev) => prev - cost);
    setPotions((prev) => [...prev, potion]);
  };

  const handleShopRemoveCard = (cardId: string, cost: number) => {
    if (gold < cost) return;
    soundFx.playClick();
    setGold((prev) => prev - cost);
    setDeckState((prev) => ({
      ...prev,
      fullDeck: prev.fullDeck.filter((c) => c.id !== cardId),
      drawPile: prev.drawPile.filter((c) => c.id !== cardId),
      hand: prev.hand.filter((c) => c.id !== cardId),
      discardPile: prev.discardPile.filter((c) => c.id !== cardId),
    }));
  };

  const handleShopUpgradeCard = (cardId: string, cost: number) => {
    if (gold < cost) return;
    soundFx.playClick();
    setGold((prev) => prev - cost);
    const upgradeCard = (c: CombatCard) => c.id === cardId ? upgradeCombatCard(c) : c;
    setDeckState((prev) => ({
      ...prev,
      fullDeck: prev.fullDeck.map(upgradeCard),
      drawPile: prev.drawPile.map(upgradeCard),
      hand: prev.hand.map(upgradeCard),
      discardPile: prev.discardPile.map(upgradeCard),
    }));
  };

  // Settings: Import Save
  const handleImportSaveData = (data: GameSaveData) => {
    setHero(data.hero);
    setProgression(data.progression);
    setGold(data.gold ?? data.inventory?.gold ?? 0);
    setPotions(data.potions ?? []);
    setDungeon(data.dungeon);
    if (data.metaProgression) {
      setMetaProgression(data.metaProgression);
    }
    setIsDungeonMapActive(true);
  };

  // Character Creator Confirmation: Start New Run
  const handleConfirmCharacter = (
    classId: CharacterClassId,
    name: string,
    selectedCards: string[],
    originBoon: OriginBoonId,
    allocatedStats?: PrimaryStats,
    selectedRelicIds?: string[]
  ) => {
    let rawHero = createHeroFromClass(classId, name, 'hero-1', 1, [], originBoon, allocatedStats);

    const extraGold = (metaProgression.upgradeRanks.gold || 0) * 35;
    let startingGold = extraGold;
    if (originBoon === 'fortune-favored') {
      startingGold += 50;
    }

    const boostedHero = applyMetaUpgradesToHero(rawHero, metaProgression);
    const freshDungeon = createInitialDungeonState(rng);

    const startingRelics = (selectedRelicIds && selectedRelicIds.length > 0)
      ? selectedRelicIds.map((id) => RELICS_CATALOG[id as RelicId]).filter(Boolean)
      : [RELICS_CATALOG['tome-ancient-ley']].filter(Boolean);

    const maxEnergyBoost = (metaProgression.upgradeRanks?.celestial_core || 0);
    const startingMaxEnergy = 3 + maxEnergyBoost;
    const freshDeck = createInitialDeck(classId, selectedCards, startingMaxEnergy);

    setHero(boostedHero);
    setDeckState(freshDeck);
    setProgression(createInitialProgression());
    setGold(startingGold);
    setPotions([]);
    setDungeon(freshDungeon);
    setRelics(startingRelics);
    setCombatState(createInitialCombatState([boostedHero], [createGoblinScout()], rng));

    setMetaProgression((prev) => ({
      ...prev,
      totalRunsStarted: prev.totalRunsStarted + 1,
    }));

    setIsCharacterCreatorOpen(false);
    setIsDungeonMapActive(true);
  };

  // Settings: Reset Run
  const handleResetRun = () => {
    deleteSave();
    try {
      localStorage.removeItem('hasSeenTutorial');
    } catch {
      // ignore
    }
    setIsSettingsOpen(false);
    setIsCharacterCreatorOpen(true);
  };

  // Settings: End / Abandon Run (Give Up)
  const handleAbandonRun = () => {
    const shardBonusPct = relics.reduce((acc, r) => acc + (r.effect.extraShardMultiplierPercent || 0), 0);
    const rawReward = calculateRunAetheriumReward(dungeon.currentFloor, metaProgression.totalMonstersSlain, false, false);
    const runReward = Math.round(rawReward * (1 + shardBonusPct / 100));
    setMetaProgression((prev) => ({
      ...prev,
      aetherium: prev.aetherium + runReward,
      lifetimeAetherium: prev.lifetimeAetherium + runReward,
    }));
    deleteSave();
    soundFx.playDefend();
    setIsSettingsOpen(false);
    setIsDungeonMapActive(false);
    setIsCharacterCreatorOpen(true);
  };

  // Meta-Progression Shop Upgrades
  const handlePurchaseMetaUpgrade = (upgradeId: MetaUpgradeId) => {
    const result = purchaseMetaUpgrade(metaProgression, upgradeId);
    if (result.success) {
      setMetaProgression(result.nextState);

      // Immediately upgrade active hero stats in real-time
      const updatedHero = applyMetaUpgradesToHero(hero, result.nextState);
      setHero(updatedHero);

      // Update in active combatants if in combat
      setCombatState((prev) => ({
        ...prev,
        combatants: {
          ...prev.combatants,
          [hero.id]: updatedHero,
        },
      }));

      // Grant instant bonuses if purchased during run
      if (upgradeId === 'attunement') {
        setProgression((prev) => ({
          ...prev,
          unallocatedStatPoints: prev.unallocatedStatPoints + 2,
        }));
      } else if (upgradeId === 'gold') {
        setGold((prev) => prev + 35);
      } else if (upgradeId === 'capacity') {
        const potion = ITEMS_CATALOG['lesser-healing-potion'];
        if (potion) {
          setPotions((prev) => [...prev, potion]);
        }
      } else if (upgradeId === 'celestial_core') {
        const newMaxEnergy = 3 + (result.nextState.upgradeRanks?.celestial_core || 0);
        setDeckState((prev) => ({
          ...prev,
          maxEnergy: newMaxEnergy,
          currentEnergy: Math.max(prev.currentEnergy, newMaxEnergy),
        }));
      }
    }
  };

  const handleUnlockMetaClass = (classId: CharacterClassId) => {
    const result = unlockMetaClass(metaProgression, classId);
    if (result.success) {
      setMetaProgression(result.nextState);
    }
  };

  const handleUnlockMetaCard = (cardId: string) => {
    const result = unlockMetaCard(metaProgression, cardId);
    if (result.success) {
      setMetaProgression(result.nextState);
    }
  };

  const handleUnlockMetaRelic = (relicId: string) => {
    const result = unlockMetaRelic(metaProgression, relicId);
    if (result.success) {
      setMetaProgression(result.nextState);
    }
  };

  // Finish Battle Node and return to Dungeon Map
  const finishBattleNodeAndReturnToMap = useCallback(() => {
    // Clear temporary combat status effects and reset shield to baseline meta Bastion
    const baseBastionShield = (metaProgression.upgradeRanks?.bastion || 0) * 6;
    setHero((prev) => ({
      ...prev,
      statusEffects: [],
      shieldHp: baseBastionShield,
    }));

    // Reset combat state back to ready idle
    setCombatState(createInitialCombatState([hero], [createGoblinScout()], rng));

    if (dungeon.currentNodeId) {
      const isBossNode = dungeon.floor.nodes[dungeon.currentNodeId]?.type === 'BOSS';
      let nextDungeon = completeDungeonNode(dungeon, dungeon.currentNodeId);

      if (isBossNode) {
        soundFx.playVictory();
        nextDungeon = advanceToNextDungeonFloor(nextDungeon, rng);
        setMetaProgression((prev) => ({
          ...prev,
          highestFloorReached: Math.max(prev.highestFloorReached, nextDungeon.currentFloor),
        }));
      }

      setDungeon(nextDungeon);
    }

    setIsDungeonMapActive(true);
  }, [dungeon, hero, metaProgression, rng]);

  const handleSelectDraftCard = (card: CombatCard) => {
    soundFx.playVictory();
    setDeckState((prev) => addCardToDeck(prev, card));
    setDraftCards(null);

    // If no relics are waiting to be drafted, return to map
    if (!draftRelics) {
      finishBattleNodeAndReturnToMap();
    }
  };

  const handleSkipDraftCard = () => {
    soundFx.playClick();
    setDraftCards(null);

    // If no relics are waiting to be drafted, return to map
    if (!draftRelics) {
      finishBattleNodeAndReturnToMap();
    }
  };

  const handleSelectDraftRelic = (relic: RelicDefinition) => {
    soundFx.playVictory();
    setRelics((prev) => [...prev, relic]);
    setDraftRelics(null);
    finishBattleNodeAndReturnToMap();
  };

  const handleSkipDraftRelic = () => {
    soundFx.playClick();
    setDraftRelics(null);
    finishBattleNodeAndReturnToMap();
  };

  // Collect Spoils and trigger Card Draft (+ Relic Draft for Elite / Boss)
  const handleCollectLootAndRematch = useCallback(() => {
    if (victoryLoot) {
      const goldBonusPct = relics.reduce((acc, r) => acc + (r.effect.extraGoldPercent || 0) + (r.effect.goldMultiplierPercent || 0), 0);
      const scaledGold = Math.round(victoryLoot.gold * (1 + goldBonusPct / 100));
      setGold((prev) => prev + scaledGold);
    }
    setVictoryLoot(null);

    // Hydra's Heart passive victory recovery
    const hydraHealPercent = relics.reduce((acc, r) => acc + (r.effect.victoryHealPercent || 0), 0);
    if (hydraHealPercent > 0) {
      setHero((prev) => ({
        ...prev,
        currentHp: Math.min(prev.maxHp, prev.currentHp + Math.round((prev.maxHp * hydraHealPercent) / 100)),
      }));
    }

    const currentNode = dungeon.currentNodeId ? dungeon.floor.nodes[dungeon.currentNodeId] : null;
    const isElite = currentNode?.type === 'ELITE';
    const isBoss = currentNode?.type === 'BOSS';

    // 1. Generate draftable cards for every battle (3 base, 4 with Cursed Monocle)
    const draftCount = 3 + (relics.some((r) => r.id === 'cursed-monocle') ? 1 : 0);
    const cardOptions = generateCardDraftOptions((hero.classId as CharacterClassId) || 'WARRIOR', rng, draftCount);
    setDraftCards(cardOptions);

    // 2. If Elite or Boss, queue Relic draft choices!
    if (isElite || isBoss) {
      const relicOptions = generateRelicDraftOptions(isBoss, relics.map((r) => r.id), rng);
      if (relicOptions.length > 0) {
        setDraftRelics({ isBoss, relics: relicOptions });
      }
    }
  }, [victoryLoot, dungeon, hero, rng, relics]);

  const handleRetryDefeat = () => {
    const shardBonusPct = relics.reduce((acc, r) => acc + (r.effect.extraShardMultiplierPercent || 0), 0);
    const rawReward = calculateRunAetheriumReward(dungeon.currentFloor, metaProgression.totalMonstersSlain, false, false);
    const runReward = Math.round(rawReward * (1 + shardBonusPct / 100));
    setMetaProgression((prev) => ({
      ...prev,
      aetherium: prev.aetherium + runReward,
      lifetimeAetherium: prev.lifetimeAetherium + runReward,
    }));
    deleteSave();
    setIsCharacterCreatorOpen(true);
  };

  // Keyboard Hotkeys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (combatState.status === 'VICTORY' && (e.key === ' ' || e.key === 'Enter')) {
        e.preventDefault();
        if (draftCards) {
          setDraftCards(null);
        } else {
          handleCollectLootAndRematch();
        }
        return;
      }

      if (isDungeonMapActive) return;

      // Number hotkeys [1-9] to play corresponding hand cards
      if (isPlayerTurn && /^[1-9]$/.test(e.key)) {
        const cardIndex = parseInt(e.key, 10) - 1;
        if (cardIndex >= 0 && cardIndex < deckState.hand.length) {
          const targetCard = deckState.hand[cardIndex];
          if (deckState.currentEnergy >= targetCard.cost) {
            e.preventDefault();
            handlePlayCard(targetCard);
            return;
          }
        }
      }

      if (e.key === ' ' && isPlayerTurn) {
        e.preventDefault();
        handleEndTurn();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlayerTurn, combatState, isDungeonMapActive, draftCards, deckState, handlePlayCard, handleEndTurn, handleCollectLootAndRematch]);

  return (
    <div
      className="crt-wrapper crt-active"
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: '#07090e',
        backgroundImage: 'radial-gradient(ellipse at 50% 15%, rgba(30, 41, 59, 0.45) 0%, rgba(7, 9, 14, 1) 90%)',
      }}
    >
      {/* Header */}
      <Header
        gold={gold}
        aetherium={metaProgression.aetherium}
        unallocatedStatPoints={progression.unallocatedStatPoints}
        unallocatedSkillPoints={progression.unallocatedSkillPoints}
        isDungeonMapActive={isDungeonMapActive}
        onOpenShop={() => setIsShopOpen(true)}
        onOpenSkillTree={() => setIsSkillTreeOpen(true)}
        onOpenLevelUp={() => setIsLevelUpOpen(true)}
        onToggleDungeonMap={() => setIsDungeonMapActive((prev) => !prev)}
        onOpenTrainer={() => setIsTrainerOpen(true)}
        onOpenCodex={() => setIsCodexOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenTutorial={() => setIsTutorialOpen(true)}
        onOpenSanctum={() => setIsSanctumOpen(true)}
      />

      {/* Main Screen: Dungeon Map View OR 1v1 Tactical Deck Combat */}
      <main
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          maxWidth: '1040px',
          width: '100%',
          margin: '0 auto',
          padding: '10px 14px',
          gap: '10px',
        }}
      >
        {/* Relics Passive Artifacts Strip */}
        <RelicBar relics={relics} />

        {isDungeonMapActive ? (
          <DungeonMapView
            hero={hero}
            dungeon={dungeon}
            gold={gold}
            onSelectNode={handleSelectDungeonNode}
          />
        ) : (
          <>
            {/* 1v1 Pokemon-Style Battlefield with Telegraphed Intent: 1 Hero (Left) VS 1 Active Enemy + Reserve Bench (Right) */}
            <div
              className={screenShake ? (screenShake === 'heavy' ? 'screen-shake-heavy' : 'screen-shake-light') : ''}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: isMobile ? '12px 14px 28px 14px' : '24px 48px 36px 48px',
                minHeight: isMobile ? '190px' : '230px',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Left Side: 1 Hero Battler */}
              <div
                className={isMarching ? 'animate-hero-marching' : ''}
                style={{ display: 'flex', alignItems: 'center', position: 'relative', zIndex: 10 }}
              >
                <BattleVfxOverlay activeVfx={activeVfx?.targetId === heroUnit.id ? activeVfx : null} />
                <CombatantCard
                  combatant={heroUnit}
                  isActiveTurn={combatState.activeCombatantId === heroUnit.id}
                  isSelectedTarget={combatState.selectedTargetId === heroUnit.id}
                  onSelectTarget={() => {
                    setCombatState((prev) => ({ ...prev, selectedTargetId: heroUnit.id }));
                  }}
                  floatingTexts={combatState.floatingTexts.filter((ft) => ft.targetId === heroUnit.id)}
                  isHitAnimating={hitAnimatingId === heroUnit.id}
                />
              </div>

              {/* Right Side: Active Monster (Center Right) + Upcoming Enemy Reserve Queue (Far Right) */}
              <div
                className={isMarching ? 'animate-enemy-enter' : ''}
                style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '8px' : '16px', justifyContent: 'flex-end', position: 'relative', zIndex: 10 }}
              >
                <BattleVfxOverlay activeVfx={activeVfx && activeVfx.targetId !== heroUnit.id ? activeVfx : null} />
                {activeEnemy && (
                  <CombatantCard
                    combatant={activeEnemy}
                    isActiveTurn={combatState.activeCombatantId === activeEnemy.id}
                    isSelectedTarget={combatState.selectedTargetId === activeEnemy.id}
                    onSelectTarget={() => {
                      setCombatState((prev) => ({ ...prev, selectedTargetId: activeEnemy.id }));
                    }}
                    floatingTexts={combatState.floatingTexts.filter((ft) => ft.targetId === activeEnemy.id)}
                    isHitAnimating={hitAnimatingId === activeEnemy.id}
                    affixes={enemyAffixes[activeEnemy.id] || []}
                    enemyQueueCount={combatState.enemyQueue.length}
                    intent={enemyIntent}
                  />
                )}
              </div>

              {/* Moving Ground Cobblestone Bumps Track */}
              <DungeonGroundTrack isAdvancing={isMarching} />
            </div>

            {/* Consumables Quick-Bar: Potion Belt */}
            {potions.length > 0 && (
              <div style={{ display: 'flex', justifyContent: 'flex-start', overflowX: 'auto', paddingBottom: '2px' }}>
                <ConsumablesQuickBar
                  potions={potions}
                  isPlayerTurn={isPlayerTurn}
                  onUsePotion={handleUseConsumable}
                />
              </div>
            )}

            {/* Tactical Deckbuilder Dock: Player Hand, Energy Orb & Combat Chronicle */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: !isMobile && isCombatLogOpen ? 'minmax(0, 1.45fr) minmax(0, 1fr)' : '1fr',
                gap: '10px',
                marginTop: 'auto',
                alignItems: 'stretch',
                transition: 'all 0.2s ease',
              }}
            >
              <CardHand
                deckState={deckState}
                hero={heroUnit}
                activeEnemy={activeEnemy}
                isPlayerTurn={isPlayerTurn}
                onPlayCard={handlePlayCard}
                onEndTurn={handleEndTurn}
                onOpenDeckView={() => setIsDeckViewOpen(true)}
                isCombatLogOpen={isCombatLogOpen}
                onToggleCombatLog={() => setIsCombatLogOpen((prev) => !prev)}
              />

              {!isMobile && isCombatLogOpen && (
                <CombatLog
                  entries={combatState.log}
                  onClose={() => setIsCombatLogOpen(false)}
                />
              )}
            </div>

            {/* Mobile Bottom-Sheet Combat Log Drawer */}
            {isMobile && isCombatLogOpen && (
              <div
                style={{
                  position: 'fixed',
                  inset: 0,
                  backgroundColor: 'rgba(0, 0, 0, 0.75)',
                  backdropFilter: 'blur(4px)',
                  zIndex: 110,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  animation: 'fadeIn 0.2s ease',
                }}
                onClick={() => setIsCombatLogOpen(false)}
              >
                <div
                  style={{
                    height: '65vh',
                    maxHeight: '450px',
                    width: '100%',
                    backgroundColor: 'rgba(10, 14, 22, 0.98)',
                    borderTop: '2px solid var(--border-gold)',
                    borderTopLeftRadius: '12px',
                    borderTopRightRadius: '12px',
                    padding: '12px',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <CombatLog
                    entries={combatState.log}
                    onClose={() => setIsCombatLogOpen(false)}
                  />
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* Post-Battle 3-Card Reward Draft Modal */}
      {draftCards && (
        <CardDraftModal
          cards={draftCards}
          onSelectCard={handleSelectDraftCard}
          onSkip={handleSkipDraftCard}
        />
      )}

      {/* Post-Battle Elite / Boss Relic Draft Modal */}
      {draftRelics && !draftCards && (
        <RelicDraftModal
          isBoss={draftRelics.isBoss}
          relics={draftRelics.relics}
          onSelectRelic={handleSelectDraftRelic}
          onSkip={handleSkipDraftRelic}
        />
      )}

      {/* Grimoire Archive Full Deck View Modal */}
      {isDeckViewOpen && (
        <DeckViewModal
          deckState={deckState}
          onClose={() => setIsDeckViewOpen(false)}
        />
      )}

      {/* Character Creator Modal (Initial Launch / New Game) */}
      {isCharacterCreatorOpen && (
        <CharacterCreatorModal
          unlockedClasses={metaProgression.unlockedClasses}
          unlockedCardIds={metaProgression.unlockedCardIds}
          metaProgression={metaProgression}
          onConfirmCharacter={handleConfirmCharacter}
          onOpenSanctum={() => setIsSanctumOpen(true)}
        />
      )}

      {/* Astral Sanctum Roguelite Meta-Progression Modal */}
      {isSanctumOpen && (
        <SanctumModal
          metaProgression={metaProgression}
          onPurchaseUpgrade={handlePurchaseMetaUpgrade}
          onUnlockClass={handleUnlockMetaClass}
          onUnlockCard={handleUnlockMetaCard}
          onUnlockRelic={handleUnlockMetaRelic}
          onClose={() => setIsSanctumOpen(false)}
        />
      )}

      {/* Outcome Modals */}
      {combatState.status === 'VICTORY' && !draftCards && !draftRelics && (
        <VictoryModal
          round={combatState.round}
          loot={victoryLoot ?? undefined}
          aetheriumEarned={
            dungeon.currentNodeId && dungeon.floor.nodes[dungeon.currentNodeId]?.type === 'BOSS'
              ? 50
              : dungeon.currentNodeId && dungeon.floor.nodes[dungeon.currentNodeId]?.type === 'ELITE'
              ? 25
              : 15
          }
          isElite={dungeon.currentNodeId ? dungeon.floor.nodes[dungeon.currentNodeId]?.type === 'ELITE' : false}
          isBoss={dungeon.currentNodeId ? dungeon.floor.nodes[dungeon.currentNodeId]?.type === 'BOSS' : false}
          onRematch={handleCollectLootAndRematch}
        />
      )}

      {combatState.status === 'DEFEAT' && <DefeatModal onRetry={handleRetryDefeat} />}

      {/* Level Up Stat Allocation Modal */}
      {isLevelUpOpen && (
        <LevelUpModal
          hero={hero}
          progression={progression}
          onAllocateStat={handleAllocateStat}
          onClose={() => setIsLevelUpOpen(false)}
        />
      )}

      {/* Class Skill Tree & Talents Modal */}
      {isSkillTreeOpen && (
        <SkillTreeModal
          hero={hero}
          progression={progression}
          onUnlockNode={handleUnlockSkillNode}
          onClose={() => setIsSkillTreeOpen(false)}
        />
      )}

      {/* Martial Skill Trainer Modal */}
      {isTrainerOpen && (
        <SkillTrainerModal
          hero={hero}
          gold={gold}
          onTrainAttribute={handleTrainAttribute}
          onClose={() => setIsTrainerOpen(false)}
        />
      )}

      {/* Tactical Bestiary Codex & Aetherbound Chronicles Modal */}
      {isCodexOpen && (
        <CodexModal
          lifetimeAetherium={metaProgression.lifetimeAetherium}
          onClose={() => setIsCodexOpen(false)}
        />
      )}

      {/* Tactical Field Training Tutorial Modal */}
      {isTutorialOpen && <TutorialModal onClose={() => setIsTutorialOpen(false)} />}

      {/* Settings & Save Data Modal */}
      {isSettingsOpen && (
        <SettingsModal
          getCurrentSaveData={() => ({
            version: 3,
            timestamp: Date.now(),
            saveName: `${hero.name} Run`,
            hero,
            progression,
            gold,
            potions,
            dungeon,
            battlesWon: 1,
            battlesLost: 0,
            metaProgression,
          })}
          onImportSaveData={handleImportSaveData}
          onResetGame={handleResetRun}
          onAbandonRun={handleAbandonRun}
          onOpenTutorial={() => setIsTutorialOpen(true)}
          onClose={() => setIsSettingsOpen(false)}
        />
      )}

      {/* Campfire Rest Site Modal */}
      {isCampfireOpen && (
        <CampfireModal
          hero={hero}
          deckCards={deckState.fullDeck}
          onRestHp={handleCampfireRestHp}
          onMeditateMana={handleCampfireMeditateMana}
          onSharpenWeapon={handleCampfireSharpenWeapon}
          onUpgradeCard={handleCampfireUpgradeCard}
        />
      )}

      {/* Ancient Narrative Event Modal */}
      {activeDungeonEvent && (
        <DungeonEventModal
          event={activeDungeonEvent}
          gold={gold}
          onSelectChoice={handleSelectEventChoice}
        />
      )}

      {/* Ancient Shrine Modal */}
      {isShrineOpen && <ShrineModal onPrayShrine={handleShrineBlessing} />}



      {/* Class Selector Modal */}
      {isClassSelectorOpen && (
        <ClassSelectorModal
          currentClassId={hero.classId as CharacterClassId}
          onSelectClass={(newClassId) => {
            const raw = createHeroFromClass(newClassId, hero.name, 'hero-1', 1);
            setHero(applyMetaUpgradesToHero(raw, metaProgression));
            setIsClassSelectorOpen(false);
          }}
          onClose={() => setIsClassSelectorOpen(false)}
        />
      )}

      {/* Outpost Merchant Shop Modal */}
      {isShopOpen && (
        <ShopModal
          gold={gold}
          deck={deckState.fullDeck}
          hero={hero}
          onBuyCard={handleShopBuyCard}
          onBuyRelic={handleShopBuyRelic}
          onBuyPotion={handleShopBuyPotion}
          onRemoveCard={handleShopRemoveCard}
          onUpgradeCard={handleShopUpgradeCard}
          onClose={() => setIsShopOpen(false)}
        />
      )}

      {/* Travelling / Marching Transition Screen */}
      {travelTransition?.active && (
        <TravelTransitionOverlay
          hero={hero}
          destinationName={travelTransition.destinationName}
          floorTitle={travelTransition.floorTitle}
          onComplete={() => {
            const targetNodeId = travelTransition.nodeId;
            setTravelTransition(null);
            executeEnterDungeonCombat(targetNodeId);
          }}
        />
      )}
    </div>
  );
};
