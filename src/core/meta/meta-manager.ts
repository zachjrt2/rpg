import type {
  MetaProgressionState,
  MetaUpgradeId,
  MetaUpgradeDefinition,
  UnlockableRelicDefinition,
  UnlockableEquipmentDefinition,
} from '../types/meta.ts';
import type { CharacterClassId } from '../types/classes.ts';
import type { Combatant } from '../types/combat.ts';

export const META_UPGRADES: Record<MetaUpgradeId, MetaUpgradeDefinition> = {
  attunement: {
    id: 'attunement',
    name: 'Astral Attunement',
    description: '+1 Extra Attribute Point to freely allocate during Character Creation per rank.',
    iconName: 'Sparkles',
    maxRank: 50,
    baseCost: 15,
    costMultiplier: 1.15,
    bonusPerRank: { startingStatPoints: 1 },
  },
  might: {
    id: 'might',
    name: 'Astral Might',
    description: '+2 Permanent Strength per rank across all runs (boosts Physical cards & Block scaling).',
    iconName: 'Flame',
    maxRank: 15,
    baseCost: 25,
    costMultiplier: 1.28,
    bonusPerRank: { strength: 2 },
  },
  agility: {
    id: 'agility',
    name: 'Astral Agility',
    description: '+2 Permanent Dexterity per rank across all runs (boosts Speed, Evasion, and Physical cards).',
    iconName: 'Zap',
    maxRank: 15,
    baseCost: 25,
    costMultiplier: 1.28,
    bonusPerRank: { dexterity: 2 },
  },
  mind: {
    id: 'mind',
    name: 'Astral Intellect',
    description: '+2 Permanent Intelligence per rank across all runs (boosts Magic spells & Heal scaling).',
    iconName: 'BookOpen',
    maxRank: 15,
    baseCost: 25,
    costMultiplier: 1.28,
    bonusPerRank: { intelligence: 2 },
  },
  vitality: {
    id: 'vitality',
    name: 'Astral Endurance',
    description: '+2 Permanent Vitality per rank across all runs (greatly boosts Block cards & Max HP).',
    iconName: 'Heart',
    maxRank: 15,
    baseCost: 25,
    costMultiplier: 1.28,
    bonusPerRank: { vitality: 2 },
  },
  willpower: {
    id: 'willpower',
    name: 'Astral Willpower',
    description: '+2 Permanent Willpower per rank across all runs (boosts Holy healing & Magic card scaling).',
    iconName: 'Sun',
    maxRank: 15,
    baseCost: 25,
    costMultiplier: 1.28,
    bonusPerRank: { willpower: 2 },
  },
  vigor: {
    id: 'vigor',
    name: 'Astral Vigor',
    description: '+15 Maximum Health per rank permanently across all runs.',
    iconName: 'Heart',
    maxRank: 15,
    baseCost: 25,
    costMultiplier: 1.28,
    bonusPerRank: { maxHp: 15 },
  },
  bastion: {
    id: 'bastion',
    name: 'Astral Bastion',
    description: '+6 Starting Combat Shield / Aegis barrier per rank at the start of every battle.',
    iconName: 'Shield',
    maxRank: 15,
    baseCost: 25,
    costMultiplier: 1.28,
    bonusPerRank: { startingShield: 6 },
  },
  prowess: {
    id: 'prowess',
    name: 'Martial Prowess',
    description: '+3 Physical & Magic Attack power per rank (directly amplifies all card damage).',
    iconName: 'Swords',
    maxRank: 15,
    baseCost: 35,
    costMultiplier: 1.30,
    bonusPerRank: { baseAttack: 3 },
  },
  gold: {
    id: 'gold',
    name: "Merchant's Inheritance",
    description: '+35 Starting Gold per rank when starting a new run.',
    iconName: 'Coins',
    maxRank: 15,
    baseCost: 20,
    costMultiplier: 1.25,
    bonusPerRank: { startingGold: 35 },
  },
  fortune: {
    id: 'fortune',
    name: 'Astral Fortune',
    description: '+2 Luck attribute per rank (improves Critical Chance and loot rarity).',
    iconName: 'Sparkles',
    maxRank: 15,
    baseCost: 30,
    costMultiplier: 1.28,
    bonusPerRank: { luck: 2 },
  },
  capacity: {
    id: 'capacity',
    name: 'Alchemist Satchel',
    description: '+1 extra starting Healing Potion on each run per rank.',
    iconName: 'FlaskConical',
    maxRank: 15,
    baseCost: 40,
    costMultiplier: 1.32,
    bonusPerRank: { potionCapacity: 1 },
  },
  transcendence: {
    id: 'transcendence',
    name: 'Astral Transcendence',
    description: '+1 Extra card drawn on Turn 1 of combat per rank.',
    iconName: 'Layers',
    maxRank: 10,
    baseCost: 50,
    costMultiplier: 1.38,
    bonusPerRank: { cardDraw: 1 },
  },
  wellspring: {
    id: 'wellspring',
    name: 'Aetheric Wellspring',
    description: '+1 Starting Bonus Energy on Turn 1 of combat per rank.',
    iconName: 'Zap',
    maxRank: 5,
    baseCost: 75,
    costMultiplier: 1.55,
    bonusPerRank: { startingEnergy: 1 },
  },
  celestial_core: {
    id: 'celestial_core',
    name: 'Astral Energy Core',
    description: 'Permanently increases your Max Energy cap across all turns (Rank 1: 3 -> 4 Energy, Rank 2: 4 -> 5 Energy).',
    iconName: 'Sparkles',
    maxRank: 2,
    baseCost: 4000,
    costMultiplier: 3.75,
    customCosts: [4000, 15000],
    bonusPerRank: { maxEnergy: 1 },
  },
  reroll: {
    id: 'reroll',
    name: 'Fated Vision',
    description: '+1 Free Card Draft Reroll per battle reward screen per rank.',
    iconName: 'Sparkles',
    maxRank: 15,
    baseCost: 35,
    costMultiplier: 1.28,
    bonusPerRank: { draftRerolls: 1 },
  },
  reaping: {
    id: 'reaping',
    name: 'Soul Harvester',
    description: '+25% Extra Soul Shards / Aetherium dropped by slain monsters per rank.',
    iconName: 'Coins',
    maxRank: 15,
    baseCost: 30,
    costMultiplier: 1.28,
    bonusPerRank: { shardMultiplier: 0.25 },
  },
  crit: {
    id: 'crit',
    name: 'Deadly Precision',
    description: '+4% Critical Strike Chance across all attack and spell cards per rank.',
    iconName: 'Swords',
    maxRank: 15,
    baseCost: 35,
    costMultiplier: 1.28,
    bonusPerRank: { critChance: 0.04 },
  },
  relic_slots: {
    id: 'relic_slots',
    name: 'Relic Attunement Pouch',
    description: '+1 Starting Relic Loadout Slot during Character Creation per rank (Base 1, up to 10 starting relics).',
    iconName: 'Sparkles',
    maxRank: 9,
    baseCost: 45,
    costMultiplier: 1.45,
    bonusPerRank: { relicSlots: 1 },
  },
  card_mastery: {
    id: 'card_mastery',
    name: 'Astral Deck Mastery',
    description: '+1 Starting Signature Ability Card choice during Character Creation per rank (Base 2, up to 6 cards).',
    iconName: 'Layers',
    maxRank: 4,
    baseCost: 40,
    costMultiplier: 1.50,
    bonusPerRank: { starterCards: 1 },
  },
  phoenix: {
    id: 'phoenix',
    name: 'Phoenix Aegis',
    description: 'Cheat death and revive with 35% Max HP upon taking a fatal blow (1 revive charge per run per rank).',
    iconName: 'Flame',
    maxRank: 3,
    baseCost: 120,
    costMultiplier: 1.85,
    bonusPerRank: { reviveChance: 1 },
  },
};

