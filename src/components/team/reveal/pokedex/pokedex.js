import React from "react";
import './pokedex.styles.scss';

export const Pokedex = ({infoRef, imageRef, id, name, type}) => {
    return (
        <div className='pokedex'>
            <div className='reveal'>
                <div className={type[0].toLowerCase()}>
                    <div ref={infoRef}>
                        <h1>{`#${id}-${name.english}`}</h1>
                    </div>
                    <img src={`images/${id}.png`} alt={''} ref={imageRef}/>
                    <audio src={`sfx/${id}.wav`} autoPlay/>
                </div>
            </div>
        </div>
    )
};

export default Pokedex;