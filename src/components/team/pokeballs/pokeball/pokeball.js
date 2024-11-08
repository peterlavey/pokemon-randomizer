import React, {useEffect, useRef, useState} from "react";
import './pokeball.styles.scss';
import {delay} from "../../../../utils/utils";
import {IMG_MASTERBALL, IMG_POKEBALL, IMG_SUPERBALL, IMG_ULTRABALL} from "../../../../utils/constants";

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
        img: IMG_POKEBALL,
        tiers: [TIER.D, TIER.C]
    },
    SUPER: {
        name: 'Superball',
        img: IMG_SUPERBALL,
        tiers: [TIER.B]
    },
    ULTRA: {
        name: 'Ultraball',
        img: IMG_ULTRABALL,
        tiers: [TIER.A]
    },
    MASTER: {
        name: 'Masterball',
        img: IMG_MASTERBALL,
        tiers: [TIER.S]
    }
};

export const Pokeball = ({type, pokemonImg }) => {
    const pokeballImg = useRef();
    const [pokemonCatched, setPokemonCatched] = useState(false);

    const reveal = async () => {
        await delay(4000);
        pokeballImg.current.classList.remove('catch');
        window.requestAnimationFrame(() => pokeballImg.current.classList.add('catch'));
        await delay(500);
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