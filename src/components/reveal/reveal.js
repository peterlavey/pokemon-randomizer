import React, {useEffect} from "react";
import './reveal.styles.scss';

export const Reveal = ({id}) => {
    useEffect(() => {
        const dist = document.querySelector('img');
        dist.classList.remove('reveal');
        window.requestAnimationFrame(function() {
            dist.classList.add('reveal');
        });
    }, [id]);
    return (
        <div className='main'>
            <img src={`images/${id}.png`} alt={''}/>
            <audio src={`sfx/${id}.wav`} autoPlay/>
        </div>
    )
};

export default Reveal;