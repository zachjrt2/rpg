import React, { useState } from 'react';
import type { Combatant } from '../../core/types/combat.ts';
import type { CombatCard } from '../../core/types/cards.ts';
import { Button } from './Button.tsx';
import { soundFx } from '../audio/sound-system.ts';
import { Flame, Heart, Zap, Shield, Hammer, ArrowLeft, Sparkles } from 'lucide-react';

interface CampfireModalProps {
  hero: Combatant;
  deckCards?: CombatCard[];
  onRestHp: () => void;
  onMeditateMana: () => void;
  onSharpenWeapon: () => void;
  onUpgradeCard?: (card: CombatCard) => void;
}

export const CampfireModal: React.FC<CampfireModalProps> = ({
  hero,
  deckCards = [],
  onRestHp,
  onMeditateMana,
  onSharpenWeapon,
  onUpgradeCard,
}) => {
  const [isUpgradingCard, setIsUpgradingCard] = useState<boolean>(false);
  const hpHeal = Math.round(hero.maxHp * 0.5);

  const upgradeableCards = deckCards.filter((card) => !card.isUpgraded && !card.id.endsWith('+'));

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
          maxWidth: isUpgradingCard ? '680px' : '560px',
          maxHeight: '92dvh',
          overflowY: 'auto',
          padding: '16px 14px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: '16px',
          backgroundColor: 'rgba(10, 14, 20, 0.98)',
          transition: 'all 0.2s ease',
        }}
      >
        {/* Fire Icon */}
        <div
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '4px',
            backgroundColor: 'rgba(249, 115, 22, 0.2)',
            border: '2px solid #f97316',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(249, 115, 22, 0.5)',
          }}
        >
          <Flame size={32} color="#fb923c" />
        </div>

        <div>
          <h2 style={{ margin: 0, fontSize: '1.4rem', color: '#fed7aa', letterSpacing: '0.03em' }}>
            Campfire Rest Site
          </h2>
          <p style={{ margin: '4px 0 0 0', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
            {isUpgradingCard
              ? 'Select a combat card to temper and permanently upgrade into its (+) enhanced form:'
              : 'You find a peaceful sheltered alcove. Choose how to spend your time before proceeding.'}
          </p>
        </div>

        {/* Card Upgrade Selection Grid */}
        {isUpgradingCard ? (
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {upgradeableCards.length === 0 ? (
              <div style={{ padding: '24px', color: '#94a3b8', fontStyle: 'italic', fontSize: '0.85rem' }}>
                All cards in your deck have already been upgraded to their (+) tier!
              </div>
            ) : (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                  gap: '8px',
                  maxHeight: '320px',
                  overflowY: 'auto',
                  padding: '4px',
                }}
              >
                {upgradeableCards.map((card) => {
                  return (
                    <div
                      key={card.id}
                      onClick={() => {
                        soundFx.playVictory();
                        if (onUpgradeCard) onUpgradeCard(card);
                      }}
                      style={{
                        padding: '10px',
                        backgroundColor: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid #334155',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px',
                        textAlign: 'left',
                        transition: 'all 0.15s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#facc15';
                        e.currentTarget.style.backgroundColor = 'rgba(234, 179, 8, 0.12)';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = '#334155';
                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)';
                        e.currentTarget.style.transform = 'none';
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <strong style={{ color: '#f8fafc', fontSize: '0.82rem' }}>{card.name}</strong>
                        <span style={{ fontSize: '0.7rem', color: '#38bdf8', fontWeight: 800 }}>⚡ {card.cost}</span>
                      </div>
                      <p style={{ margin: 0, fontSize: '0.72rem', color: '#cbd5e1', lineHeight: 1.3 }}>
                        {card.description}
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#4ade80', fontSize: '0.68rem', fontWeight: 800, marginTop: 'auto' }}>
                        <Sparkles size={11} />
                        <span>CLICK TO TEMPER (+)</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <Button
              variant="secondary"
              size="sm"
              icon={<ArrowLeft size={14} />}
              onClick={() => {
                soundFx.playClick();
                setIsUpgradingCard(false);
              }}
              style={{ alignSelf: 'flex-start' }}
            >
              &lt; BACK TO CAMP CHOICES
            </Button>
          </div>
        ) : (
          /* Main Campfire Choice Buttons */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
            <Button
              variant="gold"
              size="md"
              icon={<Heart size={16} color="#fca5a5" />}
              onClick={onRestHp}
              style={{ width: '100%', justifyContent: 'flex-start', padding: '10px 14px' }}
            >
              &gt; TEND WOUNDS: Rest and recover +{hpHeal} HP [{hero.currentHp}/{hero.maxHp} HP]
            </Button>

            {onUpgradeCard && (
              <Button
                variant="primary"
                size="md"
                icon={<Hammer size={16} color="#facc15" />}
                onClick={() => {
                  soundFx.playClick();
                  setIsUpgradingCard(true);
                }}
                style={{ width: '100%', justifyContent: 'flex-start', padding: '10px 14px' }}
              >
                &gt; TEMPER CARDS: Forge a card in your deck into its (+) enhanced tier
              </Button>
            )}

            <Button
              variant="secondary"
              size="md"
              icon={<Zap size={16} color="#38bdf8" />}
              onClick={onMeditateMana}
              style={{ width: '100%', justifyContent: 'flex-start', padding: '10px 14px' }}
            >
              &gt; MEDITATE: Channel leylines to recover FULL MANA ({hero.maxMana} MP)
            </Button>

            <Button
              variant="secondary"
              size="md"
              icon={<Shield size={16} color="#86efac" />}
              onClick={onSharpenWeapon}
              style={{ width: '100%', justifyContent: 'flex-start', padding: '10px 14px' }}
            >
              &gt; REINFORCE GEAR: Deploy a +100 HP Barrier Shield
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
