import React, { useState, useCallback, useRef, useEffect } from "react";
import { delay } from "../../../utils/utils";
import { useSoundContext } from "../../../contexts/soundContext";
import './pokeButton.styles.scss';

export const PokeButton = ({ pokeball, onClick }) => {
    const [phase, setPhase] = useState('SHAKING'); // 'SHAKING' | 'BLINKING' | 'ZOOMING'
    const { playOpen, openSfx } = useSoundContext();
    const isHandlingClick = useRef(false);

    useEffect(() => {
        return () => {
            isHandlingClick.current = false;
        };
    }, []);

    const handleClick = useCallback(async () => {
        if (isHandlingClick.current) return;
        isHandlingClick.current = true;

        if (playOpen) {
            playOpen();
        } else if (openSfx) {
            try {
                openSfx.play();
            } catch (e) {}
        }

        setPhase('BLINKING');
        await delay(500);

        setPhase('ZOOMING');
        await delay(800);

        onClick?.();
    }, [playOpen, openSfx, onClick]);

    const containerClasses = [
        phase === 'SHAKING' ? 'shaking' : '',
        phase === 'ZOOMING' ? 'zoom' : ''
    ].filter(Boolean).join(' ');

    const buttonClasses = [
        'pokeball__button',
        phase === 'BLINKING' ? 'blink' : ''
    ].filter(Boolean).join(' ');

    return (
        <div
            className="pokeButton"
            onClick={handleClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    handleClick();
                }
            }}
        >
            <div className="center-on-page">
                <div className={containerClasses}>
                    <img src={pokeball?.img} alt={pokeball?.name || 'Pokeball'} />
                    <div className={buttonClasses} />
                </div>
            </div>
        </div>
    );
};

export default PokeButton;
