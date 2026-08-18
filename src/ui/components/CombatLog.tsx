import React, { useState, useRef, useEffect } from 'react';
import type { CombatLogEntry } from '../../core/types/combat.ts';
import {
  TerminalChevronSvg,
  SwordSvg,
  ShieldSvg,
  SkullDeathSvg,
  MagicSparklesSvg,
} from './RpgSvgIcons.tsx';
import { ChevronDown, ChevronUp, X } from 'lucide-react';

interface CombatLogProps {
  entries: CombatLogEntry[];
  onClose?: () => void;
}

export const CombatLog: React.FC<CombatLogProps> = ({ entries, onClose }) => {
  const [filter, setFilter] = useState<'ALL' | 'DAMAGE' | 'SYSTEM'>('ALL');
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current && !isMinimized) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [entries, isMinimized]);

  const filteredEntries = entries.filter((e) => {
    if (filter === 'DAMAGE') return e.entryType === 'DAMAGE' || e.entryType === 'CRIT' || e.entryType === 'MISS';
    if (filter === 'SYSTEM') return e.entryType === 'INFO' || e.entryType === 'ROUND' || e.entryType === 'DEFEAT';
    return true;
  });

  const lastEntry = entries.length > 0 ? entries[entries.length - 1] : null;

  const getBadge = (entry: CombatLogEntry) => {
    switch (entry.entryType) {
      case 'CRIT':
        return (
          <span
            style={{
              fontSize: '0.68rem',
              fontWeight: 800,
              padding: '1px 5px',
              backgroundColor: '#78350f',
              border: '1px solid #f59e0b',
              color: '#fef08a',
              borderRadius: '2px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '3px',
            }}
          >
            <MagicSparklesSvg size={10} color="#fef08a" /> [CRIT]
          </span>
        );
      case 'DAMAGE':
        return (
          <span
            style={{
              fontSize: '0.68rem',
              fontWeight: 700,
              padding: '1px 5px',
              backgroundColor: '#450a0a',
              border: '1px solid #ef4444',
              color: '#fca5a5',
              borderRadius: '2px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '3px',
            }}
          >
            <SwordSvg size={10} color="#fca5a5" /> [HIT]
          </span>
        );
      case 'MISS':
        return (
          <span
            style={{
              fontSize: '0.68rem',
              fontWeight: 700,
              padding: '1px 5px',
              backgroundColor: '#1e293b',
              border: '1px solid #475569',
              color: '#94a3b8',
              borderRadius: '2px',
            }}
          >
            [MISS]
          </span>
        );
      case 'DEFEND':
        return (
          <span
            style={{
              fontSize: '0.68rem',
              fontWeight: 700,
              padding: '1px 5px',
              backgroundColor: '#064e3b',
              border: '1px solid #10b981',
              color: '#6ee7b7',
              borderRadius: '2px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '3px',
            }}
          >
            <ShieldSvg size={10} color="#6ee7b7" /> [GUARD]
          </span>
        );
      case 'DEFEAT':
        return (
          <span
            style={{
              fontSize: '0.68rem',
              fontWeight: 800,
              padding: '1px 5px',
              backgroundColor: '#380404',
              border: '1px solid #dc2626',
              color: '#f87171',
              borderRadius: '2px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '3px',
            }}
          >
            <SkullDeathSvg size={10} color="#f87171" /> [DEFEAT]
          </span>
        );
      case 'ROUND':
        return (
          <span
            style={{
              fontSize: '0.68rem',
              fontWeight: 800,
              padding: '1px 5px',
              backgroundColor: '#172554',
              border: '1px solid #3b82f6',
              color: '#93c5fd',
              borderRadius: '2px',
            }}
          >
            [ROUND {entry.round}]
          </span>
        );
      default:
        return (
          <span
            style={{
              fontSize: '0.68rem',
              fontWeight: 700,
              padding: '1px 5px',
              backgroundColor: '#0f172a',
              border: '1px solid #334155',
              color: '#38bdf8',
              borderRadius: '2px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '3px',
            }}
          >
            <TerminalChevronSvg size={9} color="#38bdf8" /> [SYS]
          </span>
        );
    }
  };

  return (
    <div
      className="rpg-panel"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: isMinimized ? 'auto' : '100%',
        maxHeight: isMinimized ? '44px' : '220px',
        width: '100%',
        backgroundColor: 'rgba(10, 14, 20, 0.96)',
        border: '1px solid var(--border-gold)',
        transition: 'all 0.2s ease',
      }}
    >
      {/* Header & Controls */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '4px 8px',
          borderBottom: isMinimized ? 'none' : '1px solid var(--border-subtle)',
          backgroundColor: 'rgba(6, 8, 12, 0.9)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <TerminalChevronSvg size={13} color="var(--text-term-green)" />
          <span
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '0.78rem',
              color: 'var(--text-term-green)',
              fontWeight: 700,
              letterSpacing: '0.05em',
            }}
          >
            BATTLE LOG
          </span>

          {isMinimized && lastEntry && (
            <span
              style={{
                fontSize: '0.72rem',
                color: '#cbd5e1',
                fontFamily: 'var(--font-mono)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                maxWidth: '220px',
              }}
            >
              {lastEntry.message}
            </span>
          )}
        </div>

        {/* Filter Buttons & Minimize Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {!isMinimized && (
            <>
              {(['ALL', 'DAMAGE', 'SYSTEM'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFilter(tab)}
                  style={{
                    background: filter === tab ? 'rgba(234, 179, 8, 0.25)' : 'transparent',
                    color: filter === tab ? '#fef08a' : 'var(--text-secondary)',
                    border: filter === tab ? '1px solid #facc15' : '1px solid #334155',
                    borderRadius: '2px',
                    padding: '1px 5px',
                    fontSize: '0.65rem',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  [{tab}]
                </button>
              ))}
            </>
          )}

          <button
            onClick={() => setIsMinimized(!isMinimized)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-secondary)',
              padding: '2px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
            }}
            title={isMinimized ? 'Expand Chronicle Log' : 'Minimize Chronicle Log'}
          >
            {isMinimized ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          {onClose && (
            <button
              onClick={onClose}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#f87171',
                padding: '2px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                marginLeft: '4px',
              }}
              title="Close Combat Log (Widen Cards)"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Log Feed */}
      {!isMinimized && (
        <div
          ref={scrollRef}
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '6px 8px',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.76rem',
            backgroundColor: 'rgba(4, 6, 8, 0.7)',
          }}
        >
          {filteredEntries.length === 0 ? (
            <div style={{ color: 'var(--text-muted)', textAlign: 'center', marginTop: '10px' }}>
              &gt; NO LOG ENTRIES RECORDED.
            </div>
          ) : (
            filteredEntries.map((entry) => (
              <div
                key={entry.id}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '6px',
                  padding: '3px 5px',
                  backgroundColor: 'rgba(255, 255, 255, 0.015)',
                  borderRadius: '2px',
                  lineHeight: 1.35,
                }}
              >
                <span style={{ color: 'var(--text-muted)', userSelect: 'none', fontSize: '0.7rem' }}>&gt;</span>
                <div style={{ paddingTop: '1px' }}>{getBadge(entry)}</div>
                <div
                  style={{
                    flex: 1,
                    color: entry.isCrit
                      ? '#fef08a'
                      : entry.entryType === 'DAMAGE'
                      ? '#fee2e2'
                      : entry.entryType === 'DEFEND'
                      ? '#a7f3d0'
                      : '#e2e8f0',
                  }}
                >
                  {entry.message}
                </div>
              </div>
            ))
          )}

          {/* Live Blinking Prompt Cursor */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px', opacity: 0.7 }}>
            <span style={{ color: 'var(--text-term-green)', fontWeight: 700, fontSize: '0.7rem' }}>&gt;</span>
            <span className="term-cursor" />
          </div>
        </div>
      )}
    </div>
  );
};
