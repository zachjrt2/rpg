import React, { useState } from 'react';
import type { DeckState, CombatCard } from '../../core/types/cards.ts';
import { Button } from './Button.tsx';
import { soundFx } from '../audio/sound-system.ts';
import { X, BookOpen, Layers, Trash2, Swords, Shield, Sparkles } from 'lucide-react';
import { SwordSvg, ShieldAegisSvg, MagicSparklesSvg } from './RpgSvgIcons.tsx';

interface DeckViewModalProps {
  deckState: DeckState;
  onClose: () => void;
}

export const DeckViewModal: React.FC<DeckViewModalProps> = ({
  deckState,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'FULL' | 'DRAW' | 'DISCARD' | 'EXHAUST'>('FULL');

  const getActiveCards = (): CombatCard[] => {
    switch (activeTab) {
      case 'DRAW':
        return deckState.drawPile;
      case 'DISCARD':
        return deckState.discardPile;
      case 'EXHAUST':
        return deckState.exhaustPile;
      default:
        return deckState.fullDeck;
    }
  };

  const cards = getActiveCards();

  const getCardBorderColor = (card: CombatCard) => {
    if (card.type === 'ATTACK') return '#f87171';
    if (card.type === 'SKILL') return '#38bdf8';
    if (card.type === 'POWER') return '#c084fc';
    return '#facc15';
  };

  const getCardTypeIcon = (type: string) => {
    if (type === 'ATTACK') return <Swords size={12} color="#f87171" />;
    if (type === 'SKILL') return <Shield size={12} color="#38bdf8" />;
    return <Sparkles size={12} color="#c084fc" />;
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
        zIndex: 140,
        padding: '8px',
        fontFamily: 'var(--font-mono)',
      }}
    >
      <div
        className="rpg-panel rpg-panel-gold animate-modal-in"
        style={{
          width: '100%',
          maxWidth: '860px',
          height: '92dvh',
          maxHeight: '92dvh',
          overflowY: 'auto',
          padding: '14px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
          backgroundColor: 'rgba(8, 12, 18, 0.98)',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BookOpen size={22} color="#facc15" />
            <h2 style={{ margin: 0, fontSize: '1.35rem', color: '#fef08a', letterSpacing: '0.03em' }}>
              Grimoire Archive — Expedition Deck
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
          >
            <X size={22} />
          </button>
        </div>

        {/* Tab Filter Pills */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {[
            { id: 'FULL' as const, label: `MASTER DECK (${deckState.fullDeck.length})`, icon: <BookOpen size={14} /> },
            { id: 'DRAW' as const, label: `DRAW PILE (${deckState.drawPile.length})`, icon: <Layers size={14} /> },
            { id: 'DISCARD' as const, label: `DISCARD (${deckState.discardPile.length})`, icon: <Layers size={14} /> },
            { id: 'EXHAUST' as const, label: `EXHAUST (${deckState.exhaustPile.length})`, icon: <Trash2 size={14} /> },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  soundFx.playClick();
                  setActiveTab(tab.id);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  backgroundColor: isActive ? 'rgba(234, 179, 8, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                  border: isActive ? '1px solid #facc15' : '1px solid var(--border-subtle)',
                  borderRadius: '3px',
                  color: isActive ? '#fef08a' : '#94a3b8',
                  fontSize: '0.78rem',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Card Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
            gap: '12px',
            maxHeight: '52vh',
            overflowY: 'auto',
            padding: '4px',
          }}
        >
          {cards.map((card) => {
            const borderColor = getCardBorderColor(card);

            return (
              <div
                key={card.id}
                style={{
                  height: '160px',
                  padding: '10px',
                  backgroundColor: 'rgba(10, 15, 24, 0.95)',
                  border: `2px solid ${borderColor}`,
                  borderRadius: '5px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  position: 'relative',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: '-6px',
                    left: '-6px',
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    backgroundColor: '#ca8a04',
                    border: '1px solid #fef08a',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#000000',
                    fontWeight: 900,
                    fontSize: '0.75rem',
                  }}
                >
                  {card.cost}
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '3px' }}>
                    {getCardTypeIcon(card.type)}
                    <span style={{ fontSize: '0.62rem', color: borderColor, fontWeight: 700 }}>
                      {card.type}
                    </span>
                  </div>
                  <strong style={{ fontSize: '0.8rem', color: card.isUpgraded ? '#86efac' : '#f8fafc', display: 'block', marginTop: '4px' }}>
                    {card.name}
                  </strong>
                </div>

                <p style={{ margin: 0, fontSize: '0.7rem', color: '#cbd5e1', lineHeight: 1.25 }}>
                  {card.description}
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.65rem' }}>
                  {card.damage ? (
                    <span style={{ color: '#f87171', display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <SwordSvg size={11} color="#f87171" /> {card.damage}
                    </span>
                  ) : null}
                  {card.block ? (
                    <span style={{ color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <ShieldAegisSvg size={11} color="#38bdf8" /> +{card.block}
                    </span>
                  ) : null}
                  {card.magicDamage ? (
                    <span style={{ color: '#c084fc', display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <MagicSparklesSvg size={11} color="#c084fc" /> {card.magicDamage}
                    </span>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="secondary" onClick={onClose}>
            &gt; CLOSE ARCHIVE
          </Button>
        </div>
      </div>
    </div>
  );
};
