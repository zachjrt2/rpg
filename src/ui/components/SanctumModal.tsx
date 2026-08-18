import React, { useState } from 'react';
import type { MetaProgressionState, MetaUpgradeId } from '../../core/types/meta.ts';
import type { CharacterClassId } from '../../core/types/classes.ts';
import {
  META_UPGRADES,
  UNLOCKABLE_CLASSES,
  UNLOCKABLE_CARDS,
  UNLOCKABLE_RELICS,
  DEFAULT_UNLOCKED_CARDS,
  DEFAULT_UNLOCKED_RELICS,
  getUpgradeCost,
} from '../../core/meta/meta-manager.ts';
import { PortraitAvatar } from './PortraitAvatar.tsx';
import { soundFx } from '../audio/sound-system.ts';
import {
  DiamondSvg,
  ShieldAegisSvg,
  BloodDropSvg,
  FireFlameSvg,
  SwordSvg,
  TrophyVictorySvg,
} from './RpgSvgIcons.tsx';
import {
  Sparkles, X, Heart, Zap, Swords, Coins, FlaskConical,
  CheckCircle2, Layers, Shield, Flame, BookOpen,
  Sun, Compass, Skull, Crown,
} from 'lucide-react';

const BLESSING_GROUPS: { label: string; color: string; ids: MetaUpgradeId[] }[] = [
  {
    label: 'EXPEDITION & LOADOUT',
    color: '#38bdf8',
    ids: ['attunement', 'card_mastery', 'relic_slots', 'celestial_core', 'wellspring', 'transcendence', 'phoenix'],
  },
  {
    label: 'ATTRIBUTES & SURVIVAL',
    color: '#c084fc',
    ids: ['might', 'agility', 'mind', 'vitality', 'willpower', 'vigor', 'bastion'],
  },
  {
    label: 'COMBAT & FORTUNE',
    color: '#facc15',
    ids: ['prowess', 'crit', 'gold', 'fortune', 'capacity', 'reroll', 'reaping'],
  },
];

interface TooltipPos { id: string; x: number; y: number; }
interface UnlockTooltipPos {
  id: string; kind: 'class' | 'relic' | 'card';
  name: string; description: string; cost: number;
  rarity?: string; isUnlocked: boolean; x: number; y: number;
}

interface SanctumModalProps {
  metaProgression: MetaProgressionState;
  onPurchaseUpgrade: (upgradeId: MetaUpgradeId) => void;
  onUnlockClass: (classId: CharacterClassId) => void;
  onUnlockCard?: (cardId: string) => void;
  onUnlockRelic?: (relicId: string) => void;
  onClose: () => void;
}

