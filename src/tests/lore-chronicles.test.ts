import { describe, it, expect } from 'vitest';
import {
  LORE_CHRONICLES,
  getUnlockedLoreFragments,
  getNextLoreMilestone,
} from '../core/data/lore.ts';

describe('Aetherbound Lore Chronicles & Void Loop', () => {
  it('unlocks Chapter 1 by default at 0 lifetime soul shards', () => {
    expect(LORE_CHRONICLES.length).toBe(8);
    const unlocked = getUnlockedLoreFragments(0);
    expect(unlocked.length).toBe(1);
    expect(unlocked[0].id).toBe('chapter-1');
    expect(unlocked[0].title).toBe('The Recursion Paradox');
  });

  it('unlocks progressive chapters at specified lifetime soul shard thresholds', () => {
    // 50 Shards: Chapter 1 & 2
    expect(getUnlockedLoreFragments(50).length).toBe(2);

    // 150 Shards: Chapters 1, 2, 3
    expect(getUnlockedLoreFragments(150).length).toBe(3);

    // 1500 Shards: Chapters 1 through 6
    expect(getUnlockedLoreFragments(1500).length).toBe(6);

    // 5000+ Shards: All 8 Chapters Unlocked
    const all = getUnlockedLoreFragments(5000);
    expect(all.length).toBe(8);
    expect(all[7].title).toBe('Shattering the Horizon');
  });

  it('calculates next milestone and progress percentage toward unlocking next fragment', () => {
    // At 25 shards (between 0 and 50): next target is 50, progress is 50%
    const m1 = getNextLoreMilestone(25);
    expect(m1.nextTarget).toBe(50);
    expect(m1.fragment?.chapter).toBe(2);
    expect(m1.progressPercent).toBe(50);

    // At 5000 shards: all chapters unlocked
    const mMax = getNextLoreMilestone(6000);
    expect(mMax.fragment).toBe(null);
    expect(mMax.progressPercent).toBe(100);
  });
});
