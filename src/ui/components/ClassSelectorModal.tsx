import React from 'react';
import type { CharacterClassId } from '../../core/types/classes.ts';
import { CHARACTER_CLASSES } from '../../core/data/classes.ts';
import { PortraitAvatar } from './PortraitAvatar.tsx';
import { Button } from './Button.tsx';
import { TerminalChevronSvg } from './RpgSvgIcons.tsx';
import { X, Check } from 'lucide-react';

interface ClassSelectorModalProps {
  currentClassId: string;
  onSelectClass: (classId: CharacterClassId) => void;
  onClose: () => void;
}

export const ClassSelectorModal: React.FC<ClassSelectorModalProps> = ({
  currentClassId,
  onSelectClass,
  onClose,
}) => {
  const classList = Object.values(CHARACTER_CLASSES);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(4, 6, 8, 0.92)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
        padding: '20px',
        fontFamily: 'var(--font-mono)',
      }}
    >
      <div
        className="rpg-panel rpg-panel-gold animate-modal-in"
        style={{
          width: '100%',
          maxWidth: '900px',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          backgroundColor: 'rgba(10, 14, 20, 0.98)',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TerminalChevronSvg size={20} color="var(--text-term-green)" />
            <h2 style={{ margin: 0, fontSize: '1.35rem', color: 'var(--text-term-green)' }}>
              SELECT_HERO_ARCHETYPE://
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
            }}
          >
            <X size={22} />
          </button>
        </div>

        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
          Select a character class to inspect its attributes, starting loadout, and playstyle.
        </p>

        {/* Classes Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '12px',
          }}
        >
          {classList.map((cls) => {
            const isSelected = cls.id === currentClassId;

            return (
              <div
                key={cls.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '14px',
                  backgroundColor: isSelected ? 'rgba(212, 163, 75, 0.12)' : 'rgba(255, 255, 255, 0.02)',
                  border: isSelected ? '2px solid var(--border-gold-bright)' : '1px solid var(--border-subtle)',
                  borderRadius: '4px',
                  gap: '10px',
                  transition: 'all 0.18s ease',
                  boxShadow: isSelected ? '0 0 16px rgba(243, 195, 96, 0.4)' : 'none',
                }}
              >
                {/* Header & Avatar */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      width: '56px',
                      height: '72px',
                      borderRadius: '4px',
                      overflow: 'hidden',
                      backgroundColor: '#161e2c',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <PortraitAvatar type={cls.avatar} size={50} />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.15rem', color: isSelected ? '#fef08a' : '#e2e8f0' }}>
                      {cls.name}
                    </h3>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-term-cyan)' }}>{cls.role}</span>
                  </div>
                </div>

                {/* Description */}
                <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.35 }}>
                  {cls.description}
                </p>

                {/* Primary Stats Grid */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '4px',
                    padding: '6px',
                    backgroundColor: 'rgba(0, 0, 0, 0.4)',
                    borderRadius: '2px',
                    fontSize: '0.75rem',
                  }}
                >
                  <span style={{ color: '#fca5a5' }}>STR:{cls.baseStats.strength}</span>
                  <span style={{ color: '#fde047' }}>DEX:{cls.baseStats.dexterity}</span>
                  <span style={{ color: '#93c5fd' }}>INT:{cls.baseStats.intelligence}</span>
                  <span style={{ color: '#86efac' }}>VIT:{cls.baseStats.vitality}</span>
                  <span style={{ color: '#d8b4fe' }}>WIL:{cls.baseStats.willpower}</span>
                  <span style={{ color: '#fed7aa' }}>LUK:{cls.baseStats.luck}</span>
                </div>

                {/* Select Button */}
                <Button
                  variant={isSelected ? 'gold' : 'secondary'}
                  size="sm"
                  icon={isSelected ? <Check size={16} /> : undefined}
                  onClick={() => {
                    onSelectClass(cls.id);
                    onClose();
                  }}
                  style={{ width: '100%', marginTop: 'auto' }}
                >
                  {isSelected ? '[ACTIVE_CLASS]' : `> DEPLOY ${cls.name.toUpperCase()}`}
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
