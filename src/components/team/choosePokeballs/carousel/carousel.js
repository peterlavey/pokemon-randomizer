import React from "react";
import './carousel.styles.scss';
import {SFX_POKEBALL_TICK} from "../../../../utils/constants";
import {delay, getByTier} from "../../../../utils/utils";


export const Carousel = ({pokeball, onSelect}) => {
    const sfxSelect = new Audio(SFX_POKEBALL_TICK);

    const handleSelect = async () => {
        sfxSelect.play();
        document.getElementById(pokeball.name).className = `pokeballItem ${pokeball.name}Selected`;
        await delay(450);
        if(document.getElementById(pokeball.name)) document.getElementById(pokeball.name).className = 'pokeballItem';
        onSelect(pokeball);
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