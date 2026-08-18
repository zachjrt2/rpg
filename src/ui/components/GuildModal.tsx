import React, { useState } from 'react';
import type { PartyState } from '../../core/types/party.ts';
import type { CharacterClassId } from '../../core/types/classes.ts';
import { CHARACTER_CLASSES } from '../../core/data/classes.ts';
import { PortraitAvatar } from './PortraitAvatar.tsx';
import { Button } from './Button.tsx';
import { InfoTooltip } from './InfoTooltip.tsx';
import { TerminalChevronSvg, GoldCoinsStackSvg } from './RpgSvgIcons.tsx';
import { X, Users, UserPlus, ArrowLeftRight, Shield, Swords } from 'lucide-react';

interface GuildModalProps {
  party: PartyState;
  gold: number;
  onTogglePosition: (heroId: string) => void;
  onRecruitMercenary: (classId: CharacterClassId, name: string) => void;
  onClose: () => void;
}

export const GuildModal: React.FC<GuildModalProps> = ({
  party,
  gold,
  onTogglePosition,
  onRecruitMercenary,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'PARTY' | 'RECRUIT'>('PARTY');
  const [selectedRecruitClass, setSelectedRecruitClass] = useState<CharacterClassId>('ROGUE');
  const [recruitName, setRecruitName] = useState<string>('Shadow Blade');

  const classes = Object.values(CHARACTER_CLASSES);
  const recruitCost = 150;
  const canRecruit = gold >= recruitCost && party.activeMembers.length < 3;

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
          maxWidth: '820px',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          backgroundColor: 'rgba(10, 14, 20, 0.98)',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Users size={22} color="var(--text-term-green)" />
            <h2 style={{ margin: 0, fontSize: '1.35rem', color: 'var(--text-term-green)' }}>
              MERCENARY_GUILD:// TAVERN_HEADQUARTERS
            </h2>
            <InfoTooltip content="Manage party frontline/backline tactical formations and recruit up to 3 battle-hardened mercenaries." />
          </div>
          <button
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
          >
            <X size={22} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px' }}>
          <button
            onClick={() => setActiveTab('PARTY')}
            style={{
              padding: '6px 14px',
              backgroundColor: activeTab === 'PARTY' ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255, 255, 255, 0.04)',
              color: activeTab === 'PARTY' ? '#bae6fd' : 'var(--text-secondary)',
              border: activeTab === 'PARTY' ? '1px solid #38bdf8' : '1px solid var(--border-subtle)',
              borderRadius: '3px',
              fontWeight: 700,
              fontFamily: 'var(--font-mono)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Shield size={15} />
            <span>&gt; SQUAD FORMATION ({party.activeMembers.length}/3 ACTIVE)</span>
          </button>

          <button
            onClick={() => setActiveTab('RECRUIT')}
            style={{
              padding: '6px 14px',
              backgroundColor: activeTab === 'RECRUIT' ? 'rgba(234, 179, 8, 0.2)' : 'rgba(255, 255, 255, 0.04)',
              color: activeTab === 'RECRUIT' ? '#fef08a' : 'var(--text-secondary)',
              border: activeTab === 'RECRUIT' ? '1px solid #facc15' : '1px solid var(--border-subtle)',
              borderRadius: '3px',
              fontWeight: 700,
              fontFamily: 'var(--font-mono)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <UserPlus size={15} />
            <span>&gt; RECRUIT MERCENARY</span>
          </button>
        </div>

        {/* TAB 1: SQUAD FORMATION */}
        {activeTab === 'PARTY' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '10px',
              }}
            >
              {party.activeMembers.map((member) => {
                const isFrontline = member.position === 'FRONTLINE';

                return (
                  <div
                    key={member.hero.id}
                    style={{
                      padding: '12px',
                      backgroundColor: 'rgba(255, 255, 255, 0.02)',
                      border: isFrontline ? '1px solid #eab308' : '1px solid #38bdf8',
                      borderRadius: '4px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '48px', height: '62px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <PortraitAvatar type={member.hero.avatar} size={44} />
                      </div>
                      <div>
                        <strong style={{ color: '#fef08a', fontSize: '0.9rem' }}>
                          {member.hero.name}
                        </strong>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-term-cyan)' }}>
                          LV.{member.hero.level} {member.hero.className}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span
                        style={{
                          fontSize: '0.7rem',
                          fontWeight: 800,
                          padding: '1px 6px',
                          borderRadius: '2px',
                          backgroundColor: isFrontline ? 'rgba(234, 179, 8, 0.2)' : 'rgba(56, 189, 248, 0.2)',
                          color: isFrontline ? '#fef08a' : '#7dd3fc',
                        }}
                      >
                        {isFrontline ? 'FRONTLINE' : 'BACKLINE'}
                      </span>

                      <Button
                        variant="secondary"
                        size="sm"
                        icon={<ArrowLeftRight size={13} />}
                        onClick={() => onTogglePosition(member.hero.id)}
                      >
                        TOGGLE
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: RECRUIT MERCENARY */}
        {activeTab === 'RECRUIT' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '8px',
              }}
            >
              {classes.map((c) => {
                const isSelected = selectedRecruitClass === c.id;

                return (
                  <div
                    key={c.id}
                    onClick={() => {
                      setSelectedRecruitClass(c.id);
                      setRecruitName(`${c.name} Hireling`);
                    }}
                    style={{
                      padding: '10px',
                      backgroundColor: isSelected ? 'rgba(212, 163, 75, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                      border: isSelected ? '1px solid var(--border-gold-bright)' : '1px solid var(--border-subtle)',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <div style={{ width: '40px', height: '52px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <PortraitAvatar type={c.avatar} size={38} />
                    </div>
                    <div>
                      <strong style={{ color: isSelected ? '#fef08a' : '#f8fafc', fontSize: '0.85rem' }}>
                        {c.name}
                      </strong>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{c.role}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Custom Mercenary Name Input */}
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-gold)' }}>MERCENARY CALLSIGN:</label>
              <input
                type="text"
                value={recruitName}
                onChange={(e) => setRecruitName(e.target.value)}
                style={{
                  flex: 1,
                  padding: '6px 10px',
                  backgroundColor: 'rgba(0, 0, 0, 0.6)',
                  border: '1px solid #334155',
                  borderRadius: '2px',
                  color: '#fef08a',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.85rem',
                }}
              />
            </div>

            {/* Recruit Action Button */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#facc15', fontSize: '0.9rem' }}>
                <GoldCoinsStackSvg size={18} color="#facc15" />
                <span>BOUNTY CONTRACT: {recruitCost} GOLD</span>
              </div>

              <Button
                variant={canRecruit ? 'gold' : 'secondary'}
                disabled={!canRecruit}
                icon={<Swords size={16} />}
                onClick={() => {
                  if (canRecruit) {
                    onRecruitMercenary(selectedRecruitClass, recruitName || 'Mercenary');
                    setActiveTab('PARTY');
                  }
                }}
              >
                {party.activeMembers.length >= 3
                  ? '[SQUAD FULL (3/3)]'
                  : gold < recruitCost
                  ? '[INSUFFICIENT GOLD]'
                  : `> RECRUIT ${selectedRecruitClass}`}
              </Button>
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '6px' }}>
          <Button variant="secondary" onClick={onClose} icon={<TerminalChevronSvg size={16} color="#94a3b8" />}>
            &gt; CLOSE_GUILD
          </Button>
        </div>
      </div>
    </div>
  );
};
