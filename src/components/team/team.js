import React, {useState} from "react";
import Pokeballs from "./pokeballs/pokeballs";
import PokeButton from "./pokeButton/pokeButton";
import Reveal, {TYPE} from "./reveal/reveal";
import Presentation from "./presentation/presentation";
import pokemons from "../../resources/pokemons.json";
import {POKEBALL} from "./pokeballs/pokeball/pokeball";
import './team.styles.scss';


const quantity = 151;

export const Team = () => {
    const [pokemon, setPokemon] = useState(undefined);
    const [pokemonTeam, setPokemonTeam] = useState([]);
    const [pokeballs] = useState([
        POKEBALL.NORMAL,
        POKEBALL.ULTRA,
        POKEBALL.NORMAL,
        POKEBALL.SUPER,
        POKEBALL.SUPER,
        POKEBALL.MASTER
    ]);
    const [completed, setCompleted] = useState(false);

    const getPokemon = () => {
        const id = Math.floor((Math.random() * quantity) + 1);
        const pokemonChoosen = pokemons.find(pokemon => pokemon.id === id);
        setPokemon(pokemonChoosen);
        setPokemonTeam([...pokemonTeam, pokemonChoosen]);
    };

    const clean = () => {
        if (pokemonTeam.length === 6) {
            setCompleted(true);
        } else {
            setPokemon(undefined);
        }
    };

    return (
        <div className='team'>
            <Pokeballs pokeballs={pokeballs} team={pokemonTeam}/>
            {(!pokemon && !completed) && <PokeButton onClick={getPokemon}/>}
            {(pokemon && !completed) && <Reveal clean={clean} type={TYPE.MOBILE} pokemon={pokemon}/>}
            {completed && <Presentation team={pokemonTeam}/>}
        </div>
    );
};

export default Team;