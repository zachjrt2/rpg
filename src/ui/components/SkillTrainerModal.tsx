import type { Combatant } from '../../core/types/combat.ts';
import type { PrimaryStats } from '../../core/types/stats.ts';
import { PortraitAvatar } from './PortraitAvatar.tsx';
import { Button } from './Button.tsx';
import { soundFx } from '../audio/sound-system.ts';
import {
  Sparkles,
  X,
  Swords,
  Zap,
  BookOpen,
  Shield,
  Sun,
  Coins,
  TrendingUp,
  Plus,
} from 'lucide-react';

interface SkillTrainerModalProps {
  hero: Combatant;
  gold: number;
  onTrainAttribute: (statKey: keyof PrimaryStats, cost: number) => void;
  onClose: () => void;
}

interface AttributeMeta {
  key: keyof PrimaryStats;
  name: string;
  short: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  borderColor: string;
  description: string;
  effectBreakdown: string;
}

const ATTRIBUTES: AttributeMeta[] = [
  {
    key: 'strength',
    name: 'Strength',
    short: 'STR',
    icon: <Swords size={20} color="#f87171" />,
    color: '#f87171',
    bgColor: 'rgba(239, 68, 68, 0.1)',
    borderColor: '#ef4444',
    description: 'Increases physical striking power and attack card damage scaling.',
    effectBreakdown: '+2.0 Physical Attack / Point',
  },
  {
    key: 'dexterity',
    name: 'Dexterity',
    short: 'DEX',
    icon: <Zap size={20} color="#38bdf8" />,
    color: '#38bdf8',
    bgColor: 'rgba(56, 189, 248, 0.1)',
    borderColor: '#38bdf8',
    description: 'Improves combat reflexes, turn initiative speed, accuracy, and evasion.',
    effectBreakdown: '+1.5 Accuracy, +1.0 Evasion, +0.8 Speed / Point',
  },
  {
    key: 'intelligence',
    name: 'Intelligence',
    short: 'INT',
    icon: <BookOpen size={20} color="#c084fc" />,
    color: '#c084fc',
    bgColor: 'rgba(168, 85, 247, 0.1)',
    borderColor: '#c084fc',
    description: 'Empowers magic spell potency, burn ticks, and maximum mana capacity.',
    effectBreakdown: '+2.5 Magic Power, +5 Max Mana / Point',
  },
  {
    key: 'vitality',
    name: 'Vitality',
    short: 'VIT',
    icon: <Shield size={20} color="#4ade80" />,
    color: '#4ade80',
    bgColor: 'rgba(34, 197, 94, 0.1)',
    borderColor: '#22c55e',
    description: 'Bolsters physiological resilience, maximum health, and physical defense.',
    effectBreakdown: '+8 Max Health (Instant Heal), +1.5 Physical Defense / Point',
  },
  {
    key: 'willpower',
    name: 'Willpower',
    short: 'WIL',
    icon: <Sun size={20} color="#fde047" />,
    color: '#fde047',
    bgColor: 'rgba(234, 179, 8, 0.1)',
    borderColor: '#facc15',
    description: 'Strengthens mental fortitude against debuffs and magic defense.',
    effectBreakdown: '+2.0 Magic Defense, +1.0% Status Ailment Resistance / Point',
  },
  {
    key: 'luck',
    name: 'Fortune',
    short: 'LUK',
    icon: <Sparkles size={20} color="#fbbf24" />,
    color: '#fbbf24',
    bgColor: 'rgba(251, 191, 36, 0.1)',
    borderColor: '#fbbf24',
    description: 'Heightens critical strike chance and gold discovery rates.',
    effectBreakdown: '+1.0% Critical Hit Chance, +1.5% Gold Discoveries / Point',
  },
];

export const getTrainingCost = (currentStatVal: number): number => {
  // Base cost 40 Gold, scaling smoothly with higher trained stats
  const base = 40;
  const scaling = Math.max(0, currentStatVal - 5) * 8;
  return base + scaling;
};

