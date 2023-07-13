import React, {useEffect, useRef} from "react";
import './reveal.styles.scss';
import Mobile from "./mobile/mobile";

export const TYPE = {
    MOBILE: 'MOBILE'
};

export const Reveal = ({clean, type, pokemon}) => {
    const imageRef = useRef(null);
    const infoRef = useRef(null);

    const reveal = () => {
        imageRef.current.classList.remove('revealImage');
        window.requestAnimationFrame(() => imageRef.current.classList.add('revealImage'));

        infoRef.current.classList.remove('revealInfo');
        window.requestAnimationFrame(() => infoRef.current.classList.add('revealInfo'));
    }
    useEffect(() => {
        reveal();
    }, [pokemon]);
    return (
        <div className='reveal' onClick={clean}>
            {
                {
                    [TYPE.MOBILE]: <Mobile infoRef={infoRef} imageRef={imageRef} {...pokemon}/>
                }[type]
            }
        </div>
    )
};

export default Reveal;