import React from 'react';

interface StatBarProps {
  current: number;
  max: number;
  label?: string;
  variant?: 'hp' | 'mana' | 'gold' | 'xp' | 'defense';
  showValues?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const StatBar: React.FC<StatBarProps> = ({
  current,
  max,
  label,
  variant = 'hp',
  showValues = true,
  size = 'md',
  className = '',
}) => {
  const percentage = Math.min(100, Math.max(0, (current / Math.max(1, max)) * 100));

  const getTheme = () => {
    switch (variant) {
      case 'hp':
        return {
          bg: 'linear-gradient(90deg, #991b1b 0%, #ef4444 60%, #f87171 100%)',
          glow: '0 0 8px rgba(239, 68, 68, 0.5)',
          track: '#3f1010',
          textColor: '#fca5a5',
        };
      case 'mana':
        return {
          bg: 'linear-gradient(90deg, #075985 0%, #0ea5e9 60%, #38bdf8 100%)',
          glow: '0 0 8px rgba(14, 165, 233, 0.5)',
          track: '#082f49',
          textColor: '#bae6fd',
        };
      case 'defense':
        return {
          bg: 'linear-gradient(90deg, #065f46 0%, #10b981 60%, #34d399 100%)',
          glow: '0 0 8px rgba(16, 185, 129, 0.5)',
          track: '#064e3b',
          textColor: '#a7f3d0',
        };
      case 'xp':
        return {
          bg: 'linear-gradient(90deg, #7c3aed 0%, #a855f7 60%, #c084fc 100%)',
          glow: '0 0 8px rgba(168, 85, 247, 0.5)',
          track: '#3b0764',
          textColor: '#e9d5ff',
        };
      default:
        return {
          bg: 'linear-gradient(90deg, #b45309 0%, #f59e0b 60%, #fbbf24 100%)',
          glow: '0 0 8px rgba(245, 158, 11, 0.5)',
          track: '#451a03',
          textColor: '#fde68a',
        };
    }
  };

  const getHeight = () => {
    switch (size) {
      case 'sm':
        return '8px';
      case 'lg':
        return '20px';
      default:
        return '14px';
    }
  };

  const theme = getTheme();

  return (
    <div className={`stat-bar-container ${className}`} style={{ width: '100%' }}>
      {label && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: size === 'sm' ? '0.75rem' : '0.85rem',
            fontFamily: 'var(--font-heading)',
            color: theme.textColor,
            marginBottom: '4px',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
          }}
        >
          <span>{label}</span>
          {showValues && (
            <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
              {current} / {max}
            </span>
          )}
        </div>
      )}
      <div
        style={{
          width: '100%',
          height: getHeight(),
          backgroundColor: theme.track,
          borderRadius: '4px',
          overflow: 'hidden',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          position: 'relative',
          boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.6)',
        }}
      >
        <div
          style={{
            width: `${percentage}%`,
            height: '100%',
            background: theme.bg,
            boxShadow: theme.glow,
            transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            borderRadius: '3px',
          }}
        />
      </div>
    </div>
  );
};
