import React, { useState } from 'react';
import { Button } from './Button.tsx';
import { soundFx } from '../audio/sound-system.ts';
import {
  X,
  Zap,
  Swords,
  Map,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Shield,
} from 'lucide-react';

interface TutorialModalProps {
  onClose: () => void;
}

export const TutorialModal: React.FC<TutorialModalProps> = ({ onClose }) => {
  const [currentPage, setCurrentPage] = useState<number>(0);

  const pages = [
    {
      id: 'cards_energy',
      title: '01. Cards & Energy Flow',
      icon: <Zap size={18} color="#facc15" />,
      tag: 'COMBAT DECK',
      summary: 'Play cards from your hand using Energy each turn.',
      points: [
        {
          label: 'Energy [⚡]',
          text: 'Refills to max at start of turn. Each card displays its energy cost in the top-left circle.',
        },
        {
          label: 'Playing Cards [1]-[9]',
          text: 'Click or press [1]-[9] to play. Attack (red), Skill/Block (blue), Power (purple).',
        },
        {
          label: 'End Turn [Space / E]',
          text: 'Ends turn, discards unused cards, and draws a fresh hand.',
        },
      ],
    },
    {
      id: 'intents_synergies',
      title: '02. Intents & Combat Combos',
      icon: <Swords size={18} color="#f87171" />,
      tag: 'TACTICS',
      summary: 'Telegraphed enemy actions and live card synergies.',
      points: [
        {
          label: 'Enemy Intents',
          text: 'Badges above enemy heads telegraph incoming damage, shield gains, or buffs before they act.',
        },
        {
          label: 'Combo Highlights [⚡ COMBO]',
          text: 'Cards with active condition synergies (e.g. Combustion on Burning targets, Rupture on Bleed) pulse gold.',
        },
        {
          label: 'Targeting [Click / Tab]',
          text: 'Click any enemy to focus single-target attacks and spells.',
        },
      ],
    },
    {
      id: 'pouch_relics',
      title: '03. Pouch & Passive Relics',
      icon: <Shield size={18} color="#38bdf8" />,
      tag: 'BELT & RELICS',
      summary: 'Quick-use items and passive run artifacts.',
      points: [
        {
          label: 'Alchemist Pouch [P]',
          text: 'Click POUCH or press [P] to toggle quick consumables. Use with [Q], [W], [E], [R].',
        },
        {
          label: 'Passive Relics',
          text: 'Relics in the top bar automatically trigger combat buffs, shields, and bonus draw.',
        },
        {
          label: 'Status Effects',
          text: 'Hover over status badges under health bars to inspect damage ticks and remaining durations.',
        },
      ],
    },
    {
      id: 'dungeon_campfires',
      title: '04. Expedition & Camp Sites',
      icon: <Map size={18} color="#4ade80" />,
      tag: 'MAP & UPGRADES',
      summary: 'Navigate floors, temper cards, and defeat bosses.',
      points: [
        {
          label: 'Dungeon Map [M]',
          text: 'Choose your route through Encounters, Elites, Shrines, Merchants [S], and Dilemma Events.',
        },
        {
          label: 'Campfire Sites',
          text: 'Rest to recover HP, meditate for Mana, or Temper & permanently upgrade (+) cards.',
        },
        {
          label: 'Floor Bosses',
          text: 'Defeat floor guardians to earn rare Boss Relics and descend deeper into the dungeon.',
        },
      ],
    },
    {
      id: 'sanctum',
      title: '05. Astral Sanctum Progression',
      icon: <Sparkles size={18} color="#c084fc" />,
      tag: 'META PROGRESSION',
      summary: 'Permanent cross-run progression with Soul Shards.',
      points: [
        {
          label: 'Soul Shards',
          text: 'Earned from defeated foes and bosses. Persist across runs even on defeat.',
        },
        {
          label: 'Astral Sanctum',
          text: 'Spend shards to unlock new character classes, starting cards, permanent gear, and attribute boons.',
        },
        {
          label: 'Hotkeys Reference',
          text: '[1]-[9] Play Card | [Space/E] End Turn | [P] Pouch | [D] Deck | [I] Bag | [M] Map',
        },
      ],
    },
  ];

  const current = pages[currentPage];
  const isLastPage = currentPage === pages.length - 1;

  const handleNext = () => {
    soundFx.playClick();
    if (!isLastPage) {
      setCurrentPage((prev) => prev + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    soundFx.playClick();
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
    }
  };

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
        zIndex: 110,
        padding: '8px',
        fontFamily: 'var(--font-mono)',
      }}
    >
      <div
        className="rpg-panel rpg-panel-gold animate-modal-in"
        style={{
          width: '100%',
          maxWidth: '560px',
          maxHeight: '92dvh',
          overflowY: 'auto',
          padding: '16px 14px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
          backgroundColor: 'rgba(10, 14, 20, 0.98)',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid var(--border-subtle)',
            paddingBottom: '10px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {current.icon}
            <div>
              <span
                style={{
                  fontSize: '0.65rem',
                  color: 'var(--color-gold)',
                  fontWeight: 800,
                  letterSpacing: '0.08em',
                }}
              >
                [{current.tag}]
              </span>
              <h3 style={{ margin: 0, fontSize: '0.95rem', color: '#f8fafc' }}>
                {current.title}
              </h3>
            </div>
          </div>
          <button
            onClick={() => {
              soundFx.playClick();
              onClose();
            }}
            style={{
              background: 'none',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              padding: '4px',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Short Summary */}
        <p
          style={{
            margin: 0,
            fontSize: '0.78rem',
            color: '#cbd5e1',
            fontStyle: 'italic',
          }}
        >
          {current.summary}
        </p>

        {/* Minimalist Key Points */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {current.points.map((pt, idx) => (
            <div
              key={idx}
              style={{
                padding: '8px 12px',
                backgroundColor: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '4px',
                textAlign: 'left',
              }}
            >
              <strong
                style={{
                  display: 'block',
                  color: '#facc15',
                  fontSize: '0.75rem',
                  marginBottom: '2px',
                }}
              >
                &gt; {pt.label}
              </strong>
              <span style={{ fontSize: '0.72rem', color: '#94a3b8', lineHeight: 1.35 }}>
                {pt.text}
              </span>
            </div>
          ))}
        </div>

        {/* Footer Navigation Bar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '1px solid var(--border-subtle)',
            paddingTop: '12px',
            marginTop: '4px',
          }}
        >
          <div style={{ display: 'flex', gap: '4px' }}>
            {pages.map((_, idx) => (
              <span
                key={idx}
                onClick={() => {
                  soundFx.playClick();
                  setCurrentPage(idx);
                }}
                style={{
                  width: '18px',
                  height: '4px',
                  borderRadius: '2px',
                  backgroundColor: currentPage === idx ? 'var(--color-gold)' : '#334155',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              />
            ))}
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <Button
              variant="secondary"
              size="sm"
              icon={<ChevronLeft size={14} />}
              onClick={handlePrev}
              disabled={currentPage === 0}
            >
              PREV
            </Button>
            <Button
              variant={isLastPage ? 'gold' : 'primary'}
              size="sm"
              icon={isLastPage ? undefined : <ChevronRight size={14} />}
              onClick={handleNext}
            >
              {isLastPage ? 'START RUN' : 'NEXT'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
