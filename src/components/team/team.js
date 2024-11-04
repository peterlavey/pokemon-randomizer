import React, {useState} from "react";
import Pokeballs from "./pokeballs/pokeballs";
import PokeButton from "./pokeButton/pokeButton";
import Reveal, {TYPE} from "./reveal/reveal";
import Presentation from "./presentation/presentation";
import './team.styles.scss';
import {getByTier, getRandom} from "../../utils/utils";
import ChoosePokeballs from "./choosePokeballs/choosePokeballs";
import {SFX_POKEMON_INTRO} from "../../utils/constants";

const COMPLETED = 6;

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
        if (pokemonTeam.length === COMPLETED) {
            setCompleted(true);
        } else {
            setPokemon(undefined);
        }
    };

    return (
        <div className='team'>
            <Pokeballs pokeballs={pokeballs} team={pokemonTeam}/>
            {pokeballs.length < COMPLETED && <ChoosePokeballs pokeballs={pokeballs} setPokeballs={setPokeballs} />}
            {pokeballs.length === COMPLETED && (
                <>
                    {(!pokemon && !completed) && <PokeButton pokeball={getCurrentPokeball()} onClick={getPokemon}/>}
                    {(pokemon && !completed) && <Reveal clean={clean} type={TYPE.MOBILE} pokemon={pokemon}/>}
                    {completed && <Presentation team={pokemonTeam}/>}
                </>
            )}
            {!completed && <audio src={SFX_POKEMON_INTRO} autoPlay/>}
        </div>
    );
};

export default Team;