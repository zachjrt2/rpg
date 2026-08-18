import React, { useState } from 'react';
import type { GameSaveData } from '../../core/storage/save-system.ts';
import { Button } from './Button.tsx';
import { soundFx } from '../audio/sound-system.ts';
import { TerminalChevronSvg } from './RpgSvgIcons.tsx';
import { X, Sliders, Volume2, Copy, Download, Check, BookOpen, RotateCcw, Flag } from 'lucide-react';

interface SettingsModalProps {
  getCurrentSaveData: () => GameSaveData;
  onImportSaveData: (data: GameSaveData) => void;
  onResetGame: () => void;
  onAbandonRun?: () => void;
  onOpenTutorial: () => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  getCurrentSaveData,
  onImportSaveData,
  onResetGame,
  onAbandonRun,
  onOpenTutorial,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);
  const [importJsonText, setImportJsonText] = useState('');
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState(false);
  const [isMuted, setIsMuted] = useState<boolean>(() => soundFx.getIsMuted());

  const handleExport = () => {
    try {
      const data = getCurrentSaveData();
      const text = JSON.stringify(data, null, 2);
      navigator.clipboard.writeText(text);
      soundFx.playClick();
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  const handleImport = () => {
    setImportError(null);
    setImportSuccess(false);
    try {
      if (!importJsonText.trim()) {
        setImportError('Please paste a valid JSON save string.');
        return;
      }
      const parsed: GameSaveData = JSON.parse(importJsonText);
      if (!parsed.hero || !parsed.inventory) {
        setImportError('Invalid save structure: Missing hero or inventory.');
        return;
      }
      onImportSaveData(parsed);
      soundFx.playVictory();
      setImportSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (e) {
      setImportError(`Failed to parse JSON save: ${(e as Error).message}`);
    }
  };

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
        padding: '8px',
        fontFamily: 'var(--font-mono)',
      }}
    >
      <div
        className="rpg-panel rpg-panel-gold animate-modal-in"
        style={{
          width: '100%',
          maxWidth: '680px',
          height: '92dvh',
          maxHeight: '92dvh',
          overflowY: 'auto',
          padding: '14px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          backgroundColor: 'rgba(10, 14, 20, 0.98)',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sliders size={22} color="var(--text-term-green)" />
            <h2 style={{ margin: 0, fontSize: '1.35rem', color: 'var(--text-term-green)', letterSpacing: '0.03em' }}>
              Game Settings & Save Data
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
          >
            <X size={22} />
          </button>
        </div>

        {/* Section 1: Tutorial Field Manual & Audio */}
        <div
          style={{
            padding: '14px',
            backgroundColor: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '4px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          <span style={{ fontSize: '0.8rem', color: 'var(--text-gold)', fontWeight: 700, letterSpacing: '0.04em' }}>
            Expedition Field Manual & Audio
          </span>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BookOpen size={18} color="#38bdf8" />
              <span style={{ fontSize: '0.85rem' }}>Combat & Roguelite Walkthrough Guide:</span>
            </div>
            <Button
              variant="primary"
              size="sm"
              icon={<BookOpen size={14} />}
              onClick={() => {
                onClose();
                onOpenTutorial();
              }}
            >
              Open Walkthrough & Field Guide
            </Button>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Volume2 size={18} color="#facc15" />
              <span style={{ fontSize: '0.85rem' }}>Audio & Music Master Control:</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Button
                variant={isMuted ? 'danger' : 'secondary'}
                size="sm"
                onClick={() => {
                  const nextMute = !isMuted;
                  soundFx.setMuted(nextMute);
                  setIsMuted(nextMute);
                }}
              >
                {isMuted ? '🔇 Unmute Audio' : '🔊 Mute Audio'}
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => soundFx.playMagicSpell()}
              >
                Test Chime
              </Button>
            </div>
          </div>
        </div>

        {/* Section 2: Save Data Export & Import */}
        <div
          style={{
            padding: '14px',
            backgroundColor: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '4px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
          }}
        >
          <span style={{ fontSize: '0.8rem', color: 'var(--text-gold)', fontWeight: 700, letterSpacing: '0.04em' }}>
            Persistent Save Data
          </span>

          <div style={{ display: 'flex', gap: '10px' }}>
            <Button
              variant="primary"
              size="sm"
              icon={copied ? <Check size={16} color="#86efac" /> : <Copy size={16} />}
              onClick={handleExport}
              style={{ flex: 1 }}
            >
              {copied ? 'Copied to Clipboard!' : 'Export Save (JSON)'}
            </Button>
          </div>

          {/* Import Textarea */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <textarea
              rows={3}
              placeholder="Paste JSON save data string here to restore character progress..."
              value={importJsonText}
              onChange={(e) => setImportJsonText(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 10px',
                backgroundColor: 'rgba(0,0,0,0.6)',
                border: '1px solid #334155',
                borderRadius: '3px',
                color: '#bae6fd',
                fontSize: '0.75rem',
                fontFamily: 'var(--font-mono)',
                resize: 'none',
              }}
            />

            {importError && (
              <span style={{ fontSize: '0.75rem', color: '#f87171' }}>{importError}</span>
            )}
            {importSuccess && (
              <span style={{ fontSize: '0.75rem', color: '#86efac' }}>Save restored successfully!</span>
            )}

            <Button
              variant="gold"
              size="sm"
              icon={<Download size={16} />}
              onClick={handleImport}
            >
              Import & Restore Save
            </Button>
          </div>
        </div>

        {/* Section 3: End Run (Forfeit / Give Up) */}
        {onAbandonRun && (
          <div
            style={{
              padding: '14px',
              backgroundColor: 'rgba(234, 179, 8, 0.08)',
              border: '1px solid rgba(234, 179, 8, 0.3)',
              borderRadius: '4px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '10px',
            }}
          >
            <div style={{ flex: 1, minWidth: '220px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Flag size={16} color="#fde047" />
                <strong style={{ color: '#fde047', fontSize: '0.85rem' }}>End Run (Forfeit / Give Up)</strong>
              </div>
              <p style={{ margin: '2px 0 0 0', fontSize: '0.72rem', color: '#cbd5e1' }}>
                Retreat from the dungeon. You will collect all Soul Shards earned so far and return to start a new adventure.
              </p>
            </div>
            <Button
              variant="gold"
              size="sm"
              icon={<Flag size={15} />}
              onClick={() => {
                if (window.confirm('🏳️ End your current expedition? You will keep all Soul Shards earned on this run and return to start a new run.')) {
                  onAbandonRun();
                }
              }}
            >
              End Expedition
            </Button>
          </div>
        )}

        {/* Section 4: Reset Progress */}
        <div
          style={{
            padding: '14px',
            backgroundColor: 'rgba(239, 68, 68, 0.08)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '4px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <strong style={{ color: '#fca5a5', fontSize: '0.85rem' }}>Reset Expedition Save</strong>
            <p style={{ margin: '2px 0 0 0', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              Wipes all saved local progress, relics, gold, and party data to start a clean new game.
            </p>
          </div>
          <Button
            variant="danger"
            size="sm"
            icon={<RotateCcw size={16} />}
            onClick={() => {
              if (window.confirm('⚠️ Reset all progress? This will delete your current party, gold, gear, and floor save to restart fresh.')) {
                onResetGame();
              }
            }}
          >
            Reset Expedition
          </Button>
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="secondary" onClick={onClose} icon={<TerminalChevronSvg size={16} color="#94a3b8" />}>
            Close Settings
          </Button>
        </div>
      </div>
    </div>
  );
};
