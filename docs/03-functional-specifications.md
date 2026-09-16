# 03 - Functional Specifications & User Flows

This document outlines the detailed functional requirements, user interactions, algorithms, and visual behaviors across the 4 core phases of the application.

---

## 1. Phase 1: Team Configuration (`CHOOSE`)

### 1.1 Objective
Allow the player to define the power balance of their 6-Pokémon team by selecting 6 Pokeballs.

### 1.2 User Flow & Mechanics
1. **Initial Screen**: The user is presented with a carousel of 4 Pokeball types:
   - **Pokeball (Normal)**: Low/Entry Tiers (`D`, `C`)
   - **Superball**: Mid Tier (`B`)
   - **Ultraball**: High Tier (`A`)
   - **Masterball**: Top/Legendary Tier (`S`)
2. **Selection**: Clicking a Pokeball adds it to the user's tray (`pokeballs` state array).
3. **Slot Tracking**: The top HUD displays the selected Pokeballs in order (slots 1 through 6).
4. **Transition**: Once `pokeballs.length === 6`, the application automatically transitions from `CHOOSE` to `OPEN`.

---

## 2. Phase 2: Pokeball Unsealing (`OPEN`)

### 2.1 Objective
Provide suspense and tactile feedback as each member of the roster is randomly generated.

### 2.2 User Flow & Mechanics
1. **Interactive Trigger**: The user is presented with a central interactive button (`PokeButton`) styled as the Pokeball corresponding to the current slot index (`pokemonTeam.length`).
2. **Generation Trigger**: When clicked, the application triggers `getPokemon()`:
   - Identifies the allowed tiers for the current Pokeball (`getCurrentPokeball().tiers`).
   - Filters the Pokémon database by those tiers via `getByTier(tiers)`.
   - Randomly samples a candidate via `getRandom(pokemonsFiltered)`.
   - **Uniqueness Guard**: Checks whether candidate exists in `pokemonTeam`. If duplicated, it recursively re-samples until a novel Pokémon is chosen.
   - Appends the unique candidate to `pokemonTeam` and sets `pokemon` as the active target.
3. **Transition**: Setting `pokemon` transitions the state machine to `REVEAL`.

---

## 3. Phase 3: Pokémon Reveal (`REVEAL`)

### 3.1 Objective
Disclose the generated Pokémon's stats, type affinities, and authentic N64 audio cry.

### 3.2 Visual & Audio Specifications
1. **Animated Entry**:
   - The Pokémon high-res sprite scales in with animation (`revealImage`).
   - The stat sheet slides in (`revealInfo`).
2. **Audio Cry**: Plays the authentic Pokémon cry (`pokemon.cry`) via HTML5 Audio / Howler.
3. **Radar Stat Visualization**:
   - Powered by Chart.js Radar (`src/components/team/reveal/mobile/stats/radar/radar.js`).
   - Renders 6 stat axes: HP, Attack, Defense, Sp. Atk, Sp. Def, Speed.
   - Scale limits: 0 to 160 with custom RGB theming.
4. **Information Badges**:
   - Primary and secondary Type badges.
   - Species, Height, Weight, and Pokédex summary.
5. **Dismissal & Next Step**:
   - Clicking anywhere on the screen clears the active `pokemon` (`setPokemon(undefined)`).
   - If `pokemonTeam.length < 6`, returns to `OPEN` for the next slot.
   - If `pokemonTeam.length === 6`, advances to `COMPLETED`.

---

## 4. Phase 4: Final Team Presentation (`COMPLETED`)

### 4.1 Objective
Showcase the complete 6-member squad in a stadium podium layout with dynamic height scaling and a full roster recap for Nintendo 64 entry.

### 4.2 Staging Algorithm (`prepareMembers`)
To prevent visual crowding and produce an authentic stadium team photo:
1. **Sort by Height**: Team members are sorted ascending by height (`a.height - b.height`).
2. **Podium Ordering**: Ordered into an aesthetic depth composition:
   - Index 0 (Back Center Left): `ordered[5]` (Tallest)
   - Index 1 (Front Left): `ordered[2]`
   - Index 2 (Back Center Right): `ordered[4]`
   - Index 3 (Front Right): `ordered[1]`
   - Index 4 (Back Center): `ordered[3]`
   - Index 5 (Front Center): `ordered[0]` (Shortest)
3. **Dynamic Scale Ratio**:
   $$\text{Rendered Width} = \left( \frac{\text{pokemon.height}}{\text{maxHeight}} \right) \times 200$$
4. **Z-Index Layering**: Calculated dynamically to ensure foreground members overlap background members properly:
   $$\text{zIndex} = \text{round}(\text{maxHeight} - \text{pokemon.height}) \times 10$$
5. **Elevation Adjustments**:
   - `isFlying === true`: positioned at `top: 5%`
   - `isJumping === true`: positioned at `top: 25%`

### 4.3 Victory Fanfare & Team Cry
1. Pauses intro theme.
2. Plays all 6 Pokémon cries simultaneously in celebration.
3. Plays the Stadium victory fanfare (`SFX_POKEMON_TEAM`).
4. Displays the `TeamInfo` summary grid with base stats for each Pokémon sorted by Pokédex ID.
