import React, { useState, useEffect } from 'react';
import type { Item } from '../../core/types/items.ts';
import { soundFx } from '../audio/sound-system.ts';
import {
  FlaskConical,
  Flame,
  Zap,
  Shield,
  Sparkles,
  Heart,
  Bomb,
  ScrollText,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';

interface ConsumablesQuickBarProps {
  potions: Item[];
  isPlayerTurn: boolean;
  onUsePotion: (potion: Item, index: number) => void;
}

export const ConsumablesQuickBar: React.FC<ConsumablesQuickBarProps> = ({
  potions,
  isPlayerTurn,
  onUsePotion,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const getItemIcon = (item: Item) => {
    const eff = item.consumableEffect;
    if (!eff) return <FlaskConical size={15} color="#38bdf8" />;

    switch (eff.type) {
      case 'HEAL_HP':
        return <Heart size={15} color="#ef4444" />;
      case 'RESTORE_ENERGY':
      case 'HEAL_MANA':
        return <Zap size={15} color="#facc15" />;
      case 'RESTORE_SHIELD':
        return <Shield size={15} color="#38bdf8" />;
      case 'CURE_STATUS':
      case 'APPLY_BUFF':
        return <Sparkles size={15} color="#c084fc" />;
      case 'DAMAGE_ENEMY':
        return eff.damageElement === 'FIRE' ? (
          <Flame size={15} color="#f87171" />
        ) : (
          <Bomb size={15} color="#fb923c" />
        );
      case 'DRAW_CARDS':
        return <ScrollText size={15} color="#a78bfa" />;
      default:
        return <FlaskConical size={15} color="#38bdf8" />;
    }
  };

  const getItemGlowColor = (item: Item) => {
    const eff = item.consumableEffect;
    if (!eff) return '#38bdf8';
    switch (eff.type) {
      case 'HEAL_HP':
        return '#ef4444';
      case 'RESTORE_ENERGY':
      case 'HEAL_MANA':
        return '#facc15';
      case 'RESTORE_SHIELD':
        return '#38bdf8';
      case 'CURE_STATUS':
        return '#4ade80';
      case 'APPLY_BUFF':
        return '#c084fc';
      case 'DAMAGE_ENEMY':
        return '#fb923c';
      case 'DRAW_CARDS':
        return '#a78bfa';
      default:
        return '#38bdf8';
    }
  };

  // Keyboard Hotkeys: [1], [2], [3]
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTag = document.activeElement?.tagName.toLowerCase();
      if (activeTag === 'input' || activeTag === 'textarea') return;

      const key = e.key.toUpperCase();
      if (key === 'P') {
        soundFx.playClick();
        setIsOpen((prev) => !prev);
        return;
      }

      if (!isPlayerTurn) return;

      const hotkeyMap: Record<string, number> = { '1': 0, '2': 1, '3': 2, '4': 3 };
      if (hotkeyMap[key] !== undefined) {
        const potion = potions[hotkeyMap[key]];
        if (potion) {
          soundFx.playClick();
          onUsePotion(potion, hotkeyMap[key]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlayerTurn, potions, onUsePotion]);

  const hotkeys = ['1', '2', '3', '4'];

  if (potions.length === 0) return null;

  // COLLAPSED COMPACT STATE
  if (!isOpen) {
    return (
      <button
        onClick={() => {
          soundFx.playClick();
          setIsOpen(true);
        }}
        title="Potion Belt [P]: Click to open potion quick-bar"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '4px 10px',
          backgroundColor: 'rgba(10, 14, 23, 0.92)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '6px',
          cursor: 'pointer',
          boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
          transition: 'all 0.15s ease',
          userSelect: 'none',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'var(--border-gold)';
          e.currentTarget.style.transform = 'translateY(-1px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'var(--border-subtle)';
          e.currentTarget.style.transform = 'none';
        }}
      >
        <FlaskConical size={14} color="#facc15" />
        <span
          style={{
            fontSize: '0.72rem',
            fontFamily: 'var(--font-heading)',
            color: '#fef08a',
            fontWeight: 800,
            letterSpacing: '0.05em',
          }}
        >
          POTIONS
        </span>
        <span
          style={{
            fontSize: '0.65rem',
            color: '#38bdf8',
            backgroundColor: 'rgba(56, 189, 248, 0.15)',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            padding: '1px 5px',
            borderRadius: '3px',
            fontWeight: 800,
          }}
        >
          {potions.length}
        </span>
        <ChevronUp size={13} color="#94a3b8" />
      </button>
    );
  }

  // EXPANDED OPEN STATE
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: '4px 8px',
        backgroundColor: 'rgba(10, 14, 23, 0.96)',
        border: '1px solid var(--border-gold)',
        borderRadius: '6px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.7)',
        position: 'relative',
        animation: 'fadeInModal 0.15s ease-out',
      }}
    >
      <button
        onClick={() => {
          soundFx.playClick();
          setIsOpen(false);
        }}
        title="Close Potion Belt [P]"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          padding: '3px 6px',
          background: 'none',
          border: 'none',
          borderRight: '1px solid var(--border-subtle)',
          cursor: 'pointer',
          color: '#fef08a',
          marginRight: '2px',
        }}
      >
        <FlaskConical size={13} color="#facc15" />
        <ChevronDown size={13} color="#94a3b8" />
      </button>

      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
        {potions.map((potion, index) => {
          const glowColor = getItemGlowColor(potion);
          const isHovered = hoveredIndex === index;
          const hotkey = hotkeys[index];

          return (
            <div
              key={`${potion.id}-${index}`}
              style={{ position: 'relative' }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <button
                disabled={!isPlayerTurn}
                onClick={() => {
                  soundFx.playClick();
                  onUsePotion(potion, index);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '4px 8px',
                  backgroundColor: isHovered
                    ? 'rgba(255, 255, 255, 0.1)'
                    : 'rgba(255, 255, 255, 0.03)',
                  border: `1px solid ${glowColor}`,
                  borderRadius: '4px',
                  cursor: isPlayerTurn ? 'pointer' : 'not-allowed',
                  opacity: isPlayerTurn ? 1 : 0.5,
                  transition: 'all 0.15s ease',
                  boxShadow: isHovered ? `0 0 10px ${glowColor}60` : 'none',
                  transform: isHovered && isPlayerTurn ? 'translateY(-2px)' : 'none',
                }}
                title={potion.name}
              >
                <span style={{ display: 'flex', alignItems: 'center' }}>
                  {getItemIcon(potion)}
                </span>
                <span style={{ fontSize: '0.72rem', color: '#f8fafc', fontWeight: 700 }}>
                  {potion.name}
                </span>
                {hotkey && (
                  <span
                    style={{
                      fontSize: '0.6rem',
                      color: '#94a3b8',
                      fontWeight: 700,
                    }}
                  >
                    [{hotkey}]
                  </span>
                )}
              </button>

              {/* Hover Breakdown Tooltip */}
              {isHovered && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: 'calc(100% + 8px)',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: 'rgba(10, 14, 23, 0.98)',
                    border: `1px solid ${glowColor}`,
                    boxShadow: '0 8px 24px rgba(0,0,0,0.9)',
                    borderRadius: '5px',
                    padding: '8px 12px',
                    width: '210px',
                    zIndex: 999,
                    pointerEvents: 'none',
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
                    <strong style={{ color: '#f8fafc', fontSize: '0.8rem' }}>{potion.name}</strong>
                    <span style={{ fontSize: '0.68rem', color: '#fde047', fontWeight: 800 }}>
                      SLOT {index + 1}
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.72rem', color: '#94a3b8', lineHeight: 1.35 }}>
                    {potion.description}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
