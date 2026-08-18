/**
 * Aetherbound Chronicles: Lore Fragments of the Void Loop
 * Unlocked progressively as the player amasses Lifetime Soul Shards across runs.
 */

export interface LoreFragment {
  id: string;
  chapter: number;
  title: string;
  shardsRequired: number;
  subtitle: string;
  speaker: string;
  quote: string;
  body: string[];
}

export const LORE_CHRONICLES: LoreFragment[] = [
  {
    id: 'chapter-1',
    chapter: 1,
    title: 'The Recursion Paradox',
    shardsRequired: 0,
    subtitle: 'Awakening in the Astral Sanctum',
    speaker: 'Chronicle Fragment #01',
    quote: 'You are neither living nor dead. You are Aetherbound—caught in the loop until the void itself breaks.',
    body: [
      'You awaken in the Astral Sanctum with burning lungs and fractured memories of a violent demise deep in the subterranean abyss.',
      'Death in this realm is not finality; it is merely a reset. Your mortal vessel dissolves, but your conscious essence is pulled back by the Aether to the celestial sanctuary.',
      'The loop binds every soul who enters the Hollows. To escape the eternal recurrence, one must descend through every floor, claim the lost soul shards of previous cycles, and shatter the dimensional anchor holding the loop intact.',
    ],
  },
  {
    id: 'chapter-2',
    chapter: 2,
    title: 'Echoes of the Lost',
    shardsRequired: 50,
    subtitle: 'Origins of the Hostile Denizens',
    speaker: 'Chronicle Fragment #02',
    quote: 'The monsters do not spawn from darkness—they are wanderers who forgot their own names.',
    body: [
      'The harrowing beasts and cultists that stalk the catacombs were once heroes, adventurers, and scholars just like you.',
      'Without an anchor to the Aether, repeated cycles slowly corrode the mind. Memories erode, purpose fades, and only primal instinct and malice remain.',
      'When you slay a monster in combat, you are not merely destroying a threat—you are releasing a trapped soul fragment back into the great astral current.',
    ],
  },
  {
    id: 'chapter-3',
    chapter: 3,
    title: 'Crystallized Memories',
    shardsRequired: 150,
    subtitle: 'The True Nature of Soul Shards',
    speaker: 'Chronicle Fragment #03',
    quote: 'What we harvest as shards is the calcified history of a shattered empire.',
    body: [
      'The glowing cerulean crystals known as Soul Shards are the condensed memories and raw kinetic aether of fallen civilizations.',
      'Centuries ago, the ancient mages of Aethelgard attempted to harness eternal life through an astral resonance matrix. The catastrophic surge collapsed physical spacetime into a closed recursive loop.',
      'As you gather shards across your journeys, fragments of forgotten martial disciplines, ancient spells, and sacred relics reawaken within the Sanctum.',
    ],
  },
  {
    id: 'chapter-4',
    chapter: 4,
    title: 'The Shifting Catacombs',
    shardsRequired: 350,
    subtitle: 'The Living Architecture of the Hollows',
    speaker: 'Chronicle Fragment #04',
    quote: 'The walls breathe, corridors realign, and the path forward is never the same twice.',
    body: [
      'No two expeditions into the Hollows are identical. The Hollows is not a static tomb of stone, but a hyper-dimensional labyrinth that rearranges its chambers between cycles.',
      'Shrines, campfire sanctuaries, and dilemma events appear and vanish like spectral mirages.',
      'Only the central guardians—the Elites and Floor Bosses—remain stationed at key spatial intersections, acting as locks that seal the deeper descents.',
    ],
  },
  {
    id: 'chapter-5',
    chapter: 5,
    title: 'The Astral Architect',
    shardsRequired: 750,
    subtitle: 'The Origin of the Sanctum',
    speaker: 'Chronicle Fragment #05',
    quote: 'Someone built this refuge outside time so that one day, a chosen hero could finish the ascent.',
    body: [
      'The Astral Sanctum is an artificial pocket dimension anchored outside the normal flow of the loop.',
      'It was forged by the first Arch-Mage who recognized the recursion paradox. Knowing their own mind would eventually succumb to madness, they created the Sanctum as a persistent repository.',
      'Every permanent talent blessing and unlocked archetype you purchase with Soul Shards is a step toward fulfilling the Architect’s final blueprint.',
    ],
  },
  {
    id: 'chapter-6',
    chapter: 6,
    title: 'The Abyssal Singularity',
    shardsRequired: 1500,
    subtitle: 'The Heart of the Loop',
    speaker: 'Chronicle Fragment #06',
    quote: 'At the floor of the deepest abyss burns a black sun that feeds upon our perpetual struggle.',
    body: [
      'Deep beneath the magma caverns and necrotic tombs lies the core of the catastrophe: the Void Singularity.',
      'It functions as a cosmic gravity well, drawing in fallen timeline branches and resetting the clock every time an expedition party perishes.',
      'The wardens stationed throughout the depths are chained to this core. To sever their chains and defeat them is to weaken the Singularity’s gravitational pull on your reality.',
    ],
  },
  {
    id: 'chapter-7',
    chapter: 7,
    title: 'Resonance of the Ascendant',
    shardsRequired: 3000,
    subtitle: 'The Loop Begins to Destabilize',
    speaker: 'Chronicle Fragment #07',
    quote: 'The Void trembles when you step into the arena. You are no longer its prisoner; you are its undoing.',
    body: [
      'With thousands of soul shards accumulated within your astral matrix, the fundamental rules of the loop begin to bend.',
      'Spells strike with catastrophic force, relic synergies surge with cosmic intensity, and the shadow illusions projected by the dungeon fail to deceive your senses.',
      'The boundary between the Sanctum and the outer universe grows gossamer thin. The cycle is running out of iterations.',
    ],
  },
  {
    id: 'chapter-8',
    chapter: 8,
    title: 'Shattering the Horizon',
    shardsRequired: 5000,
    subtitle: 'The Final Liberation',
    speaker: 'Chronicle Fragment #08',
    quote: 'Gather the shards. Conquer the depths. Break the loop and return the dawn to the world.',
    body: [
      'Five thousand crystallized souls resonate as a single brilliant beacon inside the Astral Sanctum.',
      'When the ultimate boss of the Hollows is vanquished under this celestial resonance, the Void Singularity will collapse in on itself, dissolving the recursive temporal boundary once and for all.',
      'The Aetherbound will awaken not in a sanctuary between dimensions, but beneath the open, starlit sky of a restored world.',
    ],
  },
];

/**
 * Returns all lore fragments unlocked for a given lifetime Aetherium amount
 */
export function getUnlockedLoreFragments(lifetimeAetherium: number): LoreFragment[] {
  return LORE_CHRONICLES.filter((f) => lifetimeAetherium >= f.shardsRequired);
}

/**
 * Returns the next locked lore milestone
 */
export function getNextLoreMilestone(lifetimeAetherium: number): {
  nextTarget: number;
  fragment: LoreFragment | null;
  progressPercent: number;
} {
  const next = LORE_CHRONICLES.find((f) => lifetimeAetherium < f.shardsRequired);
  if (!next) {
    return {
      nextTarget: 5000,
      fragment: null,
      progressPercent: 100,
    };
  }
  const prevRequired = LORE_CHRONICLES[next.chapter - 2]?.shardsRequired || 0;
  const range = next.shardsRequired - prevRequired;
  const current = Math.max(0, lifetimeAetherium - prevRequired);
  const progressPercent = Math.min(100, Math.round((current / range) * 100));

  return {
    nextTarget: next.shardsRequired,
    fragment: next,
    progressPercent,
  };
}
