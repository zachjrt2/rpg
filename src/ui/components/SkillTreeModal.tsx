import React from 'react';
import type { Combatant } from '../../core/types/combat.ts';
import type { ProgressionState } from '../../core/types/progression.ts';
import { CLASS_SKILL_TREES } from '../../core/data/skill-trees.ts';
import { Button } from './Button.tsx';
import { InfoTooltip } from './InfoTooltip.tsx';
import { TerminalChevronSvg } from './RpgSvgIcons.tsx';
import { X, Lock, CheckCircle2, Sparkles } from 'lucide-react';

interface SkillTreeModalProps {
  hero: Combatant;
  progression: ProgressionState;
  onUnlockNode: (nodeId: string) => void;
  onClose: () => void;
}

export const SkillTreeModal: React.FC<SkillTreeModalProps> = ({
  hero,
  progression,
  onUnlockNode,
  onClose,
}) => {
  const tree = CLASS_SKILL_TREES[hero.classId || 'WARRIOR'] || CLASS_SKILL_TREES.WARRIOR;
  const tiers = [1, 2, 3] as const;

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
          maxWidth: '860px',
          height: '92dvh',
          maxHeight: '92dvh',
          overflowY: 'auto',
          padding: '14px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          backgroundColor: 'rgba(10, 14, 20, 0.98)',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TerminalChevronSvg size={18} color="var(--text-term-green)" />
            <h2 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-term-green)', letterSpacing: '0.03em' }}>
              {tree.className} Talent Matrix
            </h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '3px 8px',
                backgroundColor: 'rgba(168, 85, 247, 0.2)',
                border: '1px solid #a855f7',
                borderRadius: '2px',
                color: '#d8b4fe',
                fontSize: '0.8rem',
                fontWeight: 700,
              }}
            >
              <Sparkles size={13} color="#d8b4fe" />
              <span>SP: {progression.unallocatedSkillPoints}</span>
            </div>
            <button
              onClick={onClose}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Tiers List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {tiers.map((tierNum) => {
            const tierNodes = tree.nodes.filter((n) => n.tier === tierNum);
            if (tierNodes.length === 0) return null;

            return (
              <div
                key={tierNum}
                style={{
                  padding: '10px 12px',
                  backgroundColor: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '4px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-gold)', fontWeight: 700 }}>
                    Tier {tierNum} {tierNum === 3 ? '(Master Ultimate)' : ''}
                  </span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    REQ: LV.{tierNum === 1 ? '2' : tierNum === 2 ? '3' : '5'}
                  </span>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                    gap: '8px',
                  }}
                >
                  {tierNodes.map((node) => {
                    const isUnlocked = progression.unlockedSkillNodeIds.includes(node.id);
                    const meetsLevel = hero.level >= node.requiredLevel;
                    const meetsPrereq = !node.prerequisiteNodeId || progression.unlockedSkillNodeIds.includes(node.prerequisiteNodeId);
                    const canUnlock = !isUnlocked && meetsLevel && meetsPrereq && progression.unallocatedSkillPoints > 0;

                    return (
                      <div
                        key={node.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '8px 10px',
                          backgroundColor: isUnlocked
                            ? 'rgba(34, 197, 94, 0.1)'
                            : canUnlock
                            ? 'rgba(168, 85, 247, 0.1)'
                            : 'rgba(0, 0, 0, 0.3)',
                          border: isUnlocked
                            ? '1px solid #22c55e'
                            : canUnlock
                            ? '1px solid #a855f7'
                            : '1px solid rgba(255, 255, 255, 0.08)',
                          borderRadius: '3px',
                          gap: '8px',
                          opacity: !isUnlocked && !canUnlock ? 0.6 : 1,
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          {isUnlocked ? (
                            <CheckCircle2 size={15} color="#22c55e" />
                          ) : (
                            <Lock size={13} color="#64748b" />
                          )}
                          <strong style={{ color: isUnlocked ? '#86efac' : canUnlock ? '#d8b4fe' : '#94a3b8', fontSize: '0.85rem' }}>
                            {node.name}
                          </strong>
                          <InfoTooltip
                            content={
                              <div>
                                <strong style={{ color: '#fef08a', display: 'block', marginBottom: '2px' }}>
                                  {node.name} [Branch: {node.branch}]
                                </strong>
                                <span>{node.description}</span>
                              </div>
                            }
                            size={13}
                            color={isUnlocked ? '#86efac' : canUnlock ? '#d8b4fe' : '#94a3b8'}
                          />
                        </div>

                        {/* Action Button */}
                        {isUnlocked ? (
                          <span style={{ fontSize: '0.7rem', color: '#86efac', fontWeight: 700 }}>
                            [ACTIVE]
                          </span>
                        ) : (
                          <Button
                            variant={canUnlock ? 'gold' : 'secondary'}
                            size="sm"
                            disabled={!canUnlock}
                            onClick={() => onUnlockNode(node.id)}
                          >
                            {canUnlock ? 'UNLOCK (1 SP)' : `LV.${node.requiredLevel}`}
                          </Button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Close Button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="secondary" onClick={onClose}>
            CLOSE
          </Button>
        </div>
      </div>
    </div>
  );
};
