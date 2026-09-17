import React, { useState, useCallback, useMemo } from "react";
import Pokeballs from "./pokeballs/pokeballs";
import PokeButton from "./pokeButton/pokeButton";
import Reveal, { TYPE } from "./reveal/reveal";
import Presentation from "./presentation/presentation";
import ChoosePokeballs from "./choosePokeballs/choosePokeballs";
import Sound from "./sound/sound";
import StartScreen from "./startScreen/startScreen";
import { useTeam } from "../../hooks/useTeam";
import { useSoundContext } from "../../contexts/soundContext";
import { TEAM_STATE } from "../../constants/gameConstants";
import { isPresentationUrlParam, getInitialTeamStateFromUrl } from "../../utils/utils";
import './team.styles.scss';

export const Team = ({ initialStarted, initialTeamState = null }) => {
    const isDirectPresentation = useMemo(() => isPresentationUrlParam(), []);
    const resolvedInitialStarted = initialStarted !== undefined
        ? initialStarted
        : isDirectPresentation;

    const [hasStarted, setHasStarted] = useState(resolvedInitialStarted);
    const [isAnimationFinished, setIsAnimationFinished] = useState(false);

    const [resolvedInitialState] = useState(() => {
        if (initialTeamState) return initialTeamState;
        if (isDirectPresentation) {
            return getInitialTeamStateFromUrl();
        }
        return undefined;
    });

    const {
        state,
        pokeballs,
        pokemonTeam,
        currentPokemon,
        currentPokeball,
        choosePokeball,
        openCurrentPokeball,
        dismissReveal,
    } = useTeam(resolvedInitialState);

    const { playIntro } = useSoundContext();

    const handleStart = useCallback(() => {
        if (playIntro) {
            playIntro();
        }
        setHasStarted(true);
    }, [playIntro]);

    const handleOpen = useCallback((optionalPokemon) => {
        setIsAnimationFinished(false);
        openCurrentPokeball(optionalPokemon);
    }, [openCurrentPokeball]);

    const handleDismiss = useCallback(() => {
        setIsAnimationFinished(false);
        dismissReveal();
    }, [dismissReveal]);

    if (!hasStarted) {
        return <StartScreen onStart={handleStart} />;
    }

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
