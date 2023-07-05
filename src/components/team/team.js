import React, {useState} from "react";
import Reveal from "../reveal/reveal";
import pokemons from "../../resources/pokemons.json";

const quantity = 10;

export const Team = () => {
    const [pokemon, setPokemon] = useState({});
    const getPokemon = () => {
        const id = Math.floor((Math.random() * quantity) + 1);
        const test = pokemons.find(pokemon => pokemon.id === id)
        console.log(test)
        setPokemon(test);
    }
    return (
        <div>
            <button onClick={getPokemon}>I choose you!</button>
            {pokemon && <Reveal {...pokemon}/>}
        </div>
    )
};

export default Team;