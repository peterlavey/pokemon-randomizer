import React, {useEffect, useRef} from "react";
import './reveal.styles.scss';

export const Reveal = ({id, name}) => {
    const imageRef = useRef(null);
    const infoRef = useRef(null);

    const reveal = () => {
        imageRef.current.classList.remove('revealImage');
        window.requestAnimationFrame(() => imageRef.current.classList.add('revealImage'));

        infoRef.current.classList.remove('revealInfo');
        window.requestAnimationFrame(() => infoRef.current.classList.add('revealInfo'));
    }
    useEffect(() => {
        console.log(id)
        reveal();
    }, [id]);
    return (
        <div className='main'>
            <div ref={infoRef}>
                <h1>{name.english}</h1>
            </div>
            <img src={`images/${id}.png`} alt={''} ref={imageRef}/>
            <audio src={`sfx/${id}.wav`} autoPlay/>
        </div>
    )
};

export default Reveal;