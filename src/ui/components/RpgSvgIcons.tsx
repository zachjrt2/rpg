import React from 'react';

interface SvgProps {
  size?: number;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Handcrafted RPG & Terminal SVG Vector Graphics
 */

export const SwordSvg: React.FC<SvgProps> = ({ size = 20, color = 'currentColor', style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={style}
    xmlns="http://www.w3.org/2000/svg"
  >
    <polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5" />
    <line x1="13" y1="19" x2="19" y2="13" />
    <line x1="16" y1="16" x2="20" y2="20" />
    <line x1="19" y1="21" x2="21" y2="19" />
  </svg>
);

export const DualSwordsSvg: React.FC<SvgProps> = ({ size = 24, color = 'currentColor', style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style} xmlns="http://www.w3.org/2000/svg">
    {/* Left Sword */}
    <path d="M4 4L12 12M12 12L15 15M12 12L9 15M4 4L2 6L8 12M4 4L6 2L12 8" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M16 16L20 20M17 19L19 17" stroke={color} strokeWidth="2" strokeLinecap="round" />
    {/* Right Sword */}
    <path d="M20 4L12 12M12 12L9 15M12 12L15 15M20 4L22 6L16 12M20 4L18 2L12 8" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 16L4 20M7 19L5 17" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const ShieldSvg: React.FC<SvgProps> = ({ size = 20, color = 'currentColor', style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style} xmlns="http://www.w3.org/2000/svg">
    <path
      d="M12 2L4 5V11C4 16.5 7.5 21.5 12 23C16.5 21.5 20 16.5 20 11V5L12 2Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill={color}
      fillOpacity="0.15"
    />
    <path d="M12 6V19M8 10H16" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const ShieldAegisSvg = ShieldSvg;

export const DiamondSvg: React.FC<SvgProps> = ({ size = 18, color = '#c084fc', style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style} xmlns="http://www.w3.org/2000/svg">
    <polygon points="6,3 18,3 22,9 12,22 2,9" stroke={color} strokeWidth="2" strokeLinejoin="round" fill={color} fillOpacity="0.25" />
    <polyline points="2,9 12,9 22,9" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
    <polyline points="6,3 9,9 12,22 15,9 18,3" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
  </svg>
);

export const FireFlameSvg: React.FC<SvgProps> = ({ size = 18, color = '#f97316', style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style} xmlns="http://www.w3.org/2000/svg">
    <path
      d="M12 2C10 6 7 8 7 13C7 16.87 9.24 20 12 20C14.76 20 17 16.87 17 13C17 10 15 8 13.5 6C13.5 6 13 4 12 2Z"
      stroke={color}
      strokeWidth="2"
      strokeLinejoin="round"
      fill={color}
      fillOpacity="0.25"
    />
    <path
      d="M12 11C11 13 10 14 10 16C10 17.5 11 19 12 19C13 19 14 17.5 14 16C14 14.5 13 13.5 12 11Z"
      fill={color}
    />
  </svg>
);

export const BloodDropSvg: React.FC<SvgProps> = ({ size = 18, color = '#ef4444', style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style} xmlns="http://www.w3.org/2000/svg">
    <path
      d="M12 2.5C12 2.5 5 11 5 15.5C5 19.1 8.1 22 12 22C15.9 22 19 19.1 19 15.5C19 11 12 2.5 12 2.5Z"
      stroke={color}
      strokeWidth="2"
      strokeLinejoin="round"
      fill={color}
      fillOpacity="0.3"
    />
    <path
      d="M9 15C9 13.5 10 11.5 12 9"
      stroke="#fca5a5"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

export const CrosshairReticleSvg: React.FC<SvgProps> = ({ size = 18, color = 'currentColor', style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style} xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="8" stroke={color} strokeWidth="2" strokeDasharray="3 3" />
    <line x1="12" y1="2" x2="12" y2="7" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="12" y1="17" x2="12" y2="22" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="2" y1="12" x2="7" y2="12" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="17" y1="12" x2="22" y2="12" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <circle cx="12" cy="12" r="2" fill={color} />
  </svg>
);

export const SkullDeathSvg: React.FC<SvgProps> = ({ size = 20, color = 'currentColor', style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style} xmlns="http://www.w3.org/2000/svg">
    <path
      d="M12 2C7.5 2 4 5.5 4 10C4 13.5 6 16 8 17.5V20C8 20.5 8.5 21 9 21H15C15.5 21 16 20.5 16 20V17.5C18 16 20 13.5 20 10C20 5.5 16.5 2 12 2Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="9" cy="10" r="2" fill={color} />
    <circle cx="15" cy="10" r="2" fill={color} />
    <path d="M10 17V19M12 17V19M14 17V19" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    <polygon points="12,12 11,14 13,14" fill={color} />
  </svg>
);

export const GoldCoinsStackSvg: React.FC<SvgProps> = ({ size = 18, color = '#fbbf24', style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style} xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="12" cy="6" rx="8" ry="3" stroke={color} strokeWidth="2" fill="none" />
    <path d="M4 6V11C4 12.65 7.58 14 12 14C16.42 14 20 12.65 20 11V6" stroke={color} strokeWidth="2" />
    <path d="M4 11V16C4 17.65 7.58 19 12 19C16.42 19 20 17.65 20 16V11" stroke={color} strokeWidth="2" />
    <circle cx="12" cy="6" r="1.5" fill={color} />
  </svg>
);

export const TerminalChevronSvg: React.FC<SvgProps> = ({ size = 16, color = '#4ade80', style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style} xmlns="http://www.w3.org/2000/svg">
    <path d="M9 18L15 12L9 6" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const MagicSparklesSvg: React.FC<SvgProps> = ({ size = 20, color = '#a855f7', style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style} xmlns="http://www.w3.org/2000/svg">
    <path
      d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z"
      stroke={color}
      strokeWidth="2"
      strokeLinejoin="round"
      fill={color}
      fillOpacity="0.2"
    />
    <circle cx="19" cy="5" r="1.5" fill={color} />
    <circle cx="5" cy="19" r="1.5" fill={color} />
  </svg>
);

export const BackpackBagSvg: React.FC<SvgProps> = ({ size = 20, color = '#38bdf8', style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style} xmlns="http://www.w3.org/2000/svg">
    <rect x="5" y="7" width="14" height="14" rx="3" stroke={color} strokeWidth="2" fill="none" />
    <path d="M9 7V4C9 3.4 9.4 3 10 3H14C14.6 3 15 3.4 15 4V7" stroke={color} strokeWidth="2" />
    <path d="M5 12H19" stroke={color} strokeWidth="2" />
    <rect x="9" y="10" width="6" height="4" rx="1" fill={color} />
  </svg>
);

export const HelmArmorSvg: React.FC<SvgProps> = ({ size = 22, color = '#94a3b8', style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style} xmlns="http://www.w3.org/2000/svg">
    <path d="M5 12C5 7 8 3 12 3C16 3 19 7 19 12V18L17 21H7L5 18V12Z" stroke={color} strokeWidth="2" fill="none" />
    <line x1="5" y1="12" x2="19" y2="12" stroke={color} strokeWidth="2" />
    <line x1="12" y1="3" x2="12" y2="12" stroke={color} strokeWidth="2" />
    <circle cx="8" cy="15" r="1" fill={color} />
    <circle cx="16" cy="15" r="1" fill={color} />
  </svg>
);

export const CuirassArmorSvg: React.FC<SvgProps> = ({ size = 22, color = '#94a3b8', style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style} xmlns="http://www.w3.org/2000/svg">
    <path d="M4 6L8 3H16L20 6L18 12L19 21H5L6 12L4 6Z" stroke={color} strokeWidth="2" fill="none" />
    <path d="M9 3V9C9 10.7 10.3 12 12 12C13.7 12 15 10.7 15 9V3" stroke={color} strokeWidth="1.5" />
    <line x1="7" y1="15" x2="17" y2="15" stroke={color} strokeWidth="1.5" />
  </svg>
);

export const GauntletsSvg: React.FC<SvgProps> = ({ size = 22, color = '#94a3b8', style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style} xmlns="http://www.w3.org/2000/svg">
    <rect x="6" y="11" width="12" height="10" rx="2" stroke={color} strokeWidth="2" fill="none" />
    <path d="M8 11V6C8 4.9 8.9 4 10 4C11.1 4 12 4.9 12 6V11" stroke={color} strokeWidth="1.5" />
    <path d="M12 6C12 4.9 12.9 4 14 4C15.1 4 16 4.9 16 6V11" stroke={color} strokeWidth="1.5" />
  </svg>
);

export const GreavesBootsSvg: React.FC<SvgProps> = ({ size = 22, color = '#94a3b8', style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style} xmlns="http://www.w3.org/2000/svg">
    <path d="M7 3H11V16L13 18H17V21H6L7 3Z" stroke={color} strokeWidth="2" strokeLinejoin="round" fill="none" />
    <line x1="7" y1="9" x2="11" y2="9" stroke={color} strokeWidth="1.5" />
    <line x1="7" y1="13" x2="11" y2="13" stroke={color} strokeWidth="1.5" />
  </svg>
);

export const RingAccessorySvg: React.FC<SvgProps> = ({ size = 22, color = '#60a5fa', style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style} xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="14" r="7" stroke={color} strokeWidth="2" fill="none" />
    <polygon points="12,3 15,7 9,7" fill="#fde047" stroke="#ca8a04" strokeWidth="1" />
  </svg>
);

export const TrophyVictorySvg: React.FC<SvgProps> = ({ size = 36, color = '#fef08a', style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style} xmlns="http://www.w3.org/2000/svg">
    <path d="M6 3H18V10C18 13.3 15.3 16 12 16C8.7 16 6 13.3 6 10V3Z" stroke={color} strokeWidth="2" fill="none" />
    <path d="M6 6H3C2.4 6 2 6.4 2 7V8C2 10.2 3.8 12 6 12V6Z" stroke={color} strokeWidth="2" />
    <path d="M18 6H21C21.6 6 22 6.4 22 7V8C22 10.2 20.2 12 18 12V6Z" stroke={color} strokeWidth="2" />
    <path d="M12 16V19M8 21H16M10 19H14" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const TvCrtMonitorSvg: React.FC<SvgProps> = ({ size = 18, color = 'currentColor', style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style} xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="5" width="20" height="15" rx="3" stroke={color} strokeWidth="2" fill="none" />
    <path d="M7 2L12 5L17 2" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="17" y1="10" x2="19" y2="10" stroke={color} strokeWidth="2" />
    <line x1="17" y1="14" x2="19" y2="14" stroke={color} strokeWidth="2" />
    <rect x="5" y="8" width="10" height="9" rx="1" fill={color} fillOpacity="0.15" />
  </svg>
);

export const VolumeSpeakerSvg: React.FC<SvgProps> = ({ size = 18, color = 'currentColor', style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style} xmlns="http://www.w3.org/2000/svg">
    <polygon points="11,5 6,9 2,9 2,15 6,15 11,19" stroke={color} strokeWidth="2" fill="none" />
    <path d="M15.5 8.5C16.5 9.5 17 10.7 17 12C17 13.3 16.5 14.5 15.5 15.5" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <path d="M19 5C20.9 6.9 22 9.4 22 12C22 14.6 20.9 17.1 19 19" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const VolumeMutedSpeakerSvg: React.FC<SvgProps> = ({ size = 18, color = 'currentColor', style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style} xmlns="http://www.w3.org/2000/svg">
    <polygon points="11,5 6,9 2,9 2,15 6,15 11,19" stroke={color} strokeWidth="2" fill="none" />
    <line x1="22" y1="9" x2="16" y2="15" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="16" y1="9" x2="22" y2="15" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </svg>
);



export const CardsStackSvg: React.FC<SvgProps> = ({ size = 20, color = 'currentColor', style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style} xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="6" width="12" height="16" rx="2" stroke={color} strokeWidth="2" />
    <path d="M8 4H18C19.1 4 20 4.9 20 6V18" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="7" y1="11" x2="13" y2="11" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="7" y1="15" x2="11" y2="15" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </svg>
);

