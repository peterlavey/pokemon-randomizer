import pokemonsData from '../resources/pokemons.json';
import { POKEBALL, TEAM_SIZE, TEAM_STATE } from '../constants/gameConstants';

/**
 * Returns all available Pokémon from the dataset.
 */
export const getAllPokemons = () => pokemonsData;

/**
 * Finds a Pokémon by its ID.
 */
export const getPokemonById = (id) => pokemonsData.find((pokemon) => pokemon.id === id);

/**
 * Filters Pokémon belonging to any of the specified tiers.
 * @param {string[]|string} tiers - Array of tier identifiers or single tier string
 */
export const getPokemonsByTiers = (tiers) => {
    if (!tiers) return [];
    const tierList = Array.isArray(tiers) ? tiers : [tiers];
    return pokemonsData.filter((pokemon) => tierList.includes(pokemon.tier));
};

/**
 * Filters Pokémon available for a specific Pokéball configuration.
 */
export const getPokemonsByPokeball = (pokeball) => {
    if (!pokeball || !pokeball.tiers) return [];
    return getPokemonsByTiers(pokeball.tiers);
};

/**
 * Gets a random item from an array.
 */
export const getRandomItem = (array) => {
    if (!array || array.length === 0) return null;
    const index = Math.floor(Math.random() * array.length);
    return array[index];
};

/**
 * Selects a unique Pokémon for a given Pokéball, avoiding duplicates in the current team.
 * Uses set filtering instead of unbounded recursion for safety and performance.
 * 
 * @param {Object} pokeball - Pokéball object containing allowed tiers
 * @param {Array} currentTeam - Array of Pokémon already in the team
 * @returns {Object|null} Selected Pokémon
 */
export const selectUniquePokemonForPokeball = (pokeball, currentTeam = []) => {
    const pool = getPokemonsByPokeball(pokeball);
    if (pool.length === 0) return null;

    const existingIds = new Set(currentTeam.map((p) => p.id));
    const available = pool.filter((pokemon) => !existingIds.has(pokemon.id));

    // Fallback to full pool if all Pokémon in this tier have already been picked
    const candidates = available.length > 0 ? available : pool;
    return getRandomItem(candidates);
};

/**
 * Calculates and caches the maximum value for each base stat across all Pokémon.
 */
const memoizedMaxStats = (() => {
    const keys = ['hp', 'attack', 'defense', 'speed', 'spDefense', 'spAttack'];
    const maxes = {};
    keys.forEach((key) => {
        maxes[key] = pokemonsData.reduce((max, { base }) => (base[key] > max ? base[key] : max), 0);
    });
    return Object.freeze(maxes);
})();

export const getMaxBaseStats = () => memoizedMaxStats;

/**
 * Calculates the stat percentage relative to the maximum base stat in Gen 1.
 */
export const getStatPercentage = (statKey, value) => {
    const max = memoizedMaxStats[statKey] || 100;
    return (value / max) * 100;
};

/**
 * Finds the Pokéball corresponding to a given competitive tier.
 */
export const getPokeballByTier = (tier) => {
    return Object.values(POKEBALL).find(({ tiers }) => tiers.includes(tier)) || POKEBALL.NORMAL;
};

/**
 * Calculates which of the 3 columns (0, 1, 2) in the Stadium lineup a Pokémon ID belongs to.
 * Formula: (id - 1) % 3
 */
export const getMemberColumnIndex = (pokemonId) => {
    if (!pokemonId || typeof pokemonId !== 'number') return 0;
    return (pokemonId - 1) % 3;
};

/**
 * Calculates proportional render height for presentation display.
 */
export const calculateScaledHeight = (pokemonHeight, maxHeight, baseScale = 200) => {
    const max = maxHeight > 0 ? maxHeight : 1;
    return (pokemonHeight / max) * baseScale;
};

/**
 * Arranges the team into the authentic 6-Pokémon Stadium presentation lineup.
 * Presentation index order: [5, 2, 4, 1, 3, 0] when sorted by height ascending.
 * Heights are adjusted for rolled/multi-segment sprites.
 */
export const arrangeStageLineup = (team = []) => {
    if (!team || team.length === 0) return [];
    
    // Non-mutating sort by height ascending
    const sorted = [...team].sort((a, b) => (a.height || 0) - (b.height || 0));
    
    // Presentation order permutation for 6 members
    const orderIndices = [5, 2, 4, 1, 3, 0];
    const arranged = [];

    orderIndices.forEach((idx) => {
        if (sorted[idx]) {
            arranged.push(sorted[idx]);
        }
    });

    // If team has fewer than 6 elements, include remaining elements
    sorted.forEach((pokemon) => {
        if (!arranged.includes(pokemon)) {
            arranged.push(pokemon);
        }
    });

    // Adjust height for roll count
    return arranged.map((pokemon) => ({
        ...pokemon,
        height: pokemon.rolls ? (pokemon.height / pokemon.rolls) : pokemon.height,
    }));
};

/**
 * Generates a randomized team of unique Pokémon.
 * @param {number} [size=TEAM_SIZE] - Desired team size
 * @returns {Array} Array of unique Pokémon objects
 */
export const getRandomTeam = (size = TEAM_SIZE) => {
    const all = getAllPokemons();
    if (!all || all.length === 0) return [];

    const pool = [...all];
    const count = Math.min(size, pool.length);
    const team = [];

    for (let i = 0; i < count; i++) {
        const index = Math.floor(Math.random() * pool.length);
        const [pokemon] = pool.splice(index, 1);
        team.push(pokemon);
    }

    return team;
};

/**
 * Creates a COMPLETED team state object for presentation display.
 * @param {Array} [team] - Optional array of Pokémon (defaults to random team)
 * @returns {Object} Team state object configured for presentation
 */
export const createPresentationTeamState = (team = getRandomTeam(TEAM_SIZE)) => {
    const pokeballs = team.map((pokemon) => getPokeballByTier(pokemon.tier));

    return {
        state: TEAM_STATE.COMPLETED,
        pokeballs,
        pokemonTeam: team,
        preselectedTeam: team,
        currentPokemon: null,
    };
};
