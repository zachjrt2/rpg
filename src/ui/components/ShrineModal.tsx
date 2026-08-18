import React from 'react';
import { Button } from './Button.tsx';
import { Sparkles, Gift } from 'lucide-react';

interface ShrineModalProps {
  onPrayShrine: () => void;
}

export const ShrineModal: React.FC<ShrineModalProps> = ({ onPrayShrine }) => {
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
          maxWidth: '520px',
          maxHeight: '92dvh',
          overflowY: 'auto',
          padding: '16px 14px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: '16px',
          backgroundColor: 'rgba(10, 14, 20, 0.98)',
        }}
      >
        {/* Shrine Icon */}
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '4px',
            backgroundColor: 'rgba(56, 189, 248, 0.2)',
            border: '2px solid #38bdf8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(56, 189, 248, 0.5)',
          }}
        >
          <Sparkles size={36} color="#7dd3fc" />
        </div>

        <div>
          <h2 style={{ margin: 0, fontSize: '1.5rem', color: '#7dd3fc', letterSpacing: '0.04em' }}>
            Ancient Celestial Shrine
          </h2>
          <p style={{ margin: '6px 0 0 0', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            The monolith hums with forgotten starlight. Communing with the shrine bestows divine blessings.
          </p>
        </div>

        <div
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: 'rgba(56, 189, 248, 0.1)',
            border: '1px solid #0284c7',
            borderRadius: '4px',
            fontSize: '0.8rem',
            color: '#bae6fd',
          }}
        >
          ✨ Divine Blessing: Restores +50 HP, grants +80 Barrier Shield & +40 Gold!
        </div>

        <Button
          variant="gold"
          size="lg"
          icon={<Gift size={18} color="#fef08a" />}
          onClick={onPrayShrine}
          style={{ width: '100%' }}
        >
          Receive Celestial Blessing
        </Button>
      </div>
    </div>
  );
};
