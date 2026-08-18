import { describe, it, expect } from 'vitest';
import { upgradeCombatCard } from '../core/combat/card-upgrader.ts';
import { CARDS_CATALOG } from '../core/data/cards.ts';

describe('Card Upgrader System', () => {
  it('should enhance an attack card with higher damage and + in name', () => {
    const strike = CARDS_CATALOG['strike'];
    const upgraded = upgradeCombatCard(strike);

    expect(upgraded.isUpgraded).toBe(true);
    expect(upgraded.name).toContain('+');
    expect(upgraded.damage).toBeGreaterThan(strike.damage!);
  });

  it('should enhance a block skill card with higher block shield', () => {
    const defend = CARDS_CATALOG['defend'];
    const upgraded = upgradeCombatCard(defend);

    expect(upgraded.isUpgraded).toBe(true);
    expect(upgraded.name).toContain('+');
    expect(upgraded.block).toBeGreaterThan(defend.block!);
  });

  it('should enhance status effects potency and duration on upgrade', () => {
    const powerCleave = CARDS_CATALOG['power-cleave'];
    const upgraded = upgradeCombatCard(powerCleave);

    expect(upgraded.isUpgraded).toBe(true);
    expect(upgraded.damage).toBeGreaterThan(powerCleave.damage!);
    expect(upgraded.statusEffects![0].potency).toBeGreaterThan(powerCleave.statusEffects![0].potency!);
  });

  it('should not double-upgrade an already upgraded card', () => {
    const strike = CARDS_CATALOG['strike'];
    const upgradedOnce = upgradeCombatCard(strike);
    const upgradedTwice = upgradeCombatCard(upgradedOnce);

    expect(upgradedTwice.name).toBe(upgradedOnce.name);
    expect(upgradedTwice.damage).toBe(upgradedOnce.damage);
  });
});
