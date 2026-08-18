import React, { useState } from 'react';
import type { CombatCard } from '../../core/types/cards.ts';
import type { Combatant } from '../../core/types/combat.ts';
import type { Item } from '../../core/types/items.ts';
import { CARDS_CATALOG } from '../../core/data/cards.ts';
import { RELICS_CATALOG } from '../../core/data/relics.ts';
import { ITEMS_CATALOG } from '../../core/data/items.ts';
import { Button } from './Button.tsx';
import { soundFx } from '../audio/sound-system.ts';
import {
  X,
  ShoppingBag,
  Coins,
  Sparkles,
  Trash2,
  ArrowUpCircle,
  FlaskConical,
} from 'lucide-react';
import { ShieldAegisSvg, CardsStackSvg } from './RpgSvgIcons.tsx';

interface ShopModalProps {
  gold: number;
  deck: CombatCard[];
  hero: Combatant;
  onBuyCard: (card: CombatCard, cost: number) => void;
  onBuyRelic: (relicId: string, cost: number) => void;
  onBuyPotion: (potion: Item, cost: number) => void;
  onRemoveCard: (cardId: string, cost: number) => void;
  onUpgradeCard: (cardId: string, cost: number) => void;
  onClose: () => void;
}

export const ShopModal: React.FC<ShopModalProps> = ({
  gold,
  deck,
  hero,
  onBuyCard,
  onBuyRelic,
  onBuyPotion,
  onRemoveCard,
  onUpgradeCard,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'CARDS' | 'RELICS' | 'POTIONS' | 'SERVICES'>('CARDS');
  const [hasPurgedCard, setHasPurgedCard] = useState<boolean>(false);
  const [hasUpgradedCard, setHasUpgradedCard] = useState<boolean>(false);
  const [selectedDeckCardId, setSelectedDeckCardId] = useState<string | null>(null);

  // Available Shop Inventory
  const [shopCards] = useState<{ card: CombatCard; cost: number }[]>(() => {
    const pool = Object.values(CARDS_CATALOG).filter(
      (c) =>
        !c.isUpgraded &&
        c.id !== 'strike' &&
        c.id !== 'defend' &&
        (!c.classRestrictions || c.classRestrictions.includes(hero.classId ?? ''))
    );
    const shuffled = [...pool].sort(() => 0.5 - Math.random()).slice(0, 4);
    return shuffled.map((card) => ({
      card,
      cost: card.rarity === 'RARE' ? 85 : card.rarity === 'UNCOMMON' ? 60 : 45,
    }));
  });

  const [shopRelics] = useState<{ relicId: string; cost: number }[]>(() => {
    const relicPool = ['vampire-bloodstone', 'tesla-capacitor', 'midas-pouch', 'trickster-die', 'phoenix-feather'];
    const chosen = relicPool.slice(0, 2);
    return chosen.map((id) => ({
      relicId: id,
      cost: 160,
    }));
  });

  const [shopPotions] = useState<{ potion: Item; cost: number }[]>([
    { potion: ITEMS_CATALOG['greater-healing-potion'], cost: 40 },
    { potion: ITEMS_CATALOG['elixir-of-haste'], cost: 45 },
    { potion: ITEMS_CATALOG['mana-draught'], cost: 35 },
  ].filter((p): p is { potion: Item; cost: number } => Boolean(p.potion)));

  const [boughtCards, setBoughtCards] = useState<string[]>([]);
  const [boughtRelics, setBoughtRelics] = useState<string[]>([]);
  const [boughtPotions, setBoughtPotions] = useState<string[]>([]);

  const purgeCost = 75;
  const upgradeCost = 50;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(3, 5, 8, 0.94)',
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
        className="rpg-panel rpg-panel-gold animate-modal-in"
        style={{
          width: '100%',
          maxWidth: '880px',
          height: '92dvh',
          maxHeight: '92dvh',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'rgba(10, 14, 22, 0.98)',
          border: '1px solid var(--border-gold)',
          padding: '12px 14px',
          gap: '12px',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid var(--border-subtle)',
            paddingBottom: '10px',
            flexWrap: 'wrap',
            gap: '8px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '4px',
                backgroundColor: 'rgba(234, 179, 8, 0.15)',
                border: '1px solid #facc15',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <ShoppingBag size={20} color="#facc15" />
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.05rem', color: '#fef08a', letterSpacing: '0.03em' }}>
                Outpost Merchant — Valerius's Emporium
              </h2>
              <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                Spend gold to buy cards, relics, draughts, or refine your deck.
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* Gold Counter */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '4px 10px',
                backgroundColor: 'rgba(234, 179, 8, 0.15)',
                border: '1px solid #facc15',
                borderRadius: '3px',
                color: '#fef08a',
                fontWeight: 800,
                fontSize: '0.85rem',
              }}
            >
              <Coins size={15} color="#facc15" />
              <span>{gold} GOLD</span>
            </div>

            <button
              onClick={onClose}
              style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '2px', borderBottom: '1px solid var(--border-subtle)' }}>
          <button
            onClick={() => {
              soundFx.playClick();
              setActiveTab('CARDS');
            }}
            style={{
              padding: '6px 14px',
              backgroundColor: activeTab === 'CARDS' ? 'rgba(234, 179, 8, 0.2)' : 'rgba(255, 255, 255, 0.03)',
              border: activeTab === 'CARDS' ? '1px solid #facc15' : '1px solid var(--border-subtle)',
              borderRadius: '3px',
              color: activeTab === 'CARDS' ? '#fef08a' : '#94a3b8',
              fontFamily: 'var(--font-mono)',
              fontWeight: 700,
              fontSize: '0.76rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <CardsStackSvg size={14} color="#facc15" />
            CARDS ({shopCards.length})
          </button>

          <button
            onClick={() => {
              soundFx.playClick();
              setActiveTab('RELICS');
            }}
            style={{
              padding: '6px 14px',
              backgroundColor: activeTab === 'RELICS' ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255, 255, 255, 0.03)',
              border: activeTab === 'RELICS' ? '1px solid #38bdf8' : '1px solid var(--border-subtle)',
              borderRadius: '3px',
              color: activeTab === 'RELICS' ? '#7dd3fc' : '#94a3b8',
              fontFamily: 'var(--font-mono)',
              fontWeight: 700,
              fontSize: '0.76rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <ShieldAegisSvg size={14} color="#38bdf8" />
            RELICS ({shopRelics.length})
          </button>

          <button
            onClick={() => {
              soundFx.playClick();
              setActiveTab('POTIONS');
            }}
            style={{
              padding: '6px 14px',
              backgroundColor: activeTab === 'POTIONS' ? 'rgba(168, 85, 247, 0.2)' : 'rgba(255, 255, 255, 0.03)',
              border: activeTab === 'POTIONS' ? '1px solid #c084fc' : '1px solid var(--border-subtle)',
              borderRadius: '3px',
              color: activeTab === 'POTIONS' ? '#f5d0fe' : '#94a3b8',
              fontFamily: 'var(--font-mono)',
              fontWeight: 700,
              fontSize: '0.76rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <FlaskConical size={14} />
            POTIONS ({shopPotions.length})
          </button>

          <button
            onClick={() => {
              soundFx.playClick();
              setActiveTab('SERVICES');
            }}
            style={{
              padding: '6px 14px',
              backgroundColor: activeTab === 'SERVICES' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(255, 255, 255, 0.03)',
              border: activeTab === 'SERVICES' ? '1px solid #22c55e' : '1px solid var(--border-subtle)',
              borderRadius: '3px',
              color: activeTab === 'SERVICES' ? '#86efac' : '#94a3b8',
              fontFamily: 'var(--font-mono)',
              fontWeight: 700,
              fontSize: '0.76rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Sparkles size={14} color="#22c55e" />
            DECK SERVICES
          </button>
        </div>

        {/* TAB 1: CARDS FOR SALE */}
        {activeTab === 'CARDS' && (
          <div style={{ flex: 1, overflowY: 'auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
            {shopCards.map(({ card, cost }) => {
              const isBought = boughtCards.includes(card.id);
              const canAfford = gold >= cost;

              return (
                <div
                  key={card.id}
                  style={{
                    padding: '12px',
                    backgroundColor: isBought ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.02)',
                    border: isBought ? '1px dashed #334155' : '1px solid var(--border-gold-bright)',
                    borderRadius: '4px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '10px',
                    opacity: isBought ? 0.5 : 1,
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <strong style={{ color: '#fef08a', fontSize: '0.88rem' }}>{card.name}</strong>
                      <span style={{ fontSize: '0.68rem', color: '#38bdf8' }}>{card.cost}⚡</span>
                    </div>
                    <span style={{ fontSize: '0.65rem', color: '#94a3b8', textTransform: 'uppercase' }}>
                      {card.type} • {card.rarity}
                    </span>
                    <p style={{ margin: '8px 0 0 0', fontSize: '0.74rem', color: '#cbd5e1', lineHeight: 1.35 }}>
                      {card.description}
                    </p>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                    <span style={{ fontSize: '0.78rem', color: '#fde047', fontWeight: 800 }}>
                      {cost} GOLD
                    </span>
                    {isBought ? (
                      <span style={{ fontSize: '0.72rem', color: '#86efac', fontWeight: 700 }}>PURCHASED</span>
                    ) : (
                      <Button
                        variant={canAfford ? 'gold' : 'secondary'}
                        size="sm"
                        disabled={!canAfford}
                        onClick={() => {
                          soundFx.playVictory();
                          setBoughtCards((prev) => [...prev, card.id]);
                          onBuyCard(card, cost);
                        }}
                      >
                        BUY
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* TAB 2: RELICS FOR SALE */}
        {activeTab === 'RELICS' && (
          <div style={{ flex: 1, overflowY: 'auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '12px' }}>
            {shopRelics.map(({ relicId, cost }) => {
              const relic = RELICS_CATALOG[relicId as keyof typeof RELICS_CATALOG];
              const isBought = boughtRelics.includes(relicId);
              const canAfford = gold >= cost;
              if (!relic) return null;

              return (
                <div
                  key={relicId}
                  style={{
                    padding: '14px',
                    backgroundColor: isBought ? 'rgba(0, 0, 0, 0.6)' : 'rgba(56, 189, 248, 0.05)',
                    border: isBought ? '1px dashed #334155' : '1px solid #38bdf8',
                    borderRadius: '4px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    opacity: isBought ? 0.5 : 1,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <ShieldAegisSvg size={24} color="#38bdf8" />
                    <div>
                      <strong style={{ color: '#f8fafc', fontSize: '0.88rem' }}>{relic.name}</strong>
                      <span style={{ display: 'block', fontSize: '0.65rem', color: '#38bdf8' }}>{relic.rarity} RELIC</span>
                    </div>
                  </div>

                  <p style={{ margin: 0, fontSize: '0.74rem', color: '#cbd5e1', lineHeight: 1.35 }}>
                    {relic.description}
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                    <span style={{ fontSize: '0.8rem', color: '#fde047', fontWeight: 800 }}>
                      {cost} GOLD
                    </span>
                    {isBought ? (
                      <span style={{ fontSize: '0.72rem', color: '#86efac', fontWeight: 700 }}>PURCHASED</span>
                    ) : (
                      <Button
                        variant={canAfford ? 'gold' : 'secondary'}
                        size="sm"
                        disabled={!canAfford}
                        onClick={() => {
                          soundFx.playVictory();
                          setBoughtRelics((prev) => [...prev, relicId]);
                          onBuyRelic(relicId, cost);
                        }}
                      >
                        BUY
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* TAB 3: POTIONS FOR SALE */}
        {activeTab === 'POTIONS' && (
          <div style={{ flex: 1, overflowY: 'auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '12px' }}>
            {shopPotions.map(({ potion, cost }) => {
              const isBought = boughtPotions.includes(potion.id);
              const canAfford = gold >= cost;

              return (
                <div
                  key={potion.id}
                  style={{
                    padding: '14px',
                    backgroundColor: isBought ? 'rgba(0, 0, 0, 0.6)' : 'rgba(168, 85, 247, 0.05)',
                    border: isBought ? '1px dashed #334155' : '1px solid #c084fc',
                    borderRadius: '4px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    opacity: isBought ? 0.5 : 1,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <FlaskConical size={24} color="#c084fc" />
                    <div>
                      <strong style={{ color: '#f8fafc', fontSize: '0.88rem' }}>{potion.name}</strong>
                      <span style={{ display: 'block', fontSize: '0.65rem', color: '#c084fc' }}>CONSUMABLE</span>
                    </div>
                  </div>

                  <p style={{ margin: 0, fontSize: '0.74rem', color: '#cbd5e1', lineHeight: 1.35 }}>
                    {potion.description}
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                    <span style={{ fontSize: '0.8rem', color: '#fde047', fontWeight: 800 }}>
                      {cost} GOLD
                    </span>
                    {isBought ? (
                      <span style={{ fontSize: '0.72rem', color: '#86efac', fontWeight: 700 }}>PURCHASED</span>
                    ) : (
                      <Button
                        variant={canAfford ? 'gold' : 'secondary'}
                        size="sm"
                        disabled={!canAfford}
                        onClick={() => {
                          soundFx.playVictory();
                          setBoughtPotions((prev) => [...prev, potion.id]);
                          onBuyPotion(potion, cost);
                        }}
                      >
                        BUY
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* TAB 4: DECK SERVICES (Purge / Upgrade) */}
        {activeTab === 'SERVICES' && (
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {/* Purge Service */}
              <div
                style={{
                  padding: '14px',
                  backgroundColor: 'rgba(239, 68, 68, 0.08)',
                  border: '1px solid #ef4444',
                  borderRadius: '4px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Trash2 size={18} color="#f87171" />
                  <strong style={{ color: '#fca5a5', fontSize: '0.9rem' }}>Purge Card from Deck</strong>
                </div>
                <p style={{ margin: 0, fontSize: '0.74rem', color: '#cbd5e1' }}>
                  Permanently remove an unwanted basic Strike or Defend from your deck to improve card draw consistency.
                </p>
                <span style={{ fontSize: '0.8rem', color: '#fde047', fontWeight: 800 }}>
                  COST: {purgeCost} GOLD
                </span>
              </div>

              {/* Upgrade Service */}
              <div
                style={{
                  padding: '14px',
                  backgroundColor: 'rgba(34, 197, 94, 0.08)',
                  border: '1px solid #22c55e',
                  borderRadius: '4px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ArrowUpCircle size={18} color="#86efac" />
                  <strong style={{ color: '#86efac', fontSize: '0.9rem' }}>Hone Card (Upgrade)</strong>
                </div>
                <p style={{ margin: 0, fontSize: '0.74rem', color: '#cbd5e1' }}>
                  Enhance a card in your deck with upgraded damage, reduced energy cost, or bonus secondary status effects.
                </p>
                <span style={{ fontSize: '0.8rem', color: '#fde047', fontWeight: 800 }}>
                  COST: {upgradeCost} GOLD
                </span>
              </div>
            </div>

            {/* Select Card from Deck */}
            <div>
              <span style={{ display: 'block', fontSize: '0.76rem', color: '#94a3b8', marginBottom: '8px', fontWeight: 700 }}>
                SELECT A CARD FROM YOUR DECK ({deck.length} CARDS):
              </span>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '8px', maxHeight: '160px', overflowY: 'auto' }}>
                {deck.map((card, idx) => {
                  const isSel = selectedDeckCardId === `${card.id}-${idx}`;
                  return (
                    <div
                      key={`${card.id}-${idx}`}
                      onClick={() => {
                        soundFx.playClick();
                        setSelectedDeckCardId(`${card.id}-${idx}`);
                      }}
                      style={{
                        padding: '6px 10px',
                        backgroundColor: isSel ? 'rgba(234, 179, 8, 0.2)' : 'rgba(0, 0, 0, 0.4)',
                        border: isSel ? '1px solid #facc15' : '1px solid #334155',
                        borderRadius: '3px',
                        cursor: 'pointer',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <strong style={{ fontSize: '0.76rem', color: isSel ? '#fef08a' : '#f8fafc' }}>
                          {card.name}
                        </strong>
                        {card.isUpgraded && <span style={{ fontSize: '0.62rem', color: '#86efac' }}>+1</span>}
                      </div>
                      <span style={{ fontSize: '0.65rem', color: '#94a3b8' }}>{card.type} • {card.cost}⚡</span>
                    </div>
                  );
                })}
              </div>

              {/* Action Buttons */}
              {selectedDeckCardId && (
                <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                  <Button
                    variant="danger"
                    size="sm"
                    disabled={hasPurgedCard || gold < purgeCost}
                    onClick={() => {
                      const [cardId] = selectedDeckCardId.split('-');
                      soundFx.playAttack();
                      setHasPurgedCard(true);
                      setSelectedDeckCardId(null);
                      onRemoveCard(cardId, purgeCost);
                    }}
                  >
                    PURGE SELECTED ({purgeCost}G)
                  </Button>

                  <Button
                    variant="gold"
                    size="sm"
                    disabled={hasUpgradedCard || gold < upgradeCost}
                    onClick={() => {
                      const [cardId] = selectedDeckCardId.split('-');
                      soundFx.playVictory();
                      setHasUpgradedCard(true);
                      setSelectedDeckCardId(null);
                      onUpgradeCard(cardId, upgradeCost);
                    }}
                  >
                    UPGRADE SELECTED ({upgradeCost}G)
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'auto' }}>
          <Button variant="secondary" onClick={onClose}>
            Leave Shop
          </Button>
        </div>
      </div>
    </div>
  );
};
