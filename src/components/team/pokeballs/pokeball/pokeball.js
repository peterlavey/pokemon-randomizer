import React, {useEffect, useRef, useState} from "react";
import './pokeball.styles.scss';
import {delay} from "../../../../utils/utils";

const TIER = {
    S: 'S',
    A: 'A',
    B: 'B',
    C: 'C',
    D: 'D',
};

export const POKEBALL = {
    NORMAL: {
        name: 'Pokeball',
        img: 'images/pokeballs/normal.png',
        tiers: [TIER.D, TIER.C]
    },
    SUPER: {
        name: 'Superball',
        img: 'images/pokeballs/super.png',
        tiers: [TIER.B]
    },
    ULTRA: {
        name: 'Ultraball',
        img: 'images/pokeballs/ultra.png',
        tiers: [TIER.A]
    },
    MASTER: {
        name: 'Masterball',
        img: 'images/pokeballs/master.png',
        tiers: [TIER.S]
    }
};

export const Pokeball = ({type, pokemonImg }) => {
    const pokeballImg = useRef();
    const [pokemonCatched, setPokemonCatched] = useState(false);

    const reveal = async () => {
        await delay(5000);
        pokeballImg.current.classList.remove('catch');
        window.requestAnimationFrame(() => pokeballImg.current.classList.add('catch'));
        await delay(1500);
        setPokemonCatched(true);
    }

    useEffect(() => {
        if(pokemonImg) {
            reveal();
        }
    }, [pokemonImg]);

    return (
        <div className='pokeballContainer'>
            <img src={type.img} alt={type.name} ref={pokeballImg}/>
            {
                pokemonCatched && <img src={pokemonImg} alt={pokemonImg} className='pokemon'/>
            }
        </div>
    )
};

export default Pokeball;