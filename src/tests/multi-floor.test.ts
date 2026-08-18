import { describe, it, expect } from 'vitest';
import {
  createInitialDungeonState,
  advanceToNextDungeonFloor,
  completeDungeonNode,
} from '../core/dungeon/dungeon-generator.ts';
import { Mulberry32RNG } from '../core/rng/rng.ts';

describe('Multi-Floor Dungeon Progression', () => {
  it('advances from Floor 1 to Floor 2, generating a fresh floor layout', () => {
    const rng = new Mulberry32RNG(99);
    const floor1 = createInitialDungeonState(rng);
    expect(floor1.currentFloor).toBe(1);
    expect(floor1.floor.name).toContain('Floor 1');

    const floor2 = advanceToNextDungeonFloor(floor1, rng);
    expect(floor2.currentFloor).toBe(2);
    expect(floor2.floor.name).toContain('Floor 2');
    expect(floor2.floor.name).toContain('The Abyssal Catacombs');
  });

  it('marks run as completed when boss node is cleared', () => {
    const rng = new Mulberry32RNG(99);
    const dungeon = createInitialDungeonState(rng);

    const completed = completeDungeonNode(dungeon, 'node-4-boss');
    expect(completed.isRunCompleted).toBe(true);
  });
});
