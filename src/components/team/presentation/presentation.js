import React, { useEffect, useMemo, useRef } from "react";
import './presentation.styles.scss';
import { delay } from "../../../utils/utils";
import TeamInfo from "./teamInfo/teamInfo";
import { useSoundContext } from "../../../contexts/soundContext";
import { arrangeStageLineup, calculateScaledHeight } from "../../../services/pokemonService";

export const Presentation = ({ team = [] }) => {
    const { pauseIntro, playTeamComplete, introSong, teamCompleteSong } = useSoundContext();
    const audioRefs = useRef([]);

    const members = useMemo(() => arrangeStageLineup(team), [team]);

    const maxHeight = useMemo(() => {
        if (!members.length) return 1;
        return Math.max(...members.map(({ height }) => height || 0), 1);
    }, [members]);

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
    }, [team.length, pauseIntro, playTeamComplete, introSong, teamCompleteSong]);

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

                return (
                    <div key={`${pokemon.id}-${index}`}>
                        <img
                            src={pokemon.image?.hires}
                            width={calculateScaledHeight(pokemon.height, maxHeight)}
                            className={`member${index}`}
                            style={{ zIndex, top }}
                            alt={pokemon.name?.english || ''}
                        />
                        <audio
                            ref={(el) => (audioRefs.current[index] = el)}
                            src={pokemon.cry}
                            autoPlay
                        />
                    </div>
                );
            })}
            <TeamInfo team={team} />
        </div>
    );
};

export default Presentation;
