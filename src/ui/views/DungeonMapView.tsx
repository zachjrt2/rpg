import React, { useState } from 'react';
import type { Combatant } from '../../core/types/combat.ts';
import type { DungeonState } from '../../core/types/dungeon.ts';
import { StatBar } from '../components/StatBar.tsx';
import { PortraitAvatar } from '../components/PortraitAvatar.tsx';
import {
  SkullDeathSvg,
  GoldCoinsStackSvg,
} from '../components/RpgSvgIcons.tsx';
import { Flame, Sparkles, Crown, Store, HelpCircle, Check, Swords } from 'lucide-react';
import { soundFx } from '../audio/sound-system.ts';

interface DungeonMapViewProps {
  hero: Combatant;
  dungeon: DungeonState;
  gold: number;
  onSelectNode: (nodeId: string) => void;
}

export const DungeonMapView: React.FC<DungeonMapViewProps> = ({
  hero,
  dungeon,
  gold,
  onSelectNode,
}) => {
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const steps = [0, 1, 2, 3, 4] as const;

  const getNodeVisuals = (type: string) => {
    switch (type) {
      case 'ELITE':
        return {
          icon: <SkullDeathSvg size={22} color="#f87171" />,
          color: '#f87171',
          bg: 'rgba(239, 68, 68, 0.15)',
          tag: 'ELITE BATTLE',
        };
      case 'CAMPFIRE':
        return {
          icon: <Flame size={22} color="#fb923c" />,
          color: '#fb923c',
          bg: 'rgba(249, 115, 22, 0.15)',
          tag: 'CAMPFIRE REST',
        };
      case 'SHRINE':
        return {
          icon: <Sparkles size={22} color="#38bdf8" />,
          color: '#38bdf8',
          bg: 'rgba(56, 189, 248, 0.15)',
          tag: 'ANCIENT SHRINE',
        };
      case 'SHOP':
      case 'MERCHANT':
        return {
          icon: <Store size={22} color="#facc15" />,
          color: '#facc15',
          bg: 'rgba(250, 204, 21, 0.15)',
          tag: 'MERCHANT OUTPOST',
        };
      case 'EVENT':
        return {
          icon: <HelpCircle size={22} color="#c084fc" />,
          color: '#c084fc',
          bg: 'rgba(192, 132, 252, 0.15)',
          tag: 'ANCIENT MYSTERY',
        };
      case 'BOSS':
        return {
          icon: <Crown size={26} color="#fde047" />,
          color: '#fde047',
          bg: 'rgba(253, 224, 71, 0.2)',
          tag: 'FLOOR GUARDIAN',
        };
      default:
        return {
          icon: <Swords size={20} color="#fca5a5" />,
          color: '#fca5a5',
          bg: 'rgba(252, 165, 165, 0.15)',
          tag: 'COMBAT ENCOUNTER',
        };
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        padding: '6px',
        fontFamily: 'var(--font-mono)',
        userSelect: 'none',
      }}
    >
      {/* Top Floor Header & Party Vitals */}
      <div
        className="rpg-panel rpg-panel-gold"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '8px 16px',
          backgroundColor: 'rgba(10, 14, 20, 0.96)',
          border: '1px solid var(--border-gold)',
          flexWrap: 'wrap',
          gap: '10px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '38px', height: '38px' }}>
            <PortraitAvatar type={hero.avatar} size={38} />
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.05rem', color: '#fef08a' }}>
              &gt; {dungeon.floor.name}
            </h2>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-term-cyan)' }}>
              EXPEDITION: {hero.name} [LV.{hero.level} {hero.className}]
            </span>
          </div>
        </div>

        {/* Hero Vitals in Dungeon */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '130px' }}>
            <StatBar label="HP" current={hero.currentHp} max={hero.maxHp} variant="hp" size="sm" />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#fde047', fontWeight: 700, fontSize: '0.85rem' }}>
            <GoldCoinsStackSvg size={14} color="#fde047" />
            <span>{gold} GOLD</span>
          </div>
        </div>
      </div>

      {/* 5-Step Branching Icon Map */}
      <div
        className="rpg-panel"
        style={{
          padding: '24px 20px',
          backgroundColor: 'rgba(7, 10, 15, 0.96)',
          border: '1px solid var(--border-subtle)',
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: '16px',
          overflowX: 'auto',
          minWidth: '100%',
          minHeight: '360px',
          position: 'relative',
          touchAction: 'pan-x pan-y',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {steps.map((stepNum) => {
          const stepNodes = Object.values(dungeon.floor.nodes).filter((n) => n.step === stepNum);

          return (
            <div
              key={stepNum}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '24px',
                position: 'relative',
              }}
            >
              {/* Step Header Badge */}
              <div
                style={{
                  fontSize: '0.68rem',
                  color: stepNum === 4 ? '#fde047' : '#94a3b8',
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '3px',
                  padding: '2px 8px',
                  fontWeight: 800,
                  letterSpacing: '0.05em',
                }}
              >
                {stepNum === 4 ? 'BOSS' : `STAGE ${stepNum + 1}`}
              </div>

              {/* Step Node Sigils */}
              {stepNodes.map((node) => {
                const isAvailable = node.isAvailable && !node.isCompleted;
                const isCompleted = node.isCompleted;
                const visuals = getNodeVisuals(node.type);
                const isHovered = hoveredNodeId === node.id;

                const orbSize = node.type === 'BOSS' ? 56 : 48;

                let borderColor = visuals.color;
                let boxShadow = `0 0 8px ${visuals.color}33`;
                let opacity = 1;

                if (isCompleted) {
                  borderColor = '#22c55e';
                  boxShadow = '0 0 6px rgba(34, 197, 94, 0.3)';
                  opacity = 0.5;
                } else if (!isAvailable) {
                  borderColor = '#334155';
                  boxShadow = 'none';
                  opacity = 0.35;
                } else if (isAvailable) {
                  boxShadow = node.type === 'BOSS'
                    ? '0 0 20px rgba(250, 204, 21, 0.7), 0 0 8px #facc15'
                    : `0 0 14px ${visuals.color}80`;
                }

                return (
                  <div
                    key={node.id}
                    style={{ position: 'relative' }}
                    onMouseEnter={() => setHoveredNodeId(node.id)}
                    onMouseLeave={() => setHoveredNodeId(null)}
                  >
                    {/* Interactive Sigil Orb */}
                    <button
                      disabled={!isAvailable}
                      onClick={() => {
                        if (isAvailable) {
                          soundFx.playClick();
                          onSelectNode(node.id);
                        }
                      }}
                      style={{
                        width: `${orbSize}px`,
                        height: `${orbSize}px`,
                        borderRadius: '50%',
                        backgroundColor: isAvailable ? visuals.bg : 'rgba(10, 14, 20, 0.8)',
                        border: `2px solid ${borderColor}`,
                        boxShadow: isHovered && isAvailable ? `0 0 20px ${visuals.color}` : boxShadow,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: isAvailable ? 'pointer' : 'default',
                        opacity,
                        transition: 'all 0.18s ease',
                        transform: isHovered && isAvailable ? 'scale(1.15)' : 'none',
                        position: 'relative',
                      }}
                      title={node.name}
                    >
                      {visuals.icon}

                      {/* Completed Green Checkmark Pill */}
                      {isCompleted && (
                        <div
                          style={{
                            position: 'absolute',
                            bottom: '-4px',
                            right: '-4px',
                            width: '18px',
                            height: '18px',
                            borderRadius: '50%',
                            backgroundColor: '#22c55e',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '1.5px solid #040608',
                            boxShadow: '0 0 6px rgba(34, 197, 94, 0.8)',
                          }}
                        >
                          <Check size={11} color="#000000" strokeWidth={3.5} />
                        </div>
                      )}
                    </button>

                    {/* Rich Hover Breakdown Tooltip */}
                    {isHovered && (
                      <div
                        style={{
                          position: 'absolute',
                          bottom: 'calc(100% + 10px)',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          backgroundColor: 'rgba(10, 14, 23, 0.98)',
                          border: `1.5px solid ${visuals.color}`,
                          boxShadow: '0 8px 24px rgba(0,0,0,0.95)',
                          borderRadius: '6px',
                          padding: '8px 12px',
                          width: '210px',
                          zIndex: 999,
                          pointerEvents: 'none',
                          textAlign: 'left',
                          animation: 'fadeInModal 0.12s ease-out',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            borderBottom: '1px solid var(--border-subtle)',
                            paddingBottom: '4px',
                            marginBottom: '4px',
                          }}
                        >
                          <strong style={{ color: visuals.color, fontSize: '0.8rem' }}>
                            {node.name}
                          </strong>
                          <span
                            style={{
                              fontSize: '0.6rem',
                              color: visuals.color,
                              fontWeight: 800,
                              backgroundColor: 'rgba(255, 255, 255, 0.05)',
                              padding: '1px 4px',
                              borderRadius: '2px',
                            }}
                          >
                            [{visuals.tag}]
                          </span>
                        </div>

                        <p style={{ margin: 0, fontSize: '0.72rem', color: '#cbd5e1', lineHeight: 1.3 }}>
                          {node.description}
                        </p>

                        <div
                          style={{
                            marginTop: '6px',
                            fontSize: '0.66rem',
                            color: isCompleted ? '#86efac' : isAvailable ? visuals.color : '#64748b',
                            fontWeight: 700,
                          }}
                        >
                          {isCompleted
                            ? '✓ Chamber Cleared'
                            : isAvailable
                            ? 'Click to enter chamber'
                            : '🔒 Path Locked'}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};
