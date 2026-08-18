import type { Combatant } from '../types/combat.ts';
import type { ProgressionState } from '../types/progression.ts';
import type { InventoryState } from '../types/inventory.ts';
import type { DungeonState } from '../types/dungeon.ts';
import type { MetaProgressionState } from '../types/meta.ts';
import { createInitialMetaProgression } from '../meta/meta-manager.ts';

import type { Item } from '../types/items.ts';

export const CURRENT_SAVE_VERSION = 3;
const STORAGE_KEY = 'aethelgard_rpg_save_v3';
const META_STORAGE_KEY = 'aethelgard_rpg_meta_v1';

export interface GameSaveData {
  version: number;
  timestamp: number;
  saveName: string;
  hero: Combatant;
  progression: ProgressionState;
  gold: number;
  potions?: Item[];
  inventory?: InventoryState;
  dungeon: DungeonState;
  battlesWon: number;
  battlesLost: number;
  metaProgression?: MetaProgressionState;
}

// In-memory fallback for environments without LocalStorage
const memoryStorage: Record<string, string> = {};

function getStorageItem(key: string): string | null {
  try {
    if (typeof window !== 'undefined' && window.localStorage && typeof window.localStorage.getItem === 'function') {
      return window.localStorage.getItem(key);
    }
  } catch {
    // ignore
  }
  return memoryStorage[key] || null;
}

function setStorageItem(key: string, value: string): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage && typeof window.localStorage.setItem === 'function') {
      window.localStorage.setItem(key, value);
      return;
    }
  } catch {
    // ignore
  }
  memoryStorage[key] = value;
}

function removeStorageItem(key: string): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage && typeof window.localStorage.removeItem === 'function') {
      window.localStorage.removeItem(key);
      return;
    }
  } catch {
    // ignore
  }
  delete memoryStorage[key];
}

export function hasSave(): boolean {
  return getStorageItem(STORAGE_KEY) !== null;
}

export function saveGame(data: GameSaveData): boolean {
  try {
    const payload = JSON.stringify(data);
    setStorageItem(STORAGE_KEY, payload);
    return true;
  } catch (error) {
    console.error('Failed to save game', error);
    return false;
  }
}

export function loadGame(): GameSaveData | null {
  try {
    const raw = getStorageItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed: GameSaveData = JSON.parse(raw);
    return parsed;
  } catch (error) {
    console.error('Failed to load game', error);
    return null;
  }
}

export function deleteSave(): boolean {
  try {
    removeStorageItem(STORAGE_KEY);
    return true;
  } catch {
    return false;
  }
}

/**
 * Persists persistent account-wide meta progression (Aetherium, Unlocked Classes, Upgrades)
 */
export function saveMetaProgression(metaState: MetaProgressionState): boolean {
  try {
    const payload = JSON.stringify(metaState);
    setStorageItem(META_STORAGE_KEY, payload);
    return true;
  } catch (error) {
    console.error('Failed to save meta progression', error);
    return false;
  }
}

/**
 * Loads persistent account-wide meta progression
 */
export function loadMetaProgression(): MetaProgressionState {
  try {
    const initial = createInitialMetaProgression();
    const raw = getStorageItem(META_STORAGE_KEY);
    if (!raw) return initial;

    const parsed: MetaProgressionState = JSON.parse(raw);
    const mergedClasses = Array.from(new Set([...(initial.unlockedClasses || []), ...(parsed.unlockedClasses || [])]));
    const mergedCardIds = Array.from(new Set([...(initial.unlockedCardIds || []), ...(parsed.unlockedCardIds || [])]));
    const mergedEquipmentIds = Array.from(new Set([...(initial.unlockedEquipmentIds || []), ...(parsed.unlockedEquipmentIds || [])]));
    const mergedRelicIds = Array.from(new Set([...(initial.unlockedRelicIds || []), ...(parsed.unlockedRelicIds || [])]));

    return {
      ...initial,
      ...parsed,
      unlockedClasses: mergedClasses,
      unlockedCardIds: mergedCardIds,
      unlockedEquipmentIds: mergedEquipmentIds,
      unlockedRelicIds: mergedRelicIds,
      upgradeRanks: {
        ...initial.upgradeRanks,
        ...(parsed.upgradeRanks || {}),
      },
    };
  } catch (error) {
    console.error('Failed to load meta progression', error);
    return createInitialMetaProgression();
  }
}

/**
 * Resets all run data and account meta progression
 */
export function resetAllData(): boolean {
  try {
    removeStorageItem(STORAGE_KEY);
    removeStorageItem(META_STORAGE_KEY);
    return true;
  } catch {
    return false;
  }
}
