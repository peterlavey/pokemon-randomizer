import React, {useEffect, useState} from "react";
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

    useEffect(() => {
        const team = [];
        for (let index = 0; index < 6; index++) {
            const id = Math.floor((Math.random() * quantity) + 1);
            const pokemonChoosen = pokemons.find(pokemon => pokemon.id === id);
            team.push(pokemonChoosen);

        }
        setPokemonTeam(team);
    }, []);

    return (
        <div className='team'>
            <Presentation team={pokemonTeam}/>
        </div>
    );
};

export default Team;