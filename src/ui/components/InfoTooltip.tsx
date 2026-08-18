import React, { useState } from 'react';
import { Info } from 'lucide-react';

interface InfoTooltipProps {
  content: React.ReactNode;
  size?: number;
  color?: string;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

export const InfoTooltip: React.FC<InfoTooltipProps> = ({
  content,
  size = 14,
  color = '#94a3b8',
  placement = 'top',
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const getPlacementStyles = (): React.CSSProperties => {
    switch (placement) {
      case 'bottom':
        return {
          top: 'calc(100% + 6px)',
          left: '50%',
          transform: 'translateX(-50%)',
        };
      case 'left':
        return {
          right: 'calc(100% + 6px)',
          top: '50%',
          transform: 'translateY(-50%)',
        };
      case 'right':
        return {
          left: 'calc(100% + 6px)',
          top: '50%',
          transform: 'translateY(-50%)',
        };
      case 'top':
      default:
        return {
          bottom: 'calc(100% + 6px)',
          left: '50%',
          transform: 'translateX(-50%)',
        };
    }
  };

  return (
    <div
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'help',
      }}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onClick={(e) => {
        e.stopPropagation();
        setIsVisible((prev) => !prev);
      }}
    >
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2px',
          borderRadius: '50%',
          color,
          transition: 'all 0.15s ease',
          opacity: 0.8,
        }}
      >
        <Info size={size} />
      </div>

      {isVisible && (
        <div
          style={{
            position: 'absolute',
            ...getPlacementStyles(),
            zIndex: 999,
            backgroundColor: 'rgba(6, 9, 15, 0.98)',
            border: '1px solid var(--border-gold)',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.8), 0 0 10px rgba(201, 151, 56, 0.3)',
            borderRadius: '4px',
            padding: '8px 12px',
            fontSize: '0.75rem',
            color: '#e2e8f0',
            fontFamily: 'var(--font-mono)',
            lineHeight: 1.4,
            whiteSpace: 'normal',
            minWidth: '180px',
            maxWidth: '280px',
            pointerEvents: 'none',
          }}
        >
          {content}
        </div>
      )}
    </div>
  );
};
