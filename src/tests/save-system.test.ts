import { describe, it, expect, beforeEach } from 'vitest';
import { saveGame, loadGame, deleteSave, hasSave, type GameSaveData } from '../core/storage/save-system.ts';
import { createWarriorHero } from '../core/data/characters.ts';
import { createInitialProgression } from '../core/progression/progression-manager.ts';
import { createInitialInventory } from '../core/inventory/inventory-manager.ts';
import { createInitialDungeonState } from '../core/dungeon/dungeon-generator.ts';
import { Mulberry32RNG } from '../core/rng/rng.ts';

describe('Game Save, Load, and Reset System', () => {
  beforeEach(() => {
    deleteSave();
  });

  it('saves and reloads full game state payload', () => {
    const rng = new Mulberry32RNG(1);
    const hero = createWarriorHero();
    const progression = createInitialProgression();
    const inventory = createInitialInventory();
    const dungeon = createInitialDungeonState(rng);

    const saveData: GameSaveData = {
      version: 2,
      timestamp: Date.now(),
      saveName: 'Alden Save',
      hero,
      progression,
      gold: inventory.gold,
      inventory,
      dungeon,
      battlesWon: 5,
      battlesLost: 0,
    };

    const saved = saveGame(saveData);
    expect(saved).toBe(true);

    const loaded = loadGame();
    expect(loaded).not.toBeNull();
    expect(loaded?.hero.name).toBe('Sir Alden');
    expect(loaded?.battlesWon).toBe(5);
    expect(loaded?.dungeon.currentFloor).toBe(1);
  });

  it('wipes and resets all saved progress when deleteSave is executed', () => {
    const rng = new Mulberry32RNG(42);
    const hero = createWarriorHero();
    const progression = createInitialProgression();
    const inventory = createInitialInventory();
    const dungeon = createInitialDungeonState(rng);

    saveGame({
      version: 2,
      timestamp: Date.now(),
      saveName: 'Reset Candidate',
      hero,
      progression,
      gold: inventory.gold,
      inventory,
      dungeon,
      battlesWon: 10,
      battlesLost: 2,
    });

    expect(hasSave()).toBe(true);
    expect(loadGame()).not.toBeNull();

    // Reset progress
    const deleted = deleteSave();
    expect(deleted).toBe(true);
    expect(hasSave()).toBe(false);
    expect(loadGame()).toBeNull();
  });
});
