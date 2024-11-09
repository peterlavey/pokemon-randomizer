import React, {useState} from "react";
import Pokeballs from "./pokeballs/pokeballs";
import PokeButton from "./pokeButton/pokeButton";
import Reveal, {TYPE} from "./reveal/reveal";
import Presentation from "./presentation/presentation";
import {getByTier, getRandom, isIOS} from "../../utils/utils";
import ChoosePokeballs from "./choosePokeballs/choosePokeballs";
import Sound from "./sound/sound";
import './team.styles.scss';

const TEAM_QUANTITY = 6;

export const Team = () => {
    const [pokemon, setPokemon] = useState(undefined);
    const [pokemonTeam, setPokemonTeam] = useState([]);
    const [pokeballs, setPokeballs] = useState([]);
    const [completed, setCompleted] = useState(false);

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
        if (pokemonTeam.length === TEAM_QUANTITY) {
            setCompleted(true);
        } else {
            setPokemon(undefined);
        }
    };

    return (
        <div className='team'>
            <Pokeballs pokeballs={pokeballs} team={pokemonTeam}/>
            {pokeballs.length < TEAM_QUANTITY && <ChoosePokeballs pokeballs={pokeballs} setPokeballs={setPokeballs} />}
            {pokeballs.length === TEAM_QUANTITY && (
                <>
                    {(!pokemon && !completed) && <PokeButton pokeball={getCurrentPokeball()} onClick={getPokemon}/>}
                    {(pokemon && !completed) && <Reveal clean={clean} type={TYPE.MOBILE} pokemon={pokemon}/>}
                    {completed && <Presentation team={pokemonTeam}/>}
                </>
            )}
            {!completed && <Sound autoplay={!isIOS()} />}
        </div>
    );
};

export default Team;