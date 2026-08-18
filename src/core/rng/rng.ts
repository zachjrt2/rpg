/**
 * Seedable Pseudo-Random Number Generator Interface and Mulberry32 implementation.
 * Ensures 100% deterministic combat calculations, loot generation, and unit testing.
 */

export interface IRandomNumberGenerator {
  /**
   * Returns a pseudo-random float between 0 (inclusive) and 1 (exclusive).
   */
  next(): number;

  /**
   * Returns a pseudo-random integer between min (inclusive) and max (inclusive).
   */
  nextInt(min: number, max: number): number;

  /**
   * Returns a pseudo-random float between min (inclusive) and max (inclusive).
   */
  nextFloat(min: number, max: number): number;

  /**
   * Rolls a probability check against a given chance (0 to 1).
   * Returns true if roll succeeds.
   */
  rollChance(chance: number): boolean;

  /**
   * Picks a random element from an array.
   */
  pickOne<T>(items: readonly T[]): T;

  /**
   * Returns the current internal seed/state value.
   */
  getSeed(): number;

  /**
   * Clones the RNG with current internal state for speculative branch calculation.
   */
  clone(): IRandomNumberGenerator;
}

export class Mulberry32RNG implements IRandomNumberGenerator {
  private state: number;
  private readonly initialSeed: number;

  constructor(seed: number = Date.now()) {
    this.initialSeed = seed >>> 0;
    this.state = this.initialSeed;
  }

  public next(): number {
    let t = (this.state += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  public nextInt(min: number, max: number): number {
    if (min > max) [min, max] = [max, min];
    return Math.floor(this.next() * (max - min + 1)) + min;
  }

  public nextFloat(min: number, max: number): number {
    if (min > max) [min, max] = [max, min];
    return this.next() * (max - min) + min;
  }

  public rollChance(chance: number): boolean {
    if (chance <= 0) return false;
    if (chance >= 1) return true;
    return this.next() < chance;
  }

  public pickOne<T>(items: readonly T[]): T {
    if (items.length === 0) {
      throw new Error('Cannot pick from an empty array');
    }
    const index = this.nextInt(0, items.length - 1);
    return items[index];
  }

  public getSeed(): number {
    return this.state;
  }

  public getInitialSeed(): number {
    return this.initialSeed;
  }

  public clone(): Mulberry32RNG {
    const copy = new Mulberry32RNG(this.initialSeed);
    copy.state = this.state;
    return copy;
  }
}

/**
 * Default global RNG instance for non-isolated operations.
 */
export const defaultRNG = new Mulberry32RNG(1337);
