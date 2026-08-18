import React from 'react';
import type { Combatant } from '../../core/types/combat.ts';
import type { PrimaryStats } from '../../core/types/stats.ts';
import type { ProgressionState } from '../../core/types/progression.ts';
import { Button } from './Button.tsx';
import { TerminalChevronSvg } from './RpgSvgIcons.tsx';
import { Plus, Award } from 'lucide-react';

interface LevelUpModalProps {
  hero: Combatant;
  progression: ProgressionState;
  onAllocateStat: (stat: keyof PrimaryStats) => void;
  onClose: () => void;
}

export const LevelUpModal: React.FC<LevelUpModalProps> = ({
  hero,
  progression,
  onAllocateStat,
  onClose,
}) => {
  const statsList: Array<{ key: keyof PrimaryStats; name: string; desc: string; color: string }> = [
    { key: 'strength', name: 'STRENGTH', desc: 'Increases Physical Attack & health scaling', color: '#fca5a5' },
    { key: 'dexterity', name: 'DEXTERITY', desc: 'Increases Accuracy, Evasion & Critical Hit rate', color: '#fde047' },
    { key: 'intelligence', name: 'INTELLIGENCE', desc: 'Increases Magic Attack & Maximum Mana pool', color: '#93c5fd' },
    { key: 'vitality', name: 'VITALITY', desc: 'Increases Maximum Health & Physical Defense', color: '#86efac' },
    { key: 'willpower', name: 'WILLPOWER', desc: 'Increases Magic Defense, Mana Regen & Healing', color: '#d8b4fe' },
    { key: 'luck', name: 'LUCK', desc: 'Increases Critical Hits & Post-Battle Loot Drops', color: '#fed7aa' },
  ];

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
        padding: '8px',
        fontFamily: 'var(--font-mono)',
      }}
    >
      <div
        className="rpg-panel rpg-panel-gold animate-modal-in"
        style={{
          width: '100%',
          maxWidth: '680px',
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Award size={22} color="#facc15" />
          <h2 style={{ margin: 0, fontSize: '1.2rem', color: '#facc15' }}>
            LEVEL UP: HERO LEVEL {hero.level}
          </h2>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '10px 14px',
            backgroundColor: 'rgba(234, 179, 8, 0.15)',
            border: '1px solid #eab308',
            borderRadius: '4px',
          }}
        >
          <span style={{ fontSize: '0.85rem', color: '#fef08a' }}>
            Allocatable Attribute Points Remaining:
          </span>
          <span
            style={{
              fontSize: '1.1rem',
              fontWeight: 800,
              color: '#fef08a',
              backgroundColor: 'rgba(234, 179, 8, 0.25)',
              padding: '2px 10px',
              borderRadius: '3px',
              border: '1px solid #facc15',
            }}
          >
            {progression.unallocatedStatPoints} PTS
          </span>
        </div>

        {/* Stats Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '10px',
          }}
        >
          {statsList.map((st) => {
            const val = hero.primaryStats[st.key];
            const canInvest = progression.unallocatedStatPoints > 0;

            return (
              <div
                key={String(st.key)}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 12px',
                  backgroundColor: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '3px',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <strong style={{ color: st.color, fontSize: '0.9rem' }}>{st.name}:</strong>
                    <span style={{ fontSize: '1rem', fontWeight: 800, color: '#f8fafc' }}>{val}</span>
                  </div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{st.desc}</span>
                </div>

                <button
                  onClick={() => onAllocateStat(st.key)}
                  disabled={!canInvest}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '6px 10px',
                    backgroundColor: canInvest ? 'rgba(234, 179, 8, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                    border: canInvest ? '1px solid #eab308' : '1px solid #475569',
                    color: canInvest ? '#fef08a' : '#64748b',
                    borderRadius: '2px',
                    cursor: canInvest ? 'pointer' : 'default',
                    fontWeight: 700,
                    fontSize: '0.75rem',
                    transition: 'all 0.15s ease',
                  }}
                  title={`Add +1 to ${st.name}`}
                >
                  <Plus size={14} /> +1
                </button>
              </div>
            );
          })}
        </div>

        {/* Close Button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
          <Button variant="gold" size="lg" icon={<TerminalChevronSvg size={18} color="#fef08a" />} onClick={onClose}>
            &gt; CONFIRM_ATTRIBUTES
          </Button>
        </div>
      </div>
    </div>
  );
};
