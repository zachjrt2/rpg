import React, { useMemo } from 'react';

export type BattleVfxType =
  | 'SLASH'
  | 'FIRE'
  | 'FROST'
  | 'LIGHTNING'
  | 'HOLY'
  | 'BLEED'
  | 'SHOCK'
  | 'SHIELD_BREAK'
  | 'BUFF_AURA'
  | 'DEATH_EXPLOSION';

export interface ActiveVfx {
  id: string;
  type: BattleVfxType;
  targetId: string;
  damage?: number;
}

interface BattleVfxOverlayProps {
  activeVfx: ActiveVfx | null;
}

interface ParticleData {
  id: number;
  tx: number;
  ty: number;
  size: number;
  rot: number;
  duration: number;
  color: string;
  shape: 'circle' | 'spark' | 'shard' | 'star';
}

export const BattleVfxOverlay: React.FC<BattleVfxOverlayProps> = ({ activeVfx }) => {
  const particles = useMemo(() => {
    if (!activeVfx) return [];

    const isExplosion = activeVfx.type === 'DEATH_EXPLOSION';
    // Clamped count between 4 and 48 particles reflecting the damage dealt or explosion
    const rawCount = isExplosion ? 42 : activeVfx.damage ? Math.round(activeVfx.damage) : 8;
    const count = isExplosion ? 42 : Math.min(36, Math.max(4, rawCount));

    const result: ParticleData[] = [];
    const type = activeVfx.type;

    for (let i = 0; i < count; i++) {
      const baseAngle = (i / count) * 2 * Math.PI;
      const jitter = (Math.random() - 0.5) * 0.7;
      const angle = baseAngle + jitter;
      const distance = isExplosion ? 60 + Math.random() * 160 : 45 + Math.random() * 95;
      const tx = Math.round(Math.cos(angle) * distance);
      const ty = Math.round(Math.sin(angle) * distance);
      const size = isExplosion ? 8 + Math.random() * 14 : 5 + Math.random() * 6;
      const rot = Math.round((Math.random() - 0.5) * 720);
      const duration = isExplosion ? 0.5 + Math.random() * 0.45 : 0.4 + Math.random() * 0.35;

      let color = '#ffffff';
      let shape: 'circle' | 'spark' | 'shard' | 'star' = 'circle';

      if (type === 'DEATH_EXPLOSION') {
        const colors = ['#f97316', '#ef4444', '#facc15', '#fbbf24', '#ff7849', '#ea580c', '#ffffff'];
        color = colors[i % colors.length];
        shape = Math.random() > 0.3 ? 'circle' : 'spark';
      } else if (type === 'FIRE') {
        const colors = ['#f97316', '#facc15', '#ef4444', '#fde047'];
        color = colors[i % colors.length];
        shape = Math.random() > 0.4 ? 'circle' : 'spark';
      } else if (type === 'FROST') {
        const colors = ['#38bdf8', '#bae6fd', '#e0f2fe', '#ffffff'];
        color = colors[i % colors.length];
        shape = 'shard';
      } else if (type === 'LIGHTNING' || type === 'SHOCK') {
        const colors = ['#facc15', '#ca8a04', '#fef08a', '#ffffff'];
        color = colors[i % colors.length];
        shape = 'spark';
      } else if (type === 'BLEED') {
        const colors = ['#dc2626', '#b91c1c', '#ef4444', '#7f1d1d'];
        color = colors[i % colors.length];
        shape = 'circle';
      } else if (type === 'HOLY') {
        const colors = ['#fef08a', '#facc15', '#86efac', '#ffffff'];
        color = colors[i % colors.length];
        shape = 'star';
      } else if (type === 'SHIELD_BREAK') {
        const colors = ['#38bdf8', '#7dd3fc', '#ffffff', '#93c5fd'];
        color = colors[i % colors.length];
        shape = 'shard';
      } else if (type === 'BUFF_AURA') {
        const colors = ['#c084fc', '#e879f9', '#fef08a', '#d8b4fe'];
        color = colors[i % colors.length];
        shape = 'star';
      } else {
        // SLASH / PHYSICAL
        const colors = ['#ffffff', '#e2e8f0', '#94a3b8', '#38bdf8'];
        color = colors[i % colors.length];
        shape = 'spark';
      }

      result.push({ id: i, tx, ty, size, rot, duration, color, shape });
    }

    return result;
  }, [activeVfx]);

  if (!activeVfx) return null;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 50,
        overflow: 'visible',
      }}
    >
      {/* 1. Core Visual Element Impact */}
      {activeVfx.type === 'SLASH' && (
        <svg
          className="animate-vfx-slash"
          width="130"
          height="130"
          viewBox="0 0 120 120"
          style={{ filter: 'drop-shadow(0 0 10px #ffffff)' }}
        >
          <path
            d="M 10 110 Q 60 50 110 10"
            fill="none"
            stroke="#ffffff"
            strokeWidth="6"
            strokeLinecap="round"
          />
          <path
            d="M 25 115 Q 65 60 115 15"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      )}

      {activeVfx.type === 'FIRE' && (
        <svg
          className="animate-vfx-fire"
          width="140"
          height="140"
          viewBox="0 0 140 140"
          style={{ filter: 'drop-shadow(0 0 16px #f97316)' }}
        >
          <circle cx="70" cy="70" r="35" fill="rgba(249, 115, 22, 0.4)" stroke="#facc15" strokeWidth="4" />
          <circle cx="70" cy="70" r="50" fill="none" stroke="#ef4444" strokeWidth="3" strokeDasharray="8 6" />
          <path d="M 70 20 L 75 55 L 95 65 L 70 80 L 45 65 L 65 55 Z" fill="#fde047" />
          <path d="M 40 40 L 60 65 L 40 85 L 65 75 Z" fill="#f97316" />
          <path d="M 100 40 L 80 65 L 100 85 L 75 75 Z" fill="#f97316" />
        </svg>
      )}

      {activeVfx.type === 'FROST' && (
        <svg
          className="animate-vfx-frost"
          width="130"
          height="130"
          viewBox="0 0 130 130"
          style={{ filter: 'drop-shadow(0 0 14px #38bdf8)' }}
        >
          <path d="M 65 15 L 65 115 M 15 65 L 115 65" stroke="#bae6fd" strokeWidth="4" strokeLinecap="round" />
          <path d="M 30 30 L 100 100 M 30 100 L 100 30" stroke="#7dd3fc" strokeWidth="3" strokeLinecap="round" />
          <polygon points="65,35 75,65 65,95 55,65" fill="#e0f2fe" opacity="0.85" />
          <polygon points="35,65 65,75 95,65 65,55" fill="#e0f2fe" opacity="0.85" />
        </svg>
      )}

      {(activeVfx.type === 'LIGHTNING' || activeVfx.type === 'SHOCK') && (
        <svg
          className="animate-vfx-lightning"
          width="130"
          height="150"
          viewBox="0 0 120 140"
          style={{ filter: 'drop-shadow(0 0 16px #facc15)' }}
        >
          <polygon
            points="65,5 35,65 65,65 45,135 95,55 65,55"
            fill="#fef08a"
            stroke="#ca8a04"
            strokeWidth="2"
          />
        </svg>
      )}

      {activeVfx.type === 'HOLY' && (
        <svg
          className="animate-vfx-holy"
          width="130"
          height="130"
          viewBox="0 0 130 130"
          style={{ filter: 'drop-shadow(0 0 16px #86efac)' }}
        >
          <circle cx="65" cy="65" r="45" fill="rgba(134, 239, 172, 0.25)" stroke="#4ade80" strokeWidth="3" />
          <path
            d="M 65 25 L 65 105 M 25 65 L 105 65"
            stroke="#fef08a"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <circle cx="40" cy="40" r="4" fill="#ffffff" />
          <circle cx="90" cy="40" r="4" fill="#ffffff" />
          <circle cx="40" cy="90" r="4" fill="#ffffff" />
          <circle cx="90" cy="90" r="4" fill="#ffffff" />
        </svg>
      )}

      {activeVfx.type === 'BLEED' && (
        <svg
          className="animate-vfx-slash"
          width="140"
          height="140"
          viewBox="0 0 140 140"
          style={{ filter: 'drop-shadow(0 0 12px #dc2626)' }}
        >
          <path
            d="M 15 25 Q 70 70 125 115"
            fill="none"
            stroke="#ef4444"
            strokeWidth="6"
            strokeLinecap="round"
          />
          <circle cx="40" cy="75" r="5" fill="#b91c1c" />
          <circle cx="75" cy="90" r="7" fill="#dc2626" />
          <circle cx="105" cy="115" r="4" fill="#ef4444" />
        </svg>
      )}

      {activeVfx.type === 'SHIELD_BREAK' && (
        <svg
          className="animate-vfx-fire"
          width="140"
          height="140"
          viewBox="0 0 140 140"
          style={{ filter: 'drop-shadow(0 0 14px #38bdf8)' }}
        >
          <polygon
            points="70,15 115,40 115,90 70,125 25,90 25,40"
            fill="rgba(56, 189, 248, 0.2)"
            stroke="#38bdf8"
            strokeWidth="3"
            strokeDasharray="10 8"
          />
          <path d="M 40 45 L 95 95 M 95 45 L 40 95" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" />
        </svg>
      )}

      {activeVfx.type === 'BUFF_AURA' && (
        <svg
          className="animate-vfx-holy"
          width="140"
          height="140"
          viewBox="0 0 140 140"
          style={{ filter: 'drop-shadow(0 0 16px #c084fc)' }}
        >
          <circle cx="70" cy="70" r="50" fill="none" stroke="#c084fc" strokeWidth="3" strokeDasharray="12 6" />
          <polygon points="70,25 80,60 115,70 80,80 70,115 60,80 25,70 60,60" fill="#e9d5ff" opacity="0.8" />
        </svg>
      )}

      {activeVfx.type === 'DEATH_EXPLOSION' && (
        <svg
          className="animate-vfx-fire"
          width="200"
          height="200"
          viewBox="0 0 200 200"
          style={{ filter: 'drop-shadow(0 0 24px #f97316)' }}
        >
          <circle cx="100" cy="100" r="75" fill="rgba(239, 68, 68, 0.3)" stroke="#f97316" strokeWidth="6" strokeDasharray="16 8" />
          <circle cx="100" cy="100" r="50" fill="rgba(250, 204, 21, 0.4)" stroke="#fde047" strokeWidth="4" />
          <circle cx="100" cy="100" r="28" fill="#ffffff" />
          {/* Flame spikes */}
          <path d="M 100 15 L 112 70 L 155 45 L 125 85 L 185 100 L 125 115 L 155 155 L 112 130 L 100 185 L 88 130 L 45 155 L 75 115 L 15 100 L 75 85 L 45 45 L 88 70 Z" fill="#ea580c" opacity="0.9" />
          <path d="M 100 35 L 110 80 L 140 60 L 120 90 L 165 100 L 120 110 L 140 140 L 110 120 L 100 165 L 90 120 L 60 140 L 80 110 L 35 100 L 80 90 L 60 60 L 90 80 Z" fill="#facc15" opacity="0.95" />
        </svg>
      )}

      {/* 2. Exploding Damage Particle Field */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
        }}
      >
        {particles.map((p) => {
          const style: React.CSSProperties = {
            position: 'absolute',
            ['--tx' as string]: `${p.tx}px`,
            ['--ty' as string]: `${p.ty}px`,
            ['--rot' as string]: `${p.rot}deg`,
            ['--dur' as string]: `${p.duration}s`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            boxShadow: `0 0 8px ${p.color}`,
            borderRadius: p.shape === 'circle' ? '50%' : p.shape === 'shard' ? '2px' : '0',
            transform: p.shape === 'shard' ? 'rotate(45deg)' : undefined,
          };

          return <div key={p.id} className="animate-particle-burst" style={style} />;
        })}
      </div>
    </div>
  );
};
