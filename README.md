# Solar Incremental Game

A Vue 3 + TypeScript incremental/idle game where players harvest energy from the sun.

## Features

- Click the sun to harvest Power
- Purchase generators for passive income
- Buy upgrades to boost your progress
- Automatic save every 30 seconds
- Offline progress calculation
- Number formatting (1K, 1M, 1B, 1T)

## Project Structure

```
src/
├── App.vue                    # Main app component
├── main.ts                    # App entry point
├── stores/
│   └── gameStore.ts           # Pinia store for game state
├── composables/
│   └── useGameLoop.ts         # Game loop logic
├── components/
│   ├── SunClicker.vue         # Clickable sun component
│   ├── PowerDisplay.vue       # Power display component
│   ├── GeneratorList.vue      # List of generators
│   ├── GeneratorItem.vue      # Single generator item
│   ├── UpgradeList.vue        # List of upgrades
│   └── UpgradeItem.vue        # Single upgrade item
├── utils/
│   ├── formatNumber.ts        # Number formatting utilities
│   └── saveLoad.ts            # localStorage persistence
├── types/
│   └── game.ts                # TypeScript interfaces
└── style.css                  # Tailwind CSS styles
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open http://localhost:5173 in your browser.

### Build

```bash
npm run build
```

The built files will be in the `dist/` directory.

## Tech Stack

- Vue 3 (Composition API, `<script setup>`)
- TypeScript (strict mode)
- Pinia (state management)
- Tailwind CSS (styling)
- Vite (build tool)

## Game Mechanics

### Generators

| Tier | Name | Base Cost | Base Output |
|------|------|-----------|-------------|
| 1 | Solar Array | 10 | 0.1/sec |
| 2 | Lunar Collector | 100 | 1/sec |
| 3 | Fusion Plant | 1,000 | 8/sec |
| 4 | Asteroid Harvester | 10,000 | 50/sec |
| 5 | Gas Giant Siphon | 100,000 | 300/sec |
| 6 | Dyson Swarm Node | 1,000,000 | 2,000/sec |
| 7 | Dyson Sphere | 100,000,000 | 20,000/sec |

Cost scaling: `baseCost * 1.15^owned`

### Upgrades

- **Click Upgrades**: Boost your clicking power
- **Generator Upgrades**: Boost specific generator output
- **Global Upgrades**: Boost all generators

## License

MIT
