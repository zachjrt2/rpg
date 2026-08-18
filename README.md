# ⚔️ Aetherbound: Chained to the Deep

A dark tactical roguelite deckbuilder RPG built with **React**, **TypeScript**, and **Vite**. Features pure Web Audio API procedural sound effects, element-specific damage particle physics, telegraphed enemy intents, multi-floor dungeon progression, card drafts, elite/boss relic drafts, martial skill training, and persistent Astral Sanctum meta-progression.

---

## 🚀 Quick Start & Testing Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Local Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your web browser to play the game with instant hot module reloading (HMR).

### 3. Run Automated Tests
```bash
npm test
```
Runs the full **Vitest** test suite covering damage calculations, card scaling, deck cycles, AI intents, status synergy, and meta-progression.

### 4. Build for Production
```bash
npm run build
```
Typechecks and compiles optimized production assets to the `dist/` directory.

### 5. Preview Production Bundle
```bash
npm run preview
```

---

## 🎮 Controls & Keyboard Hotkeys

| Key | Action |
|:---|:---|
| `1` – `9` | Play card from hand by position |
| `Space` or `E` | End turn / Advance victory reward screens |
| `Q`, `W`, `E`, `R`, `T` | Use quick-bar consumables (potions, bombs, scrolls) |
| `D` | Open Grimoire Archive / Full Deck Collection |
| `M` | Toggle Dungeon Expedition Map |
| `S` | Open Outpost Merchant Shop |
| `Esc` | Close open modal dialogues |

---

## 🏛️ Roguelite Loop & Mechanics

- **Battle Rewards**:
  - **Regular Encounters**: Yield Gold, EXP, Soul Shards, and a 3-Card Reward Draft.
  - **Elite Encounters**: Yield Gold, EXP, Soul Shards, a 3-Card Reward Draft, and an Elite Relic Draft!
  - **Boss Encounters**: Yield massive Gold, EXP, Soul Shards, a 3-Card Reward Draft, and a Legendary Boss Relic Draft!
- **Martial Skill Trainer**: Spend in-run gold to hone core attributes (Strength, Dexterity, Intelligence, Vitality, Willpower, Luck).
- **Astral Sanctum**: Spend collected Soul Shards (Aetherium) between runs to permanently unlock hero classes, card archetypes, starting relics, and expand starting card and relic loadout capacities with 9-to-15 tier endgame progression.
- **Dynamic Audio Engine**: Dual background music tracks with instant battle/exploration cross-cancellation, procedural spell audio, and independent Music & SFX sliders in the top header.
- **Mobile & Touch Optimized**: Fully responsive layout with touch-scrollable card fan, sliding command drawer, bottom-sheet combat logs, and thumb-friendly controls.
