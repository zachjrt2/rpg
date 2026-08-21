import type { DungeonFloor, DungeonNode, DungeonState } from '../types/dungeon.ts';
import type { IRandomNumberGenerator } from '../rng/rng.ts';

export interface ThemeNodeOption {
  name: string;
  description: string;
}

export interface FloorTheme {
  themeName: string;
  BATTLE: ThemeNodeOption[];
  SHRINE: ThemeNodeOption[];
  ELITE: ThemeNodeOption[];
  CAMPFIRE: ThemeNodeOption[];
  BOSS: ThemeNodeOption[];
  EVENT: ThemeNodeOption[];
  SHOP: ThemeNodeOption[];
}

export const DUNGEON_THEMES: FloorTheme[] = [
  {
    themeName: 'The Sunken Bastion',
    BATTLE: [
      { name: 'Flooded Courtyard', description: 'Water rushes over broken stones as enemies approach.' },
      { name: 'Drowned Armory', description: 'Rusty weapons lie scattered among waterlogged fiends.' }
    ],
    SHRINE: [
      { name: 'Coral Shrine', description: 'A glowing coral structure that mends wounds.' }
    ],
    ELITE: [
      { name: 'Tidehunter Sanctum', description: 'A fierce elite guardian commands the rising waters.' }
    ],
    CAMPFIRE: [
      { name: 'Dry Alcove', description: 'A rare dry spot to rest and wring out your clothes.' }
    ],
    BOSS: [
      { name: 'Abyssal Throne', description: 'The grand chamber of the deep where the boss awaits.' }
    ],
    EVENT: [
      { name: 'Sunken Reliquary', description: 'A half-submerged chest containing unknown treasures... or traps.' },
      { name: 'Murky Depths', description: 'A strange glowing orb floats beneath the dark water.' }
    ],
    SHOP: [
      { name: 'Smuggler\'s Cove', description: 'A shady aquatic merchant offering waterproof goods.' }
    ]
  },
  {
    themeName: 'The Abyssal Catacombs',
    BATTLE: [
      { name: 'Bone Chasm', description: 'Skeletons rise from the seemingly bottomless pit.' },
      { name: 'Necrotic Halls', description: 'Dark magic echoes through the cavernous walls.' }
    ],
    SHRINE: [
      { name: 'Sacrificial Altar', description: 'A dark altar that demands a toll for its blessing.' }
    ],
    ELITE: [
      { name: 'Crypt Guard Sanctum', description: 'A heavily armored undead skeleton guard wielding relic shields.' }
    ],
    CAMPFIRE: [
      { name: 'Crypt Hearth', description: 'A magically lit fire providing sparse comfort in the dark.' }
    ],
    BOSS: [
      { name: 'Lich\'s Reliquary', description: 'The inner sanctum filled with dark phylacteries.' }
    ],
    EVENT: [
      { name: 'Tomb of the Forgotten', description: 'An open sarcophagus whispers promises of power.' },
      { name: 'Cursed Pedestal', description: 'A dark artifact sits atop a bone pedestal, radiating unease.' }
    ],
    SHOP: [
      { name: 'Grave Robber\'s Stash', description: 'A shady figure selling wares scavenged from the dead.' }
    ]
  },
  {
    themeName: 'The Obsidian Sanctum',
    BATTLE: [
      { name: 'Charred Gates', description: 'The burning gates are guarded by demonic sentinels.' },
      { name: 'Magma Forge', description: 'Heat radiates from the anvils as enemies forge weapons of destruction.' }
    ],
    SHRINE: [
      { name: 'Flame Altar', description: 'A pedestal of eternal fire that invigorates the soul.' }
    ],
    ELITE: [
      { name: 'Demon\'s Roost', description: 'An elite fiend watches from a ledge above a pool of lava.' }
    ],
    CAMPFIRE: [
      { name: 'Ashen Rest', description: 'A relatively cool pile of ash to catch your breath.' }
    ],
    BOSS: [
      { name: 'Core of the Volcano', description: 'The heart of the sanctum, bubbling with molten rock.' }
    ],
    EVENT: [
      { name: 'Molten Fissure', description: 'A crack in the earth reveals a glowing object stuck in the magma.' },
      { name: 'Demonic Pact', description: 'A binding circle etched in soot offers a dangerous bargain.' }
    ],
    SHOP: [
      { name: 'Ember Merchant', description: 'An elemental trader selling goods forged in eternal fire.' }
    ]
  },
  {
    themeName: 'The Whispering Woods',
    BATTLE: [
      { name: 'Overgrown Path', description: 'Thick vines obscure the path and the feral beasts lurking within.' },
      { name: 'Hunter\'s Camp', description: 'A ruined campsite overrun by wild predators.' }
    ],
    SHRINE: [
      { name: 'Sylvan Shrine', description: 'An ancient tree radiating with nature\'s healing touch.' }
    ],
    ELITE: [
      { name: 'Alpha\'s Den', description: 'The lair of the pack leader, surrounded by gnawed bones.' }
    ],
    CAMPFIRE: [
      { name: 'Clearing in the Woods', description: 'A peaceful grassy spot illuminated by moonlight.' }
    ],
    BOSS: [
      { name: 'Heart of the Forest', description: 'A massive corrupted tree where the beast reigns.' }
    ],
    EVENT: [
      { name: 'Fairy Ring', description: 'A circle of mushrooms that seems to hum with fey magic.' },
      { name: 'Tangled Thicket', description: 'Something glimmers deep within the thorny bushes.' }
    ],
    SHOP: [
      { name: 'Wandering Trader', description: 'A lost merchant with an oversized backpack offering exotic supplies.' }
    ]
  },
  {
    themeName: 'The Crystalline Spire',
    BATTLE: [
      { name: 'Prism Gate', description: 'Refracting light creates illusions to confuse intruders.' },
      { name: 'Mana Font', description: 'Raw arcane energy coalesces into aggressive constructs.' }
    ],
    SHRINE: [
      { name: 'Arcane Focus', description: 'A perfectly cut gem that restores magical vigor.' }
    ],
    ELITE: [
      { name: 'Golem\'s Pedestal', description: 'An elite crystalline construct awakens to defend the spire.' }
    ],
    CAMPFIRE: [
      { name: 'Resonance Chamber', description: 'A quiet room where the humming crystals soothe the mind.' }
    ],
    BOSS: [
      { name: 'Apex Observatory', description: 'The very top of the spire, open to the astral plane.' }
    ],
    EVENT: [
      { name: 'Shattered Mirror', description: 'A floating mirror shard reflects a reality that isn\'t your own.' },
      { name: 'Energy Nexus', description: 'A swirling vortex of raw magical energy that could be harnessed.' }
    ],
    SHOP: [
      { name: 'Arcane Vendor', description: 'A magical projection trading artifacts for gold.' }
    ]
  }
];

