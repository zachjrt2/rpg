import React, { useState } from 'react';
import type { CharacterClassId } from '../../core/types/classes.ts';
import type { OriginBoonId } from '../../core/data/characters.ts';
import type { CombatCard } from '../../core/types/cards.ts';
import type { PrimaryStats } from '../../core/types/stats.ts';
import type { MetaProgressionState } from '../../core/types/meta.ts';
import { CHARACTER_CLASSES } from '../../core/data/classes.ts';
import { ORIGIN_BOONS } from '../../core/data/characters.ts';
import { CARDS_CATALOG } from '../../core/data/cards.ts';
import { CLASS_BASIC_CARDS } from '../../core/combat/deck-manager.ts';
import {
  UNLOCKABLE_CARDS,
  UNLOCKABLE_RELICS,
  DEFAULT_UNLOCKED_CARDS,
  DEFAULT_UNLOCKED_RELICS,
} from '../../core/meta/meta-manager.ts';
import { PortraitAvatar } from './PortraitAvatar.tsx';
import { Button } from './Button.tsx';
import { soundFx } from '../audio/sound-system.ts';
import {
  ShieldAegisSvg,
  BloodDropSvg,
  FireFlameSvg,
  SwordSvg,
  DiamondSvg,
  TrophyVictorySvg,
} from './RpgSvgIcons.tsx';
import {
  Sparkles,
  Dice5,
  ChevronRight,
  ChevronLeft,
  Lock,
  CheckCircle2,
  Compass,
  Skull,
} from 'lucide-react';
import { InfoTooltip } from './InfoTooltip.tsx';

const STAT_DESCRIPTIONS: Record<keyof PrimaryStats, { name: string; full: string; effect: string }> = {
  strength: {
    name: 'Strength',
    full: 'Physical Prowess',
    effect: 'Increases Physical, Attack, and Bleed damage. Boosts armor penetration against shielded foes.',
  },
  dexterity: {
    name: 'Dexterity',
    full: 'Agility & Reflexes',
    effect: 'Increases Critical Strike Chance and Dodge probability. Enhances Rogue and Ranger ability scaling.',
  },
  intelligence: {
    name: 'Intelligence',
    full: 'Arcane Mastery',
    effect: 'Increases Elemental spell damage (Fire, Frost, Shock) and boosts elemental reaction detonation power.',
  },
  vitality: {
    name: 'Vitality',
    full: 'Endurance & Fortitude',
    effect: 'Grants +12 Maximum HP per point and boosts restorative potion and healing card effectiveness.',
  },
  willpower: {
    name: 'Willpower',
    full: 'Mental Resolve',
    effect: 'Grants +6 starting Barrier Shield at combat start and increases resistance against debilitating status effects.',
  },
  luck: {
    name: 'Luck',
    full: 'Fortune & Favor',
    effect: 'Increases Critical Strike damage multiplier, rare card draft rates in battle rewards, and gold dropped by enemies.',
  },
};

interface CharacterCreatorModalProps {
  unlockedClasses: CharacterClassId[];
  unlockedCardIds?: string[];
  metaProgression?: MetaProgressionState;
  onConfirmCharacter: (
    classId: CharacterClassId,
    name: string,
    selectedCards: string[],
    originBoon: OriginBoonId,
    allocatedStats: PrimaryStats,
    selectedRelicIds?: string[]
  ) => void;
  onOpenSanctum?: () => void;
}

const RANDOM_NAMES = [
  'Sir Alden Dawnseeker',
  'Kaelen Shadowveil',
  'Valeria Sunshield',
  'Theron Quickblade',
  'Eldrin Emberweaver',
  'Morrigan Soulreaper',
  'Ragnar Bloodrage',
  'Sylvia Windstrider',
  'Gideon Ironclad',
  'Lyra Frostwarden',
];

