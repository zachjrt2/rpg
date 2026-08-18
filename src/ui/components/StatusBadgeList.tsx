import React, { useState } from 'react';
import type { ActiveStatusEffect } from '../../core/types/status-effects.ts';
import { FireFlameSvg, BloodDropSvg, ShieldAegisSvg } from './RpgSvgIcons.tsx';
import { Zap, Snowflake, AlertTriangle, Wind, Sparkles, VolumeX, ShieldAlert, EyeOff, ShieldCheck } from 'lucide-react';

interface StatusBadgeListProps {
  statusEffects: ActiveStatusEffect[];
  shieldHp?: number;
}

export const StatusBadgeList: React.FC<StatusBadgeListProps> = ({ statusEffects, shieldHp = 0 }) => {
  const [hoveredEffectId, setHoveredEffectId] = useState<string | null>(null);

  if (statusEffects.length === 0 && shieldHp <= 0) return null;

  const getEffectDetails = (type: string, potency: number = 0) => {
    switch (type) {
      case 'BURNING':
        return {
          bg: '#451a03',
          border: '#f97316',
          text: '#fed7aa',
          icon: <FireFlameSvg size={12} color="#f97316" />,
          label: 'BURN',
          desc: `Burning: Takes ${potency || 6} Fire damage at the start of each turn.`,
        };
      case 'POISON':
        return {
          bg: '#14532d',
          border: '#22c55e',
          text: '#bbf7d0',
          icon: <span style={{ fontSize: '11px', lineHeight: 1 }}>🧪</span>,
          label: 'POISON',
          desc: `Poison: Takes ${potency || 4} Nature damage directly to HP (pierces shield), decaying by 1 each round.`,
        };
      case 'BLEEDING':
        return {
          bg: '#450a0a',
          border: '#ef4444',
          text: '#fca5a5',
          icon: <BloodDropSvg size={12} color="#ef4444" />,
          label: 'BLEED',
          desc: `Bleeding: Takes ${potency || 4} Physical damage whenever taking actions.`,
        };
      case 'STUNNED':
        return {
          bg: '#3b0764',
          border: '#eab308',
          text: '#fef08a',
          icon: <Zap size={12} color="#facc15" />,
          label: 'STUN',
          desc: 'Stunned: Skips next turn entirely.',
        };
      case 'FROZEN':
        return {
          bg: '#0c4a6e',
          border: '#38bdf8',
          text: '#bae6fd',
          icon: <Snowflake size={12} color="#38bdf8" />,
          label: 'FROZEN',
          desc: 'Frozen: Incapacitated. Takes +30% Lightning and Fire damage.',
        };
      case 'WEAKENED':
        return {
          bg: '#292524',
          border: '#a8a29e',
          text: '#e7e5e4',
          icon: <AlertTriangle size={12} color="#a8a29e" />,
          label: 'WEAK',
          desc: 'Weakened: Attack damage reduced by 30%.',
        };
      case 'HASTE':
        return {
          bg: '#064e3b',
          border: '#34d399',
          text: '#a7f3d0',
          icon: <Wind size={12} color="#34d399" />,
          label: 'HASTE',
          desc: 'Haste: Speed increased significantly.',
        };
      case 'REGENERATION':
        return {
          bg: '#065f46',
          border: '#10b981',
          text: '#6ee7b7',
          icon: <Sparkles size={12} color="#34d399" />,
          label: 'REGEN',
          desc: `Regeneration: Heals +${potency || 10} HP at the start of turn, decaying by 1 each round.`,
        };
      case 'SHIELDED':
        return {
          bg: '#1e1b4b',
          border: '#818cf8',
          text: '#c7d2fe',
          icon: <ShieldAegisSvg size={12} color="#818cf8" />,
          label: 'SHIELD',
          desc: 'Shielded: Extra barrier absorbing incoming damage.',
        };
      case 'SILENCED':
        return {
          bg: '#3f3f46',
          border: '#71717a',
          text: '#d4d4d8',
          icon: <VolumeX size={12} color="#d4d4d8" />,
          label: 'SILENCE',
          desc: 'Silenced: Unable to cast spells or skills.',
        };
      case 'VULNERABLE':
        return {
          bg: '#450a0a',
          border: '#f87171',
          text: '#fca5a5',
          icon: <ShieldAlert size={12} color="#f87171" />,
          label: 'VULNERABLE',
          desc: 'Vulnerable: Takes 30% more damage from all incoming attacks.',
        };
      case 'SHOCKED':
        return {
          bg: '#422006',
          border: '#eab308',
          text: '#fef08a',
          icon: <Zap size={12} color="#eab308" />,
          label: 'SHOCK',
          desc: 'Shocked: Electrified. Takes bonus damage when attacked.',
        };
      case 'CORROSION':
        return {
          bg: '#1e293b',
          border: '#a3e635',
          text: '#bef264',
          icon: <span style={{ fontSize: '11px', lineHeight: 1 }}>🧪</span>,
          label: 'ACID',
          desc: `Corrosion: Dissolves ${potency || 5} Block and deals acid damage.`,
        };
      case 'THORNS':
        return {
          bg: '#14532d',
          border: '#4ade80',
          text: '#86efac',
          icon: <span style={{ fontSize: '11px', lineHeight: 1 }}>🌵</span>,
          label: 'THORNS',
          desc: `Thorns: Reflects ${potency || 4} counter-damage when struck by attackers.`,
        };
      case 'EMPOWERED':
        return {
          bg: '#3b0764',
          border: '#c084fc',
          text: '#f5d0fe',
          icon: <Sparkles size={12} color="#c084fc" />,
          label: 'EMPOWERED',
          desc: 'Empowered: Card damage and attack potency boosted by +25%.',
        };
      case 'BLINDED':
        return {
          bg: '#18181b',
          border: '#71717a',
          text: '#a1a1aa',
          icon: <EyeOff size={12} color="#a1a1aa" />,
          label: 'BLIND',
          desc: 'Blinded: 40% chance for physical attacks to miss.',
        };
      case 'FORTIFIED':
        return {
          bg: '#0c4a6e',
          border: '#0284c7',
          text: '#7dd3fc',
          icon: <ShieldCheck size={12} color="#0284c7" />,
          label: 'FORTIFIED',
          desc: 'Fortified: Damage taken reduced by 25%.',
        };
      default:
        return {
          bg: '#1f2937',
          border: '#4b5563',
          text: '#e5e7eb',
          icon: <Sparkles size={12} color="#e5e7eb" />,
          label: type,
          desc: `${type} effect active.`,
        };
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '4px',
        marginTop: '4px',
        position: 'relative',
      }}
    >
      {/* Shield HP Indicator */}
      {shieldHp > 0 && (
        <span
          style={{
            fontSize: '0.68rem',
            fontFamily: 'var(--font-mono)',
            fontWeight: 700,
            padding: '1px 5px',
            backgroundColor: '#1e1b4b',
            border: '1px solid #818cf8',
            color: '#c7d2fe',
            borderRadius: '3px',
            boxShadow: '0 0 6px rgba(129, 140, 248, 0.4)',
            cursor: 'help',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '3px',
          }}
          title={`Active Barrier: Absorbs up to ${shieldHp} incoming damage before health is lost.`}
        >
          <ShieldAegisSvg size={11} color="#818cf8" />
          <span>{shieldHp}</span>
        </span>
      )}

      {/* Active Status Effects */}
      {statusEffects.map((effect) => {
        const details = getEffectDetails(effect.type, effect.potency);
        const isHovered = hoveredEffectId === effect.id;
        const displayValue = effect.potency && effect.potency > 0 ? effect.potency : effect.remainingTurns;

        return (
          <div
            key={effect.id}
            style={{ position: 'relative' }}
            onMouseEnter={() => setHoveredEffectId(effect.id)}
            onMouseLeave={() => setHoveredEffectId(null)}
          >
            <span
              style={{
                fontSize: '0.68rem',
                fontFamily: 'var(--font-mono)',
                fontWeight: 700,
                padding: '1px 5px',
                backgroundColor: details.bg,
                border: `1px solid ${details.border}`,
                color: details.text,
                borderRadius: '3px',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '3px',
                transition: 'all 0.15s ease',
                boxShadow: isHovered ? `0 0 8px ${details.border}` : 'none',
              }}
            >
              {details.icon}
              <span>{displayValue}</span>
            </span>

            {/* Hover Tooltip Breakdown */}
            {isHovered && (
              <div
                style={{
                  position: 'absolute',
                  bottom: 'calc(100% + 6px)',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  backgroundColor: 'rgba(10, 14, 22, 0.98)',
                  border: `1px solid ${details.border}`,
                  borderRadius: '4px',
                  padding: '6px 10px',
                  zIndex: 200,
                  whiteSpace: 'nowrap',
                  pointerEvents: 'none',
                  boxShadow: '0 4px 14px rgba(0, 0, 0, 0.8)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '2px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  {details.icon}
                  <strong style={{ color: details.text, fontSize: '0.74rem' }}>
                    {details.label}
                  </strong>
                  <span style={{ fontSize: '0.65rem', color: '#94a3b8' }}>
                    [{effect.remainingTurns} TURNS LEFT]
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: '0.68rem', color: '#e2e8f0', maxWidth: '240px', whiteSpace: 'normal', lineHeight: 1.3 }}>
                  {details.desc}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
