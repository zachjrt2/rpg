import React from 'react';
import { soundFx } from '../audio/sound-system.ts';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'gold' | 'primary' | 'danger' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'gold',
  size = 'md',
  icon,
  children,
  onClick,
  disabled,
  className = '',
  style = {},
  ...props
}) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    soundFx.playClick();
    if (onClick) onClick(e);
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'gold':
        return {
          background: 'linear-gradient(180deg, #3d2c14 0%, #1f170b 100%)',
          border: '1px solid #d4a34b',
          color: '#fef08a',
          boxShadow: '0 2px 6px rgba(0,0,0,0.5), inset 0 1px 0 rgba(254, 240, 138, 0.2)',
        };
      case 'danger':
        return {
          background: 'linear-gradient(180deg, #451313 0%, #200808 100%)',
          border: '1px solid #ef4444',
          color: '#fca5a5',
          boxShadow: '0 2px 6px rgba(0,0,0,0.5)',
        };
      case 'secondary':
        return {
          background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)',
          border: '1px solid #475569',
          color: '#e2e8f0',
          boxShadow: '0 2px 4px rgba(0,0,0,0.4)',
        };
      case 'ghost':
        return {
          background: 'transparent',
          border: '1px solid transparent',
          color: '#94a3b8',
        };
      default:
        return {
          background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)',
          border: '1px solid #3b82f6',
          color: '#93c5fd',
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return { padding: '6px 12px', fontSize: '0.85rem' };
      case 'lg':
        return { padding: '14px 28px', fontSize: '1.15rem' };
      default:
        return { padding: '10px 18px', fontSize: '0.95rem' };
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`rpg-button ${className}`}
      {...props}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        fontFamily: 'var(--font-heading)',
        letterSpacing: '0.06em',
        borderRadius: '6px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.45 : 1,
        transition: 'all 0.18s ease-in-out',
        textTransform: 'uppercase',
        fontWeight: 600,
        ...getSizeStyles(),
        ...getVariantStyles(),
        ...style,
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.filter = 'brightness(1.2)';
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.filter = 'brightness(1)';
        }
      }}
    >
      {icon && <span style={{ display: 'flex', alignItems: 'center' }}>{icon}</span>}
      <span>{children}</span>
    </button>
  );
};
