# Pokémon Stadium Team Randomizer

A React application designed to build balanced 6-Pokémon teams categorized by competitive tiers for **Nintendo 64's Pokémon Stadium** (with support for **Pokémon Stadium 2** planned for future releases).

---

## 📖 Spec-Driven Development (SDD) Documentation

Comprehensive architectural and functional specifications are available in the [`docs/`](./docs/README.md) directory:

- [**01. System Architecture & Design**](./docs/01-system-architecture.md)
- [**02. Domain Models & Data Schemas**](./docs/02-domain-models-and-schemas.md)
- [**03. Functional Specifications & User Flows**](./docs/03-functional-specifications.md)
- [**04. Future Extensions & Roadmap (Stadium 2)**](./docs/04-future-extensions-roadmap.md)
- [**05. SDD Change Management Guide**](./docs/05-sdd-change-management-guide.md)

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v14+ recommended)
- `npm` or `yarn`

### Installation & Run

1. Clone the repository and navigate to the project root:
   ```bash
   cd pokemon-randomizer
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### URL Parameters & Shortcuts

You can jump directly to the Hall of Fame presentation stage with a randomized or pre-configured team using URL query parameters:

- **Jump to Presentation with Random Team**:
  - `http://localhost:3000/?presentation=true`
  - Shortcuts supported: `?presentation`, `?view=presentation`, `?mode=presentation`, `?stage=presentation`, `?skip=presentation`, `?hof=true`, `?halloffame=true`
- **Jump to Presentation with Custom Team (IDs or Names)**:
  - `http://localhost:3000/?presentation=true&team=1,4,7,25,150,151`
  - `http://localhost:3000/?presentation=true&team=Bulbasaur,Charizard,Blastoise,Pikachu,Mewtwo,Mew`

---

## 💡 Ideas & Roadmap

### Improvements
- [x] Display different backgrounds according to Pokémon type, accompanied by the cry audio ([Type icons](https://commons.wikimedia.org/wiki/Category:Pok%C3%A9mon_types_icons))
- [ ] Update Pokémon dataset with accurate Stadium 1 stats and data
- [x] Display base stats and tier badges
- [x] Replace CSS Pokéball styling with images to represent other Pokéball types
- [ ] Calculate dynamic tier ratings based on base stats, movesets, and types
- [x] Improve background styling and interactive instructions when selecting Pokéballs
- [x] Add HUD indicator to show which column the Pokémon is positioned in (3 horizontal lines with active green highlight)
- [ ] Detect browser and show button to get mobile app
- [ ] Fix Pokemon images to display correctly (in the ground)

### Game Modes
- [x] Balanced matchmaking mode based on Pokémon tier distribution
- [ ] Probability-based draft mode weighted by Pokéball tier

---

## 🐛 Bug Tracker

- [x] Gray background Pokéball remained fixed while other components scrolled
- [ ] Fix color in IOS/dark mode, shows black lines like light grey


---

## 📚 Sources & References

- [Nintendo Fandom — First Generation Pokémon Images](https://nintendo.fandom.com/wiki/Category:First_generation_Pok%C3%A9mon_images)
- [The Sounds Resource — Pokémon Stadium Sound Effects & Cries](https://www.sounds-resource.com/nintendo_64/pokemonstadium/sound/34243/)
- [GitHub — Purukitto/pokemon-data.json](https://github.com/Purukitto/pokemon-data.json/tree/master)
- [TierMaker — First Generation Pokémon Tier List](https://tiermaker.com/categories/pokemon/pokemon-first-generation-62534)
- [Pokémon Fandom — Generation I Pokémon List](https://pokemon.fandom.com/es/wiki/Lista_de_Pok%C3%A9mon_de_la_primera_generaci%C3%B3n)
