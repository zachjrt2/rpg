import React from 'react';
import type { RelicDefinition } from '../../core/types/relics.ts';
import { InfoTooltip } from './InfoTooltip.tsx';
import {
  ShieldAegisSvg,
  BloodDropSvg,
  FireFlameSvg,
  DiamondSvg,
  SwordSvg,
  TrophyVictorySvg,
} from './RpgSvgIcons.tsx';
import { Compass, Sparkles, Skull } from 'lucide-react';

interface RelicBarProps {
  relics: RelicDefinition[];
}

export const RelicBar: React.FC<RelicBarProps> = ({ relics }) => {
  if (relics.length === 0) return null;

  const getRarityBorder = (rarity: string) => {
    switch (rarity) {
      case 'LEGENDARY': return '#facc15';
      case 'EPIC': return '#c084fc';
      case 'RARE': return '#38bdf8';
      case 'UNCOMMON': return '#22c55e';
      default: return '#94a3b8';
    }
  };

  const getRelicSvg = (relic: RelicDefinition, color: string) => {
    const id = relic.id.toLowerCase();
    if (id.includes('aegis') || id.includes('shield')) {
      return <ShieldAegisSvg size={15} color={color} />;
    }
    if (id.includes('blood') || id.includes('vampire')) {
      return <BloodDropSvg size={15} color="#ef4444" />;
    }
    if (id.includes('brimstone') || id.includes('censer') || id.includes('flame') || id.includes('fire')) {
      return <FireFlameSvg size={15} color="#f97316" />;
    }
    if (id.includes('viper') || id.includes('fang') || id.includes('blade') || id.includes('sword')) {
      return <SwordSvg size={15} color={color} />;
    }
    if (id.includes('ley') || id.includes('stone') || id.includes('diamond') || id.includes('shard')) {
      return <DiamondSvg size={15} color={color} />;
    }
    if (id.includes('chalice') || id.includes('trophy') || id.includes('crown')) {
      return <TrophyVictorySvg size={15} color="#facc15" />;
    }
    if (id.includes('watch') || id.includes('chrono') || id.includes('compass')) {
      return <Compass size={15} color={color} />;
    }
    if (id.includes('necrotic') || id.includes('urn') || id.includes('skull')) {
      return <Skull size={15} color={color} />;
    }
    return <Sparkles size={15} color={color} />;
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '6px',
        padding: '4px 10px',
        backgroundColor: 'rgba(6, 9, 14, 0.75)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '3px',
        fontFamily: 'var(--font-mono)',
        position: 'relative',
        zIndex: 35,
        overflow: 'visible',
      }}
    >
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
        {relics.map((relic) => {
          const borderColor = getRarityBorder(relic.rarity);

          return (
            <div
              key={relic.id}
              title={`${relic.name} [${relic.rarity}] — ${relic.description}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '3px 7px',
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                border: `1px solid ${borderColor}`,
                borderRadius: '3px',
                fontSize: '0.75rem',
                cursor: 'default',
                position: 'relative',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {getRelicSvg(relic, borderColor)}
              </div>
              <InfoTooltip
                placement="bottom"
                content={
                  <div>
                    <strong style={{ color: borderColor, display: 'block', marginBottom: '2px' }}>
                      {relic.name} [{relic.rarity}]
                    </strong>
                    <span>{relic.description}</span>
                  </div>
                }
                size={12}
                color={borderColor}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
