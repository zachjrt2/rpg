import type { DungeonEventDefinition } from '../types/events.ts';

export const DUNGEON_EVENTS: DungeonEventDefinition[] = [
  {
    id: 'crypt-sarcophagus',
    title: 'The Gilded Sarcophagus',
    story: 'You stumble upon a sealed marble tomb wrapped in heavy runic chains. Faint magical whispers resonate from within the stone seams.',
    avatarIcon: '🏺',
    choices: [
      {
        id: 'pry-open',
        label: 'Pry open the stone lid',
        description: 'Take a chance to excavate the ancient artifact sealed within.',
        reward: {
          relicId: 'aegis-sunken-king',
        },
        risk: {
          chance: 0.35,
          failureMessage: 'A cursed toxic gas trap triggers! The party suffers 25 Poison damage.',
          damageAmount: 25,
        },
      },
      {
        id: 'leave-peaceful',
        label: 'Pay tribute and leave undisturbed',
        description: 'Salvage gold coins left at the tomb base without disturbing the dead.',
        reward: {
          gold: 40,
        },
      },
    ],
  },
  {
    id: 'altar-blood-moon',
    title: 'Altar of the Blood Moon',
    story: 'A crimson obsidian monolith pulses with raw demonic leylines. Dark whispers promise unholy strength in exchange for a vital tithe.',
    avatarIcon: '🩸',
    choices: [
      {
        id: 'sacrifice-blood',
        label: 'Sacrifice party blood tithe (-25% HP)',
        description: 'Tithe your life essence to gain the Vampire Bloodstone relic.',
        cost: {
          hpPercent: 25,
        },
        reward: {
          relicId: 'vampire-bloodstone',
        },
      },
      {
        id: 'pray-light',
        label: 'Recite defensive benediction',
        description: 'Cleanse the dark altar with sacred prayers to recover full Mana.',
        reward: {
          manaPercent: 100,
        },
      },
    ],
  },
  {
    id: 'wandering-tinkerer',
    title: 'The Goblin Alchemist Caravan',
    story: 'A friendly nomadic merchant tinkerer sets up shop beside a glowing brazier, eager to trade rare curiosities.',
    avatarIcon: '🧪',
    choices: [
      {
        id: 'buy-die',
        label: 'Purchase Loaded Lucky Die (60 Gold)',
        description: 'Pay 60 gold for the Trickster Loaded Die relic (+15 Luck).',
        cost: {
          gold: 60,
        },
        reward: {
          relicId: 'trickster-die',
        },
      },
      {
        id: 'share-bread',
        label: 'Share hearty travel rations',
        description: 'Rest by the merchant brazier and restore 40% party HP.',
        reward: {
          hpPercent: 40,
        },
      },
    ],
  },
];
