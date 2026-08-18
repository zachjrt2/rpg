import type { CharacterClassId } from '../types/classes.ts';
import type { PartyState, PartyMember, PartyPosition } from '../types/party.ts';
import { createHeroFromClass } from '../data/characters.ts';
import { createInitialProgression, addExpToHero } from '../progression/progression-manager.ts';
import { createInitialInventory, calculateHeroStatsWithEquipment } from '../inventory/inventory-manager.ts';

export function createInitialParty(leaderClassId: CharacterClassId = 'WARRIOR'): PartyState {
  const initialInv = createInitialInventory();

  // 1. Leader
  const leaderHero = createHeroFromClass(leaderClassId, 'Sir Alden', 'hero-1');
  const leaderEquipped = calculateHeroStatsWithEquipment(leaderHero, initialInv.equipment);

  // 2. Mage Companion
  const mageHero = createHeroFromClass('MAGE', 'Elena the Pyromancer', 'hero-2');

  // 3. Cleric Companion
  const clericHero = createHeroFromClass('CLERIC', 'Brother Thaddeus', 'hero-3');

  const activeMembers: PartyMember[] = [
    {
      hero: leaderEquipped,
      position: 'FRONTLINE',
      progression: createInitialProgression(),
      equipment: initialInv.equipment,
    },
    {
      hero: mageHero,
      position: 'BACKLINE',
      progression: createInitialProgression(),
      equipment: {},
    },
    {
      hero: clericHero,
      position: 'BACKLINE',
      progression: createInitialProgression(),
      equipment: {},
    },
  ];

  return {
    activeMembers,
    reserveMembers: [],
    maxActiveSize: 3,
  };
}

export function recruitMercenary(
  party: PartyState,
  classId: CharacterClassId,
  name: string
): PartyState {
  const id = `merc-${Date.now()}`;
  const rawHero = createHeroFromClass(classId, name, id);
  const position: PartyPosition = classId === 'WARRIOR' || classId === 'ROGUE' ? 'FRONTLINE' : 'BACKLINE';

  const newMember: PartyMember = {
    hero: rawHero,
    position,
    progression: createInitialProgression(),
    equipment: {},
  };

  if (party.activeMembers.length < party.maxActiveSize) {
    return {
      ...party,
      activeMembers: [...party.activeMembers, newMember],
    };
  }

  return {
    ...party,
    reserveMembers: [...party.reserveMembers, newMember],
  };
}

export function toggleMemberPosition(party: PartyState, heroId: string): PartyState {
  const nextActive = party.activeMembers.map((member) => {
    if (member.hero.id === heroId) {
      const nextPos: PartyPosition = member.position === 'FRONTLINE' ? 'BACKLINE' : 'FRONTLINE';
      return { ...member, position: nextPos };
    }
    return member;
  });

  return {
    ...party,
    activeMembers: nextActive,
  };
}

export function distributeExpToParty(
  party: PartyState,
  expGained: number
): { party: PartyState; leveledUpMembers: PartyMember[] } {
  const leveledUpMembers: PartyMember[] = [];

  const nextActive = party.activeMembers.map((member) => {
    const result = addExpToHero(member.hero, member.progression, expGained);
    const updatedMember: PartyMember = {
      ...member,
      hero: result.hero,
      progression: result.progression,
    };

    if (result.leveledUp) {
      leveledUpMembers.push(updatedMember);
    }

    return updatedMember;
  });

  return {
    party: {
      ...party,
      activeMembers: nextActive,
    },
    leveledUpMembers,
  };
}
