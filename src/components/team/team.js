import React, {useEffect, useState} from "react";
import Pokeballs from "./pokeballs/pokeballs";
import PokeButton from "./pokeButton/pokeButton";
import Reveal, {TYPE} from "./reveal/reveal";
import Presentation from "./presentation/presentation";
import {getByTier, getRandom, isIOS} from "../../utils/utils";
import ChoosePokeballs from "./choosePokeballs/choosePokeballs";
import Sound from "./sound/sound";
import './team.styles.scss';

const TEAM_QUANTITY = 6;
const STATE = {
    CHOOSE: 'CHOOSE',
    OPEN: 'OPEN',
    REVEAL: 'REVEAL',
    COMPLETED: 'COMPLETED',
};

export const Team = () => {
    const [state, setState] = useState(STATE.CHOOSE);
    const [pokemon, setPokemon] = useState(undefined);
    const [pokemonTeam, setPokemonTeam] = useState([]);
    const [pokeballs, setPokeballs] = useState([]);

    useEffect(() => {
        const completed = pokemonTeam.length === TEAM_QUANTITY;
        if (pokeballs.length < TEAM_QUANTITY) {
            setState(STATE.CHOOSE);
        } else if (pokeballs.length === TEAM_QUANTITY) {
            if (!pokemon && !completed) {
                setState(STATE.OPEN);
            } else if (pokemon && !completed) {
                setState(STATE.REVEAL);
            } else if (completed) {
                setState(STATE.COMPLETED);
            }
        }
    }, [pokeballs, pokemon, pokemonTeam.length]);


    const getCurrentPokeball = () => pokeballs[pokemonTeam.length];

    const getUniquePokemon = () => {
        const pokemonsFiltered = getByTier(getCurrentPokeball().tiers)
        const pokemonSelected = getRandom(pokemonsFiltered);
        const duplicated = pokemonTeam.find(pokemon => pokemon.id === pokemonSelected.id);
        return duplicated ? getUniquePokemon() : pokemonSelected;
    };

    const getPokemon = () => {
        const pokemonChoosen = getUniquePokemon();
        setPokemon(pokemonChoosen);
        setPokemonTeam([...pokemonTeam, pokemonChoosen]);
    };

    const clean = () => {
        if (pokemonTeam.length !== TEAM_QUANTITY) {
            setPokemon(undefined);
        }
    };

    return (
        <div className='team'>
            <Pokeballs pokeballs={pokeballs} team={pokemonTeam} />
            {state === STATE.CHOOSE && <ChoosePokeballs pokeballs={pokeballs} setPokeballs={setPokeballs} />}
            {state === STATE.OPEN && <PokeButton pokeball={getCurrentPokeball()} onClick={getPokemon} />}
            {state === STATE.REVEAL && <Reveal type={TYPE.MOBILE} pokemon={pokemon} onClick={clean} />}
            {state === STATE.COMPLETED && <Presentation team={pokemonTeam} />}
            {state !== STATE.COMPLETED && <Sound autoplay={!isIOS()} />}
        </div>
    );
};

export default Team;