import React from 'react';
import type { Combatant } from '../../core/types/combat.ts';
import { PortraitAvatar } from './PortraitAvatar.tsx';
import { Button } from './Button.tsx';
import {
  SwordSvg,
  ShieldSvg,
  MagicSparklesSvg,
  BackpackBagSvg,
  CrosshairReticleSvg,
} from './RpgSvgIcons.tsx';

interface ActionDockProps {
  isPlayerTurn: boolean;
  selectedTarget: Combatant | null;
  hero: Combatant;
  isAbilityMenuOpen: boolean;
  isItemMenuOpen: boolean;
  onAttack: () => void;
  onDefend: () => void;
  onToggleAbilities: () => void;
  onToggleItems: () => void;
}

export const ActionDock: React.FC<ActionDockProps> = ({
  isPlayerTurn,
  selectedTarget,
  hero,
  isAbilityMenuOpen,
  isItemMenuOpen,
  onAttack,
  onDefend,
  onToggleAbilities,
  onToggleItems,
}) => {
  return (
    <div
      className="rpg-panel rpg-panel-gold"
      style={{
        width: '100%',
        padding: '12px 16px',
        backgroundColor: 'rgba(8, 12, 18, 0.96)',
        border: '1px solid var(--border-gold)',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        fontFamily: 'var(--font-mono)',
      }}
    >
      {/* Top Banner: Active Hero Details + Target Status */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
        {/* Active Hero Bio */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '3px', border: '1px solid var(--border-gold)', overflow: 'hidden' }}>
            <PortraitAvatar type={hero.avatar} size={36} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <strong style={{ color: '#fef08a', fontSize: '0.95rem' }}>{hero.name}</strong>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-term-cyan)' }}>
                [LV.{hero.level} {hero.className}]
              </span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', gap: '10px' }}>
              <span style={{ color: '#86efac' }}>HP: {hero.currentHp}/{hero.maxHp}</span>
              {(hero.shieldHp || 0) > 0 && (
                <span style={{ color: '#38bdf8' }}>SHIELD: {hero.shieldHp}</span>
              )}
            </div>
          </div>
        </div>

        {/* Selected Target Status */}
        {selectedTarget ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.8rem',
              backgroundColor: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              padding: '4px 10px',
              borderRadius: '3px',
            }}
          >
            <CrosshairReticleSvg size={13} color="#ef4444" />
            <span style={{ color: 'var(--text-muted)' }}>TARGET:</span>
            <strong style={{ color: '#fca5a5' }}>{selectedTarget.name}</strong>
            <span style={{ color: '#fecaca' }}>[{selectedTarget.currentHp}/{selectedTarget.maxHp} HP]</span>
          </div>
        ) : (
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {isPlayerTurn ? 'SELECT A TARGET MONSTER' : 'ENEMY ACTING...'}
          </span>
        )}
      </div>

      {/* Action Commands Row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '8px',
        }}
      >
        {/* Attack */}
        <Button
          variant="danger"
          size="md"
          icon={<SwordSvg size={16} color="#fca5a5" />}
          onClick={onAttack}
          disabled={!isPlayerTurn || !selectedTarget || selectedTarget.isDead}
        >
          ATTACK
        </Button>

        {/* Defend */}
        <Button
          variant="gold"
          size="md"
          icon={<ShieldSvg size={16} color="#fef08a" />}
          onClick={onDefend}
          disabled={!isPlayerTurn || hero.isDefending}
        >
          {hero.isDefending ? 'GUARDED' : 'DEFEND'}
        </Button>

        {/* Abilities */}
        <Button
          variant={isAbilityMenuOpen ? 'gold' : 'secondary'}
          size="md"
          icon={<MagicSparklesSvg size={16} color={isAbilityMenuOpen ? '#fef08a' : '#a855f7'} />}
          disabled={!isPlayerTurn}
          onClick={onToggleAbilities}
        >
          {isAbilityMenuOpen ? 'CLOSE' : 'SKILLS'}
        </Button>

        {/* Items */}
        <Button
          variant={isItemMenuOpen ? 'primary' : 'secondary'}
          size="md"
          icon={<BackpackBagSvg size={16} color={isItemMenuOpen ? '#ffffff' : '#38bdf8'} />}
          disabled={!isPlayerTurn}
          onClick={onToggleItems}
        >
          {isItemMenuOpen ? 'CLOSE' : 'ITEMS'}
        </Button>
      </div>
    </div>
  );
};
