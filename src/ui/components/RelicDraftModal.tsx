import React from 'react';
import type { RelicDefinition } from '../../core/types/relics.ts';
import { Button } from './Button.tsx';
import { soundFx } from '../audio/sound-system.ts';
import {
  ShieldAegisSvg,
  BloodDropSvg,
  FireFlameSvg,
  SwordSvg,
  DiamondSvg,
  TrophyVictorySvg,
} from './RpgSvgIcons.tsx';
import { Sparkles, Compass, Skull } from 'lucide-react';

interface RelicDraftModalProps {
  isBoss: boolean;
  relics: RelicDefinition[];
  onSelectRelic: (relic: RelicDefinition) => void;
  onSkip: () => void;
}

export const RelicDraftModal: React.FC<RelicDraftModalProps> = ({
  isBoss,
  relics,
  onSelectRelic,
  onSkip,
}) => {
  const getRarityBorder = (rarity: string) => {
    switch (rarity) {
      case 'LEGENDARY': return '#facc15';
      case 'EPIC': return '#c084fc';
      case 'RARE': return '#38bdf8';
      case 'UNCOMMON': return '#22c55e';
      default: return '#94a3b8';
    }
  };

  const getRelicIcon = (relicId: string, color: string) => {
    const id = relicId.toLowerCase();
    if (id.includes('aegis') || id.includes('shield')) return <ShieldAegisSvg size={28} color={color} />;
    if (id.includes('blood') || id.includes('vampire')) return <BloodDropSvg size={28} color="#ef4444" />;
    if (id.includes('brimstone') || id.includes('censer') || id.includes('flame')) return <FireFlameSvg size={28} color="#f97316" />;
    if (id.includes('viper') || id.includes('fang') || id.includes('needle') || id.includes('sword')) return <SwordSvg size={28} color={color} />;
    if (id.includes('ley') || id.includes('stone') || id.includes('shard')) return <DiamondSvg size={28} color={color} />;
    if (id.includes('chalice') || id.includes('crown') || id.includes('pouch')) return <TrophyVictorySvg size={28} color="#facc15" />;
    if (id.includes('watch') || id.includes('chrono')) return <Compass size={28} color={color} />;
    if (id.includes('necrotic') || id.includes('urn') || id.includes('skull')) return <Skull size={28} color={color} />;
    return <Sparkles size={28} color={color} />;
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(3, 5, 10, 0.94)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 140,
        padding: '8px',
        fontFamily: 'var(--font-mono)',
      }}
    >
      <div
        className="rpg-panel animate-modal-in"
        style={{
          width: '100%',
          maxWidth: '780px',
          maxHeight: '92dvh',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          backgroundColor: 'rgba(10, 14, 24, 0.98)',
          border: isBoss ? '2px solid #facc15' : '2px solid #38bdf8',
          boxShadow: isBoss ? '0 0 35px rgba(250, 204, 21, 0.3)' : '0 0 30px rgba(56, 189, 248, 0.25)',
          padding: '16px 14px',
          gap: '14px',
        }}
      >
        {/* Header */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '4px' }}>
            {isBoss ? <TrophyVictorySvg size={26} color="#facc15" /> : <Sparkles size={24} color="#38bdf8" />}
            <h2 style={{ margin: 0, fontSize: '1.4rem', color: isBoss ? '#fde047' : '#7dd3fc', letterSpacing: '0.04em' }}>
              {isBoss ? 'Boss Relic Spoils' : 'Elite Relic Bounty'}
            </h2>
          </div>
          <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
            {isBoss
              ? 'Choose one legendary boss artifact to bestow immense power onto your hero for the journey ahead.'
              : 'Choose one ancient relic discovered in the remains of the elite foe.'}
          </span>
        </div>

        {/* 3-Relic Choice Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
            gap: '12px',
            width: '100%',
          }}
        >
          {relics.map((relic) => {
            const borderColor = getRarityBorder(relic.rarity);

            return (
              <div
                key={relic.id}
                onClick={() => {
                  soundFx.playVictory();
                  onSelectRelic(relic);
                }}
                style={{
                  padding: '16px 14px',
                  backgroundColor: 'rgba(0, 0, 0, 0.65)',
                  border: `1.5px solid ${borderColor}`,
                  borderRadius: '6px',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '10px',
                  transition: 'all 0.2s ease',
                  boxShadow: `0 0 14px ${borderColor}20`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = `0 4px 20px ${borderColor}60`;
                  e.currentTarget.style.borderColor = '#ffffff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = `0 0 14px ${borderColor}20`;
                  e.currentTarget.style.borderColor = borderColor;
                }}
              >
                <div
                  style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: `1px solid ${borderColor}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {getRelicIcon(relic.id, borderColor)}
                </div>

                <div>
                  <strong style={{ color: '#f8fafc', fontSize: '0.9rem', display: 'block' }}>
                    {relic.name}
                  </strong>
                  <span style={{ fontSize: '0.65rem', color: borderColor, fontWeight: 800 }}>
                    {relic.rarity}
                  </span>
                </div>

                <p style={{ margin: 0, fontSize: '0.74rem', color: '#cbd5e1', lineHeight: 1.35 }}>
                  {relic.description}
                </p>

                <div style={{ marginTop: 'auto', paddingTop: '8px' }}>
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      color: '#86efac',
                      padding: '3px 8px',
                      backgroundColor: 'rgba(34, 197, 94, 0.15)',
                      borderRadius: '3px',
                      border: '1px solid rgba(34, 197, 94, 0.4)',
                    }}
                  >
                    CLAIM RELIC
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Skip button */}
        <Button
          variant="secondary"
          size="sm"
          onClick={onSkip}
        >
          Skip Relic Reward
        </Button>
      </div>
    </div>
  );
};
