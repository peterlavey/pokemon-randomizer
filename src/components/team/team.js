import React, {useState} from "react";
import Pokeballs from "./pokeballs/pokeballs";
import PokeButton from "./pokeButton/pokeButton";
import Reveal, {TYPE} from "./reveal/reveal";
import pokemons from "../../resources/pokemons.json";
import {POKEBALL} from "./pokeballs/pokeball/pokeball";
import './team.styles.scss';


const quantity = 151;

export const Team = () => {
    const [pokemon, setPokemon] = useState();
    const [pokemonTeam, setPokemonTeam] = useState([])
    const [pokeballs, setPokeballs] = useState([
        POKEBALL.NORMAL,
        POKEBALL.ULTRA,
        POKEBALL.NORMAL,
        POKEBALL.SUPER,
        POKEBALL.SUPER,
        POKEBALL.MASTER
    ]);

    const getPokemon = () => {
        const id = Math.floor((Math.random() * quantity) + 1);
        const pokemonChoosen = pokemons.find(pokemon => pokemon.id === id);
        setPokemon(pokemonChoosen);
        setPokemonTeam([...pokemonTeam, pokemonChoosen]);
    }
    const clean = () => setPokemon(undefined);

    return (
        <div className='team'>
            <Pokeballs pokeballs={pokeballs} team={pokemonTeam}/>
            {!pokemon && <PokeButton onClick={getPokemon}/>}
            {pokemon && <Reveal clean={clean} type={TYPE.MOBILE} pokemon={pokemon}/>}
        </div>
    )
};

export default Team;