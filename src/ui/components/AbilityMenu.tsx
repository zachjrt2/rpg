import React from 'react';
import type { Combatant } from '../../core/types/combat.ts';
import { ABILITIES } from '../../core/data/abilities.ts';
import { Button } from './Button.tsx';
import { InfoTooltip } from './InfoTooltip.tsx';
import {
  SwordSvg,
  ShieldSvg,
  MagicSparklesSvg,
  TerminalChevronSvg,
} from './RpgSvgIcons.tsx';
import { X, Sparkles } from 'lucide-react';

interface AbilityMenuProps {
  hero: Combatant;
  selectedTarget?: Combatant | null;
  onCastAbility: (abilityId: string) => void;
  onClose: () => void;
}

export const AbilityMenu: React.FC<AbilityMenuProps> = ({
  hero,
  onCastAbility,
  onClose,
}) => {
  const getAbilityIcon = (type: string, element: string) => {
    if (type === 'HEAL' || element === 'HOLY') return <Sparkles size={16} color="#fef08a" />;
    if (type === 'BUFF' || type === 'DEFEND') return <ShieldSvg size={16} color="#6ee7b7" />;
    if (type === 'MAGICAL') return <MagicSparklesSvg size={16} color="#c084fc" />;
    return <SwordSvg size={16} color="#fca5a5" />;
  };

  return (
    <div
      className="rpg-panel rpg-panel-gold animate-modal-in"
      style={{
        padding: '14px 16px',
        backgroundColor: 'rgba(10, 14, 20, 0.98)',
        border: '1px solid var(--border-gold)',
        boxShadow: 'var(--shadow-gold)',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        fontFamily: 'var(--font-mono)',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <TerminalChevronSvg size={16} color="var(--text-term-green)" />
          <span
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '0.95rem',
              color: 'var(--text-term-green)',
              fontWeight: 700,
            }}
          >
            EXECUTE_TACTICAL_ABILITY://
          </span>
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
          <X size={18} />
        </button>
      </div>

      {/* Abilities Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '8px',
        }}
      >
        {hero.abilities.map((abilityId) => {
          const ability = ABILITIES[abilityId];
          if (!ability) return null;

          const cd = hero.abilityCooldowns[abilityId] ?? 0;
          const isOffCooldown = cd <= 0;
          const hasEnoughMana = hero.currentMana >= ability.cost.mana;
          const canCast = isOffCooldown && hasEnoughMana;

          return (
            <div
              key={ability.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 12px',
                backgroundColor: 'rgba(255, 255, 255, 0.02)',
                border: canCast ? '1px solid var(--border-subtle)' : '1px solid rgba(255, 255, 255, 0.05)',
                borderRadius: '3px',
                gap: '8px',
                opacity: canCast ? 1 : 0.6,
              }}
            >
              {/* Title & Tooltip Info */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                {getAbilityIcon(ability.type, ability.element)}
                <span style={{ color: canCast ? '#fef08a' : 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 700 }}>
                  {ability.name}
                </span>
                <InfoTooltip
                  content={
                    <div>
                      <strong style={{ color: '#fef08a', display: 'block', marginBottom: '2px' }}>
                        {ability.name} [{ability.element} {ability.type}]
                      </strong>
                      <span>{ability.description}</span>
                      <div style={{ marginTop: '4px', fontSize: '0.7rem', color: '#93c5fd' }}>
                        Cost: {ability.cost.mana} MP | CD: {ability.cooldown} Turns
                      </div>
                    </div>
                  }
                  size={13}
                  color="#facc15"
                />
              </div>

              {/* Cast Action Button */}
              <Button
                variant={canCast ? 'gold' : 'secondary'}
                size="sm"
                disabled={!canCast}
                onClick={() => {
                  onCastAbility(ability.id);
                  onClose();
                }}
              >
                {isOffCooldown ? `${ability.cost.mana}MP` : `CD:${cd}`}
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
