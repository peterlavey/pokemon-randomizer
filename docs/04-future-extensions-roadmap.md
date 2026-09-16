# 04 - Future Extensions & Architectural Roadmap

This document captures upcoming features, planned enhancements, and architectural extension points for future development iterations.

---

## 1. Multi-Game Support: Pokémon Stadium 2 (Gen 2 Expansion)

### 1.1 Context
While the current version supports the original **Pokémon Stadium (Generation 1 - 151 Pokémon)**, the system architecture is designed to extend support to **Pokémon Stadium 2 (Generation 2 - 251 Pokémon)** on the Nintendo 64.

### 1.2 Architectural Requirements for Stadium 2
1. **Game Mode Selector**:
   - Add a global game context / selector toggle: `STADIUM_1` vs `STADIUM_2`.
   - Filter dataset by generation (`gen <= 1` vs `gen <= 2`).
2. **Type System Expansion**:
   - Add `Dark` and `Steel` types.
   - Update type badge SCSS styling and weakness/resistance calculations.
3. **Audio & Sprite Assets**:
   - Add N64 Gen 2 audio cries for #152 (Chikorita) to #251 (Celebi).
   - Expand CDN assets for Gen 2 high-res models and sprites.
4. **Special Stat Split in Gen 2**:
   - In Gen 1, Special Attack and Special Defense share identical base values. In Gen 2, they diverge. The radar chart and models must support true independent SpA and SpD values.

---

## 2. Dynamic Algorithmic Tier Engine

### 2.1 Current State
Tiers (`S`, `A`, `B`, `C`, `D`) are currently hardcoded in `pokemons.json` based on static tier maker lists.

### 2.2 Future Spec: Automated Stadium Tier Metric
Develop a scoring function to calculate tiers dynamically based on Stadium battle mechanics:
$$\text{TierScore} = \text{BST} + w_{\text{speed}} \cdot \text{Speed} + w_{\text{type}} \cdot \text{TypeScore} + w_{\text{moves}} \cdot \text{RentalMoveViability}$$
- **Rental Moveset Factoring**: Stadium rental Pokémon frequently have unique or suboptimal movesets; factoring rental viability into the tier score improves real-world balance.

---

## 3. Visual & UI Enhancements

### 3.1 Type-Themed Dynamic Backgrounds
- Dynamically alter the background canvas/gradient during the `REVEAL` state to match the primary/secondary type of the unveiled Pokémon.
- Reference vector assets: [Wikimedia Pokémon Type Icons](https://commons.wikimedia.org/wiki/Category:Pok%C3%A9mon_types_icons).

### 3.2 Column Positioning HUD
- Introduce a 3-horizontal-line HUD element indicating which column the Pokémon occupies during podium staging (with an active green indicator on the occupied position).

---

## 4. Alternative Generation Modes

### 4.1 Probability-Based Pokeball Rolls
- Instead of deterministic tier mapping per Pokeball, introduce a probabilistic roll mode:
  - **Pokeball**: 70% Tier D/C, 25% Tier B, 5% Tier A
  - **Superball**: 10% Tier D/C, 60% Tier B, 25% Tier A, 5% Tier S
  - **Ultraball**: 5% Tier B, 65% Tier A, 30% Tier S
  - **Masterball**: 100% Tier S

### 4.2 Equal Combat / Mirror Match Generator
- Dual-player generator mode: Generates two balanced rosters (Player 1 and Player 2) with identical tier distributions to ensure fair local N64 versus matches.
