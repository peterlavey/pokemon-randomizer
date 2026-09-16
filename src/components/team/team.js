import React, { useState, useCallback } from "react";
import Pokeballs from "./pokeballs/pokeballs";
import PokeButton from "./pokeButton/pokeButton";
import Reveal, { TYPE } from "./reveal/reveal";
import Presentation from "./presentation/presentation";
import ChoosePokeballs from "./choosePokeballs/choosePokeballs";
import Sound from "./sound/sound";
import { useTeam } from "../../hooks/useTeam";
import { TEAM_STATE } from "../../constants/gameConstants";
import './team.styles.scss';

export const Team = () => {
    const {
        state,
        pokeballs,
        pokemonTeam,
        currentPokemon,
        currentPokeball,
        choosePokeball,
        openCurrentPokeball,
        dismissReveal,
    } = useTeam();

    const [isAnimationFinished, setIsAnimationFinished] = useState(false);

    const handleOpen = useCallback((optionalPokemon) => {
        setIsAnimationFinished(false);
        openCurrentPokeball(optionalPokemon);
    }, [openCurrentPokeball]);

    const handleDismiss = useCallback(() => {
        setIsAnimationFinished(false);
        dismissReveal();
    }, [dismissReveal]);

    return (
        <div className='team'>
            {pokeballs.length > 0 && (
                <Pokeballs
                    pokeballs={pokeballs}
                    team={pokemonTeam}
                    isAnimationFinished={isAnimationFinished}
                />
            )}
            {state === TEAM_STATE.CHOOSE && (
                <ChoosePokeballs pokeballs={pokeballs} onSelectPokeball={choosePokeball} />
            )}
            {state === TEAM_STATE.OPEN && (
                <PokeButton pokeball={currentPokeball} onClick={handleOpen} />
            )}
            {state === TEAM_STATE.REVEAL && (
                <Reveal
                    type={TYPE.MOBILE}
                    pokemon={currentPokemon}
                    onDismiss={handleDismiss}
                    isAnimationFinished={isAnimationFinished}
                    onAccelerate={() => setIsAnimationFinished(true)}
                />
            )}
            {state === TEAM_STATE.COMPLETED && (
                <Presentation team={pokemonTeam} />
            )}
            {state !== TEAM_STATE.COMPLETED && <Sound />}
        </div>
    );
};

export default Team;