export function generateDungeonFloor(
  floorNumber: number,
  rng: IRandomNumberGenerator
): DungeonFloor {
  const isIgnis = floorNumber % 2 === 1 ? rng.rollChance(0.7) : rng.rollChance(0.3);
  const bossId = isIgnis ? 'ignis-dragon' : 'lich-lord';
  const bossName = isIgnis ? 'Ignis the Fire Drake' : 'Malakor the Lich Lord';
  
  // Pick a random theme
  const theme = rng.pickOne(DUNGEON_THEMES);

  const floorTitle = `Floor ${floorNumber}: ${theme.themeName}`;

  // Step 1 node types: BATTLE / [EVENT | SHRINE]
  const step1Node2Type = rng.pickOne(['EVENT', 'SHRINE']) as 'EVENT' | 'SHRINE';
  // Step 2 node types: ELITE / [CAMPFIRE | SHOP]
  const step2Node2Type = rng.pickOne(['CAMPFIRE', 'SHOP']) as 'CAMPFIRE' | 'SHOP';
  // Step 3 node types: ELITE / [CAMPFIRE | EVENT]
  const step3Node2Type = rng.pickOne(['CAMPFIRE', 'EVENT']) as 'CAMPFIRE' | 'EVENT';

  const battle1 = rng.pickOne(theme.BATTLE);
  const battle2 = rng.pickOne(theme.BATTLE);
  
  const battle3 = rng.pickOne(theme.BATTLE);
  const node1_2 = rng.pickOne(theme[step1Node2Type]);

  const elite1 = rng.pickOne(theme.ELITE);
  const node2_2 = rng.pickOne(theme[step2Node2Type]);

  const elite2 = rng.pickOne(theme.ELITE);
  const node3_2 = rng.pickOne(theme[step3Node2Type]);

  const bossNode = rng.pickOne(theme.BOSS);

  const nodes: Record<string, DungeonNode> = {
    // Step 0: Entrance (2 Battle Paths)
    'node-0-0': {
      id: 'node-0-0',
      step: 0,
      type: 'BATTLE',
      name: battle1.name,
      description: battle1.description,
      isCompleted: false,
      isCurrent: false,
      isAvailable: true,
      nextIds: ['node-1-0', 'node-1-1'],
      enemyTypes: ['Scout'],
    },
    'node-0-1': {
      id: 'node-0-1',
      step: 0,
      type: 'BATTLE',
      name: battle2.name,
      description: battle2.description,
      isCompleted: false,
      isCurrent: false,
      isAvailable: true,
      nextIds: ['node-1-0', 'node-1-1'],
      enemyTypes: ['Beast'],
    },

    // Step 1: Encounter / (Shrine or Event)
    'node-1-0': {
      id: 'node-1-0',
      step: 1,
      type: 'BATTLE',
      name: battle3.name,
      description: battle3.description,
      isCompleted: false,
      isCurrent: false,
      isAvailable: false,
      nextIds: ['node-2-0', 'node-2-1'],
      enemyTypes: ['Shaman'],
    },
    'node-1-1': {
      id: 'node-1-1',
      step: 1,
      type: step1Node2Type,
      name: node1_2.name,
      description: node1_2.description,
      isCompleted: false,
      isCurrent: false,
      isAvailable: false,
      nextIds: ['node-2-0', 'node-2-1'],
    },

    // Step 2: Elite / (Campfire or Shop)
    'node-2-0': {
      id: 'node-2-0',
      step: 2,
      type: 'ELITE',
      name: elite1.name,
      description: elite1.description,
      isCompleted: false,
      isCurrent: false,
      isAvailable: false,
      nextIds: ['node-3-0', 'node-3-1'],
      enemyTypes: ['Undead Guard'],
    },
    'node-2-1': {
      id: 'node-2-1',
      step: 2,
      type: step2Node2Type,
      name: node2_2.name,
      description: node2_2.description,
      isCompleted: false,
      isCurrent: false,
      isAvailable: false,
      nextIds: ['node-3-0', 'node-3-1'],
    },

    // Step 3: Pre-Boss Preparation
    'node-3-0': {
      id: 'node-3-0',
      step: 3,
      type: 'ELITE',
      name: elite2.name,
      description: elite2.description,
      isCompleted: false,
      isCurrent: false,
      isAvailable: false,
      nextIds: ['node-4-boss'],
      enemyTypes: ['Dark Mage'],
    },
    'node-3-1': {
      id: 'node-3-1',
      step: 3,
      type: step3Node2Type,
      name: node3_2.name,
      description: node3_2.description,
      isCompleted: false,
      isCurrent: false,
      isAvailable: false,
      nextIds: ['node-4-boss'],
    },

    // Step 4: Boss Climax
    'node-4-boss': {
      id: 'node-4-boss',
      step: 4,
      type: 'BOSS',
      name: `${bossNode.name}: ${bossName}`,
      description: bossNode.description,
      isCompleted: false,
      isCurrent: false,
      isAvailable: false,
      nextIds: [],
      bossId,
    },
  };

  return {
    floorNumber,
    name: floorTitle,
    nodes,
    startNodeIds: ['node-0-0', 'node-0-1'],
    bossNodeId: 'node-4-boss',
  };
}

