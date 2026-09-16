import { useReducer, useCallback } from 'react';
import { TEAM_SIZE, TEAM_STATE } from '../constants/gameConstants';
import { selectUniquePokemonForPokeball } from '../services/pokemonService';

export const ACTION_TYPES = Object.freeze({
    SELECT_POKEBALL: 'SELECT_POKEBALL',
    OPEN_POKEBALL: 'OPEN_POKEBALL',
    DISMISS_REVEAL: 'DISMISS_REVEAL',
    RESET_TEAM: 'RESET_TEAM',
});

export const initialTeamState = Object.freeze({
    state: TEAM_STATE.CHOOSE,
    pokeballs: [],
    pokemonTeam: [],
    currentPokemon: null,
});

export const teamReducer = (state, action) => {
    switch (action.type) {
        case ACTION_TYPES.SELECT_POKEBALL: {
            if (state.pokeballs.length >= TEAM_SIZE) {
                return state;
            }
            const updatedPokeballs = [...state.pokeballs, action.payload];
            const isFull = updatedPokeballs.length === TEAM_SIZE;
            return {
                ...state,
                pokeballs: updatedPokeballs,
                state: isFull ? TEAM_STATE.OPEN : TEAM_STATE.CHOOSE,
            };
        }

        case ACTION_TYPES.OPEN_POKEBALL: {
            const currentSlot = state.pokemonTeam.length;
            const currentPokeball = state.pokeballs[currentSlot];
            if (!currentPokeball || currentSlot >= TEAM_SIZE) {
                return state;
            }

            const chosenPokemon = action.payload || selectUniquePokemonForPokeball(currentPokeball, state.pokemonTeam);
            if (!chosenPokemon) {
                return state;
            }

            return {
                ...state,
                currentPokemon: chosenPokemon,
                pokemonTeam: [...state.pokemonTeam, chosenPokemon],
                state: TEAM_STATE.REVEAL,
            };
        }

        case ACTION_TYPES.DISMISS_REVEAL: {
            const isTeamFull = state.pokemonTeam.length >= TEAM_SIZE;
            return {
                ...state,
                currentPokemon: null,
                state: isTeamFull ? TEAM_STATE.COMPLETED : TEAM_STATE.OPEN,
            };
        }

        case ACTION_TYPES.RESET_TEAM: {
            return initialTeamState;
        }

        default:
            return state;
    }
};

export const useTeam = (initialState = initialTeamState) => {
    const [teamState, dispatch] = useReducer(teamReducer, initialState);

    const choosePokeball = useCallback((pokeball) => {
        dispatch({ type: ACTION_TYPES.SELECT_POKEBALL, payload: pokeball });
    }, []);

    const openCurrentPokeball = useCallback((optionalPokemon) => {
        dispatch({ type: ACTION_TYPES.OPEN_POKEBALL, payload: optionalPokemon });
    }, []);

    const dismissReveal = useCallback(() => {
        dispatch({ type: ACTION_TYPES.DISMISS_REVEAL });
    }, []);

    const resetTeam = useCallback(() => {
        dispatch({ type: ACTION_TYPES.RESET_TEAM });
    }, []);

    const currentSlot = teamState.pokemonTeam.length;
    const currentPokeball = teamState.pokeballs[currentSlot] || null;
    const isCompleted = teamState.pokemonTeam.length === TEAM_SIZE && !teamState.currentPokemon;

    return {
        state: teamState.state,
        pokeballs: teamState.pokeballs,
        pokemonTeam: teamState.pokemonTeam,
        currentPokemon: teamState.currentPokemon,
        currentPokeball,
        isCompleted,
        isChoosing: teamState.state === TEAM_STATE.CHOOSE,
        isOpen: teamState.state === TEAM_STATE.OPEN,
        isReveal: teamState.state === TEAM_STATE.REVEAL,
        choosePokeball,
        openCurrentPokeball,
        dismissReveal,
        resetTeam,
    };
};

export default useTeam;
