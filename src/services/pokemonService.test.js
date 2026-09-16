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
    arrangeStageLineup
} from './pokemonService';
import { POKEBALL, TIER } from '../constants/gameConstants';

describe('pokemonService', () => {
    test('getAllPokemons returns all 151 pokemons', () => {
        const pokemons = getAllPokemons();
        expect(pokemons).toBeDefined();
        expect(pokemons.length).toBe(151);
    });

    test('getPokemonById returns the correct pokemon', () => {
        const bulbasaur = getPokemonById(1);
        expect(bulbasaur).toBeDefined();
        expect(bulbasaur.name.english).toBe('Bulbasaur');
    });

    test('getPokemonsByTiers filters correctly', () => {
        const sTier = getPokemonsByTiers(TIER.S);
        expect(sTier.length).toBeGreaterThan(0);
        expect(sTier.every((p) => p.tier === TIER.S)).toBe(true);

        const multiTier = getPokemonsByTiers([TIER.C, TIER.D]);
        expect(multiTier.every((p) => p.tier === TIER.C || p.tier === TIER.D)).toBe(true);
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

    test('selectUniquePokemonForPokeball excludes already chosen team members', () => {
        const pool = getPokemonsByPokeball(POKEBALL.MASTER);
        const first = pool[0];
        const second = selectUniquePokemonForPokeball(POKEBALL.MASTER, [first]);
        expect(second).toBeDefined();
        if (pool.length > 1) {
            expect(second.id).not.toBe(first.id);
        }
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

    test('getPokeballByTier returns correct Pokeball for tier', () => {
        expect(getPokeballByTier(TIER.S)).toEqual(POKEBALL.MASTER);
        expect(getPokeballByTier(TIER.A)).toEqual(POKEBALL.ULTRA);
        expect(getPokeballByTier(TIER.B)).toEqual(POKEBALL.SUPER);
        expect(getPokeballByTier(TIER.C)).toEqual(POKEBALL.NORMAL);
        expect(getPokeballByTier(TIER.D)).toEqual(POKEBALL.NORMAL);
    });

    test('getMemberColumnIndex calculates (id - 1) % 3 correctly', () => {
        expect(getMemberColumnIndex(1)).toBe(0);
        expect(getMemberColumnIndex(2)).toBe(1);
        expect(getMemberColumnIndex(3)).toBe(2);
        expect(getMemberColumnIndex(4)).toBe(0);
        expect(getMemberColumnIndex(150)).toBe(2);
        expect(getMemberColumnIndex(151)).toBe(0);
    });

    test('calculateScaledHeight calculates scale proportionally', () => {
        const height = calculateScaledHeight(1.5, 3.0, 200);
        expect(height).toBe(100);
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
});