export function createInitialDungeonState(rng: IRandomNumberGenerator): DungeonState {
  const floor = generateDungeonFloor(1, rng);
  return {
    currentFloor: 1,
    currentNodeId: null,
    floor,
    isRunCompleted: false,
  };
}

export function advanceToNextDungeonFloor(
  dungeon: DungeonState,
  rng: IRandomNumberGenerator
): DungeonState {
  const nextFloorNumber = dungeon.currentFloor + 1;
  const newFloor = generateDungeonFloor(nextFloorNumber, rng);

  return {
    currentFloor: nextFloorNumber,
    currentNodeId: null,
    floor: newFloor,
    isRunCompleted: false,
  };
}

/**
 * Advances the dungeon state to a chosen available node.
 */
export function selectDungeonNode(
  dungeon: DungeonState,
  nodeId: string
): DungeonState {
  const node = dungeon.floor.nodes[nodeId];
  if (!node || !node.isAvailable) return dungeon;

  const nextNodes: Record<string, DungeonNode> = {};
  for (const [id, n] of Object.entries(dungeon.floor.nodes)) {
    nextNodes[id] = { ...n, isCurrent: id === nodeId };
  }

  return {
    ...dungeon,
    currentNodeId: nodeId,
    floor: {
      ...dungeon.floor,
      nodes: nextNodes,
    },
  };
}

/**
 * Completes the active node and unlocks the next branching step nodes.
 */
export function completeDungeonNode(
  dungeon: DungeonState,
  nodeId: string
): DungeonState {
  const current = dungeon.floor.nodes[nodeId];
  if (!current) return dungeon;

  const nextNodes: Record<string, DungeonNode> = {};
  for (const [id, n] of Object.entries(dungeon.floor.nodes)) {
    nextNodes[id] = { ...n };
  }

  // Mark current as completed
  nextNodes[nodeId] = {
    ...current,
    isCompleted: true,
    isAvailable: false,
  };

  // Lock all other nodes at the same step
  for (const [id, n] of Object.entries(nextNodes)) {
    if (n.step === current.step && id !== nodeId) {
      nextNodes[id] = { ...n, isAvailable: false };
    }
  }

  // Unlock all child nodes linked in nextIds
  current.nextIds.forEach((childId) => {
    if (nextNodes[childId]) {
      nextNodes[childId] = {
        ...nextNodes[childId],
        isAvailable: true,
      };
    }
  });

  const isBossCompleted = current.type === 'BOSS';

  return {
    ...dungeon,
    floor: {
      ...dungeon.floor,
      nodes: nextNodes,
    },
    isRunCompleted: isBossCompleted,
  };
}
