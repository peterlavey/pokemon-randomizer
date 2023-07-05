import React, {useEffect, useRef} from "react";
import './reveal.styles.scss';

export const Reveal = ({id}) => {
    const imageRef = useRef(null);

    const reveal = () => {
        imageRef.current.classList.remove('reveal');
        window.requestAnimationFrame(() => imageRef.current.classList.add('reveal'));
    }
    useEffect(() => {
        reveal();
    }, [id]);
    return (
        <div className='main'>
            <img src={`images/${id}.png`} alt={''} ref={imageRef}/>
            <audio src={`sfx/${id}.wav`} autoPlay/>
        </div>
    )
};

export default Reveal;