import React from "react";
import { POKEBALL } from "../../../constants/gameConstants";
import Carousel from "./carousel/carousel";
import "./choosePokeballs.styles.scss";

export const ChoosePokeballs = ({ pokeballs = [], setPokeballs, onSelectPokeball }) => {
    const handleSelect = (pokeball) => {
        if (onSelectPokeball) {
            onSelectPokeball(pokeball);
        } else if (setPokeballs) {
            setPokeballs([...pokeballs, pokeball]);
        }
    };

    return (
        <div className='choosePokeballs'>
            {Object.values(POKEBALL).map((pokeball) => (
                <Carousel
                    pokeball={pokeball}
                    key={pokeball.name}
                    onSelect={handleSelect}
                />
            ))}
        </div>
    );
};

export default ChoosePokeballs;
