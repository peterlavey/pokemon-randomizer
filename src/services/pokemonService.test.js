import {
    getAllPokemons,
    getPokemonById,
    getPokemonsByTiers,
    getPokemonsByPokeball,
    getRandomItem,
    selectUniquePokemonForPokeball,
    getMaxBaseStats,
    getStatPercentage,
    getPokeballByTier,
    getMemberColumnIndex,
    calculateScaledHeight,
    arrangeStageLineup,
    getRandomTeam,
    createPresentationTeamState
} from './pokemonService';
import { POKEBALL, TIER, TEAM_SIZE, TEAM_STATE } from '../constants/gameConstants';

describe('pokemonService', () => {
    test('getAllPokemons returns all 151 pokemons', () => {
        const pokemons = getAllPokemons();
        expect(pokemons).toBeDefined();
        expect(pokemons.length).toBe(151);
    });

    test('getPokemonById returns the correct pokemon and undefined if not found', () => {
        const bulbasaur = getPokemonById(1);
        expect(bulbasaur).toBeDefined();
        expect(bulbasaur.name.english).toBe('Bulbasaur');

        const notFound = getPokemonById(999);
        expect(notFound).toBeUndefined();
    });

    test('getPokemonsByTiers filters correctly and returns empty array when no matches', () => {
        const sTier = getPokemonsByTiers(TIER.S);
        expect(sTier.length).toBeGreaterThan(0);
        expect(sTier.every((p) => p.tier === TIER.S)).toBe(true);

        const multiTier = getPokemonsByTiers([TIER.C, TIER.D]);
        expect(multiTier.every((p) => p.tier === TIER.C || p.tier === TIER.D)).toBe(true);

        const unknownTier = getPokemonsByTiers('UNKNOWN_TIER');
        expect(unknownTier).toEqual([]);
    });

    test('getPokemonsByPokeball returns pool matching pokeball tiers', () => {
        const masterballPool = getPokemonsByPokeball(POKEBALL.MASTER);
        expect(masterballPool.every((p) => p.tier === TIER.S)).toBe(true);

        const normalPool = getPokemonsByPokeball(POKEBALL.NORMAL);
        expect(normalPool.every((p) => p.tier === TIER.D || p.tier === TIER.C)).toBe(true);
    });

    test('getRandomItem handles empty/null arrays safely', () => {
        expect(getRandomItem([])).toBeNull();
        expect(getRandomItem(null)).toBeNull();
        const item = getRandomItem([1, 2, 3]);
        expect([1, 2, 3]).toContain(item);
    });

    test('selectUniquePokemonForPokeball excludes already chosen team members and falls back when all are chosen', () => {
        const pool = getPokemonsByPokeball(POKEBALL.MASTER);
        const first = pool[0];
        const second = selectUniquePokemonForPokeball(POKEBALL.MASTER, [first]);
        expect(second).toBeDefined();
        if (pool.length > 1) {
            expect(second.id).not.toBe(first.id);
        }

        // When all pool items are chosen, falls back to full pool
        const fullPoolChosen = selectUniquePokemonForPokeball(POKEBALL.MASTER, pool);
        expect(fullPoolChosen).toBeDefined();
        expect(pool.map((p) => p.id)).toContain(fullPoolChosen.id);
    });

    test('selectUniquePokemonForPokeball returns null for invalid pokeball', () => {
        const result = selectUniquePokemonForPokeball({ tiers: [] });
        expect(result).toBeNull();
    });

    test('getMaxBaseStats returns positive max values for all stats', () => {
        const maxStats = getMaxBaseStats();
        expect(maxStats.hp).toBeGreaterThan(0);
        expect(maxStats.attack).toBeGreaterThan(0);
        expect(maxStats.defense).toBeGreaterThan(0);
        expect(maxStats.speed).toBeGreaterThan(0);
        expect(maxStats.spAttack).toBeGreaterThan(0);
        expect(maxStats.spDefense).toBeGreaterThan(0);
    });

    test('getStatPercentage calculates proportion correctly', () => {
        const maxStats = getMaxBaseStats();
        const percent = getStatPercentage('hp', maxStats.hp / 2);
        expect(percent).toBeCloseTo(50, 1);
    });

    test('getPokeballByTier returns correct Pokeball for tier and fallback for unknown', () => {
        expect(getPokeballByTier(TIER.S)).toEqual(POKEBALL.MASTER);
        expect(getPokeballByTier(TIER.A)).toEqual(POKEBALL.ULTRA);
        expect(getPokeballByTier(TIER.B)).toEqual(POKEBALL.SUPER);
        expect(getPokeballByTier(TIER.C)).toEqual(POKEBALL.NORMAL);
        expect(getPokeballByTier(TIER.D)).toEqual(POKEBALL.NORMAL);
        expect(getPokeballByTier('UNKNOWN')).toEqual(POKEBALL.NORMAL);
    });

    test('getMemberColumnIndex calculates (id - 1) % 4 correctly and handles invalid id', () => {
        expect(getMemberColumnIndex(1)).toBe(0);
        expect(getMemberColumnIndex(2)).toBe(1);
        expect(getMemberColumnIndex(3)).toBe(2);
        expect(getMemberColumnIndex(4)).toBe(3);
        expect(getMemberColumnIndex(5)).toBe(0);
        expect(getMemberColumnIndex(150)).toBe(1);
        expect(getMemberColumnIndex(151)).toBe(2);
        expect(getMemberColumnIndex(null)).toBe(0);
        expect(getMemberColumnIndex(undefined)).toBe(0);
    });

    test('calculateScaledHeight calculates scale proportionally and handles defaults', () => {
        const height = calculateScaledHeight(1.5, 3.0, 200);
        expect(height).toBe(100);

        // default baseScale = 200
        expect(calculateScaledHeight(1.5, 3.0)).toBe(100);

        // 0 maxHeight fallback
        expect(calculateScaledHeight(1.5, 0)).toBe(300);
    });

    test('arrangeStageLineup handles empty array or null input', () => {
        expect(arrangeStageLineup([])).toEqual([]);
        expect(arrangeStageLineup(null)).toEqual([]);
    });

    test('arrangeStageLineup arranges 6 pokemons into presentation order without mutating input', () => {
        const mockTeam = [
            { id: 1, height: 1.0, rolls: 1 },
            { id: 2, height: 0.5, rolls: 1 },
            { id: 3, height: 2.0, rolls: 1 },
            { id: 4, height: 1.5, rolls: 1 },
            { id: 5, height: 0.8, rolls: 1 },
            { id: 6, height: 3.0, rolls: 1 },
        ];
        const originalCopy = [...mockTeam];
        const lineup = arrangeStageLineup(mockTeam);

        // Input should not be mutated
        expect(mockTeam).toEqual(originalCopy);
        expect(lineup.length).toBe(6);

        // Sorted by height: [0.5 (id:2), 0.8 (id:5), 1.0 (id:1), 1.5 (id:4), 2.0 (id:3), 3.0 (id:6)]
        // Order [5, 2, 4, 1, 3, 0] -> [3.0(6), 1.0(1), 2.0(3), 0.8(5), 1.5(4), 0.5(2)]
        expect(lineup[0].id).toBe(6);
        expect(lineup[1].id).toBe(1);
        expect(lineup[2].id).toBe(3);
        expect(lineup[3].id).toBe(5);
        expect(lineup[4].id).toBe(4);
        expect(lineup[5].id).toBe(2);
    });

    test('getRandomTeam generates unique random team of default TEAM_SIZE', () => {
        const team = getRandomTeam();
        expect(team.length).toBe(TEAM_SIZE);
        const uniqueIds = new Set(team.map((p) => p.id));
        expect(uniqueIds.size).toBe(TEAM_SIZE);
    });

    test('getRandomTeam supports custom size and handles edge cases', () => {
        const team3 = getRandomTeam(3);
        expect(team3.length).toBe(3);

        const emptyTeam = getRandomTeam(0);
        expect(emptyTeam).toEqual([]);
    });

    test('createPresentationTeamState constructs COMPLETED state with corresponding pokeballs', () => {
        const state = createPresentationTeamState();
        expect(state.state).toBe(TEAM_STATE.COMPLETED);
        expect(state.pokemonTeam.length).toBe(TEAM_SIZE);
        expect(state.pokeballs.length).toBe(TEAM_SIZE);
        expect(state.currentPokemon).toBeNull();

        state.pokemonTeam.forEach((pokemon, idx) => {
            expect(state.pokeballs[idx].tiers).toContain(pokemon.tier);
        });
    });
});
