import { describe, it, expect } from 'vitest';
import {
  generateDungeonFloor,
  createInitialDungeonState,
  selectDungeonNode,
  completeDungeonNode,
} from '../core/dungeon/dungeon-generator.ts';
import { Mulberry32RNG } from '../core/rng/rng.ts';

describe('Dungeon Floor Generator', () => {
  it('generates a 5-step dungeon floor ending in a boss chamber', () => {
    const rng = new Mulberry32RNG(42);
    const floor = generateDungeonFloor(1, rng);

    expect(floor.floorNumber).toBe(1);
    expect(floor.startNodeIds.length).toBe(2);
    expect(floor.bossNodeId).toBe('node-4-boss');
    expect(floor.nodes['node-4-boss'].type).toBe('BOSS');
  });

  it('completing a node unlocks downstream paths and locks peer nodes', () => {
    const rng = new Mulberry32RNG(42);
    const initial = createInitialDungeonState(rng);

    // Select start node
    const selected = selectDungeonNode(initial, 'node-0-0');
    expect(selected.currentNodeId).toBe('node-0-0');

    // Complete start node
    const completed = completeDungeonNode(selected, 'node-0-0');
    expect(completed.floor.nodes['node-0-0'].isCompleted).toBe(true);
    expect(completed.floor.nodes['node-0-1'].isAvailable).toBe(false); // Peer locked
    expect(completed.floor.nodes['node-1-0'].isAvailable).toBe(true);  // Child unlocked
    expect(completed.floor.nodes['node-1-1'].isAvailable).toBe(true);  // Child unlocked
  });
});
