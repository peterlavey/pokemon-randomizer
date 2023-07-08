import React, {useRef} from "react";
import './pokeButton.styles.scss';
import {delay} from "../../../utils/utils";

export const PokeButton = ({onClick}) => {
    const pokeball = useRef();
    const pokeballButton = useRef();
    const blink = async () => {
        pokeball.current.classList.remove('shaking');
        window.requestAnimationFrame(() => pokeballButton.current.classList.add('blink'));
        await delay(500);
        window.requestAnimationFrame(() => pokeball.current.classList.add('zoom'));
        await delay(800);
        onClick();
    }

    return (
        <div className="pokeButton" onClick={blink}>
            <div className="center-on-page">
                <div className="pokeball shaking" ref={pokeball}>
                    <div className="pokeball__button" ref={pokeballButton}/>
                </div>
            </div>
        </div>
    )
};

export default PokeButton;