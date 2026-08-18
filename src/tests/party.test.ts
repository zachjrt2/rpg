import { describe, it, expect } from 'vitest';
import {
  createInitialParty,
  recruitMercenary,
  toggleMemberPosition,
  distributeExpToParty,
} from '../core/party/party-manager.ts';

describe('Multi-Hero Party Manager', () => {
  it('creates an initial 3-champion squad with frontline and backline positions', () => {
    const party = createInitialParty('WARRIOR');
    expect(party.activeMembers.length).toBe(3);
    expect(party.activeMembers[0].position).toBe('FRONTLINE');
    expect(party.activeMembers[1].position).toBe('BACKLINE');
    expect(party.activeMembers[2].position).toBe('BACKLINE');
  });

  it('toggles a member formation position between FRONTLINE and BACKLINE', () => {
    const party = createInitialParty('WARRIOR');
    const heroId = party.activeMembers[0].hero.id;

    const toggled = toggleMemberPosition(party, heroId);
    expect(toggled.activeMembers[0].position).toBe('BACKLINE');
  });

  it('recruits new mercenary to reserve when active party is full', () => {
    const party = createInitialParty('WARRIOR');
    const updated = recruitMercenary(party, 'RANGER', 'Robin the Scout');

    expect(updated.activeMembers.length).toBe(3);
    expect(updated.reserveMembers.length).toBe(1);
    expect(updated.reserveMembers[0].hero.name).toBe('Robin the Scout');
  });

  it('distributes EXP to all active party members, leveling them up', () => {
    const party = createInitialParty('WARRIOR');
    const result = distributeExpToParty(party, 150);

    expect(result.leveledUpMembers.length).toBe(3);
    expect(result.party.activeMembers[0].hero.level).toBe(2);
    expect(result.party.activeMembers[1].hero.level).toBe(2);
  });
});
