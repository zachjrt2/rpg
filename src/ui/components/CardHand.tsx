import React, { useState, useEffect } from 'react';
import type { CombatCard, DeckState } from '../../core/types/cards.ts';
import type { Combatant } from '../../core/types/combat.ts';
import { calculateScaledCardValues } from '../../core/combat/card-scaling.ts';
import { Button } from './Button.tsx';
import { soundFx } from '../audio/sound-system.ts';
import { ShieldAegisSvg, SwordSvg, MagicSparklesSvg, TerminalChevronSvg } from './RpgSvgIcons.tsx';
import { Zap, Shield, Swords, Sparkles, BookOpen, Layers } from 'lucide-react';

interface CardHandProps {
  deckState: DeckState;
  hero?: Combatant;
  activeEnemy?: Combatant | null;
  isPlayerTurn: boolean;
  onPlayCard: (card: CombatCard) => void;
  onEndTurn: () => void;
  onOpenDeckView?: () => void;
  isCombatLogOpen?: boolean;
  onToggleCombatLog?: () => void;
}

export const CardHand: React.FC<CardHandProps> = ({
  deckState,
  hero,
  activeEnemy,
  isPlayerTurn,
  onPlayCard,
  onEndTurn,
  onOpenDeckView,
  isCombatLogOpen = false,
  onToggleCombatLog,
}) => {
  const [hoveredBadgeCardId, setHoveredBadgeCardId] = useState<string | null>(null);
  const [windowWidth, setWindowWidth] = useState<number>(() => (typeof window !== 'undefined' ? window.innerWidth : 1024));

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isSynergyActive = (c: CombatCard): boolean => {
    if (!activeEnemy || activeEnemy.isDead) return false;
    const effects = activeEnemy.statusEffects || [];
    if (c.baseId === 'combustion' && effects.some((s) => s.type === 'BURNING')) return true;
    if ((c.baseId === 'venom-strike' || c.baseId === 'acid-slash') && effects.some((s) => s.type === 'POISON' || s.type === 'CORROSION')) return true;
    if (c.baseId === 'rupture' && effects.some((s) => s.type === 'BLEEDING')) return true;
    if ((c.baseId === 'shield-slam' || c.baseId === 'spiked-barrier') && (hero?.shieldHp || 0) > 0) return true;
    if ((c.baseId === 'blood-slash' || c.baseId === 'frenzy-rage') && hero && hero.currentHp <= hero.maxHp * 0.5) return true;
    if (c.baseId === 'frost-lance' && effects.some((s) => s.type === 'FROZEN' || s.type === 'SHOCKED')) return true;
    return false;
  };

  const getCardBorderColor = (card: CombatCard) => {
    if (isSynergyActive(card)) return '#facc15';
    if (card.type === 'ATTACK') return '#f87171';
    if (card.type === 'SKILL') return '#38bdf8';
    if (card.type === 'POWER') return '#c084fc';
    return '#facc15';
  };

  const getCardTypeIcon = (type: string) => {
    if (type === 'ATTACK') return <Swords size={11} color="#f87171" />;
    if (type === 'SKILL') return <Shield size={11} color="#38bdf8" />;
    return <Sparkles size={11} color="#c084fc" />;
  };

  const handLength = deckState.hand.length;
  const isMobile = windowWidth < 640;
  const isWide = !isCombatLogOpen && !isMobile;
  const cardWidth = isMobile ? '116px' : isWide ? '132px' : '108px';
  const cardMinWidth = isMobile ? '102px' : isWide ? '104px' : '82px';
  const cardMaxWidth = isMobile ? '124px' : isWide ? '146px' : '116px';
  const cardHeight = isMobile ? '142px' : isWide ? '146px' : '138px';
  const cardFlex = isMobile ? '0 0 116px' : isWide ? '0 1 132px' : '0 1 108px';
  // Calculate smooth overlap when hand has multiple cards so cards never exceed container width
  const overlap = isMobile
    ? 0
    : isWide
    ? (handLength > 6 ? Math.min(22, Math.round((handLength - 6) * 4.5)) : 0)
    : (handLength > 4 ? Math.min(22, Math.round((handLength - 4) * 4.5)) : 0);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        width: '100%',
        fontFamily: 'var(--font-mono)',
        userSelect: 'none',
      }}
    >
      {/* Top Deck HUD Bar: Draw Pile, Energy Orb, End Turn, Discard Pile */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '5px 12px',
          backgroundColor: 'rgba(10, 14, 22, 0.95)',
          border: '1px solid var(--border-gold)',
          borderRadius: '4px',
        }}
      >
        {/* Left Controls: Draw Pile Button & Optional Log Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            onClick={onOpenDeckView}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid #334155',
              borderRadius: '3px',
              padding: '3px 8px',
              color: '#94a3b8',
              fontSize: '0.74rem',
              fontFamily: 'var(--font-mono)',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            title="View Draw Pile & Full Deck Collection"
          >
            <BookOpen size={13} color="#38bdf8" />
            <span>DRAW [{deckState.drawPile.length}]</span>
          </button>

          {onToggleCombatLog && (
            <button
              onClick={onToggleCombatLog}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                background: isCombatLogOpen ? 'rgba(74, 222, 128, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                border: isCombatLogOpen ? '1px solid #4ade80' : '1px solid #334155',
                borderRadius: '3px',
                padding: '3px 8px',
                color: isCombatLogOpen ? '#86efac' : '#94a3b8',
                fontSize: '0.74rem',
                fontFamily: 'var(--font-mono)',
                fontWeight: isCombatLogOpen ? 700 : 500,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              title={isCombatLogOpen ? 'Hide Combat Log (Expand Cards)' : 'Show Combat Log'}
            >
              <TerminalChevronSvg size={11} color={isCombatLogOpen ? '#4ade80' : '#94a3b8'} />
              <span>LOG {isCombatLogOpen ? '▲' : '▼'}</span>
            </button>
          )}
        </div>

        {/* Center: Glowing Energy Counter */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 14px',
            backgroundColor: 'rgba(234, 179, 8, 0.15)',
            border: '1.5px solid #facc15',
            borderRadius: '16px',
            boxShadow: '0 0 12px rgba(250, 204, 21, 0.3)',
          }}
        >
          <Zap size={15} color="#facc15" />
          <span
            style={{
              fontSize: '0.9rem',
              fontWeight: 800,
              color: '#fef08a',
              letterSpacing: '0.04em',
            }}
          >
            {deckState.currentEnergy} / {deckState.maxEnergy}
          </span>
        </div>

        {/* End Turn Button & Discard Pile Counter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Button
            variant={isPlayerTurn ? 'gold' : 'secondary'}
            size="sm"
            disabled={!isPlayerTurn}
            onClick={() => {
              soundFx.playClick();
              onEndTurn();
            }}
            style={{ padding: '3px 10px', fontSize: '0.75rem' }}
          >
            {isPlayerTurn ? 'END TURN [SPACE]' : 'ENEMY TURN...'}
          </Button>

          <button
            onClick={onOpenDeckView}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid #334155',
              borderRadius: '3px',
              padding: '3px 8px',
              color: '#94a3b8',
              fontSize: '0.74rem',
              fontFamily: 'var(--font-mono)',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            title="View Discard Pile"
          >
            <Layers size={13} color="#94a3b8" />
            <span>DISCARD [{deckState.discardPile.length}]</span>
          </button>
        </div>
      </div>

      {/* Hand Cards Fan - Responsive Overlap / Mobile Touch Scroll */}
      <div
        style={{
          display: 'flex',
          justifyContent: isMobile && handLength * 124 > windowWidth ? 'flex-start' : 'center',
          alignItems: 'flex-end',
          minHeight: isWide ? '156px' : '148px',
          padding: isMobile ? '16px 8px 8px 8px' : '16px 6px 2px 6px',
          overflowX: isMobile ? 'auto' : 'visible',
          overflowY: 'visible',
          position: 'relative',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {deckState.hand.map((card, index) => {
          const canAfford = deckState.currentEnergy >= card.cost && isPlayerTurn;
          const borderColor = getCardBorderColor(card);
          const scaled = calculateScaledCardValues(card, hero);

          return (
            <div
              key={card.id}
              onClick={() => {
                if (canAfford) {
                  soundFx.playClick();
                  onPlayCard(card);
                }
              }}
              style={{
                width: cardWidth,
                minWidth: cardMinWidth,
                maxWidth: cardMaxWidth,
                height: cardHeight,
                flex: cardFlex,
                flexShrink: isMobile ? 0 : undefined,
                marginLeft: isMobile ? (index === 0 ? 0 : '8px') : index === 0 ? 0 : overlap > 0 ? `-${overlap}px` : isWide ? '8px' : '6px',
                padding: '6px 8px',
                backgroundColor: 'rgba(10, 15, 24, 0.96)',
                backgroundImage: 'linear-gradient(180deg, rgba(18, 26, 40, 0.95) 0%, rgba(8, 12, 18, 0.98) 100%)',
                border: `1.5px solid ${borderColor}`,
                borderRadius: '5px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                cursor: canAfford ? 'pointer' : 'not-allowed',
                opacity: canAfford ? 1 : 0.45,
                transition: 'transform 0.15s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.15s ease, z-index 0s',
                transform: 'translateY(0) scale(1)',
                boxShadow: canAfford ? `0 2px 8px ${borderColor}25` : 'none',
                position: 'relative',
                zIndex: index + 2,
              }}
              onMouseEnter={(e) => {
                if (canAfford) {
                  e.currentTarget.style.transform = 'translateY(-16px) scale(1.10)';
                  e.currentTarget.style.zIndex = '50';
                  e.currentTarget.style.boxShadow = `0 8px 24px ${borderColor}66, 0 0 12px ${borderColor}44`;
                  e.currentTarget.style.borderWidth = '2px';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.zIndex = `${index + 2}`;
                e.currentTarget.style.boxShadow = canAfford ? `0 2px 8px ${borderColor}25` : 'none';
                e.currentTarget.style.borderWidth = '1.5px';
              }}
            >
              {/* Energy Cost Badge */}
              <div
                style={{
                  position: 'absolute',
                  top: '-7px',
                  left: '-7px',
                  width: '21px',
                  height: '21px',
                  borderRadius: '50%',
                  backgroundColor: '#ca8a04',
                  backgroundImage: 'linear-gradient(135deg, #facc15 0%, #ca8a04 100%)',
                  border: '1.5px solid #fef08a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#000000',
                  fontWeight: 900,
                  fontSize: '0.78rem',
                  boxShadow: '0 0 6px rgba(250, 204, 21, 0.6)',
                }}
              >
                {card.cost}
              </div>

              {/* Card Header (Type Icon, Hotkey, & Name) */}
              <div style={{ marginTop: '1px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                    {getCardTypeIcon(card.type)}
                    <span style={{ fontSize: '0.56rem', color: borderColor, fontWeight: 700 }}>
                      {card.type}
                    </span>
                    {isSynergyActive(card) && (
                      <span
                        style={{
                          fontSize: '0.54rem',
                          color: '#facc15',
                          fontWeight: 800,
                          backgroundColor: 'rgba(234, 179, 8, 0.2)',
                          padding: '0 3px',
                          borderRadius: '2px',
                          border: '1px solid #facc15',
                        }}
                      >
                        ⚡ COMBO
                      </span>
                    )}
                  </div>
                  {index < 9 && (
                    <span style={{ fontSize: '0.58rem', color: '#94a3b8', fontWeight: 600 }}>
                      [{index + 1}]
                    </span>
                  )}
                </div>
                <strong
                  style={{
                    fontSize: '0.74rem',
                    color: card.isUpgraded ? '#86efac' : '#f8fafc',
                    display: 'block',
                    lineHeight: 1.15,
                    marginTop: '3px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                  title={card.name}
                >
                  {card.name}
                </strong>
              </div>

              {/* Card Description */}
              <p
                style={{
                  margin: 0,
                  fontSize: '0.64rem',
                  color: '#cbd5e1',
                  lineHeight: 1.22,
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {card.description}
              </p>

              {/* Footer Badges with Hover Math Calculation Tooltip */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
                {scaled.damage ? (
                  <div
                    onMouseEnter={(e) => {
                      e.stopPropagation();
                      setHoveredBadgeCardId(`dmg-${card.id}`);
                    }}
                    onMouseLeave={(e) => {
                      e.stopPropagation();
                      setHoveredBadgeCardId(null);
                    }}
                    style={{ position: 'relative', cursor: 'help' }}
                  >
                    <span
                      style={{
                        fontSize: '0.62rem',
                        color: scaled.damage.bonus > 0 ? '#fca5a5' : '#f87171',
                        fontWeight: 700,
                        borderBottom: scaled.damage.bonus > 0 ? '1px dotted #fca5a5' : 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '3px',
                      }}
                    >
                      <SwordSvg size={11} color="#f87171" />
                      <span>{scaled.damage.total}</span>
                      {scaled.damage.bonus > 0 && <span style={{ color: '#86efac', fontSize: '0.55rem', marginLeft: '2px' }}>+{scaled.damage.bonus}</span>}
                    </span>

                    {hoveredBadgeCardId === `dmg-${card.id}` && (
                      <div
                        style={{
                          position: 'absolute',
                          bottom: 'calc(100% + 6px)',
                          left: '0',
                          backgroundColor: 'rgba(15, 23, 42, 0.98)',
                          border: '1px solid #f87171',
                          borderRadius: '4px',
                          padding: '4px 8px',
                          fontSize: '0.65rem',
                          color: '#f8fafc',
                          whiteSpace: 'nowrap',
                          zIndex: 100,
                          boxShadow: '0 4px 12px rgba(0,0,0,0.8)',
                          pointerEvents: 'none',
                        }}
                      >
                        <div style={{ color: '#fca5a5', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <SwordSvg size={12} color="#f87171" />
                          <span>Damage Math:</span>
                        </div>
                        <div>• Base: {scaled.damage.base}</div>
                        <div>• Stat Bonus: +{scaled.damage.bonus}</div>
                        <div style={{ color: '#94a3b8', fontSize: '0.58rem', marginTop: '2px' }}>
                          ({hero?.primaryStats?.strength || 10} STR, {hero?.primaryStats?.dexterity || 10} DEX)
                        </div>
                      </div>
                    )}
                  </div>
                ) : scaled.magicDamage ? (
                  <div
                    onMouseEnter={(e) => {
                      e.stopPropagation();
                      setHoveredBadgeCardId(`mdmg-${card.id}`);
                    }}
                    onMouseLeave={(e) => {
                      e.stopPropagation();
                      setHoveredBadgeCardId(null);
                    }}
                    style={{ position: 'relative', cursor: 'help' }}
                  >
                    <span
                      style={{
                        fontSize: '0.62rem',
                        color: scaled.magicDamage.bonus > 0 ? '#e9d5ff' : '#c084fc',
                        fontWeight: 700,
                        borderBottom: scaled.magicDamage.bonus > 0 ? '1px dotted #e9d5ff' : 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '3px',
                      }}
                    >
                      <MagicSparklesSvg size={11} color="#c084fc" />
                      <span>{scaled.magicDamage.total}</span>
                      {scaled.magicDamage.bonus > 0 && <span style={{ color: '#86efac', fontSize: '0.55rem', marginLeft: '2px' }}>+{scaled.magicDamage.bonus}</span>}
                    </span>

                    {hoveredBadgeCardId === `mdmg-${card.id}` && (
                      <div
                        style={{
                          position: 'absolute',
                          bottom: 'calc(100% + 6px)',
                          left: '0',
                          backgroundColor: 'rgba(15, 23, 42, 0.98)',
                          border: '1px solid #c084fc',
                          borderRadius: '4px',
                          padding: '4px 8px',
                          fontSize: '0.65rem',
                          color: '#f8fafc',
                          whiteSpace: 'nowrap',
                          zIndex: 100,
                          boxShadow: '0 4px 12px rgba(0,0,0,0.8)',
                          pointerEvents: 'none',
                        }}
                      >
                        <div style={{ color: '#e9d5ff', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <MagicSparklesSvg size={12} color="#c084fc" />
                          <span>Magic Math:</span>
                        </div>
                        <div>• Base: {scaled.magicDamage.base}</div>
                        <div>• Spell Bonus: +{scaled.magicDamage.bonus}</div>
                        <div style={{ color: '#94a3b8', fontSize: '0.58rem', marginTop: '2px' }}>
                          ({hero?.primaryStats?.intelligence || 10} INT, {hero?.primaryStats?.willpower || 10} WIL)
                        </div>
                      </div>
                    )}
                  </div>
                ) : scaled.block ? (
                  <div
                    onMouseEnter={(e) => {
                      e.stopPropagation();
                      setHoveredBadgeCardId(`blk-${card.id}`);
                    }}
                    onMouseLeave={(e) => {
                      e.stopPropagation();
                      setHoveredBadgeCardId(null);
                    }}
                    style={{ position: 'relative', cursor: 'help' }}
                  >
                    <span
                      style={{
                        fontSize: '0.62rem',
                        color: scaled.block.bonus > 0 ? '#bae6fd' : '#38bdf8',
                        fontWeight: 700,
                        borderBottom: scaled.block.bonus > 0 ? '1px dotted #bae6fd' : 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '3px',
                      }}
                    >
                      <ShieldAegisSvg size={11} color="#38bdf8" />
                      <span>+{scaled.block.total}</span>
                      {scaled.block.bonus > 0 && <span style={{ color: '#86efac', fontSize: '0.55rem', marginLeft: '2px' }}>+{scaled.block.bonus}</span>}
                    </span>

                    {hoveredBadgeCardId === `blk-${card.id}` && (
                      <div
                        style={{
                          position: 'absolute',
                          bottom: 'calc(100% + 6px)',
                          left: '0',
                          backgroundColor: 'rgba(15, 23, 42, 0.98)',
                          border: '1px solid #38bdf8',
                          borderRadius: '4px',
                          padding: '4px 8px',
                          fontSize: '0.65rem',
                          color: '#f8fafc',
                          whiteSpace: 'nowrap',
                          zIndex: 100,
                          boxShadow: '0 4px 12px rgba(0,0,0,0.8)',
                          pointerEvents: 'none',
                        }}
                      >
                        <div style={{ color: '#bae6fd', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <ShieldAegisSvg size={12} color="#38bdf8" />
                          <span>Block Math:</span>
                        </div>
                        <div>• Base: {scaled.block.base}</div>
                        <div>• Armor Bonus: +{scaled.block.bonus}</div>
                        <div style={{ color: '#94a3b8', fontSize: '0.58rem', marginTop: '2px' }}>
                          ({hero?.primaryStats?.vitality || 10} VIT, {hero?.primaryStats?.strength || 10} STR)
                        </div>
                      </div>
                    )}
                  </div>
                ) : scaled.heal ? (
                  <div
                    onMouseEnter={(e) => {
                      e.stopPropagation();
                      setHoveredBadgeCardId(`heal-${card.id}`);
                    }}
                    onMouseLeave={(e) => {
                      e.stopPropagation();
                      setHoveredBadgeCardId(null);
                    }}
                    style={{ position: 'relative', cursor: 'help' }}
                  >
                    <span
                      style={{
                        fontSize: '0.62rem',
                        color: scaled.heal.bonus > 0 ? '#bbf7d0' : '#4ade80',
                        fontWeight: 700,
                        borderBottom: scaled.heal.bonus > 0 ? '1px dotted #bbf7d0' : 'none',
                      }}
                    >
                      ✨ +{scaled.heal.total}
                      {scaled.heal.bonus > 0 && <span style={{ color: '#86efac', fontSize: '0.55rem', marginLeft: '2px' }}>+{scaled.heal.bonus}</span>}
                    </span>

                    {hoveredBadgeCardId === `heal-${card.id}` && (
                      <div
                        style={{
                          position: 'absolute',
                          bottom: 'calc(100% + 6px)',
                          left: '0',
                          backgroundColor: 'rgba(15, 23, 42, 0.98)',
                          border: '1px solid #4ade80',
                          borderRadius: '4px',
                          padding: '4px 8px',
                          fontSize: '0.65rem',
                          color: '#f8fafc',
                          whiteSpace: 'nowrap',
                          zIndex: 100,
                          boxShadow: '0 4px 12px rgba(0,0,0,0.8)',
                          pointerEvents: 'none',
                        }}
                      >
                        <div style={{ color: '#bbf7d0', fontWeight: 700 }}>✨ Heal Math:</div>
                        <div>• Base: {scaled.heal.base}</div>
                        <div>• Holy Bonus: +{scaled.heal.bonus}</div>
                        <div style={{ color: '#94a3b8', fontSize: '0.58rem', marginTop: '2px' }}>
                          ({hero?.primaryStats?.willpower || 10} WIL, {hero?.primaryStats?.intelligence || 10} INT)
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <span />
                )}

                {card.exhausts && (
                  <span style={{ fontSize: '0.55rem', color: '#f97316', fontWeight: 700 }}>
                    [EXH]
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
