import {createContext, useContext, useEffect, useState} from "react";
import {SFX_POKEBALL_OPEN, SFX_POKEBALL_TICK, SFX_POKEMON_INTRO, SFX_POKEMON_TEAM} from "../utils/constants";
import {preloadAudioIos} from "../utils/utils";

const initialState = {
    ready: false,
    introSong: undefined,
    teamCompleteSong: undefined,
    tickSfx: undefined,
    openSfx: undefined,
};

const SoundContext = createContext(initialState);
const useSoundContext = () => useContext(SoundContext);

const SoundContextProvider = ({ children }) => {
    const [ready, setReady] = useState(false);
    const [introSong, setIntroSong] = useState(initialState.introSong);
    const [teamCompleteSong, setTeamCompleteSong] = useState(initialState.teamCompleteSong);
    const [tickSfx, setTickSfx] = useState(initialState.tickSfx);
    const [openSfx, setOpenSfx] = useState(initialState.openSfx);

    const init = async () => {
        const audios = preloadAudioIos([
            SFX_POKEMON_INTRO,
            SFX_POKEMON_TEAM,
            SFX_POKEBALL_TICK,
            SFX_POKEBALL_OPEN,
        ]);

        setIntroSong(audios[0]);
        setTeamCompleteSong(audios[1]);
        setTickSfx(audios[2]);
        setOpenSfx(audios[3]);

        setReady(true);
    }

    useEffect(() => {
        init();
    }, [])

    return (
        <SoundContext.Provider
            value={{
                ready,
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

