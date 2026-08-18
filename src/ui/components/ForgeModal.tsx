import React, { useState } from 'react';
import type { Combatant } from '../../core/types/combat.ts';
import type { Item } from '../../core/types/items.ts';
import type { InventoryState } from '../../core/types/inventory.ts';
import { getUpgradeCost, MAX_UPGRADE_LEVEL } from '../../core/inventory/forge-manager.ts';
import { ENCHANTMENT_RUNES, type EnchantmentRune } from '../../core/inventory/enchant-manager.ts';
import { Button } from './Button.tsx';
import { InfoTooltip } from './InfoTooltip.tsx';
import {
  GoldCoinsStackSvg,
  TerminalChevronSvg,
  SwordSvg,
  ShieldSvg,
  HelmArmorSvg,
  CuirassArmorSvg,
  GauntletsSvg,
  GreavesBootsSvg,
} from './RpgSvgIcons.tsx';
import { X, Anvil, Hammer, Sparkles } from 'lucide-react';

interface ForgeModalProps {
  hero: Combatant;
  inventory: InventoryState;
  onUpgradeItem: (item: Item) => void;
  onEnchantWeapon?: (weapon: Item, rune: EnchantmentRune) => void;
  onClose: () => void;
}

export const ForgeModal: React.FC<ForgeModalProps> = ({
  hero,
  inventory,
  onUpgradeItem,
  onEnchantWeapon,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'TEMPER' | 'ENCHANT'>('TEMPER');
  const [selectedItem, setSelectedItem] = useState<Item | null>(() => {
    return inventory.equipment['MAIN_HAND'] || null;
  });

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'UNCOMMON': return '#22c55e';
      case 'RARE': return '#38bdf8';
      case 'EPIC': return '#c084fc';
      case 'LEGENDARY': return '#facc15';
      default: return '#94a3b8';
    }
  };

  const getItemIcon = (slot?: string) => {
    switch (slot) {
      case 'MAIN_HAND': return <SwordSvg size={18} color="#fca5a5" />;
      case 'OFF_HAND': return <ShieldSvg size={18} color="#86efac" />;
      case 'HEAD': return <HelmArmorSvg size={18} color="#94a3b8" />;
      case 'CHEST': return <CuirassArmorSvg size={18} color="#94a3b8" />;
      case 'HANDS': return <GauntletsSvg size={18} color="#94a3b8" />;
      case 'LEGS':
      case 'FEET': return <GreavesBootsSvg size={18} color="#94a3b8" />;
      default: return <SwordSvg size={18} color="#94a3b8" />;
    }
  };

  const upgradableEquipment = Object.values(inventory.equipment).filter(
    (item): item is Item => item !== undefined && item.type !== 'CONSUMABLE'
  );

  const upgradableBagItems = inventory.items
    .map((s) => s.item)
    .filter((item) => item.type !== 'CONSUMABLE');

  const allUpgradables = [...upgradableEquipment, ...upgradableBagItems];

  const currentLevel = selectedItem?.upgradeLevel || 0;
  const isMaxLevel = currentLevel >= MAX_UPGRADE_LEVEL;
  const upgradeCost = selectedItem ? getUpgradeCost(selectedItem) : 0;
  const canAfford = inventory.gold >= upgradeCost && !isMaxLevel;

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
        padding: '16px',
        fontFamily: 'var(--font-mono)',
      }}
    >
      <div
        className="rpg-panel rpg-panel-gold animate-modal-in"
        style={{
          width: '100%',
          maxWidth: '880px',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
          backgroundColor: 'rgba(10, 14, 20, 0.98)',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Anvil size={22} color="#f97316" />
            <div>
              <h2 style={{ margin: 0, fontSize: '1.2rem', color: '#fed7aa' }}>
                BLACKSMITH_FORGE:// VOLCANIC_TEMPERING_ANVIL
              </h2>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                FORGING GEAR FOR: {hero.name} [LV.{hero.level} {hero.className}]
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#fde047', fontWeight: 700 }}>
              <GoldCoinsStackSvg size={16} color="#fde047" />
              <span>{inventory.gold} GOLD</span>
            </div>
            <button
              onClick={onClose}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Tabs: TEMPER vs ENCHANT */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setActiveTab('TEMPER')}
            style={{
              padding: '6px 14px',
              backgroundColor: activeTab === 'TEMPER' ? 'rgba(249, 115, 22, 0.2)' : 'rgba(255, 255, 255, 0.04)',
              color: activeTab === 'TEMPER' ? '#fed7aa' : 'var(--text-secondary)',
              border: activeTab === 'TEMPER' ? '1px solid #f97316' : '1px solid var(--border-subtle)',
              borderRadius: '3px',
              fontWeight: 700,
              fontFamily: 'var(--font-mono)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Hammer size={15} />
            <span>&gt; TEMPER GEAR (+0 → +5)</span>
          </button>

          <button
            onClick={() => setActiveTab('ENCHANT')}
            style={{
              padding: '6px 14px',
              backgroundColor: activeTab === 'ENCHANT' ? 'rgba(168, 85, 247, 0.2)' : 'rgba(255, 255, 255, 0.04)',
              color: activeTab === 'ENCHANT' ? '#e879f9' : 'var(--text-secondary)',
              border: activeTab === 'ENCHANT' ? '1px solid #a855f7' : '1px solid var(--border-subtle)',
              borderRadius: '3px',
              fontWeight: 700,
              fontFamily: 'var(--font-mono)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Sparkles size={15} />
            <span>&gt; ELEMENTAL RUNIC ENCHANTING</span>
          </button>
        </div>

        {/* TAB 1: TEMPER */}
        {activeTab === 'TEMPER' && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '12px',
            }}
          >
            {/* Left: Gear Selector */}
            <div
              style={{
                padding: '10px',
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '4px',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                maxHeight: '340px',
                overflowY: 'auto',
              }}
            >
              {allUpgradables.map((item, idx) => {
                const isSelected = selectedItem?.id === item.id;
                const rarityColor = getRarityColor(item.rarity);
                const lvl = item.upgradeLevel || 0;

                return (
                  <div
                    key={`${item.id}-${idx}`}
                    onClick={() => setSelectedItem(item)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '6px 10px',
                      backgroundColor: isSelected ? 'rgba(249, 115, 22, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                      border: isSelected ? '1px solid #f97316' : `1px solid ${rarityColor}60`,
                      borderRadius: '3px',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {getItemIcon(item.slot)}
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: rarityColor }}>
                        {item.name}
                      </span>
                    </div>

                    <span
                      style={{
                        fontSize: '0.7rem',
                        fontWeight: 800,
                        color: lvl > 0 ? '#fde047' : '#94a3b8',
                      }}
                    >
                      +{lvl}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Right: Workbench */}
            <div
              style={{
                padding: '12px',
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '4px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '10px',
              }}
            >
              {selectedItem ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <strong style={{ color: getRarityColor(selectedItem.rarity), fontSize: '0.95rem' }}>
                        {selectedItem.name}
                      </strong>
                      <InfoTooltip content={selectedItem.description} size={13} color={getRarityColor(selectedItem.rarity)} />
                    </div>
                    <span style={{ fontSize: '0.7rem', color: '#fde047', fontWeight: 700 }}>
                      +{currentLevel} → +{currentLevel + 1}
                    </span>
                  </div>

                  {/* Primary Stats Scaling */}
                  {selectedItem.primaryStatBonuses && (
                    <div style={{ fontSize: '0.75rem', color: '#fef08a' }}>
                      {Object.entries(selectedItem.primaryStatBonuses).map(([stat, val]) => (
                        <div key={stat} style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span>{stat.toUpperCase()}:</span>
                          <span>+{val} → <strong style={{ color: '#86efac' }}>+{Math.round(val * 1.25) || val + 1}</strong></span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Derived Stats Scaling */}
                  {selectedItem.derivedStatBonuses && (
                    <div style={{ fontSize: '0.75rem', color: '#93c5fd' }}>
                      {Object.entries(selectedItem.derivedStatBonuses).map(([stat, val]) => (
                        <div key={stat} style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span>{stat.toUpperCase()}:</span>
                          <span>+{val} → <strong style={{ color: '#86efac' }}>+{Math.round(val * 1.25) || val + 1}</strong></span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Button */}
                  <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#fde047' }}>
                      <span>TEMPERING COST:</span>
                      <span>{isMaxLevel ? 'MAX' : `${upgradeCost} GOLD`}</span>
                    </div>

                    <Button
                      variant={canAfford ? 'gold' : 'secondary'}
                      size="md"
                      disabled={!canAfford}
                      onClick={() => onUpgradeItem(selectedItem)}
                    >
                      {isMaxLevel ? 'MAX LEVEL' : canAfford ? `TEMPER (+${currentLevel + 1})` : 'INSUFFICIENT GOLD'}
                    </Button>
                  </div>
                </div>
              ) : (
                <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '20px', fontSize: '0.8rem' }}>
                  &gt; SELECT GEAR TO TEMPER.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: ENCHANT */}
        {activeTab === 'ENCHANT' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-gold)', fontWeight: 700 }}>
              [SELECT ELEMENTAL RUNE TO SOCKET]:
            </span>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '8px',
              }}
            >
              {ENCHANTMENT_RUNES.map((rune) => {
                const canAffordRune = inventory.gold >= rune.cost && !!selectedItem;

                return (
                  <div
                    key={rune.type}
                    style={{
                      padding: '10px',
                      backgroundColor: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '3px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      gap: '8px',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span>{rune.icon}</span>
                        <strong style={{ color: '#bae6fd', fontSize: '0.85rem' }}>{rune.name}</strong>
                      </div>
                      <InfoTooltip content={rune.description} size={13} color="#38bdf8" />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.75rem', color: '#fde047', fontWeight: 700 }}>
                        {rune.cost} GOLD
                      </span>

                      <Button
                        variant={canAffordRune ? 'gold' : 'secondary'}
                        size="sm"
                        disabled={!canAffordRune}
                        onClick={() => {
                          if (selectedItem && onEnchantWeapon) {
                            onEnchantWeapon(selectedItem, rune);
                          }
                        }}
                      >
                        ENCHANT
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="secondary" onClick={onClose} icon={<TerminalChevronSvg size={15} color="#94a3b8" />}>
            CLOSE
          </Button>
        </div>
      </div>
    </div>
  );
};
