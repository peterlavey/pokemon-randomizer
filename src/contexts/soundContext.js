import {createContext, useContext, useEffect, useState} from "react";
import {SFX_POKEBALL_OPEN, SFX_POKEBALL_TICK, SFX_POKEMON_INTRO, SFX_POKEMON_TEAM} from "../utils/constants";

const initialState = {
    introSong: undefined,
    teamCompleteSong: undefined,
    tickSfx: undefined,
    openSfx: undefined,
};

const SoundContext = createContext(initialState);
const useSoundContext = () => useContext(SoundContext);

const SoundContextProvider = ({ children }) => {
    const [introSong, setIntroSong] = useState(initialState.introSong);
    const [teamCompleteSong, setTeamCompleteSong] = useState(initialState.teamCompleteSong);
    const [tickSfx, setTickSfx] = useState(initialState.tickSfx);
    const [openSfx, setOpenSfx] = useState(initialState.openSfx);

    const preload = () => {
        setIntroSong(new Audio(SFX_POKEMON_INTRO));
        setTeamCompleteSong(new Audio(SFX_POKEMON_TEAM));
        setTickSfx(new Audio(SFX_POKEBALL_TICK));
        setOpenSfx(new Audio(SFX_POKEBALL_OPEN));
    }

    useEffect(() => {
        preload();
    }, [])

    return (
        <SoundContext.Provider
            value={{
                introSong,
                teamCompleteSong,
                tickSfx,
                openSfx,
            }}
        >
            {children}
        </SoundContext.Provider>
    );
};

export { useSoundContext, SoundContextProvider };

