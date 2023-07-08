import React, {useEffect, useRef, useState} from "react";
import './pokeball.styles.scss';
import {delay} from "../../../../utils/utils";

export const POKEBALL = {
    NORMAL: 'normal',
    SUPER: 'super',
    ULTRA: 'ultra',
    MASTER: 'master'
};

export const Pokeball = ({type, pokemonId = 0}) => {
    const pokeballImg = useRef();
    const [pokemonCatched, setPokemonCatched] = useState(false);
    const pokeball = `images/pokeballs/${type}.png`;
    const pokemon = `images/${pokemonId}.png`

    const reveal = async () => {
        await delay(5000);
        pokeballImg.current.classList.remove('catch');
        window.requestAnimationFrame(() => pokeballImg.current.classList.add('catch'));
        await delay(1500);
        setPokemonCatched(true);
    }

    useEffect(() => {
        if(pokemonId) {
            reveal();
        }
    }, [pokemonId]);

    return (
        <div className='pokeballContainer'>
            <img src={pokeball} alt='pokeball' ref={pokeballImg}/>
            {
                pokemonCatched && <img src={pokemon} alt={'pokemon'} className='pokemon'/>
            }
        </div>
    )
};

export default Pokeball;