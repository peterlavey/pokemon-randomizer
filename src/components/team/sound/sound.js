import React, {useState} from "react";
import {IMG_SOUND_OFF, IMG_SOUND_ON} from "../../../utils/constants";
import './sound.styles.scss';
import {useSoundContext} from "../../../contexts/soundContext";


export const Sound = ({autoplay}) => {
    const { introSong } = useSoundContext();
    const [state, setState] = useState(false)

    //todo: precargar para que funcione el autoplay
    /*useEffect(() => {
        if (autoplay) onSwitch();
    }, [autoplay]);*/

    const onSwitch = () => {
        if(state) {
            introSong.pause();
        } else {
            introSong.play();
        }
        setState(!state);
    }

    return (
        <div onClick={onSwitch} className='sound'>
            {state && <img src={IMG_SOUND_ON} alt="" />}
            {!state && <img src={IMG_SOUND_OFF} alt="" />}
        </div>
    )
};

export default Sound;