export const SkillTrainerModal: React.FC<SkillTrainerModalProps> = ({
  hero,
  gold,
  onTrainAttribute,
  onClose,
}) => {
  const avatarType =
    hero.avatar?.toLowerCase() ||
    (hero.classId === 'MAGE' ? 'mage' : hero.classId === 'ROGUE' ? 'rogue' : 'warrior');

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(3, 5, 8, 0.94)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 140,
        padding: '8px',
        fontFamily: 'var(--font-mono)',
      }}
    >
      <div
        className="rpg-panel rpg-panel-gold animate-modal-in"
        style={{
          width: '100%',
          maxWidth: '820px',
          height: '92dvh',
          maxHeight: '92dvh',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'rgba(10, 14, 22, 0.98)',
          border: '1px solid var(--border-gold)',
          padding: '14px',
          gap: '12px',
        }}
      >
        {/* Header Bar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid var(--border-subtle)',
            paddingBottom: '10px',
            flexWrap: 'wrap',
            gap: '8px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '4px',
                backgroundColor: 'rgba(234, 179, 8, 0.15)',
                border: '1px solid #facc15',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <TrendingUp size={22} color="#facc15" />
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.25rem', color: '#fef08a', letterSpacing: '0.03em' }}>
                Martial Skill Trainer
              </h2>
              <span style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
                Invest your earned gold into rigorous martial training to permanently hone your primary attributes for this expedition.
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Gold Counter */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                backgroundColor: 'rgba(234, 179, 8, 0.15)',
                border: '1px solid #facc15',
                borderRadius: '3px',
                color: '#fef08a',
                fontWeight: 800,
                fontSize: '0.95rem',
              }}
            >
              <Coins size={16} color="#facc15" />
              <span>{gold} GOLD</span>
            </div>

            <button
              onClick={onClose}
              style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Hero Summary Strip */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            padding: '10px 16px',
            backgroundColor: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '4px',
          }}
        >
          <PortraitAvatar type={avatarType} size={46} />
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <strong style={{ color: '#f8fafc', fontSize: '0.92rem' }}>{hero.name}</strong>
              <span style={{ fontSize: '0.7rem', color: 'var(--color-gold)', fontWeight: 800 }}>
                LVL {hero.level} {hero.classId}
              </span>
            </div>
            <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
              HP: {hero.currentHp}/{hero.maxHp} | ATK: {hero.derivedStats.physicalAttack} | DEF: {hero.derivedStats.physicalDefense} | CRIT: {hero.derivedStats.critChance}%
            </span>
          </div>
        </div>

        {/* Training Attribute Cards Grid */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: '12px',
            padding: '2px',
          }}
        >
          {ATTRIBUTES.map((attr) => {
            const currentVal = hero.primaryStats[attr.key] || 0;
            const cost = getTrainingCost(currentVal);
            const canAfford = gold >= cost;

            return (
              <div
                key={attr.key}
                style={{
                  padding: '14px',
                  backgroundColor: attr.bgColor,
                  border: `1px solid ${attr.borderColor}`,
                  borderRadius: '4px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  position: 'relative',
                }}
              >
                {/* Title & Current Stat */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {attr.icon}
                    <strong style={{ color: attr.color, fontSize: '0.88rem' }}>
                      {attr.name.toUpperCase()} ({attr.short})
                    </strong>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'baseline',
                      gap: '4px',
                      backgroundColor: 'rgba(0, 0, 0, 0.5)',
                      padding: '2px 8px',
                      borderRadius: '3px',
                      border: `1px solid ${attr.borderColor}`,
                    }}
                  >
                    <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>RANK</span>
                    <strong style={{ color: '#f8fafc', fontSize: '1rem' }}>{currentVal}</strong>
                  </div>
                </div>

                {/* Lore / Description */}
                <p style={{ margin: 0, fontSize: '0.72rem', color: '#cbd5e1', lineHeight: 1.35 }}>
                  {attr.description}
                </p>

                {/* Stat Gain Breakdown */}
                <div
                  style={{
                    fontSize: '0.68rem',
                    color: attr.color,
                    backgroundColor: 'rgba(0,0,0,0.4)',
                    padding: '4px 8px',
                    borderRadius: '2px',
                    fontWeight: 700,
                  }}
                >
                  ⚡ {attr.effectBreakdown}
                </div>

                {/* Train Button */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'auto', paddingTop: '4px' }}>
                  <Button
                    variant={canAfford ? 'gold' : 'secondary'}
                    size="sm"
                    disabled={!canAfford}
                    icon={<Plus size={14} />}
                    onClick={() => {
                      soundFx.playVictory();
                      onTrainAttribute(attr.key, cost);
                    }}
                  >
                    TRAIN +1 ({cost} GOLD)
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
