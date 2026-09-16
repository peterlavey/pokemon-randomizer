# 01 - System Architecture & Design

## 1. Technical Stack Overview

| Layer / Concern | Technology | Version | Purpose |
|---|---|---|---|
| **Core Framework** | React | `^18.2.0` | Declarative UI rendering and component-driven view management |
| **Styling** | SASS / SCSS | `^1.63.6` | Modular, component-scoped animations and responsive styling |
| **Data Visualization** | Chart.js & `react-chartjs-2` | `^4.3.0` / `^5.2.0` | Radar charts for base stat distribution |
| **Audio Engine** | Howler.js & HTML5 Audio | `^2.2.4` | Cross-browser sound effect handling and iOS audio unlocks |
| **Build & Tooling** | React Scripts (CRA) | `5.0.1` | Webpack build pipeline, testing harness, asset bundling |

---

## 2. Component Hierarchy & Layout

```
App
└── SoundProvider (SoundContext)
    └── Team
        ├── Pokeballs (Team Slot Tracker - Header)
        │   └── Pokeball (x6 items, animations: wiggle, catch)
        ├── ChoosePokeballs (State: CHOOSE)
        │   └── Carousel (Pokeball selection per tier: Normal, Super, Ultra, Master)
        ├── PokeButton (State: OPEN)
        │   └── Interactive Pokeball button to trigger generation
        ├── Reveal (State: REVEAL)
        │   └── Mobile
        │       ├── Type (Badge tags)
        │       └── Stats
        │           └── Radar (Chart.js Radar rendering Base HP, ATK, DEF, SPA, SPD, SPE)
        ├── Presentation (State: COMPLETED)
        │   ├── Staged Pokémon Lineup (dynamic scaling, z-index, flying/jumping offsets)
        │   └── TeamInfo (Summary table / grid)
        │       └── MemberInfo (individual card summary)
        └── Sound (Mute/Unmute toggle widget)
```

---

## 3. Application State Machine

The core `Team` component acts as a deterministic state machine managing the team assembly lifecycle:

```
                  ┌──────────────────────┐
                  │    INITIAL LOAD      │
                  └──────────┬───────────┘
                             │
                             ▼
                  ┌──────────────────────┐
                  │    STATE: CHOOSE     │ <─────── User selects 6 Pokeballs (Tiers)
                  └──────────┬───────────┘
                             │ Pokeballs.length === 6
                             ▼
              ┌─────────> ┌──────────────────────┐
              │           │     STATE: OPEN      │ <─────── Click active Pokeball to catch
              │           └──────────┬───────────┘
              │                      │ Pokemon drawn (not yet revealed)
              │                      ▼
              │           ┌──────────────────────┐
              │           │    STATE: REVEAL     │ <─────── Shows Radar, Type, Stats, Cry SFX
              │           └──────────┬───────────┘
              │                      │ User clicks / confirms dismissal
              │                      ▼
              └── [pokemonTeam.length < 6] ? 
                                     │
                     [pokemonTeam.length === 6]
                                     │
                                     ▼
                          ┌──────────────────────┐
                          │   STATE: COMPLETED   │ <─────── Showcase, height scaling, full cry
                          └──────────────────────┘
```

### State Definitions

1. **`CHOOSE`**: The user configures their desired team tier balance by adding 6 Pokeballs to the tray.
2. **`OPEN`**: Pokeballs are ready. The user interacts with the current slot's Pokeball to trigger random selection from the corresponding tier pool.
3. **`REVEAL`**: The chosen Pokémon is unveiled with animated entry, audio cry, stat radar chart, and profile details.
4. **`COMPLETED`**: All 6 members have been revealed. The system calculates comparative height ratios, arranges them in an aesthetic stage layout, plays the victory theme, and displays the full roster stats.

---

## 4. State Management & Contexts

### 4.1 SoundContext (`src/contexts/soundContext.js`)
- Manages global audio playback states (`soundOn`), volume levels, and shared audio instances.
- Handles browser autoplay policies and provides iOS compatibility wrappers via Howler.js.
- Controls background intro music and victory fanfare triggers.

### 4.2 Team Local State (`src/components/team/team.js`)
- `pokeballs`: Array of 6 Pokeball configuration objects defining the tier rules for each slot.
- `pokemonTeam`: Array of selected Pokémon objects (0 to 6 elements).
- `pokemon`: The currently active Pokémon object being revealed, or `undefined` when between states.
- `state`: Active state identifier (`CHOOSE`, `OPEN`, `REVEAL`, `COMPLETED`).

---

## 5. Asset Delivery Architecture

To ensure fast load times and keep the repository lean:
- **High-Resolution Artwork & Cries**: Served via CDN (`https://cdn.jsdelivr.net/gh/peterlavey/pokemon-content/`).
- **Sprites & Thumbnails**: Sourced from raw Github CDN (`Purukitto/pokemon-data.json`).
- **Pokeball SVGs**: Vector graphics optimized for scaling and animation states.
- **Audio Assets**: Preloaded asynchronously via `preloadAudio` and `preloadAudioIos` utilities to eliminate playback lag during reveal animations.
