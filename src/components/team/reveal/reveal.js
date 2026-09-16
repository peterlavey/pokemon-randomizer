import React, { useState, useEffect, useCallback, useRef } from "react";
import './reveal.styles.scss';
import Mobile from "./mobile/mobile";

export const TYPE = Object.freeze({
    MOBILE: 'MOBILE'
});

export const Reveal = ({
    type = TYPE.MOBILE,
    pokemon,
    setPokemon,
    onDismiss,
    isAnimationFinished: controlledFinished,
    onAccelerate,
}) => {
    const [internalFinished, setInternalFinished] = useState(false);
    const prevPokemonIdRef = useRef(pokemon?.id);

    const isAnimationFinished = controlledFinished !== undefined ? controlledFinished : internalFinished;

    useEffect(() => {
        if (prevPokemonIdRef.current !== pokemon?.id) {
            prevPokemonIdRef.current = pokemon?.id;
            setInternalFinished(false);
        }
    }, [pokemon?.id]);

    const handleAction = useCallback(() => {
        if (!isAnimationFinished) {
            setInternalFinished(true);
            if (onAccelerate) {
                onAccelerate();
            }
        } else {
            if (onDismiss) {
                onDismiss();
            } else if (setPokemon) {
                setPokemon(undefined);
            }
        }
    }, [isAnimationFinished, onDismiss, setPokemon, onAccelerate]);

    const handleAnimationEnd = (e) => {
        if (!e.animationName || e.animationName === 'revealImage' || e.animationName === 'revealInfo') {
            setInternalFinished(true);
            if (onAccelerate) {
                onAccelerate();
            }
        }
    };

    if (!pokemon) return null;

    return (
        <div
            className={`reveal ${isAnimationFinished ? 'revealed' : ''}`.trim()}
            onClick={handleAction}
            onAnimationEnd={handleAnimationEnd}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    handleAction();
                }
            }}
        >
            {type === TYPE.MOBILE && <Mobile {...pokemon} isAnimationFinished={isAnimationFinished} />}
        </div>
    );
};

export default Reveal;
