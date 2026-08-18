import React from 'react';

interface PortraitAvatarProps {
  type: string;
  isDead?: boolean;
  isDefending?: boolean;
  size?: number;
}

export const PortraitAvatar: React.FC<PortraitAvatarProps> = ({
  type,
  isDead = false,
  isDefending = false,
  size = 80,
}) => {
  const getFilter = () => {
    if (isDead) return 'grayscale(100%) opacity(30%)';
    if (isDefending) return 'drop-shadow(0 0 10px #10b981)';
    return 'drop-shadow(0 4px 10px rgba(0,0,0,0.8))';
  };

  // Common outline styling parameters
  const strokeWidth = 2.2;

  // ==========================================
  // 1. WARRIOR HERO (Full-Body Plated Vanguard)
  // ==========================================
  if (type === 'warrior') {
    return (
      <svg width={size} height={size * 1.3} viewBox="0 0 100 130" fill="none" style={{ filter: getFilter(), transition: 'all 0.3s' }}>
        <ellipse cx="50" cy="122" rx="30" ry="5" fill="#000000" opacity="0.6" />
        <path d="M38 38 L25 110 L45 105 L50 45" fill="#1e293b" stroke="#3b82f6" strokeWidth={strokeWidth} opacity="0.8" />
        <path d="M38 80 L35 118 L46 118 L48 85" fill="#0f172a" stroke="#94a3b8" strokeWidth={strokeWidth} />
        <path d="M52 85 L54 118 L65 118 L62 80" fill="#0f172a" stroke="#94a3b8" strokeWidth={strokeWidth} />
        <path d="M35 38 L65 38 L60 82 L40 82 Z" fill="#1e293b" stroke="#94a3b8" strokeWidth={strokeWidth} />
        <path d="M42 42 L50 55 L58 42 M50 55 L50 80" stroke="#facc15" strokeWidth={strokeWidth - 0.5} />
        <polygon points="26,35 38,32 38,50 24,46" fill="#334155" stroke="#facc15" strokeWidth={strokeWidth} />
        <polygon points="74,35 62,32 62,50 76,46" fill="#334155" stroke="#facc15" strokeWidth={strokeWidth} />
        <line x1="72" y1="90" x2="88" y2="15" stroke="#e2e8f0" strokeWidth="3" strokeLinecap="round" />
        <line x1="78" y1="35" x2="94" y2="35" stroke="#facc15" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="70" cy="94" r="3" fill="#facc15" stroke="#78350f" />
        <path d="M36 28 C36 12 64 12 64 28 C64 36 58 40 50 40 C42 40 36 36 36 28 Z" fill="#0f172a" stroke="#94a3b8" strokeWidth={strokeWidth} />
        <polygon points="50,8 54,18 46,18" fill="#facc15" stroke="#ca8a04" strokeWidth="1" />
        <line x1="42" y1="26" x2="58" y2="26" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M22 50 L34 50 L34 80 L22 88 L14 65 Z" fill="#1e293b" stroke="#facc15" strokeWidth={strokeWidth} />
        <path d="M24 58 L24 74 M18 64 L30 64" stroke="#60a5fa" strokeWidth="1.5" />
      </svg>
    );
  }

  // ==========================================
  // 2. ROGUE HERO (Full-Body Hooded Dual-Stabber)
  // ==========================================
  if (type === 'rogue') {
    return (
      <svg width={size} height={size * 1.3} viewBox="0 0 100 130" fill="none" style={{ filter: getFilter(), transition: 'all 0.3s' }}>
        <ellipse cx="50" cy="122" rx="28" ry="5" fill="#000000" opacity="0.6" />
        <path d="M32 40 L16 115 L40 108 L48 45" fill="#0f172a" stroke="#0284c7" strokeWidth={strokeWidth} opacity="0.85" />
        <path d="M68 40 L84 115 L60 108 L52 45" fill="#0f172a" stroke="#0284c7" strokeWidth={strokeWidth} opacity="0.85" />
        <path d="M36 80 L28 116 L40 118 L46 84" fill="#090d16" stroke="#38bdf8" strokeWidth={strokeWidth} />
        <path d="M54 84 L60 118 L72 116 L64 80" fill="#090d16" stroke="#38bdf8" strokeWidth={strokeWidth} />
        <path d="M36 38 L64 38 L58 82 L42 82 Z" fill="#0f172a" stroke="#38bdf8" strokeWidth={strokeWidth} />
        <line x1="38" y1="52" x2="62" y2="68" stroke="#0284c7" strokeWidth="1.5" />
        <line x1="38" y1="68" x2="62" y2="52" stroke="#0284c7" strokeWidth="1.5" />
        <path d="M22 60 L14 90" stroke="#f8fafc" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="18" y1="68" x2="26" y2="68" stroke="#38bdf8" strokeWidth="2" />
        <path d="M78 60 L86 90" stroke="#f8fafc" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="74" y1="68" x2="82" y2="68" stroke="#38bdf8" strokeWidth="2" />
        <path d="M32 32 C32 10 68 10 68 32 C68 42 50 44 50 44 C50 44 32 42 32 32 Z" fill="#020617" stroke="#38bdf8" strokeWidth={strokeWidth} />
        <ellipse cx="42" cy="28" rx="4" ry="2" fill="#38bdf8" />
        <ellipse cx="58" cy="28" rx="4" ry="2" fill="#38bdf8" />
      </svg>
    );
  }

  // ==========================================
  // 3. MAGE HERO (Full-Body Arcane Pyromancer)
  // ==========================================
  if (type === 'mage') {
    return (
      <svg width={size} height={size * 1.3} viewBox="0 0 100 130" fill="none" style={{ filter: getFilter(), transition: 'all 0.3s' }}>
        <ellipse cx="50" cy="122" rx="26" ry="5" fill="#000000" opacity="0.6" />
        <path d="M35 40 L20 118 L80 118 L65 40 Z" fill="#1e1b4b" stroke="#c084fc" strokeWidth={strokeWidth} />
        <path d="M42 40 L38 118 M58 40 L62 118" stroke="#a855f7" strokeWidth="1.5" strokeDasharray="6 4" />
        <polygon points="50,4 72,30 28,30" fill="#3b0764" stroke="#c084fc" strokeWidth={strokeWidth} />
        <ellipse cx="50" cy="30" rx="28" ry="6" fill="#2e1065" stroke="#c084fc" strokeWidth={strokeWidth} />
        <ellipse cx="43" cy="38" rx="3.5" ry="2" fill="#f0abfc" />
        <ellipse cx="57" cy="38" rx="3.5" ry="2" fill="#f0abfc" />
        <line x1="82" y1="120" x2="82" y2="20" stroke="#ca8a04" strokeWidth="3" strokeLinecap="round" />
        <circle cx="82" cy="16" r="8" fill="#581c87" stroke="#e879f9" strokeWidth="2" />
        <circle cx="82" cy="16" r="4" fill="#fbcfe8" />
        <path d="M74 16 Q82 6 90 16 Q82 26 74 16" stroke="#f0abfc" strokeWidth="1.5" fill="none" />
      </svg>
    );
  }

  // ==========================================
  // 4. CLERIC HERO (Full-Body Holy Templar)
  // ==========================================
  if (type === 'cleric') {
    return (
      <svg width={size} height={size * 1.3} viewBox="0 0 100 130" fill="none" style={{ filter: getFilter(), transition: 'all 0.3s' }}>
        <ellipse cx="50" cy="122" rx="28" ry="5" fill="#000000" opacity="0.6" />
        <circle cx="50" cy="22" r="18" stroke="#facc15" strokeWidth="2" strokeDasharray="6 3" fill="none" />
        <path d="M32 40 L24 118 L76 118 L68 40 Z" fill="#0f172a" stroke="#ca8a04" strokeWidth={strokeWidth} />
        <path d="M42 40 L40 118 L60 118 L58 40 Z" fill="#f8fafc" stroke="#facc15" strokeWidth={strokeWidth - 0.5} />
        <path d="M50 55 L50 85 M42 65 L58 65" stroke="#ca8a04" strokeWidth="3" strokeLinecap="round" />
        <path d="M34 32 C34 14 66 14 66 32 C66 44 50 46 50 46 C50 46 34 44 34 32 Z" fill="#1e293b" stroke="#facc15" strokeWidth={strokeWidth} />
        <ellipse cx="43" cy="30" rx="3.5" ry="2" fill="#38bdf8" />
        <ellipse cx="57" cy="30" rx="3.5" ry="2" fill="#38bdf8" />
        <line x1="82" y1="115" x2="82" y2="35" stroke="#e2e8f0" strokeWidth="3" strokeLinecap="round" />
        <polygon points="82,24 88,32 82,40 76,32" fill="#facc15" stroke="#a16207" strokeWidth="1.5" />
        <circle cx="82" cy="32" r="3" fill="#ffffff" />
      </svg>
    );
  }

  // ==========================================
  // 5. RANGER HERO (Full-Body Marksman Archer)
  // ==========================================
  if (type === 'ranger') {
    return (
      <svg width={size} height={size * 1.3} viewBox="0 0 100 130" fill="none" style={{ filter: getFilter(), transition: 'all 0.3s' }}>
        <ellipse cx="50" cy="122" rx="28" ry="5" fill="#000000" opacity="0.6" />
        <path d="M36 38 L22 110 L44 105 L48 42" fill="#052e16" stroke="#22c55e" strokeWidth={strokeWidth} />
        <rect x="64" y="32" width="8" height="34" rx="2" fill="#78350f" stroke="#ca8a04" strokeWidth="1.5" transform="rotate(15 64 32)" />
        <line x1="68" y1="32" x2="72" y2="20" stroke="#f8fafc" strokeWidth="1.5" />
        <line x1="72" y1="34" x2="78" y2="22" stroke="#f8fafc" strokeWidth="1.5" />
        <path d="M38 78 L32 118 L44 118 L48 82" fill="#142407" stroke="#4ade80" strokeWidth={strokeWidth} />
        <path d="M52 82 L56 118 L68 118 L62 78" fill="#142407" stroke="#4ade80" strokeWidth={strokeWidth} />
        <path d="M36 38 L64 38 L58 80 L42 80 Z" fill="#14532d" stroke="#22c55e" strokeWidth={strokeWidth} />
        <path d="M22 25 Q10 70 22 115" stroke="#ca8a04" strokeWidth="3.5" fill="none" strokeLinecap="round" />
        <line x1="22" y1="25" x2="22" y2="115" stroke="#f8fafc" strokeWidth="1" strokeDasharray="4 2" />
        <path d="M34 32 C34 16 66 16 66 32 C66 42 50 44 50 44 C50 44 34 42 34 32 Z" fill="#064e3b" stroke="#4ade80" strokeWidth={strokeWidth} />
        <path d="M62 18 Q75 4 72 0 Q64 4 60 14" fill="#ef4444" stroke="#991b1b" strokeWidth="1" />
        <ellipse cx="42" cy="30" rx="3.5" ry="2" fill="#4ade80" />
        <ellipse cx="58" cy="30" rx="3.5" ry="2" fill="#4ade80" />
      </svg>
    );
  }

  // ==========================================
  // 6. PALADIN HERO (Full-Body Crusader of Light)
  // ==========================================
  if (type === 'paladin') {
    return (
      <svg width={size} height={size * 1.3} viewBox="0 0 100 130" fill="none" style={{ filter: getFilter(), transition: 'all 0.3s' }}>
        <ellipse cx="50" cy="122" rx="32" ry="5" fill="#000000" opacity="0.6" />
        {/* Radiant Sunburst Cape */}
        <path d="M35 36 L15 116 L45 112 L50 42" fill="#713f12" stroke="#fde047" strokeWidth={strokeWidth} />
        <path d="M65 36 L85 116 L55 112 L50 42" fill="#713f12" stroke="#fde047" strokeWidth={strokeWidth} />
        {/* Legs / Gold Plated Greaves */}
        <path d="M36 80 L32 118 L46 118 L48 84" fill="#1e293b" stroke="#facc15" strokeWidth={strokeWidth} />
        <path d="M52 84 L54 118 L68 118 L64 80" fill="#1e293b" stroke="#facc15" strokeWidth={strokeWidth} />
        {/* Golden Aegis Armor */}
        <path d="M34 36 L66 36 L60 82 L40 82 Z" fill="#0f172a" stroke="#facc15" strokeWidth={strokeWidth} />
        <polygon points="50,42 56,54 50,66 44,54" fill="#fef08a" stroke="#ca8a04" strokeWidth="1" />
        {/* Golden Crowned Greathelm */}
        <path d="M34 26 C34 10 66 10 66 26 L64 36 L36 36 Z" fill="#1e293b" stroke="#facc15" strokeWidth={strokeWidth} />
        <polygon points="36,12 44,4 50,10 56,4 64,12" fill="#facc15" stroke="#a16207" strokeWidth="1" />
        <line x1="42" y1="24" x2="58" y2="24" stroke="#fef08a" strokeWidth="2.5" strokeLinecap="round" />
        {/* Sun Tower Shield */}
        <path d="M18 45 L32 45 L30 85 L18 95 L12 70 Z" fill="#1e293b" stroke="#facc15" strokeWidth={strokeWidth} />
        <circle cx="22" cy="65" r="5" fill="#fef08a" stroke="#ca8a04" />
        {/* Radiant Claymore */}
        <line x1="75" y1="92" x2="90" y2="12" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
        <line x1="80" y1="32" x2="96" y2="32" stroke="#facc15" strokeWidth="2.5" />
      </svg>
    );
  }

  // ==========================================
  // 7. NECROMANCER HERO (Full-Body Void Harvester)
  // ==========================================
  if (type === 'necromancer') {
    return (
      <svg width={size} height={size * 1.3} viewBox="0 0 100 130" fill="none" style={{ filter: getFilter(), transition: 'all 0.3s' }}>
        <ellipse cx="50" cy="122" rx="28" ry="5" fill="#000000" opacity="0.6" />
        {/* Floating Soul Mist */}
        <path d="M28 85 Q10 110 25 120 M72 85 Q90 110 75 120" stroke="#a855f7" strokeWidth="2" fill="none" />
        {/* Ragged Bone Robes */}
        <path d="M35 40 L18 118 L82 118 L65 40 Z" fill="#030712" stroke="#a855f7" strokeWidth={strokeWidth} />
        <line x1="38" y1="52" x2="62" y2="52" stroke="#e2e8f0" strokeWidth="2" />
        <line x1="40" y1="62" x2="60" y2="62" stroke="#e2e8f0" strokeWidth="2" />
        {/* Horned Bone Shroud */}
        <path d="M32 30 C32 10 68 10 68 30 C68 42 50 45 50 45 C50 45 32 42 32 30 Z" fill="#0f051d" stroke="#c084fc" strokeWidth={strokeWidth} />
        <circle cx="42" cy="28" r="3" fill="#22c55e" />
        <circle cx="58" cy="28" r="3" fill="#22c55e" />
        {/* Soul Harvester Scythe */}
        <line x1="84" y1="120" x2="84" y2="15" stroke="#581c87" strokeWidth="3" strokeLinecap="round" />
        <path d="M84 15 Q60 5 50 20 Q68 22 84 30" fill="#e2e8f0" stroke="#a855f7" strokeWidth="2" />
      </svg>
    );
  }

  // ==========================================
  // 8. BERSERKER HERO (Full-Body Bloodthirsty Slayer)
  // ==========================================
  if (type === 'berserker') {
    return (
      <svg width={size} height={size * 1.3} viewBox="0 0 100 130" fill="none" style={{ filter: getFilter(), transition: 'all 0.3s' }}>
        <ellipse cx="50" cy="122" rx="32" ry="5" fill="#000000" opacity="0.6" />
        {/* Spiked Fur Shoulders */}
        <polygon points="22,32 36,25 36,45 20,40" fill="#450a0a" stroke="#ef4444" strokeWidth={strokeWidth} />
        <polygon points="78,32 64,25 64,45 80,40" fill="#450a0a" stroke="#ef4444" strokeWidth={strokeWidth} />
        {/* Muscular Torso & War Harness */}
        <path d="M34 36 L66 36 L60 82 L40 82 Z" fill="#180505" stroke="#ef4444" strokeWidth={strokeWidth} />
        <line x1="36" y1="42" x2="64" y2="76" stroke="#f87171" strokeWidth="2" />
        <line x1="64" y1="42" x2="36" y2="76" stroke="#f87171" strokeWidth="2" />
        {/* Muscular Legs */}
        <path d="M38 80 L32 118 L46 118 L48 84" fill="#000000" stroke="#f87171" strokeWidth={strokeWidth} />
        <path d="M52 84 L54 118 L68 118 L62 80" fill="#000000" stroke="#f87171" strokeWidth={strokeWidth} />
        {/* Horned Savage Helm */}
        <polygon points="34,22 16,6 30,18" fill="#7f1d1d" stroke="#ef4444" strokeWidth="2" />
        <polygon points="66,22 84,6 70,18" fill="#7f1d1d" stroke="#ef4444" strokeWidth="2" />
        <path d="M34 26 C34 12 66 12 66 26 L64 36 L36 36 Z" fill="#2d0606" stroke="#ef4444" strokeWidth={strokeWidth} />
        <ellipse cx="43" cy="26" rx="3.5" ry="2" fill="#ef4444" />
        <ellipse cx="57" cy="26" rx="3.5" ry="2" fill="#ef4444" />
        {/* Dual Battleaxes */}
        <line x1="16" y1="50" x2="28" y2="90" stroke="#78350f" strokeWidth="3" strokeLinecap="round" />
        <path d="M12 45 Q4 55 12 65 Q20 55 12 45" fill="#e2e8f0" stroke="#ef4444" strokeWidth="2" />
        <line x1="84" y1="50" x2="72" y2="90" stroke="#78350f" strokeWidth="3" strokeLinecap="round" />
        <path d="M88 45 Q96 55 88 65 Q80 55 88 45" fill="#e2e8f0" stroke="#ef4444" strokeWidth="2" />
      </svg>
    );
  }

  // ==========================================
  // 9. GOBLIN SCOUT (Full-Body Sneaky Stalker)
  // ==========================================
  if (type === 'goblin-scout') {
    return (
      <svg width={size} height={size * 1.3} viewBox="0 0 100 130" fill="none" style={{ filter: getFilter(), transition: 'all 0.3s' }}>
        <ellipse cx="50" cy="122" rx="30" ry="5" fill="#000000" opacity="0.6" />
        <path d="M32 80 L18 116 L32 118 L42 85" fill="#1e3a0f" stroke="#84cc16" strokeWidth={strokeWidth} />
        <path d="M58 85 L68 118 L82 116 L68 80" fill="#1e3a0f" stroke="#84cc16" strokeWidth={strokeWidth} />
        <path d="M34 45 L66 45 L62 85 L38 85 Z" fill="#365314" stroke="#84cc16" strokeWidth={strokeWidth} />
        <polygon points="34,35 6,20 28,52" fill="#3f6212" stroke="#84cc16" strokeWidth={strokeWidth} />
        <polygon points="66,35 94,20 72,52" fill="#3f6212" stroke="#84cc16" strokeWidth={strokeWidth} />
        <ellipse cx="50" cy="40" rx="18" ry="16" fill="#4d7c0f" stroke="#84cc16" strokeWidth={strokeWidth} />
        <ellipse cx="42" cy="38" rx="4" ry="5" fill="#facc15" stroke="#713f12" strokeWidth="1" />
        <ellipse cx="58" cy="38" rx="4" ry="5" fill="#facc15" stroke="#713f12" strokeWidth="1" />
        <path d="M42 50 Q50 56 58 50" stroke="#142407" strokeWidth="2" fill="none" />
        <path d="M78 65 L88 95" stroke="#f8fafc" strokeWidth="3" strokeLinecap="round" />
        <line x1="74" y1="72" x2="82" y2="72" stroke="#78350f" strokeWidth="2" />
      </svg>
    );
  }

  // ==========================================
  // 10. GOBLIN SHAMAN (Full-Body Witch Doctor)
  // ==========================================
  if (type === 'goblin-shaman') {
    return (
      <svg width={size} height={size * 1.3} viewBox="0 0 100 130" fill="none" style={{ filter: getFilter(), transition: 'all 0.3s' }}>
        <ellipse cx="50" cy="122" rx="30" ry="5" fill="#000000" opacity="0.6" />
        <path d="M30 45 L18 118 L82 118 L70 45 Z" fill="#14532d" stroke="#38bdf8" strokeWidth={strokeWidth} />
        <polygon points="34,35 8,18 28,48" fill="#365314" stroke="#38bdf8" strokeWidth={strokeWidth} />
        <polygon points="66,35 92,18 72,48" fill="#365314" stroke="#38bdf8" strokeWidth={strokeWidth} />
        <ellipse cx="50" cy="38" rx="18" ry="16" fill="#3f6212" stroke="#38bdf8" strokeWidth={strokeWidth} />
        <polygon points="40,28 60,28 50,48" fill="#f8fafc" stroke="#475569" strokeWidth="1.5" />
        <circle cx="45" cy="34" r="2.5" fill="#0284c7" />
        <circle cx="55" cy="34" r="2.5" fill="#0284c7" />
        <line x1="84" y1="120" x2="84" y2="25" stroke="#78350f" strokeWidth="3" strokeLinecap="round" />
        <circle cx="84" cy="20" r="7" fill="#f8fafc" stroke="#475569" strokeWidth="1.5" />
        <circle cx="82" cy="19" r="1.5" fill="#0284c7" />
        <circle cx="86" cy="19" r="1.5" fill="#0284c7" />
      </svg>
    );
  }

  // ==========================================
  // 11. SKELETON GUARD (Full-Body Animated Undead)
  // ==========================================
  if (type === 'skeleton-guard') {
    return (
      <svg width={size} height={size * 1.3} viewBox="0 0 100 130" fill="none" style={{ filter: getFilter(), transition: 'all 0.3s' }}>
        <ellipse cx="50" cy="122" rx="30" ry="5" fill="#000000" opacity="0.6" />
        <line x1="40" y1="80" x2="36" y2="118" stroke="#e2e8f0" strokeWidth="3" strokeLinecap="round" />
        <line x1="60" y1="80" x2="64" y2="118" stroke="#e2e8f0" strokeWidth="3" strokeLinecap="round" />
        <line x1="50" y1="42" x2="50" y2="80" stroke="#e2e8f0" strokeWidth="3" />
        <line x1="38" y1="50" x2="62" y2="50" stroke="#cbd5e1" strokeWidth="2.5" />
        <line x1="40" y1="60" x2="60" y2="60" stroke="#cbd5e1" strokeWidth="2.5" />
        <line x1="42" y1="70" x2="58" y2="70" stroke="#cbd5e1" strokeWidth="2.5" />
        <line x1="76" y1="95" x2="88" y2="28" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" />
        <line x1="80" y1="45" x2="92" y2="45" stroke="#78350f" strokeWidth="2.5" />
        <circle cx="25" cy="65" r="16" fill="#1e293b" stroke="#94a3b8" strokeWidth={strokeWidth} />
        <path d="M20 54 L28 66 L22 76" stroke="#f87171" strokeWidth="1.5" fill="none" />
        <path d="M34 26 C34 12 66 12 66 26 L64 34 L36 34 Z" fill="#334155" stroke="#94a3b8" strokeWidth={strokeWidth} />
        <path d="M36 32 C36 20 64 20 64 32 C64 42 56 46 50 46 C44 46 36 42 36 32 Z" fill="#0f172a" stroke="#e2e8f0" strokeWidth={strokeWidth} />
        <circle cx="43" cy="32" r="3" fill="#ef4444" />
        <circle cx="57" cy="32" r="3" fill="#ef4444" />
      </svg>
    );
  }

  // ==========================================
  // 12. DIRE WOLF (Full-Body Prowling Beast)
  // ==========================================
  if (type === 'dire-wolf') {
    return (
      <svg width={size} height={size * 1.3} viewBox="0 0 100 130" fill="none" style={{ filter: getFilter(), transition: 'all 0.3s' }}>
        <ellipse cx="50" cy="122" rx="34" ry="5" fill="#000000" opacity="0.6" />
        <path d="M22 65 C22 45 45 40 75 52 L82 75 L70 85 L26 80 Z" fill="#0f172a" stroke="#f97316" strokeWidth={strokeWidth} />
        <path d="M25 80 L18 118 M35 80 L30 118" stroke="#f97316" strokeWidth="3" strokeLinecap="round" />
        <path d="M68 85 L65 118 M80 75 L82 118" stroke="#f97316" strokeWidth="3" strokeLinecap="round" />
        <path d="M18 65 Q5 70 8 90" stroke="#f97316" strokeWidth="3" fill="none" strokeLinecap="round" />
        <polygon points="68,45 62,25 78,35" fill="#1e293b" stroke="#f97316" strokeWidth="2" />
        <polygon points="82,48 85,25 74,38" fill="#1e293b" stroke="#f97316" strokeWidth="2" />
        <path d="M66 46 C66 32 92 35 94 54 L84 65 L66 60 Z" fill="#0f172a" stroke="#f97316" strokeWidth={strokeWidth} />
        <circle cx="78" cy="46" r="3" fill="#facc15" />
        <polygon points="86,58 88,64 90,58" fill="#f8fafc" />
      </svg>
    );
  }

  // ==========================================
  // 13. DARK MAGE (Full-Body Necromancer)
  // ==========================================
  if (type === 'dark-mage') {
    return (
      <svg width={size} height={size * 1.3} viewBox="0 0 100 130" fill="none" style={{ filter: getFilter(), transition: 'all 0.3s' }}>
        <ellipse cx="50" cy="122" rx="28" ry="5" fill="#000000" opacity="0.6" />
        <path d="M35 40 L16 118 L84 118 L65 40 Z" fill="#0f051d" stroke="#ec4899" strokeWidth={strokeWidth} />
        <path d="M28 75 Q15 95 24 115 M72 75 Q85 95 76 115" stroke="#ec4899" strokeWidth="1.5" fill="none" />
        <line x1="82" y1="120" x2="82" y2="25" stroke="#4a044e" strokeWidth="3" strokeLinecap="round" />
        <polygon points="82,15 88,25 82,32 76,25" fill="#831843" stroke="#f43f5e" strokeWidth="2" />
        <circle cx="82" cy="24" r="3" fill="#fda4af" />
        <path d="M32 32 C32 10 68 10 68 32 C68 44 50 46 50 46 C50 46 32 44 32 32 Z" fill="#18052e" stroke="#ec4899" strokeWidth={strokeWidth} />
        <ellipse cx="42" cy="30" rx="3.5" ry="2" fill="#f43f5e" />
        <ellipse cx="58" cy="30" rx="3.5" ry="2" fill="#f43f5e" />
      </svg>
    );
  }

  // ==========================================
  // 14. GOBLIN BERSERKER (Enraged Twin-Cleaver Goblin)
  // ==========================================
  if (type === 'goblin-berserker') {
    return (
      <svg width={size} height={size * 1.3} viewBox="0 0 100 130" fill="none" style={{ filter: getFilter(), transition: 'all 0.3s' }}>
        <ellipse cx="50" cy="122" rx="30" ry="5" fill="#000000" opacity="0.6" />
        <path d="M34 45 L66 45 L62 85 L38 85 Z" fill="#7f1d1d" stroke="#ef4444" strokeWidth={strokeWidth} />
        <polygon points="34,35 6,18 28,50" fill="#991b1b" stroke="#ef4444" strokeWidth={strokeWidth} />
        <polygon points="66,35 94,18 72,50" fill="#991b1b" stroke="#ef4444" strokeWidth={strokeWidth} />
        <ellipse cx="50" cy="38" rx="18" ry="16" fill="#84cc16" stroke="#ef4444" strokeWidth={strokeWidth} />
        <circle cx="42" cy="36" r="4" fill="#ef4444" />
        <circle cx="58" cy="36" r="4" fill="#ef4444" />
        <path d="M42 48 Q50 56 58 48" stroke="#450a0a" strokeWidth="2.5" fill="none" />
        <line x1="16" y1="55" x2="28" y2="95" stroke="#78350f" strokeWidth="3" />
        <polygon points="12,50 20,40 28,60" fill="#e2e8f0" stroke="#ef4444" strokeWidth="1.5" />
        <line x1="84" y1="55" x2="72" y2="95" stroke="#78350f" strokeWidth="3" />
        <polygon points="88,50 80,40 72,60" fill="#e2e8f0" stroke="#ef4444" strokeWidth="1.5" />
      </svg>
    );
  }

  // ==========================================
  // 15. ORC WARLORD (Heavily Armored Brute)
  // ==========================================
  if (type === 'orc-warlord') {
    return (
      <svg width={size} height={size * 1.3} viewBox="0 0 100 130" fill="none" style={{ filter: getFilter(), transition: 'all 0.3s' }}>
        <ellipse cx="50" cy="122" rx="34" ry="5" fill="#000000" opacity="0.6" />
        <path d="M30 40 L70 40 L64 88 L36 88 Z" fill="#14532d" stroke="#facc15" strokeWidth={strokeWidth} />
        <polygon points="20,35 34,25 34,50 18,45" fill="#334155" stroke="#facc15" strokeWidth={strokeWidth} />
        <polygon points="80,35 66,25 66,50 82,45" fill="#334155" stroke="#facc15" strokeWidth={strokeWidth} />
        <ellipse cx="50" cy="30" rx="20" ry="18" fill="#166534" stroke="#facc15" strokeWidth={strokeWidth} />
        <polygon points="44,38 46,46 48,38" fill="#f8fafc" />
        <polygon points="52,38 54,46 56,38" fill="#f8fafc" />
        <circle cx="43" cy="28" r="3" fill="#facc15" />
        <circle cx="57" cy="28" r="3" fill="#facc15" />
        <line x1="86" y1="95" x2="86" y2="15" stroke="#94a3b8" strokeWidth="3.5" strokeLinecap="round" />
        <polygon points="86,15 96,30 86,45 76,30" fill="#e2e8f0" stroke="#ca8a04" strokeWidth="2" />
      </svg>
    );
  }

  // ==========================================
  // 16. BANDIT SHADOWBLADE (Masked Mercenary)
  // ==========================================
  if (type === 'bandit-shadowblade') {
    return (
      <svg width={size} height={size * 1.3} viewBox="0 0 100 130" fill="none" style={{ filter: getFilter(), transition: 'all 0.3s' }}>
        <ellipse cx="50" cy="122" rx="28" ry="5" fill="#000000" opacity="0.6" />
        <path d="M35 40 L18 115 L82 115 L65 40 Z" fill="#0f172a" stroke="#64748b" strokeWidth={strokeWidth} />
        <path d="M34 30 C34 12 66 12 66 30 L64 42 L36 42 Z" fill="#1e293b" stroke="#38bdf8" strokeWidth={strokeWidth} />
        <line x1="40" y1="28" x2="60" y2="28" stroke="#38bdf8" strokeWidth="2.5" />
        <circle cx="44" cy="28" r="1.5" fill="#ffffff" />
        <circle cx="56" cy="28" r="1.5" fill="#ffffff" />
        <path d="M20 65 L12 90" stroke="#f8fafc" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M80 65 L88 90" stroke="#f8fafc" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    );
  }

  // ==========================================
  // 17. CRYPT BANSHEE (Ethereal Spectral Screecher)
  // ==========================================
  if (type === 'crypt-banshee') {
    return (
      <svg width={size} height={size * 1.3} viewBox="0 0 100 130" fill="none" style={{ filter: getFilter(), transition: 'all 0.3s' }}>
        <ellipse cx="50" cy="122" rx="26" ry="5" fill="#000000" opacity="0.4" />
        <path d="M35 35 Q15 75 30 120 Q50 110 70 120 Q85 75 65 35 Z" fill="#082f49" stroke="#38bdf8" strokeWidth={strokeWidth} opacity="0.85" />
        <circle cx="50" cy="30" r="16" fill="#0c4a6e" stroke="#38bdf8" strokeWidth={strokeWidth} />
        <circle cx="43" cy="28" r="3.5" fill="#7dd3fc" />
        <circle cx="57" cy="28" r="3.5" fill="#7dd3fc" />
        <ellipse cx="50" cy="38" rx="4" ry="6" fill="#0284c7" />
      </svg>
    );
  }

  // ==========================================
  // 18. PLAGUE ABOMINATION (Toxic Colossus)
  // ==========================================
  if (type === 'plague-abomination') {
    return (
      <svg width={size} height={size * 1.3} viewBox="0 0 100 130" fill="none" style={{ filter: getFilter(), transition: 'all 0.3s' }}>
        <ellipse cx="50" cy="122" rx="36" ry="6" fill="#000000" opacity="0.6" />
        <path d="M25 45 Q20 85 30 118 L70 118 Q80 85 75 45 Z" fill="#14532d" stroke="#22c55e" strokeWidth={strokeWidth} />
        <circle cx="50" cy="35" r="22" fill="#166534" stroke="#22c55e" strokeWidth={strokeWidth} />
        <circle cx="40" cy="32" r="4" fill="#a3e635" />
        <circle cx="54" cy="30" r="5" fill="#a3e635" />
        <circle cx="62" cy="38" r="3" fill="#a3e635" />
        <path d="M38 46 Q50 56 62 46" stroke="#15803d" strokeWidth="3" fill="none" />
      </svg>
    );
  }

  // ==========================================
  // 19. VOID WRAITH (Shadow Phase Stalker)
  // ==========================================
  if (type === 'void-wraith') {
    return (
      <svg width={size} height={size * 1.3} viewBox="0 0 100 130" fill="none" style={{ filter: getFilter(), transition: 'all 0.3s' }}>
        <ellipse cx="50" cy="122" rx="28" ry="5" fill="#000000" opacity="0.5" />
        <path d="M30 35 Q10 80 25 120 Q50 115 75 120 Q90 80 70 35 Z" fill="#1e1b4b" stroke="#c084fc" strokeWidth={strokeWidth} opacity="0.9" />
        <path d="M34 25 C34 10 66 10 66 25 L60 45 L40 45 Z" fill="#0f0e26" stroke="#c084fc" strokeWidth={strokeWidth} />
        <ellipse cx="44" cy="26" rx="3.5" ry="2" fill="#e879f9" />
        <ellipse cx="56" cy="26" rx="3.5" ry="2" fill="#e879f9" />
      </svg>
    );
  }

  // ==========================================
  // 20. VENOMOUS BROODMOTHER (Giant Spider)
  // ==========================================
  if (type === 'spider-broodmother') {
    return (
      <svg width={size} height={size * 1.3} viewBox="0 0 100 130" fill="none" style={{ filter: getFilter(), transition: 'all 0.3s' }}>
        <ellipse cx="50" cy="122" rx="34" ry="5" fill="#000000" opacity="0.6" />
        {/* Legs */}
        <path d="M30 65 Q10 40 5 70 M30 75 Q8 60 5 90 M70 65 Q90 40 95 70 M70 75 Q92 60 95 90" stroke="#16a34a" strokeWidth="2.5" fill="none" />
        {/* Abdomen & Head */}
        <ellipse cx="50" cy="80" rx="22" ry="24" fill="#052e16" stroke="#16a34a" strokeWidth={strokeWidth} />
        <circle cx="50" cy="48" r="14" fill="#14532d" stroke="#22c55e" strokeWidth={strokeWidth} />
        <circle cx="44" cy="44" r="2" fill="#facc15" />
        <circle cx="50" cy="42" r="2" fill="#facc15" />
        <circle cx="56" cy="44" r="2" fill="#facc15" />
        <polygon points="46,56 44,66 48,60" fill="#f8fafc" />
        <polygon points="54,56 56,66 52,60" fill="#f8fafc" />
      </svg>
    );
  }

  // ==========================================
  // 21. FROST ELEMENTAL (Crystalline Golem)
  // ==========================================
  if (type === 'frost-elemental') {
    return (
      <svg width={size} height={size * 1.3} viewBox="0 0 100 130" fill="none" style={{ filter: getFilter(), transition: 'all 0.3s' }}>
        <ellipse cx="50" cy="122" rx="32" ry="5" fill="#000000" opacity="0.6" />
        <polygon points="25,45 50,20 75,45 68,95 32,95" fill="#082f49" stroke="#38bdf8" strokeWidth={strokeWidth} />
        <polygon points="40,30 50,12 60,30" fill="#0284c7" stroke="#7dd3fc" strokeWidth="1.5" />
        <circle cx="44" cy="42" r="3" fill="#bae6fd" />
        <circle cx="56" cy="42" r="3" fill="#bae6fd" />
        <line x1="32" y1="95" x2="25" y2="120" stroke="#38bdf8" strokeWidth="4" />
        <line x1="68" y1="95" x2="75" y2="120" stroke="#38bdf8" strokeWidth="4" />
      </svg>
    );
  }

  // ==========================================
  // 22. GARGOYLE SENTINEL (Stone Guardian)
  // ==========================================
  if (type === 'gargoyle-sentinel') {
    return (
      <svg width={size} height={size * 1.3} viewBox="0 0 100 130" fill="none" style={{ filter: getFilter(), transition: 'all 0.3s' }}>
        <ellipse cx="50" cy="122" rx="32" ry="5" fill="#000000" opacity="0.6" />
        <path d="M35 50 L10 25 Q28 65 35 85 Z" fill="#334155" stroke="#94a3b8" strokeWidth={strokeWidth} />
        <path d="M65 50 L90 25 Q72 65 65 85 Z" fill="#334155" stroke="#94a3b8" strokeWidth={strokeWidth} />
        <path d="M35 45 L65 45 L60 90 L40 90 Z" fill="#1e293b" stroke="#cbd5e1" strokeWidth={strokeWidth} />
        <circle cx="50" cy="32" r="16" fill="#334155" stroke="#e2e8f0" strokeWidth={strokeWidth} />
        <circle cx="44" cy="30" r="3" fill="#facc15" />
        <circle cx="56" cy="30" r="3" fill="#facc15" />
      </svg>
    );
  }

  // ==========================================
  // 23. IGNIS THE FIRE DRAKE (BOSS - Full Body Dragon)
  // ==========================================
  if (type === 'ignis-dragon') {
    return (
      <svg width={size * 1.2} height={size * 1.4} viewBox="0 0 120 140" fill="none" style={{ filter: getFilter(), transition: 'all 0.3s' }}>
        <ellipse cx="60" cy="132" rx="42" ry="6" fill="#000000" opacity="0.6" />
        <path d="M45 55 L5 25 Q25 65 38 85 Z" fill="#450a0a" stroke="#f97316" strokeWidth={strokeWidth} opacity="0.9" />
        <path d="M75 55 L115 25 Q95 65 82 85 Z" fill="#450a0a" stroke="#f97316" strokeWidth={strokeWidth} opacity="0.9" />
        <path d="M35 100 Q15 110 20 125" stroke="#f97316" strokeWidth="4" fill="none" strokeLinecap="round" />
        <polygon points="18,122 14,130 24,128" fill="#facc15" />
        <path d="M42 95 L36 128 M78 95 L84 128" stroke="#f97316" strokeWidth="4" strokeLinecap="round" />
        <path d="M40 50 L80 50 L72 105 L48 105 Z" fill="#7f1d1d" stroke="#f97316" strokeWidth={strokeWidth} />
        <path d="M50 58 L70 58 M52 70 L68 70 M54 82 L66 82" stroke="#facc15" strokeWidth="2" />
        <polygon points="38,30 20,8 44,22" fill="#450a0a" stroke="#f97316" strokeWidth="2" />
        <polygon points="82,30 100,8 76,22" fill="#450a0a" stroke="#f97316" strokeWidth="2" />
        <path d="M42 32 C42 16 78 16 78 32 L74 52 L60 58 L46 52 Z" fill="#7f1d1d" stroke="#f97316" strokeWidth={strokeWidth} />
        <polygon points="50,38 54,42 46,42" fill="#facc15" />
        <polygon points="70,38 74,42 66,42" fill="#facc15" />
      </svg>
    );
  }

  // ==========================================
  // 24. MALAKOR THE LICH LORD (BOSS - Full Body Lich)
  // ==========================================
  if (type === 'lich-lord') {
    return (
      <svg width={size * 1.2} height={size * 1.4} viewBox="0 0 120 140" fill="none" style={{ filter: getFilter(), transition: 'all 0.3s' }}>
        <ellipse cx="60" cy="132" rx="38" ry="6" fill="#000000" opacity="0.6" />
        <path d="M40 45 L15 125 L105 125 L80 45 Z" fill="#030712" stroke="#38bdf8" strokeWidth={strokeWidth} />
        <path d="M28 80 Q10 105 20 125 M92 80 Q110 105 100 125" stroke="#a855f7" strokeWidth="2" fill="none" />
        <path d="M25 60 L10 85 M95 60 L110 85" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="10" cy="85" r="4" fill="#38bdf8" />
        <circle cx="110" cy="85" r="4" fill="#38bdf8" />
        <polygon points="36,25 45,5 60,18 75,5 84,25" fill="#ca8a04" stroke="#fef08a" strokeWidth="2" />
        <circle cx="60" cy="14" r="3" fill="#c084fc" />
        <path d="M42 26 C42 14 78 14 78 26 L74 50 L60 56 L46 50 Z" fill="#020617" stroke="#38bdf8" strokeWidth={strokeWidth} />
        <circle cx="52" cy="34" r="3.5" fill="#38bdf8" />
        <circle cx="68" cy="34" r="3.5" fill="#38bdf8" />
      </svg>
    );
  }

  // Fallback
  return (
    <svg width={size} height={size * 1.3} viewBox="0 0 100 130" fill="none" style={{ filter: getFilter() }}>
      <ellipse cx="50" cy="122" rx="28" ry="5" fill="#000000" opacity="0.6" />
      <circle cx="50" cy="35" r="18" fill="#1e293b" stroke="#facc15" strokeWidth="2" />
      <path d="M35 55 L25 115 L75 115 L65 55 Z" fill="#0f172a" stroke="#facc15" strokeWidth="2" />
    </svg>
  );
};
