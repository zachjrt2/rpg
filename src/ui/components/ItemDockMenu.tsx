import React from 'react';
import type { InventoryItemSlot, Item } from '../../core/types/items.ts';
import { Button } from './Button.tsx';
import { InfoTooltip } from './InfoTooltip.tsx';
import { TerminalChevronSvg } from './RpgSvgIcons.tsx';
import { X, Sparkles } from 'lucide-react';

interface ItemDockMenuProps {
  items: InventoryItemSlot[];
  onUseItem: (item: Item) => void;
  onClose: () => void;
}

export const ItemDockMenu: React.FC<ItemDockMenuProps> = ({ items, onUseItem, onClose }) => {
  const consumableSlots = items.filter((slot) => slot.item.type === 'CONSUMABLE' && slot.quantity > 0);

  return (
    <div
      className="rpg-panel rpg-panel-gold animate-modal-in"
      style={{
        padding: '14px 16px',
        backgroundColor: 'rgba(10, 14, 20, 0.98)',
        border: '1px solid var(--border-gold)',
        boxShadow: 'var(--shadow-gold)',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        fontFamily: 'var(--font-mono)',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <TerminalChevronSvg size={16} color="var(--text-term-cyan)" />
          <span
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '0.95rem',
              color: 'var(--text-term-cyan)',
              fontWeight: 700,
            }}
          >
            FIELD_RATIONS_AND_POTIONS://
          </span>
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
          <X size={18} />
        </button>
      </div>

      {/* Consumables List */}
      {consumableSlots.length === 0 ? (
        <div style={{ padding: '12px', color: 'var(--text-muted)', textAlign: 'center', fontSize: '0.85rem' }}>
          &gt; NO CONSUMABLE POTIONS IN FIELD BELT.
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '8px',
          }}
        >
          {consumableSlots.map(({ item, quantity }) => (
            <div
              key={item.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 12px',
                backgroundColor: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '3px',
                gap: '8px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sparkles size={14} color="#38bdf8" />
                <strong style={{ color: '#bae6fd', fontSize: '0.85rem' }}>{item.name}</strong>
                <InfoTooltip content={item.description} size={13} color="#38bdf8" />
              </div>

              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  onUseItem(item);
                  onClose();
                }}
              >
                USE (x{quantity})
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