const DEFAULT_STARTER_CARDS: Record<CharacterClassId, string[]> = {
  WARRIOR: ['power-cleave', 'shield-slam'],
  ROGUE: ['quick-slash', 'poison-dart'],
  MAGE: ['fireball', 'frost-lance'],
  CLERIC: ['holy-smite', 'prayer-heal'],
  RANGER: ['aimed-shot', 'arrow-barrage'],
  PALADIN: ['radiant-smite', 'aegis-ward'],
  NECROMANCER: ['soul-siphon', 'bone-barrier'],
  BERSERKER: ['blood-slash', 'frenzy-rage'],
};

export const CharacterCreatorModal: React.FC<CharacterCreatorModalProps> = ({
  unlockedClasses,
  unlockedCardIds = DEFAULT_UNLOCKED_CARDS,
  metaProgression,
  onConfirmCharacter,
  onOpenSanctum,
}) => {
  const [step, setStep] = useState<number>(0);
  const [selectedClassId, setSelectedClassId] = useState<CharacterClassId>('WARRIOR');
  const [heroName, setHeroName] = useState<string>('Sir Alden Dawnseeker');
  const [selectedCards, setSelectedCards] = useState<string[]>(() => {
    return DEFAULT_STARTER_CARDS.WARRIOR;
  });
  const [selectedBoon, setSelectedBoon] = useState<OriginBoonId>('iron-constitution');

  // Relic Capacity and Selection
  const maxStartingRelics = 1 + (metaProgression?.upgradeRanks?.relic_slots || 0);
  const maxStarterCards = 2 + (metaProgression?.upgradeRanks?.card_mastery || 0);
  const unlockedRelicIds = metaProgression?.unlockedRelicIds || DEFAULT_UNLOCKED_RELICS;
  const [selectedRelicIds, setSelectedRelicIds] = useState<string[]>(() => {
    const initial = metaProgression?.unlockedRelicIds || DEFAULT_UNLOCKED_RELICS;
    return initial.slice(0, maxStartingRelics);
  });

  // Attribute Point Pool Calculation (Base 3 + Astral Attunement rank bonus)
  const baseStatPoints = 3;
  const metaStatPoints = (metaProgression?.upgradeRanks?.attunement || 0) * 1;
  const totalAvailablePoints = baseStatPoints + metaStatPoints;

  const [allocatedStats, setAllocatedStats] = useState<PrimaryStats>({
    strength: 0,
    dexterity: 0,
    intelligence: 0,
    vitality: 0,
    willpower: 0,
    luck: 0,
  });

  const spentPoints = Object.values(allocatedStats).reduce((a, b) => a + b, 0);
  const unallocatedPoints = totalAvailablePoints - spentPoints;

  const selectedClassDef = CHARACTER_CLASSES[selectedClassId];

  const effectivePrimaryStats: PrimaryStats = {
    strength: selectedClassDef.baseStats.strength + allocatedStats.strength,
    dexterity: selectedClassDef.baseStats.dexterity + allocatedStats.dexterity,
    intelligence: selectedClassDef.baseStats.intelligence + allocatedStats.intelligence,
    vitality: selectedClassDef.baseStats.vitality + allocatedStats.vitality,
    willpower: selectedClassDef.baseStats.willpower + allocatedStats.willpower,
    luck: selectedClassDef.baseStats.luck + allocatedStats.luck,
  };

  const availableCards: CombatCard[] = Object.values(CARDS_CATALOG).filter((card) => {
    if (card.isUpgraded) return false;
    if (card.rarity === 'BASIC' || card.id === 'strike' || card.id === 'defend' || card.id.endsWith('-strike') || card.id.endsWith('-defend')) return false;
    if (!card.classRestrictions || card.classRestrictions.length === 0) return true;
    return card.classRestrictions.includes(selectedClassId);
  });

  const handleSelectClass = (cId: CharacterClassId) => {
    if (!unlockedClasses.includes(cId)) return;
    soundFx.playClick();
    setSelectedClassId(cId);
    setSelectedCards(DEFAULT_STARTER_CARDS[cId] || ['power-cleave', 'shield-slam']);
  };

  const handleAdjustStat = (statKey: keyof PrimaryStats, delta: number) => {
    if (delta > 0 && unallocatedPoints <= 0) {
      soundFx.playDefend();
      return;
    }
    if (delta < 0 && allocatedStats[statKey] <= 0) {
      soundFx.playDefend();
      return;
    }
    soundFx.playClick();
    setAllocatedStats((prev) => ({
      ...prev,
      [statKey]: prev[statKey] + delta,
    }));
  };

  const handleRandomizeName = () => {
    soundFx.playClick();
    const rand = RANDOM_NAMES[Math.floor(Math.random() * RANDOM_NAMES.length)];
    setHeroName(rand);
  };

  const isCardUnlocked = (cardId: string) => {
    if (UNLOCKABLE_CARDS[cardId]) {
      return unlockedCardIds.includes(cardId);
    }
    return true;
  };

  const handleToggleCard = (cardId: string) => {
    if (!isCardUnlocked(cardId)) {
      soundFx.playDefend();
      return;
    }
    soundFx.playClick();
    if (selectedCards.includes(cardId)) {
      if (selectedCards.length > 1) {
        setSelectedCards((prev) => prev.filter((id) => id !== cardId));
      }
    } else {
      if (selectedCards.length < maxStarterCards) {
        setSelectedCards((prev) => [...prev, cardId]);
      } else {
        setSelectedCards((prev) => [...prev.slice(1), cardId]);
      }
    }
  };

  const handleToggleRelic = (relicId: string) => {
    if (!unlockedRelicIds.includes(relicId)) {
      soundFx.playDefend();
      return;
    }
    soundFx.playClick();
    if (selectedRelicIds.includes(relicId)) {
      setSelectedRelicIds((prev) => prev.filter((id) => id !== relicId));
    } else {
      if (selectedRelicIds.length < maxStartingRelics) {
        setSelectedRelicIds((prev) => [...prev, relicId]);
      } else {
        setSelectedRelicIds((prev) => [...prev.slice(1), relicId]);
      }
    }
  };

  const getRelicIcon = (relicId: string, color: string) => {
    const id = relicId.toLowerCase();
    if (id.includes('aegis') || id.includes('shield')) return <ShieldAegisSvg size={16} color={color} />;
    if (id.includes('blood') || id.includes('vampire')) return <BloodDropSvg size={16} color="#ef4444" />;
    if (id.includes('brimstone') || id.includes('censer') || id.includes('flame')) return <FireFlameSvg size={16} color="#f97316" />;
    if (id.includes('viper') || id.includes('fang') || id.includes('needle') || id.includes('sword')) return <SwordSvg size={16} color={color} />;
    if (id.includes('ley') || id.includes('stone') || id.includes('shard')) return <DiamondSvg size={16} color={color} />;
    if (id.includes('chalice') || id.includes('crown')) return <TrophyVictorySvg size={16} color="#facc15" />;
    if (id.includes('watch') || id.includes('chrono')) return <Compass size={16} color={color} />;
    if (id.includes('necrotic') || id.includes('urn') || id.includes('skull')) return <Skull size={16} color={color} />;
    return <Sparkles size={16} color={color} />;
  };

  const getRarityBorder = (rarity: string) => {
    switch (rarity) {
      case 'LEGENDARY': return '#facc15';
      case 'EPIC': return '#c084fc';
      case 'RARE': return '#38bdf8';
      case 'UNCOMMON': return '#22c55e';
      default: return '#94a3b8';
    }
  };

  const handleFinish = () => {
    soundFx.playVictory();
    onConfirmCharacter(
      selectedClassId,
      heroName.trim() || 'Nameless Adventurer',
      selectedCards,
      selectedBoon,
      allocatedStats,
      selectedRelicIds
    );
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(3, 5, 8, 0.95)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 130,
        padding: '16px',
        fontFamily: 'var(--font-mono)',
      }}
    >
      <div
        className="rpg-panel rpg-panel-gold animate-modal-in"
        style={{
          width: '100%',
          maxWidth: '890px',
          height: '88vh',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'rgba(10, 14, 22, 0.98)',
          border: '1px solid var(--border-gold)',
          padding: '20px',
          gap: '12px',
        }}
      >
        {/* Header Bar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid var(--border-subtle)',
            paddingBottom: '10px',
          }}
        >
          <div>
            <h2 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--text-gold)', letterSpacing: '0.04em' }}>
              {step === 0 ? 'Choose Hero Class' : 'Customize Starting Loadout'}
            </h2>
            <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
              Step {step + 1} of 2 — Configure your hero and starting loadout before entering the dungeon.
            </span>
          </div>

          {onOpenSanctum && (
            <Button
              variant="gold"
              size="sm"
              icon={<Sparkles size={14} />}
              onClick={onOpenSanctum}
            >
              Astral Sanctum ({metaProgression?.aetherium || 0} Shards)
            </Button>
          )}
        </div>

        {/* STEP 0: CLASS & IDENTITY SELECTION */}
        {step === 0 && (
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* Name Input Bar */}
            <div
              style={{
                display: 'flex',
                gap: '8px',
                alignItems: 'center',
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                padding: '8px 12px',
                borderRadius: '4px',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <span style={{ fontSize: '0.75rem', color: '#facc15', fontWeight: 700 }}>HERO NAME:</span>
              <input
                type="text"
                value={heroName}
                onChange={(e) => setHeroName(e.target.value)}
                maxLength={30}
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#f8fafc',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                }}
                placeholder="Enter character name..."
              />
              <Button
                variant="secondary"
                size="sm"
                icon={<Dice5 size={14} />}
                onClick={handleRandomizeName}
              >
                RANDOM
              </Button>
            </div>

            {/* Class Cards Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                gap: '10px',
              }}
            >
              {(Object.keys(CHARACTER_CLASSES) as CharacterClassId[]).map((classId) => {
                const cls = CHARACTER_CLASSES[classId];
                const isSelected = selectedClassId === classId;
                const isUnlocked = unlockedClasses.includes(classId);

                return (
                  <div
                    key={classId}
                    onClick={() => handleSelectClass(classId)}
                    style={{
                      padding: '12px',
                      backgroundColor: isSelected
                        ? 'rgba(234, 179, 8, 0.12)'
                        : isUnlocked
                        ? 'rgba(0, 0, 0, 0.5)'
                        : 'rgba(0, 0, 0, 0.8)',
                      border: isSelected
                        ? '2px solid #facc15'
                        : isUnlocked
                        ? '1px solid var(--border-subtle)'
                        : '1px dashed #475569',
                      borderRadius: '4px',
                      cursor: isUnlocked ? 'pointer' : 'not-allowed',
                      opacity: isUnlocked ? 1 : 0.45,
                      display: 'flex',
                      gap: '10px',
                      alignItems: 'center',
                      position: 'relative',
                      transition: 'all 0.15s ease',
                      boxShadow: isSelected ? '0 0 12px rgba(250, 204, 21, 0.3)' : 'none',
                    }}
                  >
                    <PortraitAvatar type={cls.avatar} size={52} />

                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <strong style={{ color: isSelected ? '#facc15' : '#f8fafc', fontSize: '0.9rem' }}>
                          {cls.name}
                        </strong>
                        {!isUnlocked && (
                          <span style={{ fontSize: '0.62rem', color: '#f87171', display: 'flex', alignItems: 'center', gap: '3px' }}>
                            <Lock size={10} /> SANCTUM
                          </span>
                        )}
                      </div>

                      <span style={{ fontSize: '0.68rem', color: '#38bdf8', display: 'block', margin: '2px 0 4px 0' }}>
                        {cls.role}
                      </span>

                      <p style={{ margin: 0, fontSize: '0.68rem', color: '#cbd5e1', lineHeight: 1.25 }}>
                        {cls.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 1: ATTRIBUTES, BOON, RELICS & STARTER CARDS */}
        {step === 1 && (
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* Top Row: 2-Column Grid (Left: Attributes + Relics Stacked; Right: Origin Blessing) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.15fr) minmax(0, 1fr)', gap: '10px' }}>
              
              {/* Left Column: Attribute Points + Starting Relics Stacked */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                
                {/* Attribute Point Allocator */}
                <div
                  style={{
                    padding: '10px',
                    backgroundColor: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '4px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <strong style={{ color: '#facc15', fontSize: '0.76rem' }}>ATTRIBUTE POINTS</strong>
                      <InfoTooltip
                        content="Allocate bonus attribute points to customize your build. Each point enhances specific core stats and combat scaling."
                        size={13}
                        color="#facc15"
                        placement="top"
                      />
                    </div>
                    <span
                      style={{
                        fontSize: '0.7rem',
                        fontWeight: 800,
                        color: unallocatedPoints > 0 ? '#4ade80' : '#94a3b8',
                        backgroundColor: unallocatedPoints > 0 ? 'rgba(74, 222, 128, 0.15)' : 'transparent',
                        padding: '1px 5px',
                        borderRadius: '2px',
                      }}
                    >
                      POOL: {unallocatedPoints}
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                    {(['strength', 'dexterity', 'intelligence', 'vitality', 'willpower', 'luck'] as const).map((statKey) => {
                      const baseVal = selectedClassDef.baseStats[statKey];
                      const allocatedVal = allocatedStats[statKey];
                      const effectiveVal = effectivePrimaryStats[statKey];
                      const statInfo = STAT_DESCRIPTIONS[statKey];

                      return (
                        <div
                          key={statKey}
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '2px 5px',
                            backgroundColor: 'rgba(0, 0, 0, 0.3)',
                            borderRadius: '2px',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <span style={{ fontSize: '0.66rem', color: '#cbd5e1', textTransform: 'uppercase' }}>
                              {statKey.slice(0, 3)}: <strong>{effectiveVal}</strong> ({baseVal})
                            </span>
                            <InfoTooltip
                              content={
                                <div>
                                  <strong style={{ color: '#facc15', display: 'block', marginBottom: '2px' }}>
                                    {statInfo.name} ({statInfo.full})
                                  </strong>
                                  <span>{statInfo.effect}</span>
                                </div>
                              }
                              size={11}
                              color="#94a3b8"
                              placement="right"
                            />
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                            <button
                              disabled={allocatedVal <= 0}
                              onClick={() => handleAdjustStat(statKey, -1)}
                              style={{
                                width: '16px',
                                height: '16px',
                                padding: 0,
                                background: '#334155',
                                border: 'none',
                                color: '#fff',
                                borderRadius: '2px',
                                cursor: allocatedVal > 0 ? 'pointer' : 'not-allowed',
                              }}
                            >
                              -
                            </button>
                            <span style={{ fontSize: '0.66rem', color: '#facc15', minWidth: '10px', textAlign: 'center' }}>
                              {allocatedVal}
                            </span>
                            <button
                              disabled={unallocatedPoints <= 0}
                              onClick={() => handleAdjustStat(statKey, 1)}
                              style={{
                                width: '16px',
                                height: '16px',
                                padding: 0,
                                background: '#334155',
                                border: 'none',
                                color: '#fff',
                                borderRadius: '2px',
                                cursor: unallocatedPoints > 0 ? 'pointer' : 'not-allowed',
                              }}
                            >
                              +
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Starting Relic Loadout Selector */}
                <div
                  style={{
                    padding: '10px',
                    backgroundColor: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '4px',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <strong style={{ color: '#facc15', fontSize: '0.76rem' }}>STARTING RELICS</strong>
                      <InfoTooltip
                        content="Select starting relics to begin your expedition with passive combat bonuses. Unlock more relics and loadout slots in the Astral Sanctum."
                        size={13}
                        color="#facc15"
                        placement="top"
                      />
                    </div>
                    <span
                      style={{
                        fontSize: '0.68rem',
                        fontWeight: 800,
                        color: selectedRelicIds.length === maxStartingRelics ? '#86efac' : '#38bdf8',
                        backgroundColor: 'rgba(56, 189, 248, 0.15)',
                        padding: '1px 5px',
                        borderRadius: '2px',
                      }}
                    >
                      SLOTS: {selectedRelicIds.length} / {maxStartingRelics}
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', maxHeight: '130px', overflowY: 'auto', paddingRight: '2px' }}>
                    {Object.values(UNLOCKABLE_RELICS).map((relic) => {
                      const isUnlocked = unlockedRelicIds.includes(relic.relicId);
                      const isSelected = selectedRelicIds.includes(relic.relicId);
                      const borderColor = getRarityBorder(relic.rarity);

                      return (
                        <div
                          key={relic.relicId}
                          onClick={() => handleToggleRelic(relic.relicId)}
                          style={{
                            padding: '4px 6px',
                            backgroundColor: isSelected
                              ? 'rgba(34, 197, 94, 0.12)'
                              : isUnlocked
                              ? 'rgba(0, 0, 0, 0.4)'
                              : 'rgba(0, 0, 0, 0.7)',
                            border: isSelected
                              ? '1px solid #22c55e'
                              : isUnlocked
                              ? '1px solid #334155'
                              : '1px dashed #1e293b',
                            borderRadius: '3px',
                            cursor: isUnlocked ? 'pointer' : 'not-allowed',
                            opacity: isUnlocked ? 1 : 0.4,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                          }}
                        >
                          {getRelicIcon(relic.relicId, borderColor)}
                          <div style={{ flex: 1, minWidth: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <strong style={{ fontSize: '0.68rem', color: isSelected ? '#86efac' : '#f8fafc', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {relic.name}
                            </strong>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <InfoTooltip
                                content={
                                  <div>
                                    <strong style={{ color: borderColor, display: 'block', marginBottom: '3px' }}>
                                      {relic.name} ({relic.rarity})
                                    </strong>
                                    <p style={{ margin: 0, fontSize: '0.72rem', color: '#e2e8f0', lineHeight: 1.35 }}>
                                      {relic.description}
                                    </p>
                                  </div>
                                }
                                size={11}
                                color={borderColor}
                                placement="left"
                              />
                              {isSelected && <CheckCircle2 size={12} color="#86efac" />}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Right Column: Origin Blessing */}
              <div
                style={{
                  padding: '10px',
                  backgroundColor: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '4px',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <strong style={{ color: '#facc15', fontSize: '0.76rem' }}>ORIGIN BLESSING</strong>
                    <InfoTooltip
                      content="Your hero's background lineage. Grants a permanent passive bonus to your hero throughout this expedition."
                      size={13}
                      color="#facc15"
                      placement="top"
                    />
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, overflowY: 'auto' }}>
                  {(Object.keys(ORIGIN_BOONS) as OriginBoonId[]).map((boonId) => {
                    const boon = ORIGIN_BOONS[boonId];
                    const isSel = selectedBoon === boonId;
                    return (
                      <div
                        key={boonId}
                        onClick={() => {
                          soundFx.playClick();
                          setSelectedBoon(boonId);
                        }}
                        style={{
                          padding: '6px 8px',
                          backgroundColor: isSel ? 'rgba(56, 189, 248, 0.12)' : 'rgba(0,0,0,0.3)',
                          border: isSel ? '1px solid #38bdf8' : '1px solid #1e293b',
                          borderRadius: '3px',
                          cursor: 'pointer',
                        }}
                      >
                        <strong style={{ fontSize: '0.7rem', color: isSel ? '#38bdf8' : '#f8fafc', display: 'block' }}>
                          {boon.name}
                        </strong>
                        <span style={{ fontSize: '0.62rem', color: '#94a3b8' }}>{boon.description}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Signature Starter Cards (Pick up to 3) */}
            <div
              style={{
                padding: '10px',
                backgroundColor: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '4px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <strong style={{ color: '#facc15', fontSize: '0.82rem' }}>
                      SIGNATURE STARTER CARDS ({selectedCards.length}/3 SELECTED)
                    </strong>
                    {CLASS_BASIC_CARDS[selectedClassId] && (
                      <span style={{ fontSize: '0.66rem', color: '#38bdf8', backgroundColor: 'rgba(56, 189, 248, 0.1)', padding: '2px 6px', borderRadius: '3px', border: '1px solid rgba(56, 189, 248, 0.25)' }}>
                        Class Core: 4x {CARDS_CATALOG[CLASS_BASIC_CARDS[selectedClassId].attackId]?.name || 'Strike'}, 4x {CARDS_CATALOG[CLASS_BASIC_CARDS[selectedClassId].defendId]?.name || 'Defend'}
                      </span>
                    )}
                  </div>
                  <span style={{ display: 'block', fontSize: '0.68rem', color: '#94a3b8', marginTop: '1px' }}>
                    Choose up to {maxStarterCards} signature starting abilities to pair with your class's unique basic Attack and Defense cards
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.68rem', fontWeight: 800, color: selectedCards.length === maxStarterCards ? '#86efac' : '#38bdf8', marginRight: '4px' }}>
                    {selectedCards.length} / {maxStarterCards}
                  </span>
                  {Array.from({ length: maxStarterCards }).map((_, idx) => (
                    <span
                      key={idx}
                      style={{
                        width: '10px',
                        height: '10px',
                        borderRadius: '2px',
                        backgroundColor: idx < selectedCards.length ? '#22c55e' : '#334155',
                        border: idx < selectedCards.length ? '1px solid #86efac' : '1px solid #1e293b',
                      }}
                    />
                  ))}
                </div>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))',
                  gap: '8px',
                  maxHeight: '220px',
                  overflowY: 'auto',
                  paddingRight: '4px',
                }}
              >
                {availableCards.map((card) => {
                  const isSelected = selectedCards.includes(card.id);
                  const isUnlocked = isCardUnlocked(card.id);

                  return (
                    <div
                      key={card.id}
                      onClick={() => handleToggleCard(card.id)}
                      style={{
                        padding: '8px 10px',
                        backgroundColor: isSelected
                          ? 'rgba(34, 197, 94, 0.14)'
                          : isUnlocked
                          ? 'rgba(0, 0, 0, 0.45)'
                          : 'rgba(0, 0, 0, 0.75)',
                        border: isSelected
                          ? '1.5px solid #22c55e'
                          : isUnlocked
                          ? '1px solid var(--border-subtle)'
                          : '1px dashed #334155',
                        borderRadius: '4px',
                        cursor: isUnlocked ? 'pointer' : 'not-allowed',
                        opacity: isUnlocked ? 1 : 0.45,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '4px',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          {isSelected && <CheckCircle2 size={14} color="#22c55e" />}
                          <strong style={{ color: isSelected ? '#86efac' : '#f8fafc', fontSize: '0.78rem' }}>
                            {card.name}
                          </strong>
                        </div>
                        <span style={{ fontSize: '0.7rem', color: '#38bdf8', fontWeight: 800 }}>
                          ⚡ {card.cost}
                        </span>
                      </div>

                      <p style={{ margin: 0, fontSize: '0.68rem', color: '#cbd5e1', lineHeight: 1.3 }}>
                        {card.description}
                      </p>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '4px' }}>
                        <span style={{ fontSize: '0.62rem', color: '#64748b', textTransform: 'uppercase' }}>
                          {card.type}
                        </span>

                        {isSelected ? (
                          <span style={{ fontSize: '0.65rem', color: '#86efac', fontWeight: 800 }}>
                            ✓ ACTIVE
                          </span>
                        ) : isUnlocked ? (
                          <span style={{ fontSize: '0.65rem', color: '#94a3b8' }}>
                            + SELECT
                          </span>
                        ) : (
                          <span style={{ fontSize: '0.62rem', color: '#f87171', display: 'flex', alignItems: 'center', gap: '3px' }}>
                            <Lock size={10} /> ARCHIVE
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Footer Navigation */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '1px solid var(--border-subtle)',
            paddingTop: '12px',
          }}
        >
          {step > 0 ? (
            <Button
              variant="secondary"
              size="md"
              icon={<ChevronLeft size={16} />}
              onClick={() => {
                soundFx.playClick();
                setStep(0);
              }}
            >
              BACK
            </Button>
          ) : (
            <div />
          )}

          {step === 0 ? (
            <Button
              variant="gold"
              size="md"
              icon={<ChevronRight size={16} />}
              onClick={() => {
                soundFx.playClick();
                setStep(1);
              }}
            >
              PROCEED TO LOADOUT
            </Button>
          ) : (
            <Button
              variant="gold"
              size="md"
              icon={<Sparkles size={16} />}
              onClick={handleFinish}
            >
              ENTER EXPEDITION DUNGEON
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
