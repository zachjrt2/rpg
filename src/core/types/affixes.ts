export type MonsterAffixType = 'MOLTEN' | 'IRONCLAD' | 'VOLTAIC' | 'VAMPIRIC' | 'PHANTOM';

export interface MonsterAffixDefinition {
  type: MonsterAffixType;
  name: string;
  badge: string;
  description: string;
  color: string;
  statModifiers?: {
    physicalDefensePercent?: number;
    evasionFlat?: number;
    speedFlat?: number;
  };
}

export const MONSTER_AFFIXES: Record<MonsterAffixType, MonsterAffixDefinition> = {
  MOLTEN: {
    type: 'MOLTEN',
    name: 'Molten',
    badge: '🔥 MOLTEN',
    description: 'Basic strikes inflict Burning DoT (18 fire dmg/turn for 2 turns).',
    color: '#f97316',
  },
  IRONCLAD: {
    type: 'IRONCLAD',
    name: 'Ironclad',
    badge: '🛡️ IRONCLAD',
    description: 'Encrusted in dense basalt armor, granting +35% Physical Defense.',
    color: '#94a3b8',
    statModifiers: {
      physicalDefensePercent: 35,
    },
  },
  VOLTAIC: {
    type: 'VOLTAIC',
    name: 'Voltaic',
    badge: '⚡ VOLTAIC',
    description: 'Surges with electricity, shocking attackers with 12 retaliatory lightning damage when struck.',
    color: '#38bdf8',
  },
  VAMPIRIC: {
    type: 'VAMPIRIC',
    name: 'Vampiric',
    badge: '🩸 VAMPIRIC',
    description: 'Siphons life essence, healing for 25% of all physical damage dealt.',
    color: '#ef4444',
  },
  PHANTOM: {
    type: 'PHANTOM',
    name: 'Phantom',
    badge: '💨 PHANTOM',
    description: 'Flickers between dimensions, gaining +18% Evasion and +5 Speed.',
    color: '#c084fc',
    statModifiers: {
      evasionFlat: 18,
      speedFlat: 5,
    },
  },
};
