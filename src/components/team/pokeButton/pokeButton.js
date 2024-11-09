import React, {useRef} from "react";
import {delay} from "../../../utils/utils";
import {useSoundContext} from "../../../contexts/soundContext";
import './pokeButton.styles.scss';


export const PokeButton = ({pokeball, onClick}) => {
    const pokeballRef = useRef();
    const pokeballButton = useRef();
    const {openSfx} = useSoundContext();
    const blink = async () => {
        openSfx.play();
        pokeballRef.current.classList.remove('shaking');
        window.requestAnimationFrame(() => pokeballButton.current.classList.add('blink'));
        await delay(500);
        window.requestAnimationFrame(() => pokeballRef.current.classList.add('zoom'));
        await delay(800);
        onClick();
    }

    return (
        <div className="pokeButton" onClick={blink}>
            <div className="center-on-page">
                <div className="shaking" ref={pokeballRef}>
                    <img src={pokeball.img} alt={pokeball.name}/>
                    <div className="pokeball__button" ref={pokeballButton}/>
                </div>
            </div>
        </div>
    )
};

export default PokeButton;