export const SanctumModal: React.FC<SanctumModalProps> = ({
  metaProgression, onPurchaseUpgrade, onUnlockClass, onUnlockCard, onUnlockRelic, onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'BLESSINGS' | 'CLASSES' | 'RELICS' | 'CARDS'>('BLESSINGS');
  const [upgTip,  setUpgTip]  = useState<TooltipPos | null>(null);
  const [unlkTip, setUnlkTip] = useState<UnlockTooltipPos | null>(null);

  const unlockedCards  = metaProgression.unlockedCardIds  || DEFAULT_UNLOCKED_CARDS;
  const unlockedRelics = metaProgression.unlockedRelicIds || DEFAULT_UNLOCKED_RELICS;

  // ── icon helpers ──────────────────────────────────────────────────────
  const upgIcon = (iconName: string, size = 22) => {
    switch (iconName) {
      case 'Heart':       return <Heart       size={size} color="#ef4444" />;
      case 'Shield':      return <Shield      size={size} color="#38bdf8" />;
      case 'Zap':         return <Zap         size={size} color="#facc15" />;
      case 'Flame':       return <Flame       size={size} color="#f87171" />;
      case 'BookOpen':    return <BookOpen    size={size} color="#a855f7" />;
      case 'Swords':      return <Swords      size={size} color="#f43f5e" />;
      case 'Coins':       return <Coins       size={size} color="#eab308" />;
      case 'FlaskConical':return <FlaskConical size={size} color="#10b981" />;
      case 'Layers':      return <Layers      size={size} color="#38bdf8" />;
      case 'Sun':         return <Sun         size={size} color="#f59e0b" />;
      default:            return <Sparkles    size={size} color="#c084fc" />;
    }
  };

  const relicIcon = (relicId: string, color: string) => {
    const id = relicId.toLowerCase();
    if (id.includes('aegis')   || id.includes('shield') || id.includes('colossus')) return <ShieldAegisSvg  size={22} color={color} />;
    if (id.includes('blood')   || id.includes('vampire')|| id.includes('heart') || id.includes('mask')) return <BloodDropSvg size={22} color="#ef4444" />;
    if (id.includes('brimstone')|| id.includes('flame') || id.includes('pyro'))   return <FireFlameSvg    size={22} color="#f97316" />;
    if (id.includes('viper')   || id.includes('sword')  || id.includes('barb'))    return <SwordSvg        size={22} color={color} />;
    if (id.includes('ley')     || id.includes('shard')  || id.includes('crystal') || id.includes('prism') || id.includes('phylactery')) return <DiamondSvg size={22} color={color} />;
    if (id.includes('chalice') || id.includes('crown')  || id.includes('warlord') || id.includes('grail') || id.includes('midas')) return <TrophyVictorySvg size={22} color="#facc15" />;
    if (id.includes('watch')   || id.includes('chrono') || id.includes('hourglass') || id.includes('monocle')) return <Compass size={22} color={color} />;
    if (id.includes('necrotic')|| id.includes('skull')  || id.includes('boneshard')) return <Skull size={22} color={color} />;
    if (id.includes('storm')   || id.includes('beacon') || id.includes('capacitor')) return <Zap size={22} color="#facc15" />;
    if (id.includes('dragon')  || id.includes('scale')) return <Shield size={22} color="#f59e0b" />;
    if (id.includes('pouch')   || id.includes('alchemist')) return <FlaskConical size={22} color="#10b981" />;
    if (id.includes('cloak')   || id.includes('shadow')) return <Sparkles size={22} color="#c084fc" />;
    return <Sparkles size={22} color={color} />;
  };

  const rarityColor = (r: string) => {
    switch (r) {
      case 'LEGENDARY': return '#facc15';
      case 'EPIC':      return '#c084fc';
      case 'RARE':      return '#38bdf8';
      case 'UNCOMMON':  return '#22c55e';
      default:          return '#94a3b8';
    }
  };

  // ── node position helper ──────────────────────────────────────────────
  const calcTipX = (rect: DOMRect, tipW = 248) => {
    let x = rect.left + rect.width / 2 - tipW / 2;
    return Math.max(8, Math.min(x, window.innerWidth - tipW - 8));
  };

  // ── shared node shell ─────────────────────────────────────────────────
  const NodeShell = ({
    icon, label, subLabel, barPct, border, bg, glow, dimmed, onClick, onHover, onLeave,
  }: {
    icon: React.ReactNode; label: string; subLabel: string;
    barPct?: number; border: string; bg: string; glow: boolean;
    dimmed?: boolean; onClick?: () => void;
    onHover: (e: React.MouseEvent<HTMLDivElement>) => void;
    onLeave: () => void;
  }) => (
    <div
      style={{ position: 'relative' }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      <div
        onClick={onClick}
        style={{
          width: '88px',
          padding: '10px 8px 8px',
          backgroundColor: bg,
          border: `1px solid ${border}`,
          borderRadius: '6px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '6px',
          cursor: onClick ? 'pointer' : 'default',
          transition: 'transform 0.15s ease, opacity 0.15s ease',
          userSelect: 'none',
          opacity: dimmed ? 0.45 : 1,
          ...(glow ? { animation: 'sanctum-pulse 2.4s ease-in-out infinite' } : {}),
        }}
      >
        {icon}
        <span style={{ fontSize: '0.6rem', color: '#e2e8f0', fontWeight: 700, textAlign: 'center', lineHeight: 1.2, width: '72px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: 'var(--font-mono)' }}>
          {label}
        </span>
        {barPct !== undefined && (
          <div style={{ width: '64px', height: '3px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
            <div style={{ width: `${barPct}%`, height: '100%', backgroundColor: border === '#22c55e' ? '#22c55e' : '#c084fc', borderRadius: '2px', transition: 'width 0.3s ease' }} />
          </div>
        )}
        <span style={{ fontSize: '0.58rem', color: border === '#22c55e' ? '#86efac' : '#64748b', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
          {subLabel}
        </span>
      </div>
    </div>
  );

  // ── upgrade node ──────────────────────────────────────────────────────
  const UpgradeNode = ({ upg }: { upg: (typeof META_UPGRADES)[MetaUpgradeId] }) => {
    const rank     = metaProgression.upgradeRanks[upg.id] || 0;
    const isMax    = rank >= upg.maxRank;
    const cost     = getUpgradeCost(upg.id, rank);
    const canAfford= metaProgression.aetherium >= cost;
    const pct      = (rank / upg.maxRank) * 100;
    const border   = isMax ? '#22c55e' : rank > 0 ? '#c084fc' : 'rgba(255,255,255,0.08)';
    const bg       = isMax ? 'rgba(34,197,94,0.06)' : rank > 0 ? 'rgba(168,85,247,0.07)' : 'rgba(0,0,0,0.45)';
    const shortName= upg.name.replace('Astral ','').replace("Merchant's ",'').replace('Aetheric ','');

    return (
      <NodeShell
        icon={upgIcon(upg.iconName, 22)}
        label={shortName}
        subLabel={isMax ? 'MAX' : `${rank}/${upg.maxRank}`}
        barPct={pct}
        border={border}
        bg={bg}
        glow={!isMax && canAfford}
        dimmed={!isMax && !canAfford && rank === 0}
        onClick={!isMax && canAfford ? () => { soundFx.playVictory(); onPurchaseUpgrade(upg.id); } : undefined}
        onHover={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          setUpgTip({ id: upg.id, x: calcTipX(rect), y: rect.top - 8 });
        }}
        onLeave={() => setUpgTip(null)}
      />
    );
  };

  // ── unlock node ───────────────────────────────────────────────────────
  const UnlockNode = ({
    id, kind, icon, name, description, cost, isUnlocked, rarity, onUnlock,
  }: {
    id: string; kind: 'class' | 'relic' | 'card';
    icon: React.ReactNode; name: string; description: string;
    cost: number; isUnlocked: boolean; rarity?: string;
    onUnlock: () => void;
  }) => {
    const canAfford = metaProgression.aetherium >= cost;
    const rc = rarity ? rarityColor(rarity) : '#94a3b8';
    const border = isUnlocked ? '#22c55e' : canAfford ? rc : 'rgba(255,255,255,0.08)';
    const bg     = isUnlocked ? 'rgba(34,197,94,0.06)' : 'rgba(0,0,0,0.45)';
    const shortName = name.replace(' the ', ' ').split(' ').slice(0,2).join(' ');

    return (
      <NodeShell
        icon={icon}
        label={shortName}
        subLabel={isUnlocked ? 'OWNED' : canAfford ? `${cost} ◈` : 'LOCKED'}
        border={border}
        bg={bg}
        glow={!isUnlocked && canAfford}
        dimmed={!isUnlocked && !canAfford}
        onClick={!isUnlocked && canAfford ? () => { soundFx.playVictory(); onUnlock(); } : undefined}
        onHover={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          setUnlkTip({ id, kind, name, description, cost, rarity, isUnlocked, x: calcTipX(rect), y: rect.top - 8 });
        }}
        onLeave={() => setUnlkTip(null)}
      />
    );
  };

  // ── fixed-position tooltip for upgrades ──────────────────────────────
  const renderUpgTip = () => {
    if (!upgTip) return null;
    const upg = META_UPGRADES[upgTip.id as MetaUpgradeId];
    if (!upg) return null;
    const rank     = metaProgression.upgradeRanks[upg.id] || 0;
    const isMax    = rank >= upg.maxRank;
    const cost     = getUpgradeCost(upg.id, rank);
    const canAfford= metaProgression.aetherium >= cost;
    const pct      = (rank / upg.maxRank) * 100;
    const tipH     = isMax ? 130 : 150;
    const top      = upgTip.y - tipH < 8 ? upgTip.y + 104 : upgTip.y - tipH;

    return (
      <div style={{ position: 'fixed', top, left: upgTip.x, width: '248px', backgroundColor: 'rgba(8,10,18,0.99)', border: `1px solid ${isMax ? '#22c55e' : '#c084fc'}`, borderRadius: '6px', padding: '12px', boxShadow: '0 12px 36px rgba(0,0,0,0.95)', zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '8px', pointerEvents: 'none' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '6px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
            {upgIcon(upg.iconName, 14)}
            <strong style={{ color: '#f8fafc', fontSize: '0.82rem', lineHeight: 1.2 }}>{upg.name}</strong>
          </div>
          <span style={{ fontSize: '0.62rem', padding: '2px 6px', backgroundColor: isMax ? 'rgba(34,197,94,0.2)' : 'rgba(99,102,241,0.2)', color: isMax ? '#86efac' : '#c7d2fe', border: isMax ? '1px solid #22c55e' : '1px solid #6366f1', borderRadius: '3px', fontWeight: 700, whiteSpace: 'nowrap', flexShrink: 0 }}>{rank}/{upg.maxRank}</span>
        </div>
        <div style={{ width: '100%', height: '4px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
          <div style={{ width: `${pct}%`, height: '100%', backgroundColor: isMax ? '#22c55e' : '#c084fc', borderRadius: '3px' }} />
        </div>
        <p style={{ margin: 0, fontSize: '0.74rem', color: '#cbd5e1', lineHeight: 1.4 }}>{upg.description}</p>
        {isMax ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#86efac', fontSize: '0.72rem', fontWeight: 700 }}>
            <CheckCircle2 size={13} color="#86efac" />MAX RANK
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: canAfford ? '#f5d0fe' : '#64748b', fontSize: '0.72rem', fontWeight: 700 }}>
            <DiamondSvg size={12} color={canAfford ? '#c084fc' : '#4b5563'} />
            {canAfford ? `Click to upgrade — ${cost} shards` : `Need ${cost - metaProgression.aetherium} more shards`}
          </div>
        )}
      </div>
    );
  };

  // ── fixed-position tooltip for unlocks ───────────────────────────────
  const renderUnlkTip = () => {
    if (!unlkTip) return null;
    const { name, description, cost, rarity, isUnlocked } = unlkTip;
    const canAfford = metaProgression.aetherium >= cost;
    const rc = rarity ? rarityColor(rarity) : '#94a3b8';
    const top = unlkTip.y - 130 < 8 ? unlkTip.y + 104 : unlkTip.y - 130;

    return (
      <div style={{ position: 'fixed', top, left: unlkTip.x, width: '248px', backgroundColor: 'rgba(8,10,18,0.99)', border: `1px solid ${isUnlocked ? '#22c55e' : rc}`, borderRadius: '6px', padding: '12px', boxShadow: '0 12px 36px rgba(0,0,0,0.95)', zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '8px', pointerEvents: 'none' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '6px' }}>
          <strong style={{ color: '#f8fafc', fontSize: '0.82rem' }}>{name}</strong>
          {rarity && <span style={{ fontSize: '0.6rem', color: rc, fontWeight: 800, letterSpacing: '0.06em', flexShrink: 0 }}>{rarity}</span>}
        </div>
        <p style={{ margin: 0, fontSize: '0.74rem', color: '#cbd5e1', lineHeight: 1.4 }}>{description}</p>
        {isUnlocked ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#86efac', fontSize: '0.72rem', fontWeight: 700 }}>
            <CheckCircle2 size={13} color="#86efac" />UNLOCKED
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: canAfford ? '#f5d0fe' : '#64748b', fontSize: '0.72rem', fontWeight: 700 }}>
            <DiamondSvg size={12} color={canAfford ? '#c084fc' : '#4b5563'} />
            {canAfford ? `Click to unlock — ${cost} shards` : `Need ${cost - metaProgression.aetherium} more`}
          </div>
        )}
      </div>
    );
  };

  const tabStyle = (active: boolean): React.CSSProperties => ({
    padding: '6px 14px',
    backgroundColor: active ? 'rgba(168,85,247,0.2)' : 'transparent',
    border: active ? '1px solid #c084fc' : '1px solid transparent',
    borderRadius: '4px',
    color: active ? '#f5d0fe' : '#64748b',
    fontFamily: 'var(--font-mono)',
    fontWeight: 700,
    fontSize: '0.74rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    transition: 'all 0.12s ease',
    letterSpacing: '0.05em',
  });

  return (
    <>
      <style>{`@keyframes sanctum-pulse{0%,100%{box-shadow:0 0 6px rgba(168,85,247,0.25);}50%{box-shadow:0 0 18px rgba(168,85,247,0.55);}}`}</style>
      {renderUpgTip()}
      {renderUnlkTip()}

      <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(5,8,14,0.92)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 150, padding: '8px', fontFamily: 'var(--font-mono)' }}>
        <div className="rpg-panel animate-modal-in" style={{ width: '100%', maxWidth: '860px', height: '92dvh', maxHeight: '92dvh', display: 'flex', flexDirection: 'column', backgroundColor: 'rgba(10,14,24,0.98)', border: '1px solid rgba(192,132,252,0.35)', boxShadow: '0 0 40px rgba(168,85,247,0.18)', borderRadius: '8px', overflow: 'hidden' }}>

          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', borderBottom: '1px solid rgba(192,132,252,0.12)', flexShrink: 0, flexWrap: 'wrap', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Sparkles size={20} color="#c084fc" />
              <div>
                <h2 style={{ margin: 0, fontSize: '0.95rem', color: '#e879f9', letterSpacing: '0.07em', fontWeight: 800 }}>ASTRAL SANCTUM</h2>
                <span style={{ fontSize: '0.65rem', color: '#475569', letterSpacing: '0.03em' }}>Tap node to inspect & unlock</span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflowX: 'auto', maxWidth: '100%' }}>
              <div style={{ display: 'flex', gap: '3px', backgroundColor: 'rgba(0,0,0,0.4)', padding: '3px', borderRadius: '5px' }}>
                <button onClick={() => { soundFx.playClick(); setActiveTab('BLESSINGS'); }} style={tabStyle(activeTab === 'BLESSINGS')}>
                  <Sparkles size={12} />BLESSINGS
                </button>
                <button onClick={() => { soundFx.playClick(); setActiveTab('CLASSES'); }} style={tabStyle(activeTab === 'CLASSES')}>
                  <Crown size={12} />CLASSES
                </button>
                <button onClick={() => { soundFx.playClick(); setActiveTab('RELICS'); }} style={tabStyle(activeTab === 'RELICS')}>
                  <ShieldAegisSvg size={13} color={activeTab === 'RELICS' ? '#f5d0fe' : '#64748b'} />RELICS
                </button>
                <button onClick={() => { soundFx.playClick(); setActiveTab('CARDS'); }} style={tabStyle(activeTab === 'CARDS')}>
                  <Layers size={12} />CARDS
                </button>
              </div>
              <button onClick={onClose} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '4px', color: '#475569', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center' }} onMouseEnter={(e) => { e.currentTarget.style.color = '#f8fafc'; }} onMouseLeave={(e) => { e.currentTarget.style.color = '#475569'; }}><X size={17} /></button>
            </div>
          </div>

          {/* Content */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {/* BLESSINGS TAB */}
            {activeTab === 'BLESSINGS' && BLESSING_GROUPS.map((grp) => {
              const items = grp.ids.map((id) => META_UPGRADES[id as MetaUpgradeId]).filter(Boolean);
              return (
                <div key={grp.label}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                    <span style={{ fontSize: '0.62rem', fontWeight: 800, color: grp.color, letterSpacing: '0.14em' }}>{grp.label}</span>
                    <div style={{ flex: 1, height: '1px', backgroundColor: `${grp.color}20` }} />
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    {items.map((upg) => <UpgradeNode key={upg.id} upg={upg} />)}
                  </div>
                </div>
              );
            })}

            {/* CLASSES TAB */}
            {activeTab === 'CLASSES' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                  <span style={{ fontSize: '0.62rem', fontWeight: 800, color: '#c084fc', letterSpacing: '0.14em' }}>HERO CLASSES</span>
                  <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(192,132,252,0.12)' }} />
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {Object.values(UNLOCKABLE_CLASSES).map((cls) => {
                    const isUnlocked = metaProgression.unlockedClasses.includes(cls.classId);
                    return (
                      <UnlockNode
                        key={cls.classId}
                        id={cls.classId}
                        kind="class"
                        icon={<PortraitAvatar type={cls.classId.toLowerCase()} size={34} />}
                        name={cls.name}
                        description={cls.description}
                        cost={cls.cost}
                        isUnlocked={isUnlocked}
                        onUnlock={() => onUnlockClass(cls.classId)}
                      />
                    );
                  })}
                </div>
              </div>
            )}

            {/* RELICS TAB */}
            {activeTab === 'RELICS' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                  <span style={{ fontSize: '0.62rem', fontWeight: 800, color: '#38bdf8', letterSpacing: '0.14em' }}>STARTING & ARCHIVED RELICS</span>
                  <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(56,189,248,0.12)' }} />
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {Object.values(UNLOCKABLE_RELICS).map((relic) => {
                    const isUnlocked = unlockedRelics.includes(relic.relicId);
                    const rc = rarityColor(relic.rarity);
                    return (
                      <UnlockNode
                        key={relic.relicId}
                        id={relic.relicId}
                        kind="relic"
                        icon={relicIcon(relic.relicId, rc)}
                        name={relic.name}
                        description={relic.description}
                        cost={relic.cost}
                        rarity={relic.rarity}
                        isUnlocked={isUnlocked}
                        onUnlock={() => onUnlockRelic && onUnlockRelic(relic.relicId)}
                      />
                    );
                  })}
                </div>
              </div>
            )}

            {/* CARDS TAB */}
            {activeTab === 'CARDS' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                  <span style={{ fontSize: '0.62rem', fontWeight: 800, color: '#facc15', letterSpacing: '0.14em' }}>CARD ARCHIVE</span>
                  <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(250,204,21,0.12)' }} />
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {Object.values(UNLOCKABLE_CARDS).map((card) => {
                    const isUnlocked = unlockedCards.includes(card.cardId);
                    return (
                      <UnlockNode
                        key={card.cardId}
                        id={card.cardId}
                        kind="card"
                        icon={<Layers size={22} color="#38bdf8" />}
                        name={card.name}
                        description={card.description}
                        cost={card.cost}
                        isUnlocked={isUnlocked}
                        onUnlock={() => onUnlockCard && onUnlockCard(card.cardId)}
                      />
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div style={{ flexShrink: 0, borderTop: '1px solid rgba(192,132,252,0.12)', padding: '10px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'rgba(6,8,16,0.95)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <DiamondSvg size={14} color="#c084fc" />
              <span style={{ fontSize: '1.05rem', color: '#f5d0fe', fontWeight: 800, letterSpacing: '0.05em' }}>{metaProgression.aetherium}</span>
              <span style={{ fontSize: '0.65rem', color: '#475569', fontWeight: 600, letterSpacing: '0.08em' }}>AETHERIUM REMAINING</span>
            </div>
            <span style={{ fontSize: '0.62rem', color: '#334155' }}>Lifetime: {metaProgression.lifetimeAetherium ?? metaProgression.aetherium} shards</span>
          </div>
        </div>
      </div>
    </>
  );
};