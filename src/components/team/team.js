import React, {useState} from "react";
import Reveal, {TYPE} from "../reveal/reveal";
import pokemons from "../../resources/pokemons.json";
import './team.styles.scss';
import PokeButton from "../pokeButton/pokeButton";

const quantity = 151;

export const Team = () => {
    const [pokemon, setPokemon] = useState();
    const getPokemon = () => {
        const id = Math.floor((Math.random() * quantity) + 1);
        const pokemonChoosen = pokemons.find(pokemon => pokemon.id === id)
        setPokemon(pokemonChoosen);
    }
    const clean = () => setPokemon(undefined);

    return (
        <div className='team'>
            {!pokemon && <PokeButton onClick={getPokemon}/>}
            {pokemon && <Reveal clean={clean} type={TYPE.MOBILE} pokemon={pokemon}/>}
        </div>
    )
};

export default Team;