import React from 'react';
import type { Combatant, FloatingText } from '../../core/types/combat.ts';
import type { MonsterAffixType } from '../../core/types/affixes.ts';
import type { EnemyIntent } from '../../core/types/intent.ts';
import { MONSTER_AFFIXES } from '../../core/types/affixes.ts';
import { PortraitAvatar } from './PortraitAvatar.tsx';
import { FloatingCombatText } from './FloatingCombatText.tsx';
import { StatusBadgeList } from './StatusBadgeList.tsx';
import { CrosshairReticleSvg, ShieldSvg, SwordSvg, FireFlameSvg } from './RpgSvgIcons.tsx';
import { Sparkles, FlaskConical } from 'lucide-react';

interface CombatantCardProps {
  combatant: Combatant;
  isActiveTurn: boolean;
  isSelectedTarget: boolean;
  onSelectTarget?: () => void;
  floatingTexts: FloatingText[];
  isHitAnimating?: boolean;
  affixes?: MonsterAffixType[];
  position?: 'FRONTLINE' | 'BACKLINE';
  enemyQueueCount?: number;
  intent?: EnemyIntent | null; // Telegraphed intent for enemies
}

export const CombatantCard: React.FC<CombatantCardProps> = ({
  combatant,
  isActiveTurn,
  isSelectedTarget,
  onSelectTarget,
  floatingTexts,
  isHitAnimating = false,
  affixes = [],
  enemyQueueCount = 0,
  intent,
}) => {
  const isHero = combatant.type === 'HERO';
  const isDead = combatant.isDead || combatant.currentHp <= 0;

  const hpPercent = Math.max(0, Math.min(100, Math.round((combatant.currentHp / combatant.maxHp) * 100)));

  const spriteSize = isHero ? 72 : 82;
  const spriteHeight = Math.round(spriteSize * 1.3);

  const getIntentBadge = () => {
    if (!intent || isDead || isHero) return null;

    let badgeColor = '#f87171';
    let badgeIcon = <SwordSvg size={12} color="#f87171" />;
    let badgeText = `${intent.damage ?? 0}`;

    if (intent.type === 'DEFEND') {
      badgeColor = '#38bdf8';
      badgeIcon = <ShieldSvg size={12} color="#38bdf8" />;
      badgeText = `+${intent.block ?? 0}`;
    } else if (intent.type === 'HEAL') {
      badgeColor = '#4ade80';
      badgeIcon = <Sparkles size={12} color="#4ade80" />;
      badgeText = `+${intent.heal ?? 0}`;
    } else if (intent.type === 'DEBUFF') {
      badgeColor = '#a855f7';
      badgeIcon = <FlaskConical size={12} color="#a855f7" />;
      badgeText = `${intent.damage ?? 0} +DOT`;
    } else if (intent.type === 'SPECIAL') {
      badgeColor = '#f97316';
      badgeIcon = <FireFlameSvg size={12} color="#f97316" />;
      badgeText = `${intent.damage ?? 0} ULTRA`;
    }

    return (
      <div
        style={{
          position: 'absolute',
          top: '-24px',
          padding: '2px 8px',
          backgroundColor: 'rgba(5, 8, 14, 0.95)',
          border: `1px solid ${badgeColor}`,
          borderRadius: '3px',
          color: badgeColor,
          fontSize: '0.72rem',
          fontWeight: 800,
          fontFamily: 'var(--font-mono)',
          whiteSpace: 'nowrap',
          zIndex: 15,
          boxShadow: `0 0 8px ${badgeColor}66`,
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
        }}
        title={`Intent: ${intent.description}`}
      >
        {badgeIcon}
        <span>{badgeText}</span>
      </div>
    );
  };

  return (
    <div
      onClick={() => {
        if (!isDead && onSelectTarget) {
          onSelectTarget();
        }
      }}
      className={isHitAnimating ? 'animate-hit' : ''}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '4px',
        width: `${spriteSize + 20}px`,
        cursor: !isDead && onSelectTarget ? 'pointer' : 'default',
        position: 'relative',
        userSelect: 'none',
        opacity: isDead ? 0.3 : 1,
        transition: 'transform 0.2s ease',
        transform: isActiveTurn ? 'scale(1.08) translateY(-4px)' : 'none',
      }}
    >
      {/* Floating combat numbers */}
      <FloatingCombatText floatingTexts={floatingTexts} />

      {/* Telegraphed Enemy Intent Badge */}
      {getIntentBadge()}

      {/* Subtle Enemy Squad Reserve Dots (Hovering over enemy) */}
      {!isHero && enemyQueueCount > 0 && !isDead && (
        <div
          style={{
            position: 'absolute',
            top: intent ? '-44px' : '-22px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '2px 6px',
            backgroundColor: 'rgba(10, 14, 22, 0.75)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '10px',
            backdropFilter: 'blur(4px)',
            zIndex: 12,
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.6)',
          }}
          title={`Enemy Squad: 1 Active + ${enemyQueueCount} in reserve queue`}
        >
          {/* Active Monster dot */}
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: '#ef4444',
              boxShadow: '0 0 6px #ef4444',
              display: 'inline-block',
            }}
          />
          {/* Reserve Queued Monster dots */}
          {Array.from({ length: enemyQueueCount }).map((_, idx) => (
            <span
              key={idx}
              style={{
                width: '5px',
                height: '5px',
                borderRadius: '50%',
                backgroundColor: '#fbbf24',
                opacity: 0.85,
                boxShadow: '0 0 4px rgba(251, 191, 36, 0.5)',
                display: 'inline-block',
              }}
            />
          ))}
        </div>
      )}



      {/* Target locked reticle indicator */}
      {isSelectedTarget && !isDead && (
        <div
          style={{
            position: 'absolute',
            top: '-14px',
            color: '#ef4444',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
            filter: 'drop-shadow(0 0 8px rgba(239, 68, 68, 0.9))',
          }}
          title="[TARGET_LOCKED]"
        >
          <CrosshairReticleSvg size={18} color="#ef4444" />
        </div>
      )}

      {/* Avatar Sprite (No box container, clean transparent sprite with drop shadow) */}
      <div
        style={{
          position: 'relative',
          width: `${spriteSize}px`,
          height: `${spriteHeight}px`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          filter: isActiveTurn
            ? 'drop-shadow(0 0 12px rgba(250, 204, 21, 0.85))'
            : isSelectedTarget
            ? 'drop-shadow(0 0 12px rgba(239, 68, 68, 0.95))'
            : 'drop-shadow(0 4px 10px rgba(0, 0, 0, 0.7))',
        }}
      >
        <PortraitAvatar
          type={combatant.avatar}
          isDead={isDead}
          isDefending={combatant.isDefending}
          size={spriteSize}
        />

        {/* Guard Shield Icon Overlay */}
        {(combatant.isDefending || (combatant.shieldHp && combatant.shieldHp > 0)) && (
          <div
            style={{
              position: 'absolute',
              bottom: '-2px',
              right: '-2px',
              backgroundColor: 'rgba(0,0,0,0.85)',
              borderRadius: '50%',
              padding: '3px',
              border: '1px solid #10b981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            title={`Shield: ${combatant.shieldHp} HP`}
          >
            <ShieldSvg size={13} color="#6ee7b7" />
          </div>
        )}
      </div>

      {/* HP Bar & Shield Indicator directly under the sprite */}
      {!isDead && (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '3px' }}>
          {/* HP Bar */}
          <div
            style={{
              width: '100%',
              height: '8px',
              backgroundColor: 'rgba(0, 0, 0, 0.85)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '3px',
              overflow: 'hidden',
              boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.8)',
            }}
          >
            <div
              style={{
                width: `${hpPercent}%`,
                height: '100%',
                backgroundColor: hpPercent > 50 ? '#22c55e' : hpPercent > 25 ? '#eab308' : '#ef4444',
                boxShadow: `0 0 6px ${hpPercent > 50 ? '#22c55e' : hpPercent > 25 ? '#eab308' : '#ef4444'}`,
                transition: 'width 0.3s ease',
              }}
            />
          </div>
        </div>
      )}

      {/* Monster Affix Dot Badges (Minimalist) */}
      {affixes.length > 0 && !isDead && (
        <div style={{ display: 'flex', gap: '3px', marginTop: '1px' }}>
          {affixes.map((aff) => {
            const def = MONSTER_AFFIXES[aff];
            if (!def) return null;
            return (
              <span
                key={aff}
                title={def.description}
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: def.color,
                  boxShadow: `0 0 4px ${def.color}`,
                  display: 'inline-block',
                }}
              />
            );
          })}
        </div>
      )}

      {/* Active Status Effects & Shields */}
      {!isDead && (
        <StatusBadgeList
          statusEffects={combatant.statusEffects || []}
          shieldHp={combatant.shieldHp || 0}
        />
      )}
    </div>
  );
};
