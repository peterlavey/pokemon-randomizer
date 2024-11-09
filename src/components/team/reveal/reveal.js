import React, {useEffect, useRef} from "react";
import './reveal.styles.scss';
import Mobile from "./mobile/mobile";

export const TYPE = {
    MOBILE: 'MOBILE'
};

export const Reveal = ({type, pokemon, setPokemon}) => {
    const imageRef = useRef(null);
    const infoRef = useRef(null);

    const clean = () => {
        setPokemon(undefined);
    }

    const reveal = () => {
        imageRef?.current?.classList?.remove('revealImage');
        window.requestAnimationFrame(() => imageRef.current?.classList?.add('revealImage'));

        infoRef?.current?.classList?.remove('revealInfo');
        window.requestAnimationFrame(() => infoRef?.current?.classList?.add('revealInfo'));
    }

    useEffect(() => {
        if(pokemon) reveal();
    }, [pokemon]);

    return (
        <div className='reveal' onClick={clean}>
            {
                {
                    [TYPE.MOBILE]: pokemon && <Mobile infoRef={infoRef} imageRef={imageRef} {...pokemon}/>
                }[type]
            }
        </div>
    )
};

export default Reveal;