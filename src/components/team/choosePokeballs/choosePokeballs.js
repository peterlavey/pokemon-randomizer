import React from "react";
import {POKEBALL} from "../pokeballs/pokeball/pokeball";
import "./choosePokeballs.styles.scss";
import {SFX_POKEBALL_TICK} from "../../../utils/constants";
import {delay, getByTier} from "../../../utils/utils";


export const ChoosePokeballs = ({pokeballs, setPokeballs}) => {
    const sfxSelect = new Audio(SFX_POKEBALL_TICK);
    const select = async (pokeball) => {
        setPokeballs([...pokeballs, pokeball]);
        sfxSelect.play();
        document.getElementById(pokeball.name).className = `pokeballItem ${pokeball.name}Selected`;
        await delay(450);
        if(document.getElementById(pokeball.name)) document.getElementById(pokeball.name).className = 'pokeballItem'
    }

    return (
        <div className='choosePokeballs'>
            {
                Object.values(POKEBALL).map(pokeball => (
                    <div id={pokeball.name} onClick={() => select(pokeball)} className='pokeballItem' key={pokeball.name}>
                        <img
                            src={pokeball.img}
                            alt={pokeball.name}
                        />
                        <div className='roulette'>
                            {pokeball.tiers.flatMap(getByTier).map(pokemon => (
                                <img src={pokemon.image.sprite}  alt={pokemon.name.english} key={pokemon.id + pokemon.name.english}/>
                            ))}
                        </div>
                    </div>
                ))
            }
        </div>
    )
};

export default ChoosePokeballs;