import React from 'react';

interface DungeonGroundTrackProps {
  isAdvancing?: boolean;
}

export const DungeonGroundTrack: React.FC<DungeonGroundTrackProps> = ({ isAdvancing = false }) => {
  return (
    <div
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '98px',
        overflow: 'hidden',
        pointerEvents: 'none',
        borderTop: '1px solid rgba(212, 163, 75, 0.35)',
        background: 'linear-gradient(180deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.85) 35%, rgba(6, 9, 14, 0.98) 100%)',
      }}
    >
      {/* Ground Bumps & Cobblestone Pebble Layer */}
      <div
        className={isAdvancing ? 'animate-ground-scroll' : ''}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '200%',
          height: '100%',
          backgroundImage: `
            radial-gradient(ellipse at 12px 10px, #475569 6px, #1e293b 7px, transparent 8px),
            radial-gradient(ellipse at 42px 22px, #334155 5px, #0f172a 6px, transparent 7px),
            radial-gradient(ellipse at 78px 12px, #64748b 7px, #334155 8px, transparent 9px),
            radial-gradient(ellipse at 108px 24px, #334155 4px, transparent 5px),
            radial-gradient(ellipse at 25px 45px, #475569 6px, transparent 7px),
            radial-gradient(ellipse at 85px 55px, #334155 5px, transparent 6px),
            linear-gradient(90deg, rgba(212, 163, 75, 0.2) 1px, transparent 1px)
          `,
          backgroundSize: '120px 98px, 120px 98px, 120px 98px, 120px 98px, 120px 98px, 120px 98px, 60px 98px',
          opacity: 0.85,
          transition: 'transform 0.3s ease',
        }}
      />

      {/* Subtle Ambient Shadow / Vignette */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(90deg, rgba(0,0,0,0.6) 0%, transparent 15%, transparent 85%, rgba(0,0,0,0.6) 100%)',
        }}
      />
    </div>
  );
};
