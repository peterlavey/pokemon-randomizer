import React from "react";
import {POKEBALL} from "../pokeballs/pokeball/pokeball";
import "./choosePokeballs.styles.scss";


export const ChoosePokeballs = ({pokeballs, setPokeballs}) => (
    <div className='choosePokeballs'>
        {
            Object.values(POKEBALL).map(pokeball => (
                <img
                    onClick={() => setPokeballs([...pokeballs, pokeball])}
                    src={pokeball.img}
                    key={pokeball.name}
                    alt={pokeball.name}
                />
            ))
        }
    </div>
);

export default ChoosePokeballs;