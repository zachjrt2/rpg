import React from 'react';
import type { Combatant } from '../../core/types/combat.ts';
import { PortraitAvatar } from './PortraitAvatar.tsx';
import { StatBar } from './StatBar.tsx';
import { Button } from './Button.tsx';
import {
  TerminalChevronSvg,
  SwordSvg,
  HelmArmorSvg,
  CuirassArmorSvg,
  GauntletsSvg,
  GreavesBootsSvg,
  RingAccessorySvg,
} from './RpgSvgIcons.tsx';
import { X } from 'lucide-react';

interface CharacterModalProps {
  hero: Combatant;
  onClose: () => void;
}

export const CharacterModal: React.FC<CharacterModalProps> = ({ hero, onClose }) => {
  const p = hero.primaryStats;
  const d = hero.derivedStats;

  const equipmentSlots = [
    { name: 'MAIN_HAND', item: 'Iron Broadsword (+8 ATK)', rarity: 'Common', icon: <SwordSvg size={18} color="#fca5a5" /> },
    { name: 'HEADWEAR', item: 'Steel Visor Helm (+4 DEF)', rarity: 'Common', icon: <HelmArmorSvg size={18} color="#94a3b8" /> },
    { name: 'CHEST_ARMOR', item: 'Tempered Steel Cuirass (+12 DEF)', rarity: 'Common', icon: <CuirassArmorSvg size={18} color="#94a3b8" /> },
    { name: 'HANDS', item: 'Plated Gauntlets (+3 STR)', rarity: 'Common', icon: <GauntletsSvg size={18} color="#94a3b8" /> },
    { name: 'LEGGINGS', item: 'Iron Greaves (+5 DEF)', rarity: 'Common', icon: <GreavesBootsSvg size={18} color="#94a3b8" /> },
    { name: 'FOOTWEAR', item: 'Reinforced Sabatons (+2 SPD)', rarity: 'Common', icon: <GreavesBootsSvg size={18} color="#94a3b8" /> },
    { name: 'ACCESSORY_1', item: 'Silver Crest Ring (+5% Crit)', rarity: 'Uncommon', icon: <RingAccessorySvg size={18} color="#60a5fa" /> },
    { name: 'ACCESSORY_2', item: 'EMPTY_SLOT', itemEmpty: true, rarity: 'Common', icon: <RingAccessorySvg size={18} color="#475569" /> },
  ];

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
        padding: '20px',
      }}
    >
      <div
        className="rpg-panel rpg-panel-gold animate-modal-in"
        style={{
          width: '100%',
          maxWidth: '780px',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          backgroundColor: 'rgba(10, 14, 20, 0.98)',
          fontFamily: 'var(--font-mono)',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <TerminalChevronSvg size={22} color="var(--text-term-green)" />
            <h2 style={{ margin: 0, fontSize: '1.35rem', color: 'var(--text-term-green)' }}>
              SYSTEM_RECORD:// HERO_DOSSIER
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
            }}
          >
            <X size={24} />
          </button>
        </div>

        {/* Hero Banner */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: '20px',
            padding: '16px',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            borderRadius: '4px',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <div style={{ width: '90px', height: '90px' }}>
            <PortraitAvatar type={hero.avatar} size={90} />
          </div>

          <div style={{ flex: 1, minWidth: '220px' }}>
            <h3 style={{ margin: 0, fontSize: '1.4rem', color: '#fef08a' }}>&gt; {hero.name}</h3>
            <p style={{ margin: '2px 0 8px 0', color: 'var(--text-term-cyan)', fontSize: '0.85rem' }}>
              CLASS: {hero.className} // LEVEL: {hero.level}
            </p>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.8rem', lineHeight: 1.4 }}>
              {hero.description}
            </p>
          </div>

          <div style={{ minWidth: '180px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <StatBar label="HP" current={hero.currentHp} max={hero.maxHp} variant="hp" size="sm" />
            {hero.shieldHp > 0 && (
              <StatBar label="SHIELD" current={hero.shieldHp} max={Math.max(hero.shieldHp, 50)} variant="defense" size="sm" />
            )}
          </div>
        </div>

        {/* Grid: Primary Stats & Derived Stats */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '16px',
          }}
        >
          {/* Primary Attributes */}
          <div
            style={{
              padding: '16px',
              backgroundColor: 'rgba(0, 0, 0, 0.4)',
              borderRadius: '4px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            <h4 style={{ fontSize: '0.95rem', color: 'var(--text-gold)', marginBottom: '12px' }}>
              [PRIMARY_ATTRIBUTES]
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px', background: 'rgba(255,255,255,0.02)', borderRadius: '2px' }}>
                <span style={{ color: '#fca5a5' }}>STR:</span>
                <strong>{p.strength}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px', background: 'rgba(255,255,255,0.02)', borderRadius: '2px' }}>
                <span style={{ color: '#fde047' }}>DEX:</span>
                <strong>{p.dexterity}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px', background: 'rgba(255,255,255,0.02)', borderRadius: '2px' }}>
                <span style={{ color: '#93c5fd' }}>INT:</span>
                <strong>{p.intelligence}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px', background: 'rgba(255,255,255,0.02)', borderRadius: '2px' }}>
                <span style={{ color: '#86efac' }}>VIT:</span>
                <strong>{p.vitality}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px', background: 'rgba(255,255,255,0.02)', borderRadius: '2px' }}>
                <span style={{ color: '#d8b4fe' }}>WIL:</span>
                <strong>{p.willpower}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px', background: 'rgba(255,255,255,0.02)', borderRadius: '2px' }}>
                <span style={{ color: '#fed7aa' }}>LUK:</span>
                <strong>{p.luck}</strong>
              </div>
            </div>
          </div>

          {/* Derived Combat Ratings */}
          <div
            style={{
              padding: '16px',
              backgroundColor: 'rgba(0, 0, 0, 0.4)',
              borderRadius: '4px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            <h4 style={{ fontSize: '0.95rem', color: 'var(--text-gold)', marginBottom: '12px' }}>
              [COMBAT_RATINGS]
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>PHY_ATK:</span>
                <strong style={{ color: '#fca5a5' }}>{d.physicalAttack}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>PHY_DEF:</span>
                <strong style={{ color: '#86efac' }}>{d.physicalDefense}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>MAG_ATK:</span>
                <strong style={{ color: '#93c5fd' }}>{d.magicAttack}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>MAG_DEF:</span>
                <strong style={{ color: '#d8b4fe' }}>{d.magicDefense}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>SPEED:</span>
                <strong style={{ color: '#fde047' }}>{d.speed}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>ACCURACY:</span>
                <strong style={{ color: '#fef08a' }}>{d.accuracy}%</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>CRIT_RATE:</span>
                <strong style={{ color: '#fbbf24' }}>{d.critChance}% ({d.critMultiplier}x)</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>EVASION:</span>
                <strong style={{ color: '#a7f3d0' }}>{d.evasion}%</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Equipment Loadout Preview */}
        <div
          style={{
            padding: '16px',
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            borderRadius: '4px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h4 style={{ fontSize: '0.95rem', color: 'var(--text-gold)', margin: 0 }}>
              [EQUIPMENT_MATRIX]
            </h4>
            <span style={{ fontSize: '0.7rem', color: '#93c5fd', backgroundColor: 'rgba(59, 130, 246, 0.2)', padding: '2px 8px', borderRadius: '2px' }}>
              EXPANDED_INVENTORY_MILESTONE_3
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '8px' }}>
            {equipmentSlots.map((slot, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '6px 10px',
                  backgroundColor: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '2px',
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center' }}>{slot.icon}</span>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{slot.name}</span>
                  <span
                    style={{
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      color: slot.itemEmpty ? 'var(--text-muted)' : slot.rarity === 'Uncommon' ? '#60a5fa' : '#e2e8f0',
                    }}
                  >
                    {slot.item}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Close Button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="secondary" onClick={onClose}>
            &gt; CLOSE_DOSSIER
          </Button>
        </div>
      </div>
    </div>
  );
};
