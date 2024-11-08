import React from "react";
import './carousel.styles.scss';
import {delay, getByTier} from "../../../../utils/utils";
import {useSoundContext} from "../../../../contexts/soundContext";


export const Carousel = ({pokeball, onSelect}) => {
    const {tickSfx} = useSoundContext();

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
                {pokeball.tiers.flatMap(getByTier).map(pokemon => (
                    <img src={pokemon.image.sprite} alt={pokemon.name.english} key={pokemon.id + pokemon.name.english}/>
                ))}
            </div>
        </div>
    )
};

export default Carousel;