export const UNLOCKABLE_CLASSES: Record<
  string,
  { classId: CharacterClassId; name: string; cost: number; description: string }
> = {
  PALADIN: {
    classId: 'PALADIN',
    name: 'Paladin',
    cost: 80,
    description: 'Holy armored knight wielding Radiant Smite, Aegis Shielding, and divine wrath.',
  },
  NECROMANCER: {
    classId: 'NECROMANCER',
    name: 'Necromancer',
    cost: 120,
    description: 'Master of forbidden void magic with Soul Siphon lifesteal and Bone Armor barrier.',
  },
  BERSERKER: {
    classId: 'BERSERKER',
    name: 'Berserker',
    cost: 160,
    description: 'Frenzied warrior whose damage surges exponentially as health drops.',
  },
};

export const UNLOCKABLE_CARDS: Record<
  string,
  { cardId: string; name: string; cost: number; description: string; classTag: string }
> = {
  'combustion': {
    cardId: 'combustion',
    name: 'Combustion',
    cost: 35,
    description: 'Deals 14 Fire dmg. If target is Burning, deals +10 bonus damage.',
    classTag: 'MAGE / WARRIOR',
  },
  'venom-strike': {
    cardId: 'venom-strike',
    name: 'Venom Strike',
    cost: 35,
    description: 'Deals 8 Nature dmg + 6 Poison. If target is Poisoned, gain +1 Energy.',
    classTag: 'ROGUE / RANGER',
  },
  'rupture': {
    cardId: 'rupture',
    name: 'Rupture',
    cost: 35,
    description: 'Deals 12 dmg. If target Bleeds, gain 8 Block and apply Vulnerable.',
    classTag: 'WARRIOR / BERSERKER',
  },
  'shatter-ice': {
    cardId: 'shatter-ice',
    name: 'Shatter Ice',
    cost: 40,
    description: 'Deals 14 Ice dmg. Deals +14 massive crit bonus if target is Frozen.',
    classTag: 'MAGE',
  },
  'miasma-cloud': {
    cardId: 'miasma-cloud',
    name: 'Miasma Cloud',
    cost: 40,
    description: 'Inflicts 8 Poison and 2 turns of Weakened (-30% enemy attack).',
    classTag: 'NECROMANCER / ROGUE',
  },
  'spiked-barrier': {
    cardId: 'spiked-barrier',
    name: 'Spiked Barrier',
    cost: 35,
    description: 'Gain 10 Block and 5 Thorns reflect counter-damage.',
    classTag: 'WARRIOR / PALADIN',
  },
  'thunder-strike': {
    cardId: 'thunder-strike',
    name: 'Thunder Strike',
    cost: 35,
    description: 'Deals 10 Lightning dmg and inflicts Shocked (+30% bonus damage taken).',
    classTag: 'WARRIOR / MAGE',
  },
  'acid-slash': {
    cardId: 'acid-slash',
    name: 'Acid Slash',
    cost: 40,
    description: 'Deals 9 Nature dmg and inflicts 6 Corrosion (shreds enemy shield and deals dmg).',
    classTag: 'ROGUE / WARRIOR',
  },
  'smoke-bomb': {
    cardId: 'smoke-bomb',
    name: 'Smoke Bomb',
    cost: 35,
    description: 'Gain 8 Block and inflict Blinded (enemy has 40% chance to miss attacks).',
    classTag: 'ROGUE',
  },
  'whirlwind': {
    cardId: 'whirlwind',
    name: 'Whirlwind',
    cost: 35,
    description: 'Deals 14 physical dmg to all enemies and draws 1 card.',
    classTag: 'WARRIOR / BERSERKER',
  },
  'reckless-fury': {
    cardId: 'reckless-fury',
    name: 'Reckless Fury',
    cost: 45,
    description: 'Deals 20 physical damage and grants +1 Energy.',
    classTag: 'WARRIOR / BERSERKER',
  },
  'shield-wall': {
    cardId: 'shield-wall',
    name: 'Shield Wall',
    cost: 40,
    description: 'Gain 22 Block. Retains card in hand if unplayed.',
    classTag: 'WARRIOR / PALADIN',
  },
  'executioner-axe': {
    cardId: 'executioner-axe',
    name: 'Executioner Axe',
    cost: 50,
    description: 'Deals 26 physical damage (amplifies vs wounded foes).',
    classTag: 'WARRIOR / BERSERKER',
  },
  'blood-tithe': {
    cardId: 'blood-tithe',
    name: 'Blood Tithe',
    cost: 35,
    description: 'Gain +1 Energy and inflict 6 Bleed on target.',
    classTag: 'WARRIOR / NECROMANCER',
  },
  'bastion-stance': {
    cardId: 'bastion-stance',
    name: 'Bastion Stance',
    cost: 30,
    description: 'Gain 14 Block and 6 Thorns counter-damage for 3 turns.',
    classTag: 'WARRIOR / PALADIN',
  },
  'meteor-strike': {
    cardId: 'meteor-strike',
    name: 'Meteor Strike',
    cost: 55,
    description: 'Deals 36 Fire Magic damage and inflicts 12 Burning.',
    classTag: 'MAGE',
  },
  'blizzard': {
    cardId: 'blizzard',
    name: 'Blizzard',
    cost: 40,
    description: 'Deals 16 Ice Magic dmg, gains 12 Block, and applies 1 turn of Frozen.',
    classTag: 'MAGE',
  },
  'arc-lightning': {
    cardId: 'arc-lightning',
    name: 'Arc Lightning',
    cost: 35,
    description: 'Deals 12 Lightning dmg, applies 8 Shocked, and draws 1 card.',
    classTag: 'MAGE',
  },
  'arcane-intellect': {
    cardId: 'arcane-intellect',
    name: 'Arcane Intellect',
    cost: 45,
    description: 'Draws 3 cards and gains +1 Energy.',
    classTag: 'MAGE',
  },
  'flame-ward': {
    cardId: 'flame-ward',
    name: 'Flame Ward',
    cost: 30,
    description: 'Gain 10 Block and inflict 6 Burning on target.',
    classTag: 'MAGE',
  },
  'supernova': {
    cardId: 'supernova',
    name: 'Supernova',
    cost: 50,
    description: 'Deals 28 Fire Magic damage and inflicts 14 Burning.',
    classTag: 'MAGE',
  },
  'shadowstep': {
    cardId: 'shadowstep',
    name: 'Shadowstep',
    cost: 30,
    description: 'Gain 12 Block and draw 1 card.',
    classTag: 'ROGUE',
  },
  'flurry-daggers': {
    cardId: 'flurry-daggers',
    name: 'Flurry of Daggers',
    cost: 40,
    description: 'Deals 18 physical damage and inflicts 6 Bleed.',
    classTag: 'ROGUE',
  },
  'noxious-flask': {
    cardId: 'noxious-flask',
    name: 'Noxious Flask',
    cost: 35,
    description: 'Inflicts 14 Poison and 6 Corrosion armor-shred.',
    classTag: 'ROGUE / NECROMANCER',
  },
  'smoke-cloak': {
    cardId: 'smoke-cloak',
    name: 'Smoke Cloak',
    cost: 40,
    description: 'Gain 14 Block and apply 2 turns of Blinded.',
    classTag: 'ROGUE',
  },
  'assassinate': {
    cardId: 'assassinate',
    name: 'Assassinate',
    cost: 55,
    description: 'Deals 32 heavy physical damage.',
    classTag: 'ROGUE',
  },
  'preparation': {
    cardId: 'preparation',
    name: 'Preparation',
    cost: 45,
    description: 'Draw 2 cards and gain +1 Energy.',
    classTag: 'ROGUE',
  },
  'solar-flare': {
    cardId: 'solar-flare',
    name: 'Solar Flare',
    cost: 35,
    description: 'Deals 22 Holy Magic damage and restores 8 HP.',
    classTag: 'PALADIN / CLERIC',
  },
  'divine-shield': {
    cardId: 'divine-shield',
    name: 'Divine Shield',
    cost: 30,
    description: 'Gain 16 Block and heal 5 HP.',
    classTag: 'PALADIN / CLERIC',
  },
  'consecration': {
    cardId: 'consecration',
    name: 'Consecration',
    cost: 40,
    description: 'Deals 18 Holy damage and applies Vulnerable for 3 turns.',
    classTag: 'PALADIN',
  },
  'aegis-glory': {
    cardId: 'aegis-glory',
    name: 'Aegis of Glory',
    cost: 50,
    description: 'Gain 28 Block and heal 8 HP.',
    classTag: 'PALADIN',
  },
  'holy-light': {
    cardId: 'holy-light',
    name: 'Holy Light',
    cost: 35,
    description: 'Heal 14 HP and draw 1 card.',
    classTag: 'PALADIN / CLERIC',
  },
  'judgement': {
    cardId: 'judgement',
    name: 'Judgement',
    cost: 60,
    description: 'Deals 40 Holy damage and applies Vulnerable.',
    classTag: 'PALADIN',
  },
  'void-leech': {
    cardId: 'void-leech',
    name: 'Void Leech',
    cost: 35,
    description: 'Deals 14 Void Shadow damage and restores 8 HP.',
    classTag: 'NECROMANCER',
  },
  'bone-armor': {
    cardId: 'bone-armor',
    name: 'Bone Armor',
    cost: 30,
    description: 'Gain 18 Block.',
    classTag: 'NECROMANCER',
  },
  'grave-chill': {
    cardId: 'grave-chill',
    name: 'Grave Chill',
    cost: 35,
    description: 'Deals 12 Ice damage, inflicts 6 Frostbite and 2 Weakened.',
    classTag: 'NECROMANCER / MAGE',
  },
  'doom-gaze': {
    cardId: 'doom-gaze',
    name: 'Doom Gaze',
    cost: 45,
    description: 'Deals 24 Void damage and applies Vulnerable for 3 turns.',
    classTag: 'NECROMANCER',
  },
  'corpse-explosion': {
    cardId: 'corpse-explosion',
    name: 'Corpse Explosion',
    cost: 50,
    description: 'Deals 26 physical damage and inflicts 8 Poison.',
    classTag: 'NECROMANCER',
  },
  'astral-rift': {
    cardId: 'astral-rift',
    name: 'Astral Rift',
    cost: 60,
    description: 'Deals 28 Void damage and draws 2 cards.',
    classTag: 'ALL CLASSES',
  },
};

