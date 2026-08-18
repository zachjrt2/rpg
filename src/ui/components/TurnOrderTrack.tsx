import React from 'react';
import type { Combatant } from '../../core/types/combat.ts';
import { PortraitAvatar } from './PortraitAvatar.tsx';

interface TurnOrderTrackProps {
  round: number;
  turnOrder: string[];
  activeCombatantId: string;
  combatants: Record<string, Combatant>;
}

export const TurnOrderTrack: React.FC<TurnOrderTrackProps> = ({
  round,
  turnOrder,
  activeCombatantId,
  combatants,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '6px 12px',
        backgroundColor: 'rgba(6, 9, 14, 0.85)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '4px',
        width: '100%',
        overflowX: 'auto',
      }}
    >
      {/* Round Indicator */}
      <span
        style={{
          fontSize: '0.75rem',
          fontFamily: 'var(--font-mono)',
          fontWeight: 800,
          color: 'var(--text-gold)',
          backgroundColor: 'rgba(201, 151, 56, 0.15)',
          padding: '3px 8px',
          borderRadius: '2px',
          border: '1px solid var(--border-gold)',
          whiteSpace: 'nowrap',
        }}
      >
        ROUND {round}
      </span>

      {/* Sleek Turn Order Avatars */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        {turnOrder.map((id, index) => {
          const combatant = combatants[id];
          if (!combatant) return null;

          const isActive = id === activeCombatantId;
          const isDead = combatant.isDead || combatant.currentHp <= 0;
          const isHero = combatant.type === 'HERO';

          return (
            <div
              key={`${id}-${index}`}
              title={`${combatant.name} (${combatant.className})`}
              style={{
                position: 'relative',
                width: isActive ? '32px' : '26px',
                height: isActive ? '32px' : '26px',
                borderRadius: '50%',
                border: isActive
                  ? '2px solid #facc15'
                  : isHero
                  ? '1px solid #38bdf8'
                  : '1px solid #f87171',
                boxShadow: isActive ? '0 0 8px rgba(250, 204, 21, 0.8)' : 'none',
                backgroundColor: isHero ? '#0f172a' : '#271010',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                opacity: isDead ? 0.25 : 1,
                transition: 'all 0.2s ease',
              }}
            >
              <PortraitAvatar type={combatant.avatar} isDead={isDead} size={isActive ? 32 : 26} />
            </div>
          );
        })}
      </div>
    </div>
  );
};
