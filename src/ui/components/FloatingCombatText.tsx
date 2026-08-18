import React from 'react';
import type { FloatingText } from '../../core/types/combat.ts';

interface FloatingCombatTextProps {
  floatingTexts: FloatingText[];
}

export const FloatingCombatText: React.FC<FloatingCombatTextProps> = ({ floatingTexts }) => {
  return (
    <div
      style={{
        position: 'absolute',
        top: '20%',
        left: '50%',
        transform: 'translateX(-50%)',
        pointerEvents: 'none',
        zIndex: 50,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '4px',
      }}
    >
      {floatingTexts.map((ft) => {
        const getStyle = () => {
          switch (ft.type) {
            case 'crit':
              return {
                color: '#fbbf24',
                fontSize: '1.6rem',
                fontWeight: 900,
                textShadow: '0 0 12px rgba(245, 158, 11, 0.8), 2px 2px 0 #000',
              };
            case 'damage':
              return {
                color: '#ef4444',
                fontSize: '1.4rem',
                fontWeight: 800,
                textShadow: '0 0 8px rgba(239, 68, 68, 0.8), 2px 2px 0 #000',
              };
            case 'miss':
              return {
                color: '#94a3b8',
                fontSize: '1.2rem',
                fontWeight: 700,
                textShadow: '2px 2px 0 #000',
              };
            case 'defend':
              return {
                color: '#34d399',
                fontSize: '1.3rem',
                fontWeight: 800,
                textShadow: '0 0 10px rgba(16, 185, 129, 0.8), 2px 2px 0 #000',
              };
            case 'heal':
              return {
                color: '#10b981',
                fontSize: '1.4rem',
                fontWeight: 800,
                textShadow: '0 0 8px rgba(16, 185, 129, 0.8), 2px 2px 0 #000',
              };
            default:
              return {
                color: '#f8fafc',
                fontSize: '1.2rem',
                fontWeight: 700,
                textShadow: '2px 2px 0 #000',
              };
          }
        };

        return (
          <div
            key={ft.id}
            style={{
              fontFamily: 'var(--font-heading)',
              letterSpacing: '0.05em',
              animation: 'floatUpFade 1.2s cubic-bezier(0.1, 0.9, 0.2, 1) forwards',
              whiteSpace: 'nowrap',
              ...getStyle(),
            }}
          >
            {ft.text}
          </div>
        );
      })}
    </div>
  );
};
