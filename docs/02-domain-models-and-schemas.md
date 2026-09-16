# 02 - Domain Models & Data Schemas

This document defines the formal data contracts, entity models, and JSON schemas utilized across the Pokémon Stadium Team Randomizer.

---

## 1. Pokémon Entity Schema

The primary data source is loaded from `src/resources/pokemons.json`. Each entry corresponds to an available Pokémon in the roster.

### TypeScript / JSON Schema Representation

```typescript
interface PokemonEntity {
  id: number;                          // National Pokédex number (1 - 151 for Gen 1)
  name: {
    english: string;                   // "Bulbasaur"
    japanese: string;                  // "フシギダネ"
    chinese: string;                   // "妙蛙种子"
    french: string;                    // "Bulbizarre"
  };
  type: Array<PokemonType>;            // 1 or 2 types (e.g., ["Grass", "Poison"])
  base: {
    hp: number;                        // Base Hit Points
    attack: number;                    // Base Physical Attack
    defense: number;                   // Base Physical Defense
    spAttack: number;                  // Base Special Attack (Gen 1 Special split)
    spDefense: number;                 // Base Special Defense (Gen 1 Special split)
    speed: number;                     // Base Speed
  };
  tier: TierGrade;                     // Competitive Stadium Tier: 'S' | 'A' | 'B' | 'C' | 'D'
  species: string;                     // Species classification (e.g., "Seed Pokémon")
  description: string;                 // Pokédex lore entry
  evolution?: {
    prev?: [string, string];           // [Previous Dex ID, Trigger e.g., "Level 16"]
    next?: Array<[string, string]>;    // Array of [Target Dex ID, Trigger]
  };
  profile: {
    height: string;                    // Human-readable string e.g. "0.7 m"
    weight: string;                    // Human-readable string e.g. "6.9 kg"
    egg: string[];                     // Egg groups
    ability: Array<[string, string]>;  // Ability definitions [Name, IsHidden]
    gender: string;                    // Gender ratio (e.g. "87.5:12.5")
  };
  image: {
    sprite: string;                    // Low-res standard sprite URL
    thumbnail: string;                 // Low-res thumbnail URL
    hires: string;                     // High-definition transparent artwork URL
  };
  height: number;                      // Numeric height in meters (used for staging)
  weight: number;                      // Numeric weight in kilograms
  cry: string;                         // URL to authentic N64 audio cry (.wav/.mp3)
  rolls: number;                       // Visual scaling denominator for presentation
  isFlying?: boolean;                  // Presentation positioning flag (elevation: 5%)
  isJumping?: boolean;                 // Presentation positioning flag (elevation: 25%)
}
```

### Type Enum

```typescript
type PokemonType = 
  | "Normal" | "Fire" | "Water" | "Grass" | "Electric" | "Ice" 
  | "Fighting" | "Poison" | "Ground" | "Flying" | "Psychic" 
  | "Bug" | "Rock" | "Ghost" | "Dragon";
  // Gen 2 extensions will add: "Steel" | "Dark"
```

---

## 2. Competitive Tier System & Pokeball Mapping

The Pokémon roster is categorized into 5 tiers based on their viability, base stat totals (BST), and effectiveness in Pokémon Stadium:

| Tier | Grade Meaning | Mapped Pokeball | Included Tiers in Pool | Example Pokémon |
|---|---|---|---|---|
| **S** | God / Uber / Top Meta | **Masterball** | `['S']` | Mewtwo, Dragonite, Alakazam, Gengar, Zapdos |
| **A** | High Tier / Competitive | **Ultraball** | `['A']` | Charizard, Golem, Exeggutor, Starmie, Lapras |
| **B** | Mid Tier / Balanced | **Superball** | `['B']` | Raichu, Venusaur, Blastoise, Scyther, Clefable |
| **C** | Low Tier / Niche | **Pokeball** | `['C', 'D']` | Butterfree, Beedrill, Raticate, Pidgeot |
| **D** | Entry / Pre-Evolution | **Pokeball** | `['C', 'D']` | Caterpie, Weedle, Magikarp, Zubat |

### Pokeball Configuration Model

```javascript
export const POKEBALL = {
  NORMAL: {
    name: 'Pokeball',
    img: IMG_POKEBALL,
    tiers: ['D', 'C']
  },
  SUPER: {
    name: 'Superball',
    img: IMG_SUPERBALL,
    tiers: ['B']
  },
  ULTRA: {
    name: 'Ultraball',
    img: IMG_ULTRABALL,
    tiers: ['A']
  },
  MASTER: {
    name: 'Masterball',
    img: IMG_MASTERBALL,
    tiers: ['S']
  }
};
```

---

## 3. Team Roster Model

```typescript
interface TeamState {
  pokeballs: Array<PokeballConfig>;    // Exactly 6 Pokeballs selected by user
  pokemonTeam: Array<PokemonEntity>;   // 0 to 6 unique Pokémon entities
  activePokemon?: PokemonEntity;       // Pokémon currently in REVEAL state
  isCompleted: boolean;                // pokemonTeam.length === 6
}
```

### Business Invariants:
1. **Roster Size**: A completed team must contain strictly **6 Pokémon**.
2. **Species Uniqueness**: Duplicate species (`pokemon.id`) within the same team are strictly forbidden. The selection algorithm must recurse or re-sample until an unpicked Pokémon is selected.
3. **Deterministic Tier Pool**: Each Pokémon assigned to a slot must strictly belong to one of the tiers associated with that slot's assigned Pokeball.
