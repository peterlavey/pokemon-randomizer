import React, {useState} from "react";
import {IMG_SOUND_OFF, IMG_SOUND_ON} from "../../../utils/constants";
import './sound.styles.scss';
import {useSoundContext} from "../../../contexts/soundContext";


export const Sound = () => {
    const { introSong } = useSoundContext();
    const [state, setState] = useState(false)

    const onSwitch = () => {
        if(state) {
            introSong.pause();
        } else {
            introSong.play();
        }
        setState(!state);
    }

    return (
        <div className='sound'>
            {state && <img src={IMG_SOUND_ON} onClick={onSwitch} alt="" />}
            {!state && <img src={IMG_SOUND_OFF} onClick={onSwitch} alt="" />}
        </div>
    )
};

export default Sound;