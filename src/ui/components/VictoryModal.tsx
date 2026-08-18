import React, { useEffect } from 'react';
import type { EncounterLootResult } from '../../core/types/loot.ts';
import { Button } from './Button.tsx';
import { soundFx } from '../audio/sound-system.ts';
import { TrophyVictorySvg, GoldCoinsStackSvg, MagicSparklesSvg, DiamondSvg } from './RpgSvgIcons.tsx';

interface VictoryModalProps {
  round: number;
  loot?: EncounterLootResult;
  aetheriumEarned?: number;
  isElite?: boolean;
  isBoss?: boolean;
  onRematch: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  round,
  loot,
  aetheriumEarned = 15,
  isElite = false,
  isBoss = false,
  onRematch,
}) => {
  useEffect(() => {
    soundFx.playVictory();
  }, []);

  const goldReward = loot?.gold ?? 45;
  const expReward = loot?.exp ?? 75;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(4, 6, 8, 0.92)',
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
          background: 'linear-gradient(180deg, #161e2c 0%, #0c1017 100%)',
          border: isBoss ? '2px solid #facc15' : isElite ? '2px solid #38bdf8' : '2px solid var(--border-gold-bright)',
          boxShadow: 'var(--shadow-gold-heavy)',
        }}
      >
        {/* Trophy Emblem */}
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '4px',
            backgroundColor: 'rgba(212, 163, 75, 0.2)',
            border: '2px solid var(--border-gold-bright)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(252, 231, 154, 0.5)',
          }}
        >
          <TrophyVictorySvg size={36} color="#fef08a" />
        </div>

        <div>
          <h2
            style={{
              fontSize: '1.75rem',
              color: isBoss ? '#fde047' : '#fef08a',
              margin: '0 0 4px 0',
              fontFamily: 'var(--font-heading)',
              textShadow: '0 0 14px rgba(212, 163, 75, 0.9)',
            }}
          >
            {isBoss ? 'Boss Slain!' : isElite ? 'Elite Vanquished!' : 'Victory Achieved'}
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0 }}>
            Hostile targets neutralized in {round} turn {round === 1 ? 'cycle' : 'cycles'}.
          </p>
        </div>

        {/* Currency & Exp Card */}
        <div
          style={{
            width: '100%',
            padding: '14px 10px',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            borderRadius: '4px',
            border: '1px solid var(--border-subtle)',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: '8px',
            alignItems: 'center',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#fde047' }}>
              <GoldCoinsStackSvg size={16} color="#fde047" />
              <span style={{ fontWeight: 700, fontSize: '1rem' }}>+{goldReward}</span>
            </div>
            <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Gold Earned</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', borderLeft: '1px solid var(--border-subtle)', borderRight: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#c084fc' }}>
              <MagicSparklesSvg size={16} color="#c084fc" />
              <span style={{ fontWeight: 700, fontSize: '1rem' }}>+{expReward}</span>
            </div>
            <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Experience</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#38bdf8' }}>
              <DiamondSvg size={16} color="#38bdf8" />
              <span style={{ fontWeight: 700, fontSize: '1rem' }}>+{aetheriumEarned}</span>
            </div>
            <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Soul Shards</span>
          </div>
        </div>

        {/* Action button */}
        <Button
          variant="gold"
          size="lg"
          onClick={onRematch}
          style={{ width: '100%', marginTop: '6px' }}
        >
          Claim Spoils & Draft Rewards
        </Button>
      </div>
    </div>
  );
};
