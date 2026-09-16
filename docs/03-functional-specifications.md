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
3. **Asset Preloading**: When each Pokeball is selected, a unique Pokémon candidate is preselected and its visual assets (high-res sprite, thumbnail/sprite) and audio cry (`pokemon.cry`) are preloaded in the background into the browser cache. This ensures instant audio playback and rendering during the `REVEAL` phase, preventing loading lag even when reveal animations are fast-forwarded.
4. **Slot Tracking**: The top HUD displays the selected Pokeballs in order (slots 1 through 6).
5. **Transition**: Once `pokeballs.length === 6`, the application automatically transitions from `CHOOSE` to `OPEN`.

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
1. **Animated Guessing & Reveal Sequence**:
   - **Sound-Only Guessing & Origin Phase** (`revealImage` 0%-30% / ~1.0s): The authentic Pokémon cry (`pokemon.cry`) plays via HTML5 Audio while the image remains completely hidden (`opacity: 0; transform: translateY(35%)`), centered alongside dynamic elemental particles emulating the Pokémon's type (e.g., flames for Fire, bubbles/droplets for Water, wind streaks for Flying, electricity zaps for Electric, leaves for Grass, etc.), allowing players to identify the Pokémon by audio and elemental particle cues.
   - **Silhouette Phase in Center** (`revealImage` 30%-60% / ~1.0s): Pokémon sprite smoothly fades in from transparent to fully visible as an unrevealed black silhouette (`brightness(0); transform: translateY(35%)`), positioned directly in the center of the display surrounded by type particles to provide visual shape clues.
   - **Full Color Transition & Particle Fade** (`revealImage` 60%-75% / ~0.5s): Sprite smoothly transitions its brightness from `brightness(0)` to full color (`brightness(1); transform: translateY(35%)`) at the center point, while particle generation halts and existing particles fade out completely (`opacity: 0` by 75%) to ensure a clean, unobstructed display.
   - **Ascension to Top Position** (`revealImage` 75%-90% / ~0.5s): The fully revealed Pokémon smoothly glides up from the center (`translateY(35%)`) to its standard header position (`translateY(0)`) with the background clear of particles.
   - **Stat Sheet Entry** (`revealInfo` 80%-100%): Pokémon stats, badges, radar chart, and information smoothly fade in and slide up into view once the Pokémon reaches its top presentation position, completely free of any overlapping visual particle clutter.
2. **Radar Stat Visualization**:
   - Powered by Chart.js Radar (`src/components/team/reveal/mobile/stats/radar/radar.js`).
   - Renders 6 stat axes: HP, Attack, Defense, Sp. Atk, Sp. Def, Speed.
   - Scale limits: 0 to 160 with custom RGB theming.
3. **Information Badges**:
   - Primary and secondary Type badges.
   - Species, Height, Weight, and Pokédex summary.
4. **Fast-Forward & Dismissal**:
   - Clicking anywhere on the screen (or pressing Enter/Space) while animations are in progress fast-forwards all reveal animations immediately, showing the complete Pokémon sprite with full brightness and the visible stat sheet.
   - Clicking anywhere on the screen (or pressing Enter/Space) after animations are completed/fast-forwarded clears the active `pokemon` (`setPokemon(undefined)` / `dismissReveal`).
   - If `pokemonTeam.length < 6`, returns to `OPEN` for the next slot.
   - If `pokemonTeam.length === 6`, advances to `COMPLETED`.
5. **Top Header Pokéball Coordination**:
   - In the top header tray, the Pokéball slot corresponding to the current Pokémon remains in its unrevealed Pokéball state during the audio-only and silhouette phases.
   - When the Pokémon in the main reveal starts its smooth color transition (~2.3s), the header Pokéball initiates a smooth catch animation (`catch` 0.6s ease-out), dimming the Pokéball icon, and smoothly fades in the caught Pokémon thumbnail sprite (`revealPokemon` 0.5s ease-in-out).
   - If the user fast-forwards the reveal animation with a click or keydown, the header Pokéball slot immediately fast-forwards into its caught revealed state with full opacity.
   - Previously caught Pokémon in earlier slots remain permanently in their caught/revealed state without replaying animations.

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
