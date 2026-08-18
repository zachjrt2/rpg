import { describe, it, expect } from 'vitest';
import { Mulberry32RNG } from '../core/rng/rng.ts';

describe('Mulberry32 Seedable RNG', () => {
  it('produces identical sequences for identical seeds', () => {
    const rng1 = new Mulberry32RNG(42);
    const rng2 = new Mulberry32RNG(42);

    const seq1 = [rng1.next(), rng1.nextInt(1, 100), rng1.rollChance(0.5)];
    const seq2 = [rng2.next(), rng2.nextInt(1, 100), rng2.rollChance(0.5)];

    expect(seq1).toEqual(seq2);
  });

  it('produces numbers strictly within bounds', () => {
    const rng = new Mulberry32RNG(999);

    for (let i = 0; i < 500; i++) {
      const intVal = rng.nextInt(5, 15);
      expect(intVal).toBeGreaterThanOrEqual(5);
      expect(intVal).toBeLessThanOrEqual(15);
      expect(Number.isInteger(intVal)).toBe(true);

      const floatVal = rng.nextFloat(2.5, 4.5);
      expect(floatVal).toBeGreaterThanOrEqual(2.5);
      expect(floatVal).toBeLessThanOrEqual(4.5);
    }
  });

  it('picks random elements from array correctly', () => {
    const rng = new Mulberry32RNG(1234);
    const items = ['sword', 'shield', 'potion', 'staff'] as const;
    const picked = rng.pickOne(items);
    expect(items).toContain(picked);
  });
});
