import { describe, it, expect } from 'vitest';
import { DUNGEON_EVENTS } from '../core/data/events.ts';

describe('Dungeon Events System', () => {
  it('should have properly structured narrative events with valid choices and rewards', () => {
    expect(DUNGEON_EVENTS.length).toBeGreaterThanOrEqual(3);

    DUNGEON_EVENTS.forEach((event) => {
      expect(event.title).toBeDefined();
      expect(event.story).toBeDefined();
      expect(event.choices.length).toBeGreaterThanOrEqual(2);
      event.choices.forEach((choice) => {
        expect(choice.label).toBeDefined();
        expect(choice.reward).toBeDefined();
      });
    });
  });
});
