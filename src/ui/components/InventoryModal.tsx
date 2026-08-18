import React, { useState } from 'react';
import type { Combatant } from '../../core/types/combat.ts';
import type { Item, ItemSlot } from '../../core/types/items.ts';
import type { InventoryState } from '../../core/types/inventory.ts';
import { PortraitAvatar } from './PortraitAvatar.tsx';
import { Button } from './Button.tsx';
import { InfoTooltip } from './InfoTooltip.tsx';
import {
  TerminalChevronSvg,
  SwordSvg,
  HelmArmorSvg,
  CuirassArmorSvg,
  GauntletsSvg,
  GreavesBootsSvg,
  RingAccessorySvg,
  ShieldSvg,
  GoldCoinsStackSvg,
} from './RpgSvgIcons.tsx';
import { X } from 'lucide-react';

interface InventoryModalProps {
  hero: Combatant;
  inventory: InventoryState;
  onEquipItem: (item: Item) => void;
  onUnequipItem: (slot: ItemSlot) => void;
  onConsumeItem: (item: Item) => void;
  onClose: () => void;
}

export const InventoryModal: React.FC<InventoryModalProps> = ({
  hero,
  inventory,
  onEquipItem,
  onUnequipItem,
  onConsumeItem,
  onClose,
}) => {
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'UNCOMMON': return '#22c55e';
      case 'RARE': return '#38bdf8';
      case 'EPIC': return '#c084fc';
      case 'LEGENDARY': return '#facc15';
      default: return '#94a3b8';
    }
  };

  const equipmentSlots: Array<{ key: ItemSlot; label: string; icon: React.ReactNode }> = [
    { key: 'MAIN_HAND', label: 'MAIN_HAND', icon: <SwordSvg size={18} color="#fca5a5" /> },
    { key: 'OFF_HAND', label: 'OFF_HAND', icon: <ShieldSvg size={18} color="#86efac" /> },
    { key: 'HEAD', label: 'HEAD', icon: <HelmArmorSvg size={18} color="#94a3b8" /> },
    { key: 'CHEST', label: 'CHEST', icon: <CuirassArmorSvg size={18} color="#94a3b8" /> },
    { key: 'HANDS', label: 'HANDS', icon: <GauntletsSvg size={18} color="#94a3b8" /> },
    { key: 'LEGS', label: 'LEGS', icon: <GreavesBootsSvg size={18} color="#94a3b8" /> },
    { key: 'FEET', label: 'FEET', icon: <GreavesBootsSvg size={18} color="#94a3b8" /> },
    { key: 'RING_1', label: 'RING_1', icon: <RingAccessorySvg size={18} color="#60a5fa" /> },
    { key: 'RING_2', label: 'RING_2', icon: <RingAccessorySvg size={18} color="#60a5fa" /> },
  ];

  const currentEquippedInSlot = selectedItem?.slot ? inventory.equipment[selectedItem.slot] : null;

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
          maxWidth: '1020px',
          maxHeight: '92vh',
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TerminalChevronSvg size={18} color="var(--text-term-green)" />
            <h2 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-term-green)' }}>
              SYSTEM_RECORD:// INVENTORY_AND_LOADOUT_MATRIX
            </h2>
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

        {/* Top Hero Dossier Summary */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            padding: '10px 14px',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '4px',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ width: '48px', height: '48px' }}>
            <PortraitAvatar type={hero.avatar} size={48} />
          </div>
          <div style={{ flex: 1, minWidth: '160px' }}>
            <h3 style={{ margin: 0, color: '#fef08a', fontSize: '1rem' }}>&gt; {hero.name}</h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-term-cyan)' }}>
              LV.{hero.level} {hero.className}
            </span>
          </div>
          {/* Quick Combat Ratings Strip */}
          <div style={{ display: 'flex', gap: '10px', fontSize: '0.75rem' }}>
            <span style={{ color: '#fca5a5' }}>ATK: {hero.derivedStats.physicalAttack}</span>
            <span style={{ color: '#93c5fd' }}>MAG: {hero.derivedStats.magicAttack}</span>
            <span style={{ color: '#86efac' }}>DEF: {hero.derivedStats.physicalDefense}</span>
            <span style={{ color: '#fde047' }}>SPD: {hero.derivedStats.speed}</span>
          </div>
        </div>

        {/* 3-Column Layout: Equipment Paperdoll | Inventory Bag Grid | Item Inspector */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '14px',
          }}
        >
          {/* Column 1: Equipped Gear Slots */}
          <div
            style={{
              padding: '12px',
              backgroundColor: 'rgba(0, 0, 0, 0.4)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '4px',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
            }}
          >
            <h4 style={{ margin: '0 0 4px 0', fontSize: '0.85rem', color: 'var(--text-gold)' }}>
              [ACTIVE_EQUIPMENT]
            </h4>

            {equipmentSlots.map(({ key, label, icon }) => {
              const item = inventory.equipment[key];
              const isSelected = selectedItem?.id === item?.id;

              return (
                <div
                  key={key}
                  onClick={() => item && setSelectedItem(item)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '5px 8px',
                    backgroundColor: isSelected ? 'rgba(212, 163, 75, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                    border: item
                      ? `1px solid ${getRarityColor(item.rarity)}60`
                      : '1px dashed rgba(255, 255, 255, 0.1)',
                    borderRadius: '2px',
                    cursor: item ? 'pointer' : 'default',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {icon}
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{label}</span>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          color: item ? getRarityColor(item.rarity) : 'var(--text-muted)',
                        }}
                      >
                        {item ? item.name : '[EMPTY]'}
                      </span>
                    </div>
                  </div>

                  {item && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <InfoTooltip content={item.description} size={12} color={getRarityColor(item.rarity)} />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onUnequipItem(key);
                        }}
                        style={{
                          background: 'transparent',
                          border: '1px solid #475569',
                          color: 'var(--text-secondary)',
                          borderRadius: '2px',
                          padding: '1px 5px',
                          fontSize: '0.65rem',
                          cursor: 'pointer',
                        }}
                      >
                        UNEQUIP
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Column 2: Inventory Grid */}
          <div
            style={{
              padding: '12px',
              backgroundColor: 'rgba(0, 0, 0, 0.4)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '4px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h4 style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-gold)' }}>
                [INVENTORY: {inventory.items.length}/{inventory.maxSlots}]
              </h4>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '6px',
                maxHeight: '320px',
                overflowY: 'auto',
                padding: '2px',
              }}
            >
              {inventory.items.map(({ item, quantity }, idx) => {
                const isSelected = selectedItem?.id === item.id;
                const rarityColor = getRarityColor(item.rarity);

                return (
                  <div
                    key={`${item.id}-${idx}`}
                    onClick={() => setSelectedItem(item)}
                    style={{
                      height: '60px',
                      padding: '4px 6px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      backgroundColor: isSelected ? 'rgba(212, 163, 75, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                      border: `1px solid ${rarityColor}`,
                      borderRadius: '3px',
                      cursor: 'pointer',
                      boxShadow: isSelected ? `0 0 8px ${rarityColor}` : 'none',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        color: rarityColor,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                      title={item.name}
                    >
                      {item.name}
                    </span>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.65rem' }}>
                      <span style={{ color: 'var(--text-muted)' }}>{item.type.slice(0, 3)}</span>
                      {quantity > 1 && <span style={{ color: '#38bdf8', fontWeight: 700 }}>x{quantity}</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Column 3: Selected Item Inspector & Comparison */}
          <div
            style={{
              padding: '12px',
              backgroundColor: 'rgba(0, 0, 0, 0.4)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '4px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '10px',
            }}
          >
            <h4 style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-gold)' }}>
              [ITEM_INSPECTION]
            </h4>

            {selectedItem ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <h3 style={{ margin: 0, fontSize: '1rem', color: getRarityColor(selectedItem.rarity) }}>
                      {selectedItem.name}
                    </h3>
                    <InfoTooltip content={selectedItem.description} size={13} color={getRarityColor(selectedItem.rarity)} />
                  </div>
                  <span style={{ fontSize: '0.65rem', color: getRarityColor(selectedItem.rarity), fontWeight: 700 }}>
                    [{selectedItem.rarity}]
                  </span>
                </div>

                {/* Primary Stat Bonuses */}
                {selectedItem.primaryStatBonuses && (
                  <div style={{ fontSize: '0.75rem', color: '#fef08a' }}>
                    {Object.entries(selectedItem.primaryStatBonuses).map(([stat, val]) => (
                      <div key={stat}>+{val} {stat.toUpperCase()}</div>
                    ))}
                  </div>
                )}

                {/* Derived Stat Bonuses */}
                {selectedItem.derivedStatBonuses && (
                  <div style={{ fontSize: '0.75rem', color: '#86efac' }}>
                    {Object.entries(selectedItem.derivedStatBonuses).map(([stat, val]) => (
                      <div key={stat}>+{val} {stat.toUpperCase()}</div>
                    ))}
                  </div>
                )}

                {currentEquippedInSlot && currentEquippedInSlot.id !== selectedItem.id && (
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    Replaces: {currentEquippedInSlot.name}
                  </div>
                )}

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                  {selectedItem.slot && (
                    <Button
                      variant="gold"
                      size="sm"
                      onClick={() => {
                        onEquipItem(selectedItem);
                        setSelectedItem(null);
                      }}
                      style={{ flex: 1 }}
                    >
                      EQUIP
                    </Button>
                  )}

                  {selectedItem.type === 'CONSUMABLE' && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => {
                        onConsumeItem(selectedItem);
                        setSelectedItem(null);
                      }}
                      style={{ flex: 1 }}
                    >
                      USE
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '16px', fontSize: '0.8rem' }}>
                &gt; SELECT AN ITEM TO INSPECT.
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'auto' }}>
              <Button variant="secondary" onClick={onClose}>
                CLOSE
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
