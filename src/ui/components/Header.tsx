import React, { useState, useRef, useEffect } from 'react';
import {
  MagicSparklesSvg,
  GoldCoinsStackSvg,
  VolumeSpeakerSvg,
  VolumeMutedSpeakerSvg,
  DiamondSvg,
} from './RpgSvgIcons.tsx';
import { soundFx } from '../audio/sound-system.ts';
import { ShoppingBag, Map, Sparkles, PlusCircle, TrendingUp, BookOpen, Settings, HelpCircle, Music, Volume2, Menu, X } from 'lucide-react';

interface HeaderProps {
  gold: number;
  aetherium: number;
  unallocatedStatPoints: number;
  unallocatedSkillPoints: number;
  isDungeonMapActive: boolean;
  onOpenShop: () => void;
  onOpenSkillTree: () => void;
  onOpenLevelUp: () => void;
  onToggleDungeonMap: () => void;
  onOpenTrainer: () => void;
  onOpenCodex: () => void;
  onOpenSettings: () => void;
  onOpenTutorial: () => void;
  onOpenSanctum: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  gold,
  aetherium,
  unallocatedStatPoints,
  unallocatedSkillPoints,
  isDungeonMapActive,
  onOpenShop,
  onOpenSkillTree,
  onOpenLevelUp,
  onToggleDungeonMap,
  onOpenTrainer,
  onOpenCodex,
  onOpenSettings,
  onOpenTutorial,
  onOpenSanctum,
}) => {
  const [isAudioPanelOpen, setIsAudioPanelOpen] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [windowWidth, setWindowWidth] = useState<number>(() => (typeof window !== 'undefined' ? window.innerWidth : 1024));
  const [isMuted, setIsMuted] = useState<boolean>(() => soundFx.getIsMuted());
  const [musicVol, setMusicVol] = useState<number>(() => Math.round(soundFx.getMusicVolume() * 100));
  const [sfxVol, setSfxVol] = useState<number>(() => Math.round(soundFx.getSfxVolume() * 100));
  const audioPanelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (audioPanelRef.current && !audioPanelRef.current.contains(e.target as Node)) {
        setIsAudioPanelOpen(false);
      }
    };
    if (isAudioPanelOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isAudioPanelOpen]);

  const toggleMute = () => {
    const nextMute = !isMuted;
    soundFx.setMuted(nextMute);
    setIsMuted(nextMute);
    if (!nextMute) {
      soundFx.playClick();
    }
  };

  const isMobile = windowWidth < 768;

  return (
    <header
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '8px 16px',
        backgroundColor: 'rgba(7, 10, 15, 0.96)',
        borderBottom: '1px solid var(--border-gold)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.8)',
        position: 'sticky',
        top: 0,
        zIndex: 40,
        backdropFilter: 'blur(8px)',
        fontFamily: 'var(--font-mono)',
      }}
    >
      {/* Title / Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <MagicSparklesSvg size={20} color="var(--border-gold)" />
        <h1
          style={{
            margin: 0,
            fontSize: '1.15rem',
            fontFamily: 'var(--font-heading)',
            color: 'var(--text-gold)',
            letterSpacing: '0.08em',
          }}
        >
          Aetherbound
        </h1>
        <span
          style={{
            fontSize: '0.66rem',
            padding: '2px 6px',
            backgroundColor: 'rgba(212, 163, 75, 0.15)',
            border: '1px solid var(--border-gold)',
            color: '#fef08a',
            borderRadius: '2px',
            fontWeight: 700,
            letterSpacing: '0.04em',
          }}
        >
          Chained to the Deep
        </span>
      </div>

      {/* Icon-only Nav Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap' }}>

        {/* Aetherium Counter */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '4px 8px',
            backgroundColor: 'rgba(147, 51, 234, 0.15)',
            border: '1px solid #c084fc',
            borderRadius: '2px',
            color: '#f5d0fe',
            fontSize: '0.8rem',
            fontWeight: 700,
          }}
          title="Aetherium Soul Shards — Persistent Meta-Currency"
        >
          <DiamondSvg size={14} color="#c084fc" />
          <span>{aetherium}</span>
        </div>

        {/* Gold Counter */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '4px 8px',
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            border: '1px solid rgba(251, 191, 36, 0.4)',
            borderRadius: '2px',
            color: '#fef08a',
            fontSize: '0.8rem',
            fontWeight: 700,
          }}
          title="Gold"
        >
          <GoldCoinsStackSvg size={13} color="#fbbf24" />
          <span>{gold}G</span>
        </div>

        {/* Desktop Navigation Buttons */}
        {!isMobile && (
          <>
            {/* Level Up badge — pulsing when points available */}
            {unallocatedStatPoints > 0 && (
              <button
                onClick={onOpenLevelUp}
                className="animate-pulse-gold"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '3px',
                  padding: '4px 7px',
                  backgroundColor: 'rgba(234, 179, 8, 0.25)',
                  border: '1px solid #facc15',
                  borderRadius: '3px',
                  color: '#fef08a',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 800,
                  cursor: 'pointer',
                  boxShadow: '0 0 10px rgba(250, 204, 21, 0.3)',
                }}
                title={`Level Up — ${unallocatedStatPoints} stat point(s) available`}
              >
                <PlusCircle size={14} color="#fef08a" />
                <span style={{ fontSize: '0.68rem' }}>+{unallocatedStatPoints}</span>
              </button>
            )}

            {/* Astral Sanctum */}
            <button
              onClick={onOpenSanctum}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '5px 7px',
                backgroundColor: 'rgba(168, 85, 247, 0.18)',
                border: '1px solid #a855f7',
                borderRadius: '2px',
                color: '#e879f9',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              title="Astral Sanctum — Roguelite Meta-Upgrades"
            >
              <Sparkles size={15} color="#e879f9" />
            </button>

            {/* Field Manual / Tutorial */}
            <button
              onClick={onOpenTutorial}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '5px 7px',
                backgroundColor: 'rgba(56, 189, 248, 0.15)',
                border: '1px solid #38bdf8',
                borderRadius: '2px',
                color: '#7dd3fc',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              title="Field Manual — Tutorial & Help"
            >
              <HelpCircle size={15} color="#7dd3fc" />
            </button>

            {/* Skill Tree */}
            <button
              onClick={onOpenSkillTree}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '3px',
                padding: '5px 7px',
                backgroundColor: unallocatedSkillPoints > 0 ? 'rgba(168, 85, 247, 0.25)' : 'rgba(20, 28, 42, 0.9)',
                border: unallocatedSkillPoints > 0 ? '1px solid #a855f7' : '1px solid var(--border-subtle)',
                borderRadius: '2px',
                color: unallocatedSkillPoints > 0 ? '#d8b4fe' : '#94a3b8',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              title={`Class Skill Tree${unallocatedSkillPoints > 0 ? ` — ${unallocatedSkillPoints} point(s) available` : ''}`}
            >
              <Sparkles size={15} color={unallocatedSkillPoints > 0 ? '#d8b4fe' : '#94a3b8'} />
              {unallocatedSkillPoints > 0 && (
                <span style={{ fontSize: '0.62rem', color: '#d8b4fe', fontWeight: 800 }}>{unallocatedSkillPoints}</span>
              )}
            </button>

            {/* Map / Battle Toggle */}
            <button
              onClick={onToggleDungeonMap}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '5px 7px',
                backgroundColor: isDungeonMapActive ? 'rgba(56, 189, 248, 0.25)' : 'rgba(20, 28, 42, 0.9)',
                border: isDungeonMapActive ? '1px solid #38bdf8' : '1px solid var(--border-subtle)',
                borderRadius: '2px',
                color: isDungeonMapActive ? '#7dd3fc' : '#94a3b8',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              title={isDungeonMapActive ? 'Switch to Battle View' : 'Open Dungeon Map'}
            >
              <Map size={15} color={isDungeonMapActive ? '#7dd3fc' : '#94a3b8'} />
            </button>

            {/* Martial Skill Trainer */}
            <button
              onClick={onOpenTrainer}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '5px 7px',
                backgroundColor: 'rgba(234, 179, 8, 0.15)',
                border: '1px solid #facc15',
                borderRadius: '2px',
                color: '#fef08a',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              title="Martial Skill Trainer — Spend Gold to Train Primary Attributes (STR, DEX, INT, etc.)"
            >
              <TrendingUp size={15} color="#fef08a" />
            </button>

            {/* Shop */}
            <button
              onClick={onOpenShop}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '5px 7px',
                backgroundColor: 'rgba(234, 179, 8, 0.15)',
                border: '1px solid #eab308',
                borderRadius: '2px',
                color: '#fef08a',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              title="Outpost Merchant Shop"
            >
              <ShoppingBag size={15} color="#fef08a" />
            </button>

            {/* Codex */}
            <button
              onClick={onOpenCodex}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '5px 7px',
                backgroundColor: 'rgba(20, 28, 42, 0.9)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '2px',
                color: '#a7f3d0',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              title="Tactical Codex — Bestiary & Game Reference"
            >
              <BookOpen size={15} color="#a7f3d0" />
            </button>

            {/* Settings */}
            <button
              onClick={onOpenSettings}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '5px 7px',
                backgroundColor: 'rgba(20, 28, 42, 0.9)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '2px',
                color: '#cbd5e1',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              title="System Settings & Save Manager"
            >
              <Settings size={15} color="#cbd5e1" />
            </button>
          </>
        )}

        {/* Audio Volume Controls Popover */}
        <div ref={audioPanelRef} style={{ position: 'relative' }}>
          <button
            onClick={() => {
              soundFx.playClick();
              setIsAudioPanelOpen((prev) => !prev);
            }}
            style={{
              background: isAudioPanelOpen ? 'rgba(56, 189, 248, 0.2)' : 'transparent',
              border: isAudioPanelOpen ? '1px solid #38bdf8' : '1px solid #334155',
              borderRadius: '2px',
              padding: '5px 7px',
              color: isMuted ? '#64748b' : '#38bdf8',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              transition: 'all 0.15s ease',
            }}
            title="Audio & Music Volume Controls"
          >
            {isMuted ? <VolumeMutedSpeakerSvg size={15} color="#64748b" /> : <VolumeSpeakerSvg size={15} color="#38bdf8" />}
          </button>

          {isAudioPanelOpen && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                right: 0,
                width: '240px',
                backgroundColor: 'rgba(9, 14, 23, 0.98)',
                border: '1px solid var(--border-gold)',
                borderRadius: '6px',
                padding: '14px',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.9), 0 0 15px rgba(212, 163, 75, 0.2)',
                backdropFilter: 'blur(12px)',
                zIndex: 100,
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                fontFamily: 'var(--font-sans)',
              }}
            >
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-gold)', letterSpacing: '0.05em' }}>
                  AUDIO CONTROLS
                </span>
                <button
                  onClick={toggleMute}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: isMuted ? '#ef4444' : '#4ade80',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    padding: '2px 4px',
                  }}
                >
                  {isMuted ? 'UNMUTE ALL' : 'MUTE ALL'}
                </button>
              </div>

              {/* Music Volume Slider */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#cbd5e1' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Music size={13} color="#facc15" /> Music
                  </span>
                  <span style={{ color: '#facc15', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>{musicVol}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={musicVol}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setMusicVol(val);
                    soundFx.setMusicVolume(val / 100);
                    if (isMuted && val > 0) {
                      soundFx.setMuted(false);
                      setIsMuted(false);
                    }
                  }}
                  style={{
                    width: '100%',
                    accentColor: '#facc15',
                    cursor: 'pointer',
                  }}
                />
              </div>

              {/* SFX Volume Slider */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#cbd5e1' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Volume2 size={13} color="#38bdf8" /> Sound FX
                  </span>
                  <span style={{ color: '#38bdf8', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>{sfxVol}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={sfxVol}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setSfxVol(val);
                    soundFx.setSfxVolume(val / 100);
                    if (isMuted && val > 0) {
                      soundFx.setMuted(false);
                      setIsMuted(false);
                    }
                  }}
                  style={{
                    width: '100%',
                    accentColor: '#38bdf8',
                    cursor: 'pointer',
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Menu Button */}
        {isMobile && (
          <button
            onClick={() => {
              soundFx.playClick();
              setIsMobileMenuOpen(true);
            }}
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '6px 9px',
              backgroundColor: 'rgba(212, 163, 75, 0.18)',
              border: '1px solid var(--border-gold)',
              borderRadius: '3px',
              color: 'var(--text-gold)',
              cursor: 'pointer',
            }}
            title="Open Game Menu"
          >
            <Menu size={16} color="var(--text-gold)" />
            {(unallocatedStatPoints > 0 || unallocatedSkillPoints > 0) && (
              <span
                style={{
                  position: 'absolute',
                  top: '-3px',
                  right: '-3px',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#facc15',
                  boxShadow: '0 0 6px #facc15',
                }}
              />
            )}
          </button>
        )}

      </div>

      {/* Mobile Sliding Navigation Drawer */}
      {isMobile && isMobileMenuOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(6px)',
            zIndex: 120,
            display: 'flex',
            justifyContent: 'flex-end',
            animation: 'fadeIn 0.2s ease',
          }}
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div
            style={{
              width: '82%',
              maxWidth: '320px',
              height: '100%',
              backgroundColor: 'rgba(10, 14, 22, 0.98)',
              borderLeft: '1px solid var(--border-gold)',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              overflowY: 'auto',
              boxShadow: '-6px 0 25px rgba(0, 0, 0, 0.9)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MagicSparklesSvg size={16} color="var(--border-gold)" />
                <span style={{ fontFamily: 'var(--font-heading)', fontSize: '0.9rem', color: 'var(--text-gold)' }}>
                  COMMAND MENU
                </span>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', padding: '4px', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Menu Action List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '6px' }}>
              <button
                onClick={() => {
                  soundFx.playClick();
                  setIsMobileMenuOpen(false);
                  onOpenSanctum();
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 12px',
                  backgroundColor: 'rgba(168, 85, 247, 0.15)',
                  border: '1px solid #a855f7',
                  borderRadius: '4px',
                  color: '#e879f9',
                  textAlign: 'left',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                }}
              >
                <Sparkles size={16} color="#e879f9" />
                <span>Astral Sanctum</span>
              </button>

              <button
                onClick={() => {
                  soundFx.playClick();
                  setIsMobileMenuOpen(false);
                  onOpenShop();
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 12px',
                  backgroundColor: 'rgba(234, 179, 8, 0.12)',
                  border: '1px solid #eab308',
                  borderRadius: '4px',
                  color: '#fef08a',
                  textAlign: 'left',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                }}
              >
                <ShoppingBag size={16} color="#fef08a" />
                <span>Merchant Shop</span>
              </button>

              <button
                onClick={() => {
                  soundFx.playClick();
                  setIsMobileMenuOpen(false);
                  onToggleDungeonMap();
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 12px',
                  backgroundColor: 'rgba(56, 189, 248, 0.15)',
                  border: '1px solid #38bdf8',
                  borderRadius: '4px',
                  color: '#7dd3fc',
                  textAlign: 'left',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                }}
              >
                <Map size={16} color="#7dd3fc" />
                <span>{isDungeonMapActive ? 'Return to Battle' : 'Dungeon Floor Map'}</span>
              </button>

              {unallocatedStatPoints > 0 && (
                <button
                  onClick={() => {
                    soundFx.playClick();
                    setIsMobileMenuOpen(false);
                    onOpenLevelUp();
                  }}
                  className="animate-pulse-gold"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 12px',
                    backgroundColor: 'rgba(234, 179, 8, 0.25)',
                    border: '1px solid #facc15',
                    borderRadius: '4px',
                    color: '#fef08a',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <PlusCircle size={16} color="#fef08a" />
                    <span>Level Up</span>
                  </div>
                  <span style={{ fontSize: '0.75rem', backgroundColor: '#facc15', color: '#000', padding: '2px 6px', borderRadius: '3px', fontWeight: 800 }}>
                    +{unallocatedStatPoints}
                  </span>
                </button>
              )}

              <button
                onClick={() => {
                  soundFx.playClick();
                  setIsMobileMenuOpen(false);
                  onOpenSkillTree();
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 12px',
                  backgroundColor: unallocatedSkillPoints > 0 ? 'rgba(168, 85, 247, 0.25)' : 'rgba(20, 28, 42, 0.9)',
                  border: unallocatedSkillPoints > 0 ? '1px solid #a855f7' : '1px solid var(--border-subtle)',
                  borderRadius: '4px',
                  color: unallocatedSkillPoints > 0 ? '#d8b4fe' : '#cbd5e1',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Sparkles size={16} color={unallocatedSkillPoints > 0 ? '#d8b4fe' : '#94a3b8'} />
                  <span>Class Skill Tree</span>
                </div>
                {unallocatedSkillPoints > 0 && (
                  <span style={{ fontSize: '0.75rem', backgroundColor: '#a855f7', color: '#fff', padding: '2px 6px', borderRadius: '3px', fontWeight: 800 }}>
                    +{unallocatedSkillPoints}
                  </span>
                )}
              </button>

              <button
                onClick={() => {
                  soundFx.playClick();
                  setIsMobileMenuOpen(false);
                  onOpenTrainer();
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 12px',
                  backgroundColor: 'rgba(20, 28, 42, 0.9)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '4px',
                  color: '#cbd5e1',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                }}
              >
                <TrendingUp size={16} color="#fbbf24" />
                <span>Martial Skill Trainer</span>
              </button>

              <button
                onClick={() => {
                  soundFx.playClick();
                  setIsMobileMenuOpen(false);
                  onOpenCodex();
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 12px',
                  backgroundColor: 'rgba(20, 28, 42, 0.9)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '4px',
                  color: '#a7f3d0',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                }}
              >
                <BookOpen size={16} color="#a7f3d0" />
                <span>Tactical Codex</span>
              </button>

              <button
                onClick={() => {
                  soundFx.playClick();
                  setIsMobileMenuOpen(false);
                  onOpenTutorial();
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 12px',
                  backgroundColor: 'rgba(20, 28, 42, 0.9)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '4px',
                  color: '#7dd3fc',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                }}
              >
                <HelpCircle size={16} color="#7dd3fc" />
                <span>Field Guide & Tutorial</span>
              </button>

              <button
                onClick={() => {
                  soundFx.playClick();
                  setIsMobileMenuOpen(false);
                  onOpenSettings();
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 12px',
                  backgroundColor: 'rgba(20, 28, 42, 0.9)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '4px',
                  color: '#cbd5e1',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                }}
              >
                <Settings size={16} color="#cbd5e1" />
                <span>Settings & Save Manager</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
