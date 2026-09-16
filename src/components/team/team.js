import React from "react";
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

    return (
        <div className='team'>
            {pokeballs.length > 0 && (
                <Pokeballs pokeballs={pokeballs} team={pokemonTeam} />
            )}
            {state === TEAM_STATE.CHOOSE && (
                <ChoosePokeballs pokeballs={pokeballs} onSelectPokeball={choosePokeball} />
            )}
            {state === TEAM_STATE.OPEN && (
                <PokeButton pokeball={currentPokeball} onClick={openCurrentPokeball} />
            )}
            {state === TEAM_STATE.REVEAL && (
                <Reveal type={TYPE.MOBILE} pokemon={currentPokemon} onDismiss={dismissReveal} />
            )}
            {state === TEAM_STATE.COMPLETED && (
                <Presentation team={pokemonTeam} />
            )}
            {state !== TEAM_STATE.COMPLETED && <Sound />}
        </div>
    );
};

export default Team;
