import {createContext, useContext, useEffect, useState} from "react";
import {SFX_POKEMON_INTRO} from "../utils/constants";

const initialState = {
    introSong: undefined,
};

const SoundContext = createContext(initialState);
const useSoundContext = () => useContext(SoundContext);

const SoundContextProvider = ({ children }) => {
    const [introSong, setIntroSong] = useState(initialState.introSong);

    useEffect(() => {
        setIntroSong(new Audio(SFX_POKEMON_INTRO));
    }, [])

    return (
        <SoundContext.Provider
            value={{
                introSong
            }}
        >
            {children}
        </SoundContext.Provider>
    );
};

export { useSoundContext, SoundContextProvider };

