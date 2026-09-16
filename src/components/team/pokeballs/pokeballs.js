import React from "react";
import './pokeballs.styles.scss';
import Pokeball, { POKEBALL } from "./pokeball/pokeball";

export const Pokeballs = ({ pokeballs = [], team = [], isAnimationFinished = false }) => {
    return (
        <div className='pokeballs'>
            {pokeballs.map((pokeball, i) => {
                const isCurrent = i === team.length - 1;
                const isPast = i < team.length - 1;
                const isSlotRevealed = isPast || (isCurrent && isAnimationFinished);
                return (
                    <Pokeball
                        type={pokeball}
                        pokemonImg={team[i] ? team[i].image?.sprite : ''}
                        isRevealed={isSlotRevealed}
                        isCurrent={isCurrent}
                        key={`${pokeball.name}-${i}`}
                    />
                );
            })}
            <Pokeball type={POKEBALL.NORMAL} pokemonImg={''} isRevealed={false} isCurrent={false} />
        </div>
    );
};

export default Pokeballs;
