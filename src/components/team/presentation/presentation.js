import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import './presentation.styles.scss';
import { delay } from "../../../utils/utils";
import TeamInfo from "./teamInfo/teamInfo";
import { useSoundContext } from "../../../contexts/soundContext";
import { arrangeStageLineup, calculateScaledHeight } from "../../../services/pokemonService";

export const Presentation = ({ team = [] }) => {
    const { pauseIntro, playTeamComplete, introSong, teamCompleteSong } = useSoundContext();
    const audioRefs = useRef([]);
    const [cryingMap, setCryingMap] = useState({});

    const members = useMemo(() => arrangeStageLineup(team), [team]);

    const maxHeight = useMemo(() => {
        if (!members.length) return 1;
        return Math.max(...members.map(({ height }) => height || 0), 1);
    }, [members]);

    const handlePlayCry = useCallback((pokemonId) => {
        setCryingMap((prev) => ({
            ...prev,
            [pokemonId]: (prev[pokemonId] || 0) + 1,
        }));
    }, []);

    const handleStagePokemonClick = useCallback((pokemon, index) => {
        handlePlayCry(pokemon.id);
        const audio = audioRefs.current[index];
        if (audio) {
            try {
                audio.currentTime = 0;
                const playPromise = audio.play();
                if (playPromise?.catch) playPromise.catch(() => {});
            } catch (e) {}
        }
    }, [handlePlayCry]);

    useEffect(() => {
        let isCancelled = false;

        const playStadiumAudio = async () => {
            await delay(1000);
            if (isCancelled) return;

            if (pauseIntro) {
                pauseIntro();
            } else if (introSong?.pause) {
                introSong.pause();
            }

            members.forEach((pokemon) => {
                handlePlayCry(pokemon.id);
            });

            audioRefs.current.forEach((audio) => {
                if (audio) {
                    try {
                        audio.currentTime = 0;
                        const playPromise = audio.play();
                        if (playPromise?.catch) playPromise.catch(() => {});
                    } catch (e) {}
                }
            });

            if (playTeamComplete) {
                playTeamComplete();
            } else if (teamCompleteSong?.play) {
                teamCompleteSong.play();
            }
        };

        if (team.length > 0) {
            playStadiumAudio();
        }

        return () => {
            isCancelled = true;
        };
    }, [team.length, pauseIntro, playTeamComplete, introSong, teamCompleteSong, members, handlePlayCry]);

    return (
        <div className='presentation'>
            {members.map((pokemon, index) => {
                const zIndex = Math.round((maxHeight - (pokemon.height || 0)) * 10);
                let top = 'initial';
                if (pokemon.isFlying) {
                    top = '5%';
                } else if (pokemon.isJumping) {
                    top = '25%';
                }

                const cryKey = cryingMap[pokemon.id] || 0;

                return (
                    <div key={`${pokemon.id}-${index}`}>
                        <img
                            key={`${pokemon.id}-${cryKey}`}
                            src={pokemon.image?.hires}
                            width={calculateScaledHeight(pokemon.height, maxHeight)}
                            className={`member${index}${cryKey > 0 ? ' crying' : ''}`}
                            style={{ zIndex, top }}
                            alt={pokemon.name?.english || ''}
                            onClick={() => handleStagePokemonClick(pokemon, index)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    handleStagePokemonClick(pokemon, index);
                                }
                            }}
                        />
                        <audio
                            ref={(el) => (audioRefs.current[index] = el)}
                            src={pokemon.cry}
                        />
                    </div>
                );
            })}
            <TeamInfo team={team} onPlayCry={handlePlayCry} activeCryMap={cryingMap} />
        </div>
    );
};

export default Presentation;
