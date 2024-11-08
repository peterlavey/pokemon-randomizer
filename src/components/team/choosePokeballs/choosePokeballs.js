import React from "react";
import {POKEBALL} from "../pokeballs/pokeball/pokeball";
import Carousel from "./carousel/carousel";
import "./choosePokeballs.styles.scss";


export const ChoosePokeballs = ({pokeballs, setPokeballs}) => {
    const select = async (pokeball) => {
        setPokeballs([...pokeballs, pokeball]);
    }

    return (
        <div className='choosePokeballs'>
            {
                Object.values(POKEBALL).map(pokeball => (
                    <Carousel pokeball={pokeball} key={pokeball.name} onSelect={select} />
                ))
            }
        </div>
    )
};

export default ChoosePokeballs;