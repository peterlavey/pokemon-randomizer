import React from "react";
import { IMG_SOUND_OFF, IMG_SOUND_ON } from "../../../constants/gameConstants";
import './sound.styles.scss';
import { useSoundContext } from "../../../contexts/soundContext";

export const Sound = () => {
    const { soundOn, toggleSound } = useSoundContext();

    return (
        <div className='sound'>
            <img
                src={soundOn ? IMG_SOUND_ON : IMG_SOUND_OFF}
                onClick={toggleSound}
                alt={soundOn ? "Mute sound" : "Enable sound"}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        toggleSound();
                    }
                }}
            />
        </div>
    );
};

export default Sound;
