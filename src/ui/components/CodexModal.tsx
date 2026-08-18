import React, { useState } from 'react';
import { PortraitAvatar } from './PortraitAvatar.tsx';
import { Button } from './Button.tsx';
import { soundFx } from '../audio/sound-system.ts';
import { LORE_CHRONICLES, type LoreFragment, getNextLoreMilestone } from '../../core/data/lore.ts';
import {
  X,
  BookOpen,
  ShieldAlert,
  Crosshair,
  Sparkles,
  Lock,
  CheckCircle2,
} from 'lucide-react';

interface CodexEntry {
  id: string;
  name: string;
  avatar: string;
  category: 'MINION' | 'ELITE' | 'BOSS';
  threatLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'LETHAL';
  lore: string;
  weakness: string;
  keyAbilities: string[];
  tactics: string;
}

const BESTIARY_DATA: CodexEntry[] = [
  {
    id: 'goblin-scout',
    name: 'Goblin Scout',
    avatar: 'goblin-scout',
    category: 'MINION',
    threatLevel: 'LOW',
    lore: 'Nimble scavengers lurking in the upper dungeons of Aethelgard. They strike fast with crude daggers.',
    weakness: 'Vulnerable to heavy Physical burst and Fire cleave.',
    keyAbilities: ['Quick Slash', 'Evasive Retreat'],
    tactics: 'Focus them down early to prevent sustained bleed chip damage.',
  },
  {
    id: 'goblin-shaman',
    name: 'Goblin Shaman',
    avatar: 'goblin-shaman',
    category: 'MINION',
    threatLevel: 'MEDIUM',
    lore: 'Tribal channelers of chaotic primal magic. They mend ally wounds and curse intruders.',
    weakness: 'Weak against high single-target physical damage and silence/stun.',
    keyAbilities: ['Primal Heal', 'Lightning Shock', 'Tribal Hex'],
    tactics: 'Interrupt or eliminate before they restore HP to frontline brawlers.',
  },
  {
    id: 'skeleton-guard',
    name: 'Skeleton Guard',
    avatar: 'skeleton-guard',
    category: 'ELITE',
    threatLevel: 'HIGH',
    lore: 'Remnants of the ancient Aethelgard royal infantry, reanimated by foul necromancy.',
    weakness: 'Highly vulnerable to Holy magic and Blunt strikes.',
    keyAbilities: ['Shield Bash (Stun)', 'Iron Guard (-50% DMG)', 'Rusty Cleave'],
    tactics: 'Trigger Holy reactions to bypass their reinforced armor defenses.',
  },
  {
    id: 'dire-wolf',
    name: 'Dire Wolf',
    avatar: 'dire-wolf',
    category: 'MINION',
    threatLevel: 'MEDIUM',
    lore: 'Fierce subterranean predators with hyper-acute senses and razor jaws.',
    weakness: 'Weak to Frost control and Fire explosions.',
    keyAbilities: ['Savage Bite (Bleed)', 'Pack Howl (Crit Buff)'],
    tactics: 'Use Defend or Frost slows when the alpha howls to minimize incoming crits.',
  },
  {
    id: 'dark-mage',
    name: 'Dark Cultist Mage',
    avatar: 'dark-mage',
    category: 'ELITE',
    threatLevel: 'HIGH',
    lore: 'Corrupted scholars seeking forbidden void power deep within the sunken catacombs.',
    weakness: 'Low physical armor; weak against Rogue backstabs and Ranger arrows.',
    keyAbilities: ['Shadow Bolt', 'Void Curse (DoT)', 'Soul Siphon'],
    tactics: 'Burst them down before they cast their channelled multi-turn dark spells.',
  },
  {
    id: 'ignis-dragon',
    name: 'Ignis the Fire Drake',
    avatar: 'ignis-dragon',
    category: 'BOSS',
    threatLevel: 'LETHAL',
    lore: 'An ancient apex dragon that slumbered under the magma core for millennia.',
    weakness: 'Vulnerable to Frost spells; creates Thermal Shock explosive reactions.',
    keyAbilities: ['Inferno Breath (AoE Fire)', 'Molten Armor (Counter-burn)', 'Draconic Roar'],
    tactics: 'Alternate Ice spells and Physical combos to trigger shatter reactions.',
  },
  {
    id: 'lich-lord',
    name: 'Malakor the Lich Lord',
    avatar: 'lich-lord',
    category: 'BOSS',
    threatLevel: 'LETHAL',
    lore: 'Architect of the catacomb curse, commanding endless legions of undead wraiths.',
    weakness: 'High magic resistance; weak to sustained Physical bleed pressure.',
    keyAbilities: ['Death Coil', 'Grasp of the Damned (Freeze)', 'Summon Minions'],
    tactics: 'Cleanse freeze effects promptly and focus attacks before minions overwhelm the turn queue.',
  },
];

interface CodexModalProps {
  lifetimeAetherium?: number;
  onClose: () => void;
}

export const CodexModal: React.FC<CodexModalProps> = ({ lifetimeAetherium = 0, onClose }) => {
  const [activeTab, setActiveTab] = useState<'BESTIARY' | 'LORE'>('BESTIARY');
  const [selectedEntry, setSelectedEntry] = useState<CodexEntry>(BESTIARY_DATA[0]);
  const [selectedLore, setSelectedLore] = useState<LoreFragment>(LORE_CHRONICLES[0]);

  const unlockedLoreCount = LORE_CHRONICLES.filter((f) => lifetimeAetherium >= f.shardsRequired).length;
  const nextMilestone = getNextLoreMilestone(lifetimeAetherium);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(4, 6, 8, 0.94)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
        padding: '16px',
        fontFamily: 'var(--font-mono)',
      }}
    >
      <div
        className="rpg-panel rpg-panel-gold animate-modal-in"
        style={{
          width: '100%',
          maxWidth: '940px',
          height: '92dvh',
          maxHeight: '92dvh',
          overflowY: 'auto',
          padding: '14px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
          backgroundColor: 'rgba(10, 14, 20, 0.98)',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BookOpen size={20} color="var(--text-gold)" />
            <h2 style={{ margin: 0, fontSize: '1.15rem', color: 'var(--text-gold)', letterSpacing: '0.03em' }}>
              Archive Codex & Chronicles
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '4px' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px' }}>
          <button
            onClick={() => {
              soundFx.playClick();
              setActiveTab('BESTIARY');
            }}
            style={{
              padding: '6px 12px',
              backgroundColor: activeTab === 'BESTIARY' ? 'rgba(234, 179, 8, 0.2)' : 'rgba(255, 255, 255, 0.03)',
              border: activeTab === 'BESTIARY' ? '1px solid #facc15' : '1px solid var(--border-subtle)',
              borderRadius: '3px',
              color: activeTab === 'BESTIARY' ? '#fef08a' : '#94a3b8',
              fontFamily: 'var(--font-mono)',
              fontWeight: 700,
              fontSize: '0.74rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Crosshair size={14} />
            TACTICAL BESTIARY ({BESTIARY_DATA.length})
          </button>

          <button
            onClick={() => {
              soundFx.playClick();
              setActiveTab('LORE');
            }}
            style={{
              padding: '6px 12px',
              backgroundColor: activeTab === 'LORE' ? 'rgba(168, 85, 247, 0.25)' : 'rgba(255, 255, 255, 0.03)',
              border: activeTab === 'LORE' ? '1px solid #c084fc' : '1px solid var(--border-subtle)',
              borderRadius: '3px',
              color: activeTab === 'LORE' ? '#f5d0fe' : '#94a3b8',
              fontFamily: 'var(--font-mono)',
              fontWeight: 700,
              fontSize: '0.74rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Sparkles size={14} color="#c084fc" />
            CHRONICLES ({unlockedLoreCount}/{LORE_CHRONICLES.length})
          </button>
        </div>

        {/* TAB 1: TACTICAL BESTIARY */}
        {activeTab === 'BESTIARY' && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '16px',
            }}
          >
            {/* Column 1: Hostiles List */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                maxHeight: '480px',
                overflowY: 'auto',
                paddingRight: '4px',
              }}
            >
              {BESTIARY_DATA.map((entry) => {
                const isSelected = selectedEntry.id === entry.id;
                const isBoss = entry.category === 'BOSS';

                return (
                  <div
                    key={entry.id}
                    onClick={() => setSelectedEntry(entry)}
                    style={{
                      padding: '8px 12px',
                      backgroundColor: isSelected ? 'rgba(212, 163, 75, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                      border: isSelected ? '1px solid var(--border-gold-bright)' : '1px solid var(--border-subtle)',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '36px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <PortraitAvatar type={entry.avatar} size={34} />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: isBoss ? '#facc15' : '#f8fafc' }}>
                          {entry.name}
                        </div>
                        <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                          [{entry.category}]
                        </span>
                      </div>
                    </div>

                    <span
                      style={{
                        fontSize: '0.65rem',
                        fontWeight: 800,
                        color: entry.threatLevel === 'LETHAL' ? '#f87171' : entry.threatLevel === 'HIGH' ? '#fbbf24' : '#86efac',
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        padding: '2px 6px',
                        borderRadius: '2px',
                      }}
                    >
                      {entry.threatLevel}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Column 2: Selected Hostile Dossier */}
            <div
              style={{
                padding: '16px',
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '4px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div
                  style={{
                    width: '72px',
                    height: '92px',
                    border: '2px solid var(--border-gold)',
                    borderRadius: '4px',
                    backgroundColor: 'rgba(0, 0, 0, 0.6)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <PortraitAvatar type={selectedEntry.avatar} size={64} />
                </div>

                <div>
                  <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#fef08a' }}>
                    {selectedEntry.name}
                  </h3>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '4px', fontSize: '0.75rem' }}>
                    <span style={{ color: '#38bdf8' }}>Classification: {selectedEntry.category}</span>
                    <span style={{ color: '#f87171' }}>Threat Level: {selectedEntry.threatLevel}</span>
                  </div>
                </div>
              </div>

              {/* Lore dossier */}
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-gold)', fontWeight: 700, marginBottom: '2px' }}>
                  Tactical Lore:
                </div>
                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                  {selectedEntry.lore}
                </p>
              </div>

              {/* Tactical Weakness */}
              <div
                style={{
                  padding: '8px 10px',
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: '3px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <ShieldAlert size={16} color="#f87171" />
                <span style={{ fontSize: '0.8rem', color: '#fca5a5' }}>
                  <strong>Weakness:</strong> {selectedEntry.weakness}
                </span>
              </div>

              {/* Key Signature Abilities */}
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-gold)', fontWeight: 700, marginBottom: '4px' }}>
                  Known Abilities:
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {selectedEntry.keyAbilities.map((ab, i) => (
                    <span
                      key={i}
                      style={{
                        fontSize: '0.75rem',
                        backgroundColor: 'rgba(56, 189, 248, 0.15)',
                        border: '1px solid #38bdf8',
                        color: '#bae6fd',
                        padding: '2px 8px',
                        borderRadius: '2px',
                      }}
                    >
                      {ab}
                    </span>
                  ))}
                </div>
              </div>

              {/* Field Tactics */}
              <div
                style={{
                  padding: '8px 10px',
                  backgroundColor: 'rgba(34, 197, 94, 0.08)',
                  border: '1px solid rgba(34, 197, 94, 0.3)',
                  borderRadius: '3px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginTop: 'auto',
                }}
              >
                <Crosshair size={16} color="#86efac" />
                <span style={{ fontSize: '0.8rem', color: '#86efac' }}>
                  <strong>Directive:</strong> {selectedEntry.tactics}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: AETHERBOUND CHRONICLES & VOID LOOP LORE */}
        {activeTab === 'LORE' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Shards Progress Banner */}
            <div
              style={{
                padding: '12px 16px',
                backgroundColor: 'rgba(168, 85, 247, 0.1)',
                border: '1px solid rgba(168, 85, 247, 0.3)',
                borderRadius: '4px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Sparkles size={18} color="#c084fc" />
                  <span style={{ fontSize: '0.85rem', color: '#f5d0fe', fontWeight: 700 }}>
                    Lifetime Soul Shards Collected: <strong>{lifetimeAetherium}</strong>
                  </span>
                </div>

                <span style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>
                  {nextMilestone.fragment
                    ? `Next Chapter at ${nextMilestone.nextTarget} Shards`
                    : '✨ All 8 Void Chronicles Fully Deciphered!'}
                </span>
              </div>

              {/* Progress Bar */}
              <div
                style={{
                  width: '100%',
                  height: '6px',
                  backgroundColor: 'rgba(0, 0, 0, 0.6)',
                  borderRadius: '3px',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${nextMilestone.progressPercent}%`,
                    background: 'linear-gradient(90deg, #a855f7 0%, #38bdf8 100%)',
                    transition: 'width 0.3s ease',
                  }}
                />
              </div>
            </div>

            {/* 2-Column Chronicles Layout */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(240px, 1fr) minmax(360px, 1.8fr)',
                gap: '16px',
              }}
            >
              {/* Left Column: List of Chapters */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                  maxHeight: '440px',
                  overflowY: 'auto',
                  paddingRight: '4px',
                }}
              >
                {LORE_CHRONICLES.map((frag) => {
                  const isUnlocked = lifetimeAetherium >= frag.shardsRequired;
                  const isSelected = selectedLore.id === frag.id;

                  return (
                    <div
                      key={frag.id}
                      onClick={() => {
                        soundFx.playClick();
                        setSelectedLore(frag);
                      }}
                      style={{
                        padding: '10px 12px',
                        backgroundColor: isSelected
                          ? 'rgba(168, 85, 247, 0.18)'
                          : isUnlocked
                          ? 'rgba(255, 255, 255, 0.02)'
                          : 'rgba(0, 0, 0, 0.6)',
                        border: isSelected
                          ? '1px solid #c084fc'
                          : isUnlocked
                          ? '1px solid var(--border-subtle)'
                          : '1px dashed #334155',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        opacity: isUnlocked ? 1 : 0.6,
                        transition: 'all 0.15s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                        <div
                          style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '50%',
                            backgroundColor: isUnlocked ? 'rgba(168, 85, 247, 0.2)' : 'rgba(0,0,0,0.5)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            color: isUnlocked ? '#c084fc' : '#64748b',
                            fontSize: '0.75rem',
                            fontWeight: 800,
                          }}
                        >
                          {isUnlocked ? frag.chapter : <Lock size={12} />}
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <div
                            style={{
                              fontSize: '0.8rem',
                              fontWeight: 700,
                              color: isSelected ? '#f5d0fe' : isUnlocked ? '#f8fafc' : '#94a3b8',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            {frag.title}
                          </div>
                          <span style={{ fontSize: '0.65rem', color: isUnlocked ? '#38bdf8' : '#64748b' }}>
                            {isUnlocked ? `Unlocked` : `Req. ${frag.shardsRequired} Shards`}
                          </span>
                        </div>
                      </div>

                      {isUnlocked ? (
                        <CheckCircle2 size={14} color="#86efac" />
                      ) : (
                        <span
                          style={{
                            fontSize: '0.62rem',
                            color: '#e879f9',
                            backgroundColor: 'rgba(232, 121, 249, 0.1)',
                            padding: '1px 5px',
                            borderRadius: '2px',
                          }}
                        >
                          {frag.shardsRequired} 💎
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Right Column: Selected Lore Fragment Reading View */}
              <div
                style={{
                  padding: '20px',
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '4px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                  maxHeight: '440px',
                  overflowY: 'auto',
                }}
              >
                {lifetimeAetherium >= selectedLore.shardsRequired ? (
                  <>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span
                          style={{
                            fontSize: '0.68rem',
                            padding: '2px 8px',
                            backgroundColor: 'rgba(168, 85, 247, 0.25)',
                            border: '1px solid #c084fc',
                            color: '#f5d0fe',
                            borderRadius: '3px',
                            fontWeight: 800,
                          }}
                        >
                          CHAPTER {selectedLore.chapter}
                        </span>
                        <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                          {selectedLore.speaker}
                        </span>
                      </div>

                      <h3 style={{ margin: 0, fontSize: '1.3rem', color: '#fef08a', letterSpacing: '0.02em' }}>
                        {selectedLore.title}
                      </h3>
                      <span style={{ fontSize: '0.78rem', color: '#38bdf8', fontStyle: 'italic' }}>
                        {selectedLore.subtitle}
                      </span>
                    </div>

                    {/* Blockquote */}
                    <div
                      style={{
                        padding: '10px 14px',
                        backgroundColor: 'rgba(168, 85, 247, 0.08)',
                        borderLeft: '3px solid #c084fc',
                        borderRadius: '0 4px 4px 0',
                        fontSize: '0.78rem',
                        color: '#e9d5ff',
                        fontStyle: 'italic',
                        lineHeight: 1.4,
                      }}
                    >
                      "{selectedLore.quote}"
                    </div>

                    {/* Body Paragraphs */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.8rem', color: '#cbd5e1', lineHeight: 1.5 }}>
                      {selectedLore.body.map((paragraph, idx) => (
                        <p key={idx} style={{ margin: 0 }}>
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </>
                ) : (
                  /* Locked View */
                  <div
                    style={{
                      height: '100%',
                      minHeight: '280px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      textAlign: 'center',
                      gap: '12px',
                      padding: '24px',
                    }}
                  >
                    <div
                      style={{
                        width: '54px',
                        height: '54px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(168, 85, 247, 0.15)',
                        border: '1px solid #c084fc',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Lock size={26} color="#c084fc" />
                    </div>

                    <div>
                      <h4 style={{ margin: 0, fontSize: '1.1rem', color: '#f5d0fe' }}>
                        Locked Chronicle Fragment #{selectedLore.chapter}
                      </h4>
                      <p style={{ margin: '6px 0 0 0', fontSize: '0.78rem', color: '#94a3b8', maxWidth: '340px', lineHeight: 1.4 }}>
                        Requires <strong>{selectedLore.shardsRequired} Lifetime Soul Shards</strong> to decipher this lost memory of the recursion loop.
                      </p>
                      <span style={{ display: 'block', fontSize: '0.72rem', color: '#e879f9', marginTop: '6px' }}>
                        Current Progress: {lifetimeAetherium} / {selectedLore.shardsRequired} Shards ({Math.min(100, Math.round((lifetimeAetherium / selectedLore.shardsRequired) * 100))}%)
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '6px' }}>
          <Button variant="secondary" onClick={onClose} icon={<BookOpen size={16} color="#94a3b8" />}>
            Close Archive
          </Button>
        </div>
      </div>
    </div>
  );
};
