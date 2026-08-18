import React, { useEffect } from 'react';
import { Button } from './Button.tsx';
import { soundFx } from '../audio/sound-system.ts';
import { SkullDeathSvg } from './RpgSvgIcons.tsx';

interface DefeatModalProps {
  onRetry: () => void;
}

export const DefeatModal: React.FC<DefeatModalProps> = ({ onRetry }) => {
  useEffect(() => {
    soundFx.playDefeat();
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(8, 2, 2, 0.92)',
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
        className="rpg-panel animate-modal-in"
        style={{
          width: '100%',
          maxWidth: '460px',
          maxHeight: '92dvh',
          overflowY: 'auto',
          padding: '16px 14px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: '18px',
          background: 'linear-gradient(180deg, #240a0a 0%, #100303 100%)',
          border: '2px solid #ef4444',
          boxShadow: '0 0 30px rgba(239, 68, 68, 0.5)',
        }}
      >
        {/* Skull Icon */}
        <div
          style={{
            width: '68px',
            height: '68px',
            borderRadius: '4px',
            backgroundColor: 'rgba(239, 68, 68, 0.2)',
            border: '2px solid #ef4444',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(239, 68, 68, 0.7)',
          }}
        >
          <SkullDeathSvg size={40} color="#fca5a5" />
        </div>

        <div>
          <h2
            style={{
              fontSize: '1.8rem',
              color: '#f87171',
              margin: '0 0 6px 0',
              fontFamily: 'var(--font-heading)',
              textShadow: '0 0 14px rgba(239, 68, 68, 0.9)',
              letterSpacing: '0.04em',
            }}
          >
            Expedition Fallen
          </h2>
          <p style={{ color: '#cbd5e1', fontSize: '0.85rem', lineHeight: 1.4 }}>
            Your hero succumbed to the darkness of the Hollows. Your Soul Shards have been gathered into the Astral Sanctum.
          </p>
        </div>

        {/* Retry button */}
        <Button variant="danger" size="lg" onClick={onRetry} style={{ width: '100%' }}>
          Return to Sanctum & Reclaim Soul
        </Button>
      </div>
    </div>
  );
};
