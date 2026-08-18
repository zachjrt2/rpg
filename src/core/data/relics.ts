import type { RelicDefinition, RelicId } from '../types/relics.ts';

export const RELICS_CATALOG: Record<RelicId, RelicDefinition> = {
  'aegis-sunken-king': {
    id: 'aegis-sunken-king',
    name: 'Aegis of the Sunken King',
    rarity: 'EPIC',
    icon: '🛡️',
    description: 'At the start of combat, grants +50 Barrier Block and draws +1 additional card on Turn 1.',
    effect: {
      startOfCombatShield: 50,
      startOfCombatDraw: 1,
    },
  },
  'vampire-bloodstone': {
    id: 'vampire-bloodstone',
    name: "Vampire's Bloodstone",
    rarity: 'RARE',
    icon: '🩸',
    description: 'When any enemy falls in battle, your hero restores 10% of their Max HP.',
    effect: {
      onKillPartyHealPercent: 10,
    },
  },
  'brimstone-censer': {
    id: 'brimstone-censer',
    name: 'Brimstone Censer',
    rarity: 'RARE',
    icon: '🔥',
    description: 'Whenever you apply Burning to an enemy, immediately gain +8 Block.',
    effect: {
      burnGainBlock: 8,
    },
  },
  'blood-needle': {
    id: 'blood-needle',
    name: 'Blood Needle',
    rarity: 'EPIC',
    icon: '🪡',
    description: 'The first card played each turn costs 0 Energy (costs 4 HP instead).',
    effect: {
      firstCardFreeHpCost: 4,
    },
  },
  'chrono-pocketwatch': {
    id: 'chrono-pocketwatch',
    name: 'Chrono Pocketwatch',
    rarity: 'EPIC',
    icon: '⏱️',
    description: 'Retain 1 unplayed card in your hand between turns.',
    effect: {
      retainCardCount: 1,
    },
  },
  'necrotic-urn': {
    id: 'necrotic-urn',
    name: 'Necrotic Urn',
    rarity: 'RARE',
    icon: '🏺',
    description: 'Defeating an enemy in combat immediately draws 2 cards and grants +1 Energy.',
    effect: {
      onKillDrawCards: 2,
      onKillEnergyGain: 1,
    },
  },
  'sunken-aegis': {
    id: 'sunken-aegis',
    name: 'Sunken Bastion Relic',
    rarity: 'UNCOMMON',
    icon: '⚓',
    description: 'Start every combat encounter with 15 Block.',
    effect: {
      startOfCombatShield: 15,
    },
  },
  'gambler-die': {
    id: 'gambler-die',
    name: "Gambler's Loaded Die",
    rarity: 'RARE',
    icon: '🎲',
    description: 'Damage dealt and taken fluctuates with a ±35% wild variance and grants +15 Luck.',
    effect: {
      damageVariancePercent: 35,
      luckFlat: 15,
    },
  },
  'tesla-capacitor': {
    id: 'tesla-capacitor',
    name: "Tesla's Voltaic Capacitor",
    rarity: 'RARE',
    icon: '⚡',
    description: 'Whenever you gain Block on your turn, discharge 8 Lightning counter-damage to the enemy.',
    effect: {
      guardReflectDamage: 8,
    },
  },
  'tome-ancient-ley': {
    id: 'tome-ancient-ley',
    name: 'Tome of Ancient Ley',
    rarity: 'EPIC',
    icon: '📜',
    description: 'Ancient runic inscriptions reduce skill costs and grant +15% Magic Critical Strike.',
    effect: {
      manaCostReductionPercent: 25,
      magicCritChanceFlat: 15,
    },
  },
  'midas-pouch': {
    id: 'midas-pouch',
    name: "Midas' Golden Pouch",
    rarity: 'UNCOMMON',
    icon: '🪙',
    description: 'Increases gold earned from combat encounters and treasure chambers by +40%.',
    effect: {
      goldMultiplierPercent: 40,
    },
  },
  'trickster-die': {
    id: 'trickster-die',
    name: "Trickster's Loaded Die",
    rarity: 'RARE',
    icon: '🎲',
    description: 'Grants +15 Luck rating, significantly increasing Rare card drops and critical strikes.',
    effect: {
      luckFlat: 15,
    },
  },
  'phoenix-feather': {
    id: 'phoenix-feather',
    name: 'Phoenix Down Feather',
    rarity: 'LEGENDARY',
    icon: '🪶',
    description: 'Once per dungeon floor, prevents fatal damage to your hero and revives with 40% HP.',
    effect: {
      reviveOnFatalPercent: 40,
    },
  },
  'berserker-pendant': {
    id: 'berserker-pendant',
    name: "Berserker's Blood Pendant",
    rarity: 'UNCOMMON',
    icon: '⚔️',
    description: 'Hero deals +25% more damage when health is below 50% HP.',
    effect: {},
  },
  'alchemist-crucible': {
    id: 'alchemist-crucible',
    name: "Alchemist's Crucible",
    rarity: 'RARE',
    icon: '🧪',
    description: 'Consumable potions heal for +50% more potency.',
    effect: {},
  },
  'obsidian-shard': {
    id: 'obsidian-shard',
    name: 'Obsidian Shard',
    rarity: 'RARE',
    icon: '🗡️',
    description: 'Attacks deal +2 bonus damage for every card held in hand.',
    effect: {},
  },
  'viper-fang': {
    id: 'viper-fang',
    name: "Viper's Venomfang",
    rarity: 'RARE',
    icon: '🐍',
    description: 'Whenever you apply Poison to an enemy, immediately trigger +6 bonus Poison damage and gain +1 Energy once per turn.',
    effect: {
      poisonApplyBonusDmg: 6,
      poisonGainEnergyOnce: true,
    },
  },
  'crimson-talisman': {
    id: 'crimson-talisman',
    name: 'Crimson Talisman',
    rarity: 'RARE',
    icon: '🩸',
    description: 'Attacks against Bleeding enemies deal +40% bonus damage and heal your hero for 4 HP.',
    effect: {
      bleedBonusDmgPercent: 40,
      bleedHitHeal: 4,
    },
  },
  'frostfire-prism': {
    id: 'frostfire-prism',
    name: 'Frostfire Prism',
    rarity: 'EPIC',
    icon: '💠',
    description: 'Striking a Burning enemy with Ice attacks triggers a violent Steam Explosion for +18 burst damage.',
    effect: {
      freezeOnBurnSteamDmg: 18,
    },
  },
  'thunderstone-coil': {
    id: 'thunderstone-coil',
    name: 'Thunderstone Coil',
    rarity: 'UNCOMMON',
    icon: '⚡',
    description: 'Attacking a Shocked enemy grants +6 Block and reapplies Shocked.',
    effect: {
      shockHitGainBlock: 6,
    },
  },
  'cursed-skull': {
    id: 'cursed-skull',
    name: 'Pestilent Cursed Skull',
    rarity: 'EPIC',
    icon: '💀',
    description: 'Enemies enter combat afflicted with 2 turns of Vulnerable and 1 turn of Weakened.',
    effect: {
      startOfCombatEnemyVulnerableTurns: 2,
      startOfCombatEnemyWeakenedTurns: 1,
    },
  },
  'thornmail-core': {
    id: 'thornmail-core',
    name: 'Thornmail Core',
    rarity: 'RARE',
    icon: '🌵',
    description: 'Your hero is imbued with Thorns, reflecting 8 physical damage back to attackers when struck.',
    effect: {
      thornsReflectDamage: 8,
    },
  },
  'catalyst-vial': {
    id: 'catalyst-vial',
    name: "Alchemist's Catalyst Vial",
    rarity: 'RARE',
    icon: '⚗️',
    description: 'All status effect damage-over-time ticks (Burning, Poison, Bleed) deal +50% increased damage.',
    effect: {
      dotPotencyMultiplierPercent: 50,
    },
  },
  'soul-harvester': {
    id: 'soul-harvester',
    name: 'Soul Harvester Pendant',
    rarity: 'LEGENDARY',
    icon: '🔮',
    description: 'Defeating an enemy afflicted with any status effect restores 15% Max HP and draws 1 card.',
    effect: {
      statusKillHealPercent: 15,
      statusKillDrawCard: 1,
    },
  },
  'warlord-crown': {
    id: 'warlord-crown',
    name: 'Crown of the Warlord',
    rarity: 'RARE',
    icon: '👑',
    description: 'Start every combat encounter with +2 Strength and +12 Block.',
    effect: {
      startOfCombatStrength: 2,
      startOfCombatShield: 12,
    },
  },
  'voidstone-phylactery': {
    id: 'voidstone-phylactery',
    name: 'Voidstone Phylactery',
    rarity: 'EPIC',
    icon: '💎',
    description: 'Whenever you take unblocked HP damage, gain +1 Max Energy on your next turn.',
    effect: {
      damageTakenGainNextTurnEnergy: 1,
    },
  },
  'celestial-hourglass': {
    id: 'celestial-hourglass',
    name: 'Celestial Hourglass',
    rarity: 'RARE',
    icon: '⏳',
    description: 'Every 3rd round of combat, draw +2 additional cards and gain +1 Energy.',
    effect: {
      everyThreeTurnsDrawExtra: 2,
    },
  },
  'mirror-retaliation': {
    id: 'mirror-retaliation',
    name: 'Mirror of Retaliation',
    rarity: 'RARE',
    icon: '🪞',
    description: 'Reflect 25% of all direct attack damage taken back to the attacker as true damage.',
    effect: {
      reflectMeleeDamagePercent: 25,
    },
  },
  'hydra-heart': {
    id: 'hydra-heart',
    name: "Hydra's Pulsing Heart",
    rarity: 'EPIC',
    icon: '🫀',
    description: 'Regenerate 8% of your Max HP at the end of every victorious combat encounter.',
    effect: {
      victoryHealPercent: 8,
    },
  },
  'pyromancer-ring': {
    id: 'pyromancer-ring',
    name: 'Ring of the Pyromancer',
    rarity: 'RARE',
    icon: '💍',
    description: 'Burning status effect stacks on enemies do not decay at the end of rounds.',
    effect: {
      burnNeverDecays: true,
    },
  },
  'glacial-shard': {
    id: 'glacial-shard',
    name: 'Glacial Everfrost Shard',
    rarity: 'UNCOMMON',
    icon: '❄️',
    description: 'Whenever you Freeze an enemy or deal Ice damage, gain +10 Block.',
    effect: {
      freezeBonusBlock: 10,
    },
  },
  'stormcaller-beacon': {
    id: 'stormcaller-beacon',
    name: "Stormcaller's Beacon",
    rarity: 'RARE',
    icon: '🌩️',
    description: 'All Lightning cards and abilities deal +6 flat bonus damage.',
    effect: {
      lightningFlatBonusDmg: 6,
    },
  },
  'shadow-cloak': {
    id: 'shadow-cloak',
    name: 'Shadow Cloak of Evasion',
    rarity: 'EPIC',
    icon: '🧥',
    description: 'Start every combat encounter with 1 turn of complete Invisibility and Evasion.',
    effect: {
      startOfCombatEvasionTurns: 1,
    },
  },
  'alchemist-pouch': {
    id: 'alchemist-pouch',
    name: "Master Alchemist's Pouch",
    rarity: 'UNCOMMON',
    icon: '🎒',
    description: 'All healing and offensive potions have their effects increased by +50%.',
    effect: {
      potionPotencyMultiplierPercent: 50,
    },
  },
  'dragon-scale': {
    id: 'dragon-scale',
    name: 'Ancient Dragon Scale',
    rarity: 'LEGENDARY',
    icon: '🐉',
    description: 'Gain +35 Max HP permanently and start every battle with +18 Shield Barrier.',
    effect: {
      maxHpBonusFlat: 35,
      startOfCombatShield: 18,
    },
  },
  'cursed-monocle': {
    id: 'cursed-monocle',
    name: 'Cursed Monocle of Insight',
    rarity: 'RARE',
    icon: '🧐',
    description: 'Card draft rewards offer 4 choices instead of 3 after battle victories.',
    effect: {
      extraDraftCardChoice: 1,
    },
  },
  'holy-grail': {
    id: 'holy-grail',
    name: 'The Sacred Chalice',
    rarity: 'EPIC',
    icon: '🏆',
    description: 'All healing received from cards, potions, and campfires is boosted by +40%.',
    effect: {
      healingReceivedMultiplierPercent: 40,
    },
  },
  'boneshard-talisman': {
    id: 'boneshard-talisman',
    name: 'Boneshard Talisman',
    rarity: 'RARE',
    icon: '🦴',
    description: 'Whenever you slay an elite or boss monster, permanently gain +3 Max HP for the run.',
    effect: {
      onKillPermanentMaxHp: 3,
    },
  },
  'midas-touch': {
    id: 'midas-touch',
    name: "Golden Hand of Midas",
    rarity: 'UNCOMMON',
    icon: '✋',
    description: 'Slain monsters and combat rewards drop +50% more Gold.',
    effect: {
      extraGoldPercent: 50,
    },
  },
  'chrono-crystal': {
    id: 'chrono-crystal',
    name: 'Chrono Rift Crystal',
    rarity: 'LEGENDARY',
    icon: '💎',
    description: 'Start every combat encounter with +1 extra Turn 1 Energy.',
    effect: {
      startOfCombatEnergyBonus: 1,
    },
  },
  'venomous-barb': {
    id: 'venomous-barb',
    name: "Viper Queen's Barb",
    rarity: 'RARE',
    icon: '🦂',
    description: 'Whenever Poison ticks on an enemy, it triggers an additional extra tick immediately.',
    effect: {
      poisonExtraTrigger: true,
    },
  },
  'colossus-shield': {
    id: 'colossus-shield',
    name: 'Shield of the Colossus',
    rarity: 'EPIC',
    icon: '🛡️',
    description: 'All Block and Shield gained from Skill cards is increased by +25%.',
    effect: {
      skillBlockMultiplierPercent: 25,
    },
  },
  'bloodlust-mask': {
    id: 'bloodlust-mask',
    name: 'Mask of Bloodlust',
    rarity: 'RARE',
    icon: '🎭',
    description: 'Scoring a Critical Strike on any enemy immediately restores 5 HP.',
    effect: {
      critHealFlat: 5,
    },
  },
  'astral-prism': {
    id: 'astral-prism',
    name: 'Astral Soul Prism',
    rarity: 'EPIC',
    icon: '✨',
    description: 'Earn +40% more Soul Shards (Aetherium) across all encounters and floor clears.',
    effect: {
      extraShardMultiplierPercent: 40,
    },
  },
};


