import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import {
    SFX_POKEBALL_OPEN,
    SFX_POKEBALL_TICK,
    SFX_POKEMON_INTRO,
    SFX_POKEMON_TEAM
} from '../constants/gameConstants';
import { preloadAudioIos } from '../utils/utils';

const SoundContext = createContext({
    ready: false,
    soundOn: false,
    introSong: null,
    teamCompleteSong: null,
    tickSfx: null,
    openSfx: null,
    toggleSound: () => {},
    playTick: () => {},
    playOpen: () => {},
    playIntro: () => {},
    pauseIntro: () => {},
    playTeamComplete: () => {},
});

export const useSoundContext = () => useContext(SoundContext);

export const SoundContextProvider = ({ children }) => {
    const [ready, setReady] = useState(false);
    const [soundOn, setSoundOn] = useState(false);
    const [audioInstances, setAudioInstances] = useState({
        introSong: null,
        teamCompleteSong: null,
        tickSfx: null,
        openSfx: null,
    });

    useEffect(() => {
        try {
            const audios = preloadAudioIos([
                SFX_POKEMON_INTRO,
                SFX_POKEMON_TEAM,
                SFX_POKEBALL_TICK,
                SFX_POKEBALL_OPEN,
            ]);

            setAudioInstances({
                introSong: audios[0],
                teamCompleteSong: audios[1],
                tickSfx: audios[2],
                openSfx: audios[3],
            });
            setReady(true);
        } catch (error) {
            console.warn('Audio initialization error:', error);
            setReady(true);
        }
    }, []);

    const playSoundInstance = useCallback((audio) => {
        if (!audio) return;
        try {
            if (typeof audio.seek === 'function') {
                audio.seek(0);
                audio.play();
            } else if (typeof audio.play === 'function') {
                audio.currentTime = 0;
                const playPromise = audio.play();
                if (playPromise && typeof playPromise.catch === 'function') {
                    playPromise.catch(() => {});
                }
            }
        } catch (e) {
            // Silently ignore autoplay restrictions
        }
    }, []);

    const pauseSoundInstance = useCallback((audio) => {
        if (!audio) return;
        try {
            if (typeof audio.pause === 'function') {
                audio.pause();
            }
        } catch (e) {
            // Silently ignore
        }
    }, []);

    const playTick = useCallback(() => {
        playSoundInstance(audioInstances.tickSfx);
    }, [audioInstances.tickSfx, playSoundInstance]);

    const playOpen = useCallback(() => {
        playSoundInstance(audioInstances.openSfx);
    }, [audioInstances.openSfx, playSoundInstance]);

    const playIntro = useCallback(() => {
        playSoundInstance(audioInstances.introSong);
    }, [audioInstances.introSong, playSoundInstance]);

    const pauseIntro = useCallback(() => {
        pauseSoundInstance(audioInstances.introSong);
    }, [audioInstances.introSong, pauseSoundInstance]);

    const playTeamComplete = useCallback(() => {
        playSoundInstance(audioInstances.teamCompleteSong);
    }, [audioInstances.teamCompleteSong, playSoundInstance]);

    const toggleSound = useCallback(() => {
        setSoundOn((prev) => {
            const next = !prev;
            if (next) {
                playSoundInstance(audioInstances.introSong);
            } else {
                pauseSoundInstance(audioInstances.introSong);
            }
            return next;
        });
    }, [audioInstances.introSong, playSoundInstance, pauseSoundInstance]);

    const contextValue = useMemo(() => ({
        ready,
        soundOn,
        introSong: audioInstances.introSong,
        teamCompleteSong: audioInstances.teamCompleteSong,
        tickSfx: audioInstances.tickSfx,
        openSfx: audioInstances.openSfx,
        toggleSound,
        playTick,
        playOpen,
        playIntro,
        pauseIntro,
        playTeamComplete,
    }), [
        ready,
        soundOn,
        audioInstances,
        toggleSound,
        playTick,
        playOpen,
        playIntro,
        pauseIntro,
        playTeamComplete,
    ]);

    return (
        <SoundContext.Provider value={contextValue}>
            {children}
        </SoundContext.Provider>
    );
};

export default SoundContext;
