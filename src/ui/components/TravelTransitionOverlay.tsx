import React, { useEffect } from 'react';
import type { Combatant } from '../../core/types/combat.ts';
import { PortraitAvatar } from './PortraitAvatar.tsx';
import { Sparkles, MapPin, Compass } from 'lucide-react';

interface TravelTransitionOverlayProps {
  hero: Combatant;
  destinationName: string;
  floorTitle: string;
  onComplete: () => void;
}

export const TravelTransitionOverlay: React.FC<TravelTransitionOverlayProps> = ({
  hero,
  destinationName,
  floorTitle,
  onComplete,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2250);
    return () => clearTimeout(timer);
  }, [onComplete]);

  const avatarType = hero.avatar?.toLowerCase() || (hero.classId === 'MAGE' ? 'mage' : hero.classId === 'ROGUE' ? 'rogue' : 'warrior');

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: '#04060a',
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '40px 30px',
        overflow: 'hidden',
        userSelect: 'none',
        fontFamily: 'var(--font-mono)',
      }}
    >
      {/* Subtle Dungeon Silhouette Grid Background */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.12,
          backgroundImage:
            'radial-gradient(circle at 50% 50%, rgba(212, 163, 75, 0.25) 0%, transparent 60%), linear-gradient(0deg, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
          backgroundSize: '100% 100%, 40px 40px, 40px 40px',
          pointerEvents: 'none',
        }}
      />

      {/* Top Header: Floor Title */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid rgba(212, 163, 75, 0.3)',
          paddingBottom: '12px',
          zIndex: 10,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Compass size={18} color="var(--border-gold)" />
          <span style={{ fontSize: '0.85rem', color: 'var(--text-gold)', fontWeight: 700, letterSpacing: '0.1em' }}>
            {floorTitle.toUpperCase()}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Sparkles size={14} color="#38bdf8" />
          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>EXPEDITION IN PROGRESS</span>
        </div>
      </div>

      {/* Center Banner: Target Destination */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          zIndex: 10,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <MapPin size={22} color="#facc15" />
          <h2
            style={{
              margin: 0,
              fontSize: '1.5rem',
              color: '#fef08a',
              fontFamily: 'var(--font-heading)',
              letterSpacing: '0.08em',
              textShadow: '0 0 16px rgba(250, 204, 21, 0.4)',
            }}
          >
            {destinationName}
          </h2>
        </div>
        <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
          &gt; ADVANCING THROUGH THE CORRIDORS...
        </span>
      </div>

      {/* Bottom Walking Track with Bouncing Character Portrait */}
      <div
        style={{
          position: 'relative',
          height: '110px',
          width: '100%',
          borderTop: '2px solid rgba(212, 163, 75, 0.4)',
          overflow: 'visible',
          zIndex: 10,
        }}
      >
        {/* Moving Ground Cobblestone Bumps */}
        <div
          className="animate-ground-scroll"
          style={{
            position: 'absolute',
            bottom: '0',
            left: 0,
            width: '200%',
            height: '24px',
            backgroundImage:
              'radial-gradient(circle at 15px 12px, #334155 4px, transparent 5px), radial-gradient(circle at 45px 16px, #475569 3px, transparent 4px), radial-gradient(circle at 75px 8px, #334155 5px, transparent 6px), radial-gradient(circle at 105px 14px, #475569 4px, transparent 5px)',
            backgroundSize: '120px 24px',
            opacity: 0.7,
          }}
        />

        {/* Character Bouncing Container (moves smoothly left-to-right across screen) */}
        <div
          style={{
            position: 'absolute',
            bottom: '12px',
            animation: 'travelAcrossScreen 2.2s linear forwards',
          }}
        >
          {/* Vertical Hop / Bounce */}
          <div
            style={{
              animation: 'travelHop 0.28s ease-in-out infinite',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <PortraitAvatar type={avatarType} size={68} />
            {/* Small shadow beneath hopping portrait */}
            <div
              style={{
                width: '40px',
                height: '8px',
                backgroundColor: 'rgba(0,0,0,0.6)',
                borderRadius: '50%',
                marginTop: '-4px',
                filter: 'blur(2px)',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
