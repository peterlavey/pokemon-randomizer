import React, {useEffect, useState} from "react";
import './carousel.styles.scss';
import {delay, getByTier} from "../../../../utils/utils";
import {useSoundContext} from "../../../../contexts/soundContext";


export const Carousel = ({pokeball, onSelect}) => {
    const [pokemonImg, setPokemonImg] = useState([]);
    const {tickSfx} = useSoundContext();

    useEffect(() => {
        const images = pokeball.tiers.flatMap(getByTier);
        // todo: get the length of tier with more quantity of pokemons and try to replicate the length in the others to can calculate an infinity loop in the css
        if (pokeball.name === 'Masterball') {
            setPokemonImg([...images, ...images, ...images, ...images, ...images, ...images, ...images]);
        } else {
            setPokemonImg([...images, ...images, ...images, ...images]);
        }
    }, [pokeball.name, pokeball.tiers]);

    const handleSelect = async () => {
        tickSfx.currentTime = 0;
        tickSfx.play();
        onSelect(pokeball);
        document.getElementById(pokeball.name).className = `pokeballItem ${pokeball.name}Selected`;
        await delay(450);
        if(document.getElementById(pokeball.name)) document.getElementById(pokeball.name).className = 'pokeballItem';
    }

    return (
        <div id={pokeball.name} onClick={handleSelect} className='pokeballItem' key={pokeball.name}>
            <img
                src={pokeball.img}
                alt={pokeball.name}
            />
            <div className='roulette'>
                {pokemonImg.map((pokemon, index) => (
                    <img src={pokemon.image.sprite} alt={pokemon.name.english} key={pokemon.id + pokemon.name.english + index}/>
                ))}
            </div>
        </div>
    )
};

export default Carousel;