export const UNLOCKABLE_RELICS: Record<string, UnlockableRelicDefinition> = {
  'aegis-sunken-king': {
    relicId: 'aegis-sunken-king',
    name: 'Aegis of the Sunken King',
    cost: 35,
    rarity: 'EPIC',
    description: 'At the start of combat, grants +50 Barrier Block and draws +1 additional card on Turn 1.',
  },
  'vampire-bloodstone': {
    relicId: 'vampire-bloodstone',
    name: "Vampire's Bloodstone",
    cost: 35,
    rarity: 'RARE',
    description: 'When any enemy falls in battle, your hero restores 10% of their Max HP.',
  },
  'brimstone-censer': {
    relicId: 'brimstone-censer',
    name: 'Brimstone Censer',
    cost: 35,
    rarity: 'RARE',
    description: 'Whenever you apply Burning to an enemy, immediately gain +8 Block.',
  },
  'blood-needle': {
    relicId: 'blood-needle',
    name: 'Blood Needle',
    cost: 45,
    rarity: 'EPIC',
    description: 'The first card played each turn costs 0 Energy (costs 4 HP instead).',
  },
  'chrono-pocketwatch': {
    relicId: 'chrono-pocketwatch',
    name: 'Chrono Pocketwatch',
    cost: 50,
    rarity: 'EPIC',
    description: 'Retain 1 unplayed card in your hand between turns.',
  },
  'necrotic-urn': {
    relicId: 'necrotic-urn',
    name: 'Necrotic Urn',
    cost: 45,
    rarity: 'RARE',
    description: 'Defeating an enemy in combat immediately draws 2 cards and grants +1 Energy.',
  },
  'viper-fang': {
    relicId: 'viper-fang',
    name: "Viper's Fang",
    cost: 40,
    rarity: 'RARE',
    description: 'Whenever you inflict Poison, deal +4 bonus Physical damage.',
  },
  'tome-ancient-ley': {
    relicId: 'tome-ancient-ley',
    name: 'Tome of Ancient Ley',
    cost: 25,
    rarity: 'UNCOMMON',
    description: 'Start every combat with +1 extra Card Draw on Turn 1.',
  },
  'midas-pouch': {
    relicId: 'midas-pouch',
    name: "Midas's Coin Pouch",
    cost: 35,
    rarity: 'RARE',
    description: 'Increase all Gold earned from combat victories and dungeon chests by +35%.',
  },
  'warlord-crown': {
    relicId: 'warlord-crown',
    name: 'Crown of the Warlord',
    cost: 45,
    rarity: 'RARE',
    description: 'Start every combat encounter with +2 Strength and +12 Block.',
  },
  'voidstone-phylactery': {
    relicId: 'voidstone-phylactery',
    name: 'Voidstone Phylactery',
    cost: 60,
    rarity: 'EPIC',
    description: 'Taking unblocked HP damage grants +1 Max Energy next turn.',
  },
  'celestial-hourglass': {
    relicId: 'celestial-hourglass',
    name: 'Celestial Hourglass',
    cost: 45,
    rarity: 'RARE',
    description: 'Every 3rd combat round, draw +2 extra cards and gain +1 Energy.',
  },
  'mirror-retaliation': {
    relicId: 'mirror-retaliation',
    name: 'Mirror of Retaliation',
    cost: 45,
    rarity: 'RARE',
    description: 'Reflect 25% of all direct attack damage taken back to the attacker.',
  },
  'hydra-heart': {
    relicId: 'hydra-heart',
    name: "Hydra's Pulsing Heart",
    cost: 65,
    rarity: 'EPIC',
    description: 'Regenerate 8% Max HP at the end of every victorious battle.',
  },
  'pyromancer-ring': {
    relicId: 'pyromancer-ring',
    name: 'Ring of the Pyromancer',
    cost: 50,
    rarity: 'RARE',
    description: 'Burning status effect stacks on enemies never decay over rounds.',
  },
  'glacial-shard': {
    relicId: 'glacial-shard',
    name: 'Glacial Everfrost Shard',
    cost: 35,
    rarity: 'UNCOMMON',
    description: 'Whenever you Freeze an enemy or deal Ice damage, gain +10 Block.',
  },
  'stormcaller-beacon': {
    relicId: 'stormcaller-beacon',
    name: "Stormcaller's Beacon",
    cost: 45,
    rarity: 'RARE',
    description: 'All Lightning cards and abilities deal +6 flat bonus damage.',
  },
  'shadow-cloak': {
    relicId: 'shadow-cloak',
    name: 'Shadow Cloak of Evasion',
    cost: 60,
    rarity: 'EPIC',
    description: 'Start every battle with 1 turn of complete Invisibility / Evasion.',
  },
  'alchemist-pouch': {
    relicId: 'alchemist-pouch',
    name: "Master Alchemist's Pouch",
    cost: 35,
    rarity: 'UNCOMMON',
    description: 'All potion effects are boosted by +50% potency.',
  },
  'dragon-scale': {
    relicId: 'dragon-scale',
    name: 'Ancient Dragon Scale',
    cost: 85,
    rarity: 'LEGENDARY',
    description: 'Permanently gain +35 Max HP and start battle with +18 Shield.',
  },
  'cursed-monocle': {
    relicId: 'cursed-monocle',
    name: 'Cursed Monocle of Insight',
    cost: 45,
    rarity: 'RARE',
    description: 'Card draft rewards offer 4 choices instead of 3.',
  },
  'holy-grail': {
    relicId: 'holy-grail',
    name: 'The Sacred Chalice',
    cost: 65,
    rarity: 'EPIC',
    description: 'All healing received is increased by +40%.',
  },
  'boneshard-talisman': {
    relicId: 'boneshard-talisman',
    name: 'Boneshard Talisman',
    cost: 50,
    rarity: 'RARE',
    description: 'Slaying elite/boss monsters permanently grants +3 Max HP.',
  },
  'midas-touch': {
    relicId: 'midas-touch',
    name: 'Golden Hand of Midas',
    cost: 35,
    rarity: 'UNCOMMON',
    description: 'Slain monsters and combat rewards drop +50% more Gold.',
  },
  'chrono-crystal': {
    relicId: 'chrono-crystal',
    name: 'Chrono Rift Crystal',
    cost: 90,
    rarity: 'LEGENDARY',
    description: 'Start every combat encounter with +1 extra Turn 1 Energy.',
  },
  'venomous-barb': {
    relicId: 'venomous-barb',
    name: "Viper Queen's Barb",
    cost: 50,
    rarity: 'RARE',
    description: 'Poison ticks trigger an additional extra tick immediately.',
  },
  'colossus-shield': {
    relicId: 'colossus-shield',
    name: 'Shield of the Colossus',
    cost: 60,
    rarity: 'EPIC',
    description: 'Block and Shield gained from Skill cards is boosted by +25%.',
  },
  'bloodlust-mask': {
    relicId: 'bloodlust-mask',
    name: 'Mask of Bloodlust',
    cost: 45,
    rarity: 'RARE',
    description: 'Scoring a Critical Strike immediately restores 5 HP.',
  },
  'astral-prism': {
    relicId: 'astral-prism',
    name: 'Astral Soul Prism',
    cost: 70,
    rarity: 'EPIC',
    description: 'Earn +40% more Soul Shards across all encounters.',
  },
};

export const DEFAULT_UNLOCKED_RELICS: string[] = ['tome-ancient-ley'];

export const DEFAULT_UNLOCKED_CARDS: string[] = [
  'strike',
  'defend',
  // Class Basic Attacks & Defenses
  'warrior-strike',
  'warrior-defend',
  'rogue-strike',
  'rogue-defend',
  'mage-strike',
  'mage-defend',
  'cleric-strike',
  'cleric-defend',
  'ranger-strike',
  'ranger-defend',
  'paladin-strike',
  'paladin-defend',
  'necromancer-strike',
  'necromancer-defend',
  'berserker-strike',
  'berserker-defend',
  // Warrior
  'power-cleave',
  'shield-slam',
  // Rogue
  'quick-slash',
  'poison-dart',
  // Mage
  'fireball',
  'frost-lance',
  // Cleric
  'holy-smite',
  'prayer-heal',
  'smite',
  // Ranger
  'aimed-shot',
  'arrow-barrage',
  // Paladin
  'radiant-smite',
  'aegis-ward',
  // Necromancer
  'soul-siphon',
  'bone-barrier',
  // Berserker
  'blood-slash',
  'frenzy-rage',
];

export const DEFAULT_UNLOCKED_EQUIPMENT: string[] = [
  'iron-broadsword',
  'yew-longbow',
  'shield-of-the-lion',
  'steel-visor-helm',
  'tempered-cuirass',
  'robes-of-the-archmage',
  'plated-gauntlets',
  'iron-greaves',
  'reinforced-sabatons',
  'ring-of-evasion',
];

export const UNLOCKABLE_EQUIPMENT: Record<string, UnlockableEquipmentDefinition> = {
  'steel-claymore': {
    itemId: 'steel-claymore',
    name: 'Steel Claymore',
    slot: 'MAIN_HAND',
    rarity: 'UNCOMMON',
    cost: 35,
    description: '+5 STR, +2 VIT, +16 Physical Atk, +4% Crit.',
  },
  'venomous-kris': {
    itemId: 'venomous-kris',
    name: 'Venomous Kris',
    slot: 'MAIN_HAND',
    rarity: 'RARE',
    cost: 45,
    description: '+6 DEX, +4 LUK, +14 Physical Atk, +10% Crit, +2 Spd.',
  },
  'staff-of-arcane-ruin': {
    itemId: 'staff-of-arcane-ruin',
    name: 'Staff of Arcane Ruin',
    slot: 'MAIN_HAND',
    rarity: 'EPIC',
    cost: 60,
    description: '+10 INT, +5 WIL, +26 Magic Atk.',
  },
  'sunfire-greatsword': {
    itemId: 'sunfire-greatsword',
    name: 'Sunfire Greatsword',
    slot: 'MAIN_HAND',
    rarity: 'LEGENDARY',
    cost: 100,
    description: '+12 STR, +6 VIT, +6 LUK, +36 Phys Atk, +15% Crit.',
  },
  'shield-of-the-lion': {
    itemId: 'shield-of-the-lion',
    name: 'Shield of the Lion',
    slot: 'OFF_HAND',
    rarity: 'RARE',
    cost: 45,
    description: '+6 VIT, +4 WIL, +16 Phys Def, +8 Mag Def, +30 Max HP.',
  },
  'shadow-cowl': {
    itemId: 'shadow-cowl',
    name: 'Shadow Cowl',
    slot: 'HEAD',
    rarity: 'RARE',
    cost: 40,
    description: '+5 DEX, +4 LUK, +7 Phys Def, +6 Evasion, +2 Spd.',
  },
  'crown-of-the-sun-king': {
    itemId: 'crown-of-the-sun-king',
    name: 'Crown of the Sun King',
    slot: 'HEAD',
    rarity: 'LEGENDARY',
    cost: 90,
    description: '+10 INT, +8 WIL, +6 LUK, +18 Mag Def, +14 Mag Atk, +8% Crit.',
  },
  'dragonscale-hauberk': {
    itemId: 'dragonscale-hauberk',
    name: 'Dragonscale Hauberk',
    slot: 'CHEST',
    rarity: 'EPIC',
    cost: 75,
    description: '+8 VIT, +6 STR, +26 Phys Def, +16 Mag Def, +65 Max HP.',
  },
  'robes-of-the-archmage': {
    itemId: 'robes-of-the-archmage',
    name: 'Robes of the Archmage',
    slot: 'CHEST',
    rarity: 'RARE',
    cost: 50,
    description: '+8 INT, +6 WIL, +18 Mag Def, +12 Mag Atk.',
  },
  'boots-of-the-wind-strider': {
    itemId: 'boots-of-the-wind-strider',
    name: 'Boots of the Wind Strider',
    slot: 'FEET',
    rarity: 'EPIC',
    cost: 65,
    description: '+6 DEX, +8 Phys Def, +8 Speed, +8 Evasion.',
  },
  'band-of-the-bull': {
    itemId: 'band-of-the-bull',
    name: 'Band of the Crimson Bull',
    slot: 'RING_1',
    rarity: 'RARE',
    cost: 50,
    description: '+6 STR, +5 VIT, +6 Phys Atk, +25 Max HP.',
  },
  'phoenix-amulet': {
    itemId: 'phoenix-amulet',
    name: 'Phoenix Amulet',
    slot: 'RING_2',
    rarity: 'LEGENDARY',
    cost: 110,
    description: '+4 All Stats, +8 LUK, +50 Max HP, +10% Crit.',
  },
};

/**
 * Creates default initial meta-progression state
 */
export function createInitialMetaProgression(): MetaProgressionState {
  return {
    aetherium: 0,
    lifetimeAetherium: 0,
    unlockedClasses: ['WARRIOR', 'ROGUE', 'MAGE', 'CLERIC', 'RANGER'],
    upgradeRanks: {
      attunement: 0,
      might: 0,
      agility: 0,
      mind: 0,
      vitality: 0,
      willpower: 0,
      vigor: 0,
      bastion: 0,
      prowess: 0,
      gold: 0,
      fortune: 0,
      capacity: 0,
      transcendence: 0,
      wellspring: 0,
      celestial_core: 0,
      reroll: 0,
      reaping: 0,
      crit: 0,
      relic_slots: 0,
      card_mastery: 0,
      phoenix: 0,
    },
    unlockedRelicIds: [...DEFAULT_UNLOCKED_RELICS],
    unlockedCardIds: [...DEFAULT_UNLOCKED_CARDS],
    unlockedEquipmentIds: [...DEFAULT_UNLOCKED_EQUIPMENT],
    totalRunsStarted: 0,
    totalRunsWon: 0,
    victoriesCount: 0,
    highestFloorReached: 1,
    totalMonstersSlain: 0,
  };
}

/**
 * Calculates current cost for an upgrade based on rank
 */
export function getUpgradeCost(upgradeId: MetaUpgradeId, currentRank: number): number {
  const def = META_UPGRADES[upgradeId];
  if (!def) return 999;
  if (def.customCosts && def.customCosts[currentRank] !== undefined) {
    return def.customCosts[currentRank];
  }
  return Math.round(def.baseCost * Math.pow(def.costMultiplier, currentRank));
}

/**
 * Purchases a permanent meta upgrade with Aetherium
 */
export function purchaseMetaUpgrade(
  state: MetaProgressionState,
  upgradeId: MetaUpgradeId
): { success: boolean; nextState: MetaProgressionState; message: string } {
  const def = META_UPGRADES[upgradeId];
  if (!def) {
    return { success: false, nextState: state, message: 'Invalid upgrade ID.' };
  }

  const currentRank = state.upgradeRanks[upgradeId] || 0;
  if (currentRank >= def.maxRank) {
    return {
      success: false,
      nextState: state,
      message: `${def.name} has already reached maximum rank (${def.maxRank}).`,
    };
  }

  const cost = getUpgradeCost(upgradeId, currentRank);
  if (state.aetherium < cost) {
    return {
      success: false,
      nextState: state,
      message: `Insufficient Aetherium. Requires 💎${cost}, you have 💎${state.aetherium}.`,
    };
  }

  const nextState: MetaProgressionState = {
    ...state,
    aetherium: state.aetherium - cost,
    upgradeRanks: {
      ...state.upgradeRanks,
      [upgradeId]: currentRank + 1,
    },
  };

  return {
    success: true,
    nextState,
    message: `Upgraded ${def.name} to Rank ${currentRank + 1}!`,
  };
}

/**
 * Unlocks a new hero class permanently with Aetherium
 */
export function unlockMetaClass(
  state: MetaProgressionState,
  classId: CharacterClassId
): { success: boolean; nextState: MetaProgressionState; message: string } {
  if (state.unlockedClasses.includes(classId)) {
    return {
      success: false,
      nextState: state,
      message: 'Class is already unlocked.',
    };
  }

  const classDef = UNLOCKABLE_CLASSES[classId];
  if (!classDef) {
    return {
      success: false,
      nextState: state,
      message: 'Class is not available for purchase.',
    };
  }

  if (state.aetherium < classDef.cost) {
    return {
      success: false,
      nextState: state,
      message: `Insufficient Aetherium. Requires 💎${classDef.cost}, you have 💎${state.aetherium}.`,
    };
  }

  const nextState: MetaProgressionState = {
    ...state,
    aetherium: state.aetherium - classDef.cost,
    unlockedClasses: [...state.unlockedClasses, classId],
  };

  return {
    success: true,
    nextState,
    message: `Unlocked ${classDef.name} Class!`,
  };
}

/**
 * Unlocks a card in the Astral Sanctum Card Archive
 */
export function unlockMetaCard(
  state: MetaProgressionState,
  cardId: string
): { success: boolean; nextState: MetaProgressionState; message: string } {
  const currentUnlocked = state.unlockedCardIds || DEFAULT_UNLOCKED_CARDS;
  if (currentUnlocked.includes(cardId)) {
    return { success: false, nextState: state, message: 'Card is already unlocked.' };
  }

  const cardDef = UNLOCKABLE_CARDS[cardId];
  if (!cardDef) {
    return { success: false, nextState: state, message: 'Card is not available in the Astral Archive.' };
  }

  if (state.aetherium < cardDef.cost) {
    return {
      success: false,
      nextState: state,
      message: `Insufficient Aetherium. Requires 💎${cardDef.cost}, you have 💎${state.aetherium}.`,
    };
  }

  const nextState: MetaProgressionState = {
    ...state,
    aetherium: state.aetherium - cardDef.cost,
    unlockedCardIds: [...currentUnlocked, cardId],
  };

  return {
    success: true,
    nextState,
    message: `Unlocked [${cardDef.name}] into your Card Pool & Starter Loadout!`,
  };
}

/**
 * Unlocks a starting relic in the Astral Sanctum Reliquary
 */
export function unlockMetaRelic(
  state: MetaProgressionState,
  relicId: string
): { success: boolean; nextState: MetaProgressionState; message: string } {
  const currentUnlocked = state.unlockedRelicIds || DEFAULT_UNLOCKED_RELICS;
  if (currentUnlocked.includes(relicId)) {
    return { success: false, nextState: state, message: 'Relic is already unlocked.' };
  }

  const relicDef = UNLOCKABLE_RELICS[relicId];
  if (!relicDef) {
    return { success: false, nextState: state, message: 'Relic is not available in the Astral Reliquary.' };
  }

  if (state.aetherium < relicDef.cost) {
    return {
      success: false,
      nextState: state,
      message: `Insufficient Aetherium. Requires ${relicDef.cost} Soul Shards, you have ${state.aetherium}.`,
    };
  }

  const nextState: MetaProgressionState = {
    ...state,
    aetherium: state.aetherium - relicDef.cost,
    unlockedRelicIds: [...currentUnlocked, relicId],
  };

  return {
    success: true,
    nextState,
    message: `Unlocked [${relicDef.name}] into your Starting Reliquary!`,
  };
}

