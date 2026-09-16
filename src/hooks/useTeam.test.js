import { renderHook, act } from '@testing-library/react';
import { useTeam, teamReducer, ACTION_TYPES, initialTeamState } from './useTeam';
import { POKEBALL, TEAM_STATE, TEAM_SIZE } from '../constants/gameConstants';

describe('useTeam and teamReducer', () => {
    test('teamReducer handles SELECT_POKEBALL up to TEAM_SIZE and preselects unique pokemon', () => {
        let state = initialTeamState;
        expect(state.state).toBe(TEAM_STATE.CHOOSE);
        expect(state.preselectedTeam).toEqual([]);

        for (let i = 0; i < 5; i++) {
            state = teamReducer(state, { type: ACTION_TYPES.SELECT_POKEBALL, payload: POKEBALL.NORMAL });
            expect(state.state).toBe(TEAM_STATE.CHOOSE);
            expect(state.pokeballs.length).toBe(i + 1);
            expect(state.preselectedTeam.length).toBe(i + 1);
            expect(state.preselectedTeam[i]).toBeDefined();
        }

        // 6th pokeball transitions to OPEN
        state = teamReducer(state, { type: ACTION_TYPES.SELECT_POKEBALL, payload: POKEBALL.MASTER });
        expect(state.state).toBe(TEAM_STATE.OPEN);
        expect(state.pokeballs.length).toBe(TEAM_SIZE);
        expect(state.preselectedTeam.length).toBe(TEAM_SIZE);

        // 7th should be ignored
        const state7 = teamReducer(state, { type: ACTION_TYPES.SELECT_POKEBALL, payload: POKEBALL.SUPER });
        expect(state7.pokeballs.length).toBe(TEAM_SIZE);
        expect(state7.preselectedTeam.length).toBe(TEAM_SIZE);
    });

    test('teamReducer automatically uses preselected pokemon when OPEN_POKEBALL has no payload', () => {
        let state = initialTeamState;
        for (let i = 0; i < TEAM_SIZE; i++) {
            state = teamReducer(state, { type: ACTION_TYPES.SELECT_POKEBALL, payload: POKEBALL.MASTER });
        }

        const preselectedFirst = state.preselectedTeam[0];
        state = teamReducer(state, { type: ACTION_TYPES.OPEN_POKEBALL });

        expect(state.state).toBe(TEAM_STATE.REVEAL);
        expect(state.currentPokemon).toEqual(preselectedFirst);
        expect(state.pokemonTeam[0]).toEqual(preselectedFirst);
    });

    test('teamReducer handles OPEN_POKEBALL and DISMISS_REVEAL lifecycle', () => {
        let state = initialTeamState;
        for (let i = 0; i < TEAM_SIZE; i++) {
            state = teamReducer(state, { type: ACTION_TYPES.SELECT_POKEBALL, payload: POKEBALL.NORMAL });
        }

        const mockPokemon = { id: 25, name: { english: 'Pikachu' }, height: 0.4 };

        // Open 1st
        state = teamReducer(state, { type: ACTION_TYPES.OPEN_POKEBALL, payload: mockPokemon });
        expect(state.state).toBe(TEAM_STATE.REVEAL);
        expect(state.currentPokemon).toEqual(mockPokemon);
        expect(state.pokemonTeam.length).toBe(1);

        // Dismiss 1st -> goes back to OPEN because team.length < 6
        state = teamReducer(state, { type: ACTION_TYPES.DISMISS_REVEAL });
        expect(state.state).toBe(TEAM_STATE.OPEN);
        expect(state.currentPokemon).toBeNull();

        // Simulate opening 5 more
        for (let i = 2; i <= TEAM_SIZE; i++) {
            state = teamReducer(state, {
                type: ACTION_TYPES.OPEN_POKEBALL,
                payload: { id: i, name: { english: `Mon ${i}` }, height: 1 }
            });
            if (i < TEAM_SIZE) {
                state = teamReducer(state, { type: ACTION_TYPES.DISMISS_REVEAL });
                expect(state.state).toBe(TEAM_STATE.OPEN);
            }
        }

        // Dismiss the 6th -> goes to COMPLETED
        state = teamReducer(state, { type: ACTION_TYPES.DISMISS_REVEAL });
        expect(state.state).toBe(TEAM_STATE.COMPLETED);
        expect(state.currentPokemon).toBeNull();
        expect(state.pokemonTeam.length).toBe(6);
    });

    test('teamReducer returns current state on unknown action or invalid OPEN_POKEBALL', () => {
        const state = initialTeamState;
        const unchanged = teamReducer(state, { type: 'UNKNOWN_ACTION' });
        expect(unchanged).toBe(state);

        // OPEN_POKEBALL when no pokeball has been selected
        const afterInvalidOpen = teamReducer(state, { type: ACTION_TYPES.OPEN_POKEBALL });
        expect(afterInvalidOpen).toBe(state);
    });

    test('teamReducer handles RESET_TEAM', () => {
        let state = {
            state: TEAM_STATE.COMPLETED,
            pokeballs: [POKEBALL.NORMAL],
            pokemonTeam: [{ id: 1 }],
            currentPokemon: null,
        };

        const reset = teamReducer(state, { type: ACTION_TYPES.RESET_TEAM });
        expect(reset).toEqual(initialTeamState);
    });

    test('useTeam hook provides state and action helpers', () => {
        const { result } = renderHook(() => useTeam());

        expect(result.current.isChoosing).toBe(true);
        expect(result.current.pokeballs).toEqual([]);

        act(() => {
            for (let i = 0; i < 6; i++) {
                result.current.choosePokeball(POKEBALL.ULTRA);
            }
        });

        expect(result.current.isOpen).toBe(true);
        expect(result.current.currentPokeball).toEqual(POKEBALL.ULTRA);
        expect(result.current.preselectedTeam.length).toBe(6);

        act(() => {
            result.current.openCurrentPokeball({ id: 1, name: { english: 'Bulbasaur' }, height: 0.7 });
        });

        expect(result.current.isReveal).toBe(true);
        expect(result.current.currentPokemon.name.english).toBe('Bulbasaur');

        act(() => {
            result.current.dismissReveal();
        });

        expect(result.current.isOpen).toBe(true);
        expect(result.current.pokemonTeam.length).toBe(1);

        act(() => {
            result.current.resetTeam();
        });

        expect(result.current.isChoosing).toBe(true);
        expect(result.current.pokeballs).toEqual([]);
        expect(result.current.pokemonTeam).toEqual([]);
    });
});
