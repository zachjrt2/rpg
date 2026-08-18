import type { DungeonFloor, DungeonNode, DungeonState } from '../types/dungeon.ts';
import type { IRandomNumberGenerator } from '../rng/rng.ts';

export function getFloorName(floorNumber: number): string {
  switch (floorNumber) {
    case 1:
      return 'The Sunken Bastion';
    case 2:
      return 'The Abyssal Catacombs';
    case 3:
      return 'The Obsidian Sanctum';
    default:
      return `The Infernal Abyss (Floor ${floorNumber})`;
  }
}

export function generateDungeonFloor(
  floorNumber: number,
  rng: IRandomNumberGenerator
): DungeonFloor {
  const isIgnis = floorNumber % 2 === 1 ? rng.rollChance(0.7) : rng.rollChance(0.3);
  const bossId = isIgnis ? 'ignis-dragon' : 'lich-lord';
  const bossName = isIgnis ? 'Ignis the Fire Drake' : 'Malakor the Lich Lord';
  const floorTitle = `Floor ${floorNumber}: ${getFloorName(floorNumber)}`;

  const nodes: Record<string, DungeonNode> = {
    // Step 0: Entrance (2 Battle Paths)
    'node-0-0': {
      id: 'node-0-0',
      step: 0,
      type: 'BATTLE',
      name: `${getFloorName(floorNumber)} Gate Patrol`,
      description: 'Hostile woodland scouts patrolling the outer courtyard.',
      isCompleted: false,
      isCurrent: false,
      isAvailable: true,
      nextIds: ['node-1-0', 'node-1-1'],
      enemyTypes: ['Scout'],
    },
    'node-0-1': {
      id: 'node-0-1',
      step: 0,
      type: 'BATTLE',
      name: 'Verdant Thicket',
      description: 'Feral alpha wolves prowling the perimeter gate.',
      isCompleted: false,
      isCurrent: false,
      isAvailable: true,
      nextIds: ['node-1-0', 'node-1-1'],
      enemyTypes: ['Beast'],
    },

    // Step 1: Encounter / Shrine
    'node-1-0': {
      id: 'node-1-0',
      step: 1,
      type: 'BATTLE',
      name: 'Ritual Grove',
      description: 'Shaman ritualists summoning storms in the courtyard.',
      isCompleted: false,
      isCurrent: false,
      isAvailable: false,
      nextIds: ['node-2-0', 'node-2-1'],
      enemyTypes: ['Shaman'],
    },
    'node-1-1': {
      id: 'node-1-1',
      step: 1,
      type: 'SHRINE',
      name: 'Celestial Obelisk',
      description: 'An ancient runic shrine radiating restorative celestial energy.',
      isCompleted: false,
      isCurrent: false,
      isAvailable: false,
      nextIds: ['node-2-0', 'node-2-1'],
    },

    // Step 2: Elite / Campfire
    'node-2-0': {
      id: 'node-2-0',
      step: 2,
      type: 'ELITE',
      name: 'Crypt Guard Sanctum',
      description: 'A heavily armored undead skeleton guard wielding relic shields.',
      isCompleted: false,
      isCurrent: false,
      isAvailable: false,
      nextIds: ['node-3-0', 'node-3-1'],
      enemyTypes: ['Undead Guard'],
    },
    'node-2-1': {
      id: 'node-2-1',
      step: 2,
      type: 'CAMPFIRE',
      name: 'Sheltered Alcove',
      description: 'A warm sheltered hearth to tend wounds and sharpen blades.',
      isCompleted: false,
      isCurrent: false,
      isAvailable: false,
      nextIds: ['node-3-0', 'node-3-1'],
    },

    // Step 3: Pre-Boss Preparation
    'node-3-0': {
      id: 'node-3-0',
      step: 3,
      type: 'ELITE',
      name: 'Inner Sanctum Cultist',
      description: 'A shadowy evoker channeling cataclysmic void magic.',
      isCompleted: false,
      isCurrent: false,
      isAvailable: false,
      nextIds: ['node-4-boss'],
      enemyTypes: ['Dark Mage'],
    },
    'node-3-1': {
      id: 'node-3-1',
      step: 3,
      type: 'CAMPFIRE',
      name: 'Pre-Boss Hearth',
      description: 'The final bastion of safety before entering the Boss Throne.',
      isCompleted: false,
      isCurrent: false,
      isAvailable: false,
      nextIds: ['node-4-boss'],
    },

    // Step 4: Boss Climax
    'node-4-boss': {
      id: 'node-4-boss',
      step: 4,
      type: 'BOSS',
      name: `Throne of ${bossName}`,
      description: `The grand sanctum chamber where ${bossName} awaits your challenge.`,
      isCompleted: false,
      isCurrent: false,
      isAvailable: false,
      nextIds: [],
      bossId,
    },
  };

  return {
    floorNumber,
    name: floorTitle,
    nodes,
    startNodeIds: ['node-0-0', 'node-0-1'],
    bossNodeId: 'node-4-boss',
  };
}

export function createInitialDungeonState(rng: IRandomNumberGenerator): DungeonState {
  const floor = generateDungeonFloor(1, rng);
  return {
    currentFloor: 1,
    currentNodeId: null,
    floor,
    isRunCompleted: false,
  };
}

export function advanceToNextDungeonFloor(
  dungeon: DungeonState,
  rng: IRandomNumberGenerator
): DungeonState {
  const nextFloorNumber = dungeon.currentFloor + 1;
  const newFloor = generateDungeonFloor(nextFloorNumber, rng);

  return {
    currentFloor: nextFloorNumber,
    currentNodeId: null,
    floor: newFloor,
    isRunCompleted: false,
  };
}

/**
 * Advances the dungeon state to a chosen available node.
 */
export function selectDungeonNode(
  dungeon: DungeonState,
  nodeId: string
): DungeonState {
  const node = dungeon.floor.nodes[nodeId];
  if (!node || !node.isAvailable) return dungeon;

  const nextNodes: Record<string, DungeonNode> = {};
  for (const [id, n] of Object.entries(dungeon.floor.nodes)) {
    nextNodes[id] = { ...n, isCurrent: id === nodeId };
  }

  return {
    ...dungeon,
    currentNodeId: nodeId,
    floor: {
      ...dungeon.floor,
      nodes: nextNodes,
    },
  };
}

/**
 * Completes the active node and unlocks the next branching step nodes.
 */
export function completeDungeonNode(
  dungeon: DungeonState,
  nodeId: string
): DungeonState {
  const current = dungeon.floor.nodes[nodeId];
  if (!current) return dungeon;

  const nextNodes: Record<string, DungeonNode> = {};
  for (const [id, n] of Object.entries(dungeon.floor.nodes)) {
    nextNodes[id] = { ...n };
  }

  // Mark current as completed
  nextNodes[nodeId] = {
    ...current,
    isCompleted: true,
    isAvailable: false,
  };

  // Lock all other nodes at the same step
  for (const [id, n] of Object.entries(nextNodes)) {
    if (n.step === current.step && id !== nodeId) {
      nextNodes[id] = { ...n, isAvailable: false };
    }
  }

  // Unlock all child nodes linked in nextIds
  current.nextIds.forEach((childId) => {
    if (nextNodes[childId]) {
      nextNodes[childId] = {
        ...nextNodes[childId],
        isAvailable: true,
      };
    }
  });

  const isBossCompleted = current.type === 'BOSS';

  return {
    ...dungeon,
    floor: {
      ...dungeon.floor,
      nodes: nextNodes,
    },
    isRunCompleted: isBossCompleted,
  };
}
