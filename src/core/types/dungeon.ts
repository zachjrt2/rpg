export type DungeonNodeType = 'BATTLE' | 'ELITE' | 'CAMPFIRE' | 'SHRINE' | 'BOSS';

export interface DungeonNode {
  id: string;
  step: number; // 0 to 4 (Step 4 is Boss)
  type: DungeonNodeType;
  name: string;
  description: string;
  isCompleted: boolean;
  isCurrent: boolean;
  isAvailable: boolean;
  nextIds: string[];
  enemyTypes?: string[];
  bossId?: string;
}

export interface DungeonFloor {
  floorNumber: number;
  name: string;
  nodes: Record<string, DungeonNode>;
  startNodeIds: string[];
  bossNodeId: string;
}

export interface DungeonState {
  currentFloor: number;
  currentNodeId: string | null;
  floor: DungeonFloor;
  isRunCompleted: boolean;
}
