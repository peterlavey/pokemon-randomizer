import React, {useState} from "react";
import Reveal from "../reveal/reveal";

const quantity = 10;

export const Team = () => {
    const [pokemon, setPokemon] = useState({});
    const getPokemon = () => {
        const id = Math.floor((Math.random() * quantity) + 1);
        setPokemon({id});
    }
    return (
        <div>
            <button onClick={getPokemon}>I choose you!</button>
            {pokemon && <Reveal id={pokemon.id}/>}
        </div>
    )
};

export default Team;