import React, { useState } from 'react';
import type { Combatant } from '../../core/types/combat.ts';
import { PortraitAvatar } from './PortraitAvatar.tsx';
import { Users, Heart } from 'lucide-react';

interface EnemyQueuePreviewProps {
  enemyQueue: Combatant[];
}

export const EnemyQueuePreview: React.FC<EnemyQueuePreviewProps> = ({ enemyQueue }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (!enemyQueue || enemyQueue.length === 0) return null;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '6px',
        padding: '6px 6px',
        backgroundColor: 'rgba(8, 12, 20, 0.85)',
        border: '1px solid rgba(239, 68, 68, 0.35)',
        borderRadius: '6px',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(6px)',
        position: 'relative',
        userSelect: 'none',
      }}
      title={`Enemy Reserve: ${enemyQueue.length} waiting`}
    >
      {/* Mini Header Tag */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '3px',
          color: '#fca5a5',
          fontSize: '0.6rem',
          fontWeight: 800,
          fontFamily: 'var(--font-mono)',
          padding: '1px 4px',
          backgroundColor: 'rgba(239, 68, 68, 0.15)',
          borderRadius: '2px',
          border: '1px solid rgba(239, 68, 68, 0.3)',
        }}
      >
        <Users size={10} color="#ef4444" />
        <span>RESERVE ({enemyQueue.length})</span>
      </div>

      {/* Minimized Portrait Row/Column */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {enemyQueue.map((enemy, index) => {
          const isNext = index === 0;
          const isHovered = hoveredIndex === index;
          const hpPercent = Math.max(0, Math.min(100, Math.round((enemy.currentHp / enemy.maxHp) * 100)));

          return (
            <div
              key={enemy.id || index}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              style={{
                position: 'relative',
                cursor: 'pointer',
                transition: 'transform 0.15s ease',
                transform: isHovered ? 'scale(1.08)' : 'scale(1)',
              }}
            >
              {/* Portrait Container with Next / Queue Order Indicator */}
              <div
                style={{
                  position: 'relative',
                  width: '38px',
                  height: '38px',
                  borderRadius: '4px',
                  border: isNext ? '1.5px solid #ef4444' : '1px solid #475569',
                  backgroundColor: 'rgba(0, 0, 0, 0.6)',
                  boxShadow: isNext ? '0 0 8px rgba(239, 68, 68, 0.4)' : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                }}
              >
                <PortraitAvatar type={enemy.avatar} size={36} />

                {/* Next Tag / Order Badge Overlay */}
                <span
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    backgroundColor: isNext ? '#ef4444' : '#334155',
                    color: isNext ? '#ffffff' : '#94a3b8',
                    fontSize: '0.55rem',
                    fontWeight: 900,
                    fontFamily: 'var(--font-mono)',
                    padding: '0 3px',
                    borderRadius: '2px 0 0 0',
                    lineHeight: '1.2',
                  }}
                >
                  {isNext ? 'NEXT' : `#${index + 1}`}
                </span>
              </div>

              {/* Hover Tooltip with Basic Info */}
              {isHovered && (
                <div
                  style={{
                    position: 'absolute',
                    right: '48px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    zIndex: 100,
                    width: '180px',
                    padding: '8px 10px',
                    backgroundColor: 'rgba(10, 14, 24, 0.98)',
                    border: isNext ? '1px solid #ef4444' : '1px solid #64748b',
                    borderRadius: '4px',
                    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.8), 0 0 10px rgba(239, 68, 68, 0.2)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '5px',
                    pointerEvents: 'none',
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  {/* Tooltip Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong style={{ fontSize: '0.78rem', color: isNext ? '#fca5a5' : '#f8fafc' }}>
                      {enemy.name}
                    </strong>
                    <span style={{ fontSize: '0.65rem', color: '#94a3b8' }}>
                      Lv.{enemy.level}
                    </span>
                  </div>

                  {/* HP Bar */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: '#ef4444', fontWeight: 700 }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                        <Heart size={10} color="#ef4444" /> HP
                      </span>
                      <span>{enemy.currentHp} / {enemy.maxHp}</span>
                    </div>
                    <div
                      style={{
                        width: '100%',
                        height: '4px',
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        borderRadius: '2px',
                        overflow: 'hidden',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                      }}
                    >
                      <div
                        style={{
                          width: `${hpPercent}%`,
                          height: '100%',
                          backgroundColor: hpPercent > 50 ? '#22c55e' : hpPercent > 25 ? '#eab308' : '#ef4444',
                        }}
                      />
                    </div>
                  </div>

                  {/* Queue Status Note */}
                  <span style={{ fontSize: '0.62rem', color: isNext ? '#fecaca' : '#94a3b8', lineHeight: 1.2 }}>
                    {isNext ? '⚡ Enters battle immediately when current foe falls.' : `⏳ In queue (Position #${index + 1})`}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
