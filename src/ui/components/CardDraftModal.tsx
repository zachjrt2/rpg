import React from 'react';
import type { CombatCard } from '../../core/types/cards.ts';
import { Button } from './Button.tsx';
import { soundFx } from '../audio/sound-system.ts';
import { Sparkles, Swords, Shield, Plus, SkipForward } from 'lucide-react';

interface CardDraftModalProps {
  cards: CombatCard[];
  onSelectCard: (card: CombatCard) => void;
  onSkip: () => void;
}

export const CardDraftModal: React.FC<CardDraftModalProps> = ({
  cards,
  onSelectCard,
  onSkip,
}) => {
  const getCardBorderColor = (card: CombatCard) => {
    if (card.rarity === 'RARE') return '#facc15';
    if (card.rarity === 'UNCOMMON') return '#38bdf8';
    return '#94a3b8';
  };

  const getCardTypeIcon = (type: string) => {
    if (type === 'ATTACK') return <Swords size={14} color="#f87171" />;
    if (type === 'SKILL') return <Shield size={14} color="#38bdf8" />;
    return <Sparkles size={14} color="#c084fc" />;
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(3, 5, 8, 0.94)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 130,
        padding: '8px',
        fontFamily: 'var(--font-mono)',
      }}
    >
      <div
        className="rpg-panel rpg-panel-gold animate-modal-in"
        style={{
          width: '100%',
          maxWidth: '740px',
          maxHeight: '92dvh',
          overflowY: 'auto',
          padding: '16px 14px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px',
          backgroundColor: 'rgba(8, 12, 18, 0.98)',
          border: '2px solid var(--border-gold-bright)',
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <Sparkles size={22} color="#facc15" />
            <h2
              style={{
                margin: 0,
                fontSize: '1.4rem',
                fontFamily: 'var(--font-heading)',
                color: 'var(--text-gold)',
                letterSpacing: '0.04em',
              }}
            >
              Card Reward — Choose a Card
            </h2>
          </div>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: '#94a3b8' }}>
            Select 1 card to permanently add to your expedition deck, or skip to keep your deck lean.
          </p>
        </div>

        {/* 3 Card Choices Grid */}
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          {cards.map((card) => {
            const borderColor = getCardBorderColor(card);

            return (
              <div
                key={card.id}
                onClick={() => {
                  soundFx.playVictory();
                  onSelectCard(card);
                }}
                style={{
                  width: '180px',
                  height: '220px',
                  padding: '14px',
                  backgroundColor: 'rgba(10, 15, 24, 0.95)',
                  border: `2px solid ${borderColor}`,
                  borderRadius: '6px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: `0 6px 16px ${borderColor}33`,
                  position: 'relative',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-10px) scale(1.05)';
                  e.currentTarget.style.boxShadow = `0 10px 24px ${borderColor}66`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = `0 6px 16px ${borderColor}33`;
                }}
              >
                {/* Cost */}
                <div
                  style={{
                    position: 'absolute',
                    top: '-10px',
                    left: '-10px',
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    backgroundColor: '#ca8a04',
                    border: '2px solid #fef08a',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#000000',
                    fontWeight: 900,
                    fontSize: '0.9rem',
                    boxShadow: '0 0 10px rgba(250, 204, 21, 0.7)',
                  }}
                >
                  {card.cost}
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '4px' }}>
                    {getCardTypeIcon(card.type)}
                    <span style={{ fontSize: '0.7rem', color: borderColor, fontWeight: 700 }}>
                      {card.rarity}
                    </span>
                  </div>

                  <strong
                    style={{
                      fontSize: '0.95rem',
                      color: '#f8fafc',
                      display: 'block',
                      lineHeight: 1.2,
                      marginTop: '6px',
                    }}
                  >
                    {card.name}
                  </strong>
                </div>

                <p
                  style={{
                    margin: 0,
                    fontSize: '0.78rem',
                    color: '#cbd5e1',
                    lineHeight: 1.35,
                  }}
                >
                  {card.description}
                </p>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                    padding: '6px 0',
                    backgroundColor: 'rgba(250, 204, 21, 0.1)',
                    border: '1px solid rgba(250, 204, 21, 0.3)',
                    borderRadius: '3px',
                    color: '#fef08a',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                  }}
                >
                  <Plus size={14} />
                  <span>DRAFT CARD</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Skip Button */}
        <Button
          variant="secondary"
          size="md"
          icon={<SkipForward size={16} />}
          onClick={() => {
            soundFx.playClick();
            onSkip();
          }}
        >
          Skip Card Reward
        </Button>
      </div>
    </div>
  );
};
