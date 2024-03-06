import React from "react";
import {POKEBALL} from "../pokeballs/pokeball/pokeball";
import "./choosePokeballs.styles.scss";
import {SFX_POKEBALL_TICK} from "../../../utils/constants";


export const ChoosePokeballs = ({pokeballs, setPokeballs}) => {
    const sfxSelect = new Audio(SFX_POKEBALL_TICK);
    const select = (pokeball) => {
        setPokeballs([...pokeballs, pokeball]);
        sfxSelect.play();
    }

    return (
        <div className='choosePokeballs'>
            {
                Object.values(POKEBALL).map(pokeball => (
                    <img
                        onClick={() => select(pokeball)}
                        src={pokeball.img}
                        key={pokeball.name}
                        alt={pokeball.name}
                    />
                ))
            }
        </div>
    )
};

export default ChoosePokeballs;