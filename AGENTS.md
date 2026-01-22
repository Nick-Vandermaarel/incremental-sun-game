# Solar Incremental Game - Agent Instructions

## Project Overview

Build an incremental/idle game where players click the sun to harvest energy, purchase generators for passive income, and progress toward building a Dyson Sphere.

## Tech Stack

- **Frontend:** Vue 3 (Composition API, `<script setup>`)
- **Language:** TypeScript (strict mode)
- **Desktop/Mobile:** Tauri v2
- **Package Manager:** Bun
- **State Management:** Pinia
- **Styling:** Tailwind CSS

## Core Game Loop

1. Player clicks the sun → gains Power
2. Power buys generators → passive Power/sec
3. Power buys upgrades → multipliers and bonuses
4. Progression unlocks new generator tiers
5. Eventually: prestige mechanic (optional, later)

## Primary Resource

- **Power** - Single abstract resource
- Display with unit scaling: `1K → 1M → 1B → 1T`

## Generators (in order of unlock)

| Tier | Name               | Base Cost   | Base Output |
| ---- | ------------------ | ----------- | ----------- |
| 1    | Solar Array        | 10          | 0.1/sec     |
| 2    | Lunar Collector    | 100         | 1/sec       |
| 3    | Fusion Plant       | 1,000       | 8/sec       |
| 4    | Asteroid Harvester | 10,000      | 50/sec      |
| 5    | Gas Giant Siphon   | 100,000     | 300/sec     |
| 6    | Dyson Swarm Node   | 1,000,000   | 2,000/sec   |
| 7    | Dyson Sphere       | 100,000,000 | 20,000/sec  |

Cost scaling: `baseCost * 1.15^owned`

## Upgrades

### Click Upgrades

- Focused Lens: +1 Power per click
- Solar Concentrators: +50% Power per click
- Quantum Tap: Click gains 1% of Power/sec

### Generator Upgrades (per type)

- Efficiency I/II/III: +25%/50%/100% output
- Automation: -10% cost for this generator type

### Global Upgrades

- Synergy: Each generator type boosts others by 1%
- Offline Progress: Gain 50% of Power/sec while away (calc on load)

## UI Structure

```
┌─────────────────────────────────────┐
│  Power: 1.5M    (+2.3K/sec)         │
├─────────────────────────────────────┤
│                                     │
│            [  SUN  ]                │
│         (click target)              │
│                                     │
├─────────────────────────────────────┤
│  Generators          │  Upgrades    │
│  ─────────────       │  ─────────   │
│  Solar Array (5)     │  [Upgrade]   │
│  [Buy - 15 Power]    │  [Upgrade]   │
│  ...                 │  ...         │
└─────────────────────────────────────┘
```

## File Structure

```
src/
├── App.vue
├── main.ts
├── stores/
│   └── gameStore.ts        # Pinia store for all game state
├── composables/
│   └── useGameLoop.ts      # setInterval tick logic
├── components/
│   ├── SunClicker.vue      # Main clickable sun
│   ├── PowerDisplay.vue    # Current power + rate
│   ├── GeneratorList.vue   # List of purchasable generators
│   ├── GeneratorItem.vue   # Single generator row
│   ├── UpgradeList.vue     # Available upgrades
│   └── UpgradeItem.vue     # Single upgrade button
├── utils/
│   ├── formatNumber.ts     # 1000 → "1K" formatting
│   └── saveLoad.ts         # localStorage persistence
└── types/
    └── game.ts             # TypeScript interfaces
```

## Implementation Rules

### DO

- Use `<script setup lang="ts">` for all components
- Keep components small and focused
- Use Pinia for all game state
- Use `computed` for derived values (canAfford, powerPerSec)
- Persist to localStorage on every purchase and every 30 seconds
- Calculate offline progress on app load
- Use CSS transitions for feedback (click pulse, purchase flash)
- Make the sun visually satisfying to click

### DON'T

- No Options API
- No any types - define interfaces
- No complex abstractions - keep it flat and readable
- No external state libraries beyond Pinia
- No over-engineering - simplest solution wins

## Game Loop Implementation

```typescript
// useGameLoop.ts pattern
const TICK_RATE = 100; // ms
let lastTick = Date.now();

setInterval(() => {
  const now = Date.now();
  const delta = (now - lastTick) / 1000;
  lastTick = now;

  gameStore.addPower(gameStore.powerPerSecond * delta);
}, TICK_RATE);
```

## Save/Load Pattern

```typescript
// On purchase or every 30s
localStorage.setItem(
  "solarGame",
  JSON.stringify({
    power: gameStore.power,
    generators: gameStore.generators,
    upgrades: gameStore.upgrades,
    lastSave: Date.now(),
  }),
);

// On load
const save = JSON.parse(localStorage.getItem("solarGame"));
if (save) {
  const offlineSeconds = (Date.now() - save.lastSave) / 1000;
  const offlineGain = calculatePowerPerSec(save) * offlineSeconds * 0.5;
  // Apply save + offline gains
}
```

## Visual Style

- Dark space theme
- Sun should glow/pulse on click
- Numbers should animate when changing
- Generators show visual count or progress bar
- Subtle particle effects optional (don't over-scope)

## MVP Scope (Phase 1)

1. Clickable sun that grants Power
2. Power display with formatting
3. First 3 generators purchasable
4. Basic persistence
5. Working game loop

## Phase 2 (After MVP works)

- Remaining generators
- Upgrade system
- Offline progress
- Visual polish

## Phase 3 (Stretch)

- Prestige system
- Events (solar flares, pirates)
- Achievements
- Sound effects

---

**Start with Phase 1. Get the core loop working before adding complexity.**
