import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import './presentation.styles.scss';
import { delay } from "../../../utils/utils";
import TeamInfo from "./teamInfo/teamInfo";
import Confetti from "./confetti/confetti";
import { useSoundContext } from "../../../contexts/soundContext";
import { arrangeStageLineup, calculateScaledHeight } from "../../../services/pokemonService";

const getHorizontalPositions = (count) => {
    switch (count) {
        case 1:
            return ['50%'];
        case 2:
            return ['38%', '62%'];
        case 3:
            return ['25%', '50%', '75%'];
        case 4:
            return ['20%', '40%', '60%', '80%'];
        case 5:
            return ['16%', '33%', '50%', '67%', '84%'];
        case 6:
        default:
            return ['13%', '28%', '43%', '57%', '72%', '87%'];
    }
};

export const Presentation = ({ team = [] }) => {
    const { pauseIntro, playTeamComplete, introSong, teamCompleteSong } = useSoundContext();
    const audioRefs = useRef([]);
    const [cryingMap, setCryingMap] = useState({});

    const members = useMemo(() => arrangeStageLineup(team), [team]);

    const memberPositions = useMemo(() => {
        const flyingMembers = members.filter((p) => p.isFlying);
        const groundMembers = members.filter((p) => !p.isFlying);

        const flyingPositions = getHorizontalPositions(flyingMembers.length);
        const groundPositions = getHorizontalPositions(groundMembers.length);

        let flyingIndex = 0;
        let groundIndex = 0;

        return members.map((pokemon) => {
            if (pokemon.isFlying) {
                const left = flyingPositions[flyingIndex++];
                return { left, top: '15%' };
            }
            const left = groundPositions[groundIndex++];
            const top = pokemon.isJumping ? '45%' : 'initial';
            return { left, top };
        });
    }, [members]);

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
        <div className='presentation hall-of-fame'>
            <div className="hof-header" />
            <div className="hof-stage">
                <Confetti count={55} />
                {members.map((pokemon, index) => {
                    const zIndex = Math.round((maxHeight - (pokemon.height || 0)) * 10);
                    const { left, top } = memberPositions[index] || { left: 'initial', top: 'initial' };

                    const cryKey = cryingMap[pokemon.id] || 0;

                    return (
                        <div key={`${pokemon.id}-${index}`} className={`pokemon-wrapper slot-${index}`}>
                            <img
                                key={`${pokemon.id}-${cryKey}`}
                                src={pokemon.image?.hires}
                                width={calculateScaledHeight(pokemon.height, maxHeight)}
                                className={`member${index}${cryKey > 0 ? ' crying' : ''}`}
                                style={{ zIndex, top, left }}
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
            </div>
            <div className="hof-banner">
                <h1 className="hof-title">Welcome to the HALL OF FAME!</h1>
            </div>
            <div className="hof-footer">
                <TeamInfo team={team} onPlayCry={handlePlayCry} activeCryMap={cryingMap} />
            </div>
        </div>
    );
};

export default Presentation;
