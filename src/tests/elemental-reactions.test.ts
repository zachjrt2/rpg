import { describe, it, expect } from 'vitest';
import { checkElementalReaction } from '../core/combat/elemental-reactions.ts';
import { createDarkMage } from '../core/data/enemies.ts';

describe('Elemental Reaction System', () => {
  it('triggers Thermal Shock when a Frozen target is struck by Fire magic', () => {
    const enemy = createDarkMage();
    enemy.statusEffects = [
      {
        id: 'freeze-1',
        type: 'FROZEN',
        name: 'Frost Nova',
        duration: 1,
        remainingTurns: 1,
        potency: 1,
      },
    ];

    const result = checkElementalReaction(enemy, 'FIRE', 30);
    expect(result.hasReaction).toBe(true);
    expect(result.reactionName).toBe('THERMAL_SHOCK');
    expect(result.bonusDamage).toBeGreaterThan(30);
  });

  it('triggers Venom Combustion when a Poisoned target is struck by Fire', () => {
    const enemy = createDarkMage();
    enemy.statusEffects = [
      {
        id: 'poison-1',
        type: 'POISON',
        name: 'Poison',
        duration: 3,
        remainingTurns: 3,
        potency: 20,
      },
    ];

    const result = checkElementalReaction(enemy, 'FIRE', 25);
    expect(result.hasReaction).toBe(true);
    expect(result.reactionName).toBe('VENOM_COMBUSTION');
    expect(result.bonusDamage).toBe(50); // 20 * 2.5
  });

  it('triggers Guard Break when a Stunned target is struck by Physical strike', () => {
    const enemy = createDarkMage();
    enemy.statusEffects = [
      {
        id: 'stun-1',
        type: 'STUNNED',
        name: 'Stunned',
        duration: 1,
        remainingTurns: 1,
        potency: 1,
      },
    ];

    const result = checkElementalReaction(enemy, 'PHYSICAL', 20);
    expect(result.hasReaction).toBe(true);
    expect(result.reactionName).toBe('GUARD_BREAK');
  });
});
