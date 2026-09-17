import React from "react";
import { POKEBALL, TEAM_SIZE } from "../../../constants/gameConstants";
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

    const currentPick = Math.min(pokeballs.length + 1, TEAM_SIZE);

    return (
        <div className='choosePokeballs'>
            <div className="choosePokeballs__header">
                <span className="choosePokeballs__badge">
                    MEMBER {currentPick} OF {TEAM_SIZE}
                </span>
                <h2 className="choosePokeballs__title">CHOOSE A TIER</h2>
                <p className="choosePokeballs__subtitle">
                    Select a Pokéball tier to spin and summon your Pokémon
                </p>
            </div>
            <div className="choosePokeballs__list">
                {Object.values(POKEBALL).map((pokeball) => (
                    <Carousel
                        pokeball={pokeball}
                        key={pokeball.name}
                        onSelect={handleSelect}
                    />
                ))}
            </div>
        </div>
    );
};

export default ChoosePokeballs;
