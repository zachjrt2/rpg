import React from 'react';
import type { DungeonEventDefinition, DungeonEventChoice } from '../../core/types/events.ts';
import { Button } from './Button.tsx';
import { TerminalChevronSvg } from './RpgSvgIcons.tsx';

interface DungeonEventModalProps {
  event: DungeonEventDefinition;
  gold: number;
  onSelectChoice: (choice: DungeonEventChoice) => void;
}

export const DungeonEventModal: React.FC<DungeonEventModalProps> = ({
  event,
  gold,
  onSelectChoice,
}) => {
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
          <span style={{ fontSize: '1.8rem' }}>{event.avatarIcon}</span>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <TerminalChevronSvg size={16} color="var(--text-gold)" />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-gold)', fontWeight: 700 }}>
                ANCIENT_DUNGEON_ENCOUNTER://
              </span>
            </div>
            <h2 style={{ margin: 0, fontSize: '1.25rem', color: '#fef08a' }}>{event.title}</h2>
          </div>
        </div>

        {/* Story Paragraph */}
        <div
          style={{
            padding: '14px',
            backgroundColor: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '4px',
            fontSize: '0.85rem',
            color: '#e2e8f0',
            lineHeight: 1.5,
          }}
        >
          {event.story}
        </div>

        {/* Choices List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-gold)', fontWeight: 700 }}>
            [CHOOSE YOUR PATH]:
          </span>

          {event.choices.map((choice) => {
            const hasGold = !choice.cost?.gold || gold >= choice.cost.gold;

            return (
              <div
                key={choice.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                  padding: '12px',
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  border: hasGold ? '1px solid var(--border-subtle)' : '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '4px',
                  opacity: hasGold ? 1 : 0.5,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong style={{ color: '#bae6fd', fontSize: '0.9rem' }}>{choice.label}</strong>
                  {choice.cost?.gold && (
                    <span style={{ fontSize: '0.75rem', color: hasGold ? '#fde047' : '#ef4444', fontWeight: 700 }}>
                      COST: {choice.cost.gold} GOLD
                    </span>
                  )}
                </div>

                <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  {choice.description}
                </p>

                <Button
                  variant={hasGold ? 'gold' : 'secondary'}
                  size="sm"
                  disabled={!hasGold}
                  onClick={() => onSelectChoice(choice)}
                  style={{ alignSelf: 'flex-start', marginTop: '4px' }}
                >
                  {hasGold ? '&gt; SELECT PATH' : '[CANNOT AFFORD]'}
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
