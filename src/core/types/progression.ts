import type { PrimaryStats } from './stats.ts';

export interface SkillTreeNode {
  id: string;
  name: string;
  description: string;
  tier: 1 | 2 | 3;
  branch: string;
  requiredLevel: number;
  prerequisiteNodeId?: string;
  statBonus?: Partial<PrimaryStats>;
  derivedBonus?: {
    physicalAttack?: number;
    magicAttack?: number;
    critChance?: number;
    evasion?: number;
    accuracy?: number;
    physicalDefense?: number;
    magicDefense?: number;
    speed?: number;
    maxHp?: number;
    maxMana?: number;
  };
  unlocksAbilityId?: string;
  icon: string;
}

export interface ClassSkillTree {
  classId: string;
  className: string;
  nodes: SkillTreeNode[];
}

export interface ProgressionState {
  currentExp: number;
  expToNextLevel: number;
  unallocatedStatPoints: number;
  unallocatedSkillPoints: number;
  unlockedSkillNodeIds: string[];
}