/**
 * Unlocks a piece of equipment in the Astral Sanctum Armory
 */
export function unlockMetaEquipment(
  state: MetaProgressionState,
  itemId: string
): { success: boolean; nextState: MetaProgressionState; message: string } {
  const currentUnlocked = state.unlockedEquipmentIds || DEFAULT_UNLOCKED_EQUIPMENT;
  if (currentUnlocked.includes(itemId)) {
    return { success: false, nextState: state, message: 'Equipment is already unlocked.' };
  }

  const equipDef = UNLOCKABLE_EQUIPMENT[itemId];
  if (!equipDef) {
    return { success: false, nextState: state, message: 'Equipment is not available in the Astral Armory.' };
  }

  if (state.aetherium < equipDef.cost) {
    return {
      success: false,
      nextState: state,
      message: `Insufficient Aetherium. Requires 💎${equipDef.cost}, you have 💎${state.aetherium}.`,
    };
  }

  const nextState: MetaProgressionState = {
    ...state,
    aetherium: state.aetherium - equipDef.cost,
    unlockedEquipmentIds: [...currentUnlocked, itemId],
  };

  return {
    success: true,
    nextState,
    message: `Unlocked [${equipDef.name}] into your Starting Armory!`,
  };
}

/**
 * Calculates end-of-run Aetherium reward based on performance
 * Deep floor runs receive exponential reward bonuses matching the steeper difficulty curve.
 */
export function calculateRunAetheriumReward(
  floorsCleared: number,
  monstersDefeated: number,
  isBossSlain: boolean,
  isVictory: boolean
): number {
  const floorMultiplier = Math.pow(1.5, Math.max(0, floorsCleared - 1));
  let baseReward = (floorsCleared * 25 + monstersDefeated * 10) * floorMultiplier;
  if (isBossSlain) baseReward += 60 * floorMultiplier;
  if (isVictory) baseReward += 150 * floorMultiplier;
  return Math.max(10, Math.round(baseReward));
}

import { calculateDerivedStats } from '../stats/stat-calculator.ts';

/**
 * Applies permanent meta upgrade bonuses to a hero (safe for initial creation and live updates)
 */
export function applyMetaUpgradesToHero(
  hero: Combatant,
  metaState: MetaProgressionState
): Combatant {
  const ranks = metaState.upgradeRanks || ({} as Record<MetaUpgradeId, number>);
  const vigorRank = ranks.vigor || 0;
  const prowessRank = ranks.prowess || 0;
  const fortuneRank = ranks.fortune || 0;
  const bastionRank = ranks.bastion || 0;
  const mightRank = ranks.might || 0;
  const agilityRank = ranks.agility || 0;
  const mindRank = ranks.mind || 0;
  const vitalityRank = ranks.vitality || 0;
  const willpowerRank = ranks.willpower || 0;

  const extraHp = vigorRank * (META_UPGRADES.vigor?.bonusPerRank?.maxHp || 15);
  const extraAtk = prowessRank * (META_UPGRADES.prowess?.bonusPerRank?.baseAttack || 3);
  const extraLuck = fortuneRank * (META_UPGRADES.fortune?.bonusPerRank?.luck || 2);
  const extraShield = bastionRank * (META_UPGRADES.bastion?.bonusPerRank?.startingShield || 6);

  const extraStr = mightRank * (META_UPGRADES.might?.bonusPerRank?.strength || 2);
  const extraDex = agilityRank * (META_UPGRADES.agility?.bonusPerRank?.dexterity || 2);
  const extraInt = mindRank * (META_UPGRADES.mind?.bonusPerRank?.intelligence || 2);
  const extraVit = vitalityRank * (META_UPGRADES.vitality?.bonusPerRank?.vitality || 2);
  const extraWil = willpowerRank * (META_UPGRADES.willpower?.bonusPerRank?.willpower || 2);

  const updatedPrimary = {
    ...hero.primaryStats,
    strength: hero.primaryStats.strength + extraStr,
    dexterity: hero.primaryStats.dexterity + extraDex,
    intelligence: hero.primaryStats.intelligence + extraInt,
    vitality: hero.primaryStats.vitality + extraVit,
    willpower: hero.primaryStats.willpower + extraWil,
    luck: hero.primaryStats.luck + extraLuck,
  };

  let boonHp = 0;
  let boonAtk = 0;
  let boonMatk = 0;

  if (hero.originBoon === 'iron-constitution') {
    boonHp += 30;
  } else if (hero.originBoon === 'sharpened-edge') {
    boonAtk += 5;
  } else if (hero.originBoon === 'spell-weaver') {
    boonMatk += 5;
  }

  const updatedDerived = calculateDerivedStats(updatedPrimary, hero.level, {
    maxHpBonus: extraHp + boonHp,
    physicalAttack: extraAtk + boonAtk,
    magicAttack: extraAtk + boonMatk,
  });

  const hpDiff = updatedDerived.maxHp - hero.maxHp;
  const nextHp = hero.currentHp > 0 ? Math.min(updatedDerived.maxHp, hero.currentHp + Math.max(0, hpDiff)) : updatedDerived.maxHp;

  return {
    ...hero,
    primaryStats: updatedPrimary,
    derivedStats: updatedDerived,
    maxHp: updatedDerived.maxHp,
    currentHp: nextHp,
    shieldHp: Math.max(hero.shieldHp || 0, extraShield),
  };
}
