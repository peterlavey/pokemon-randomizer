import React from "react";
import './reveal.styles.scss';
import Mobile from "./mobile/mobile";

export const TYPE = Object.freeze({
    MOBILE: 'MOBILE'
});

export const Reveal = ({ type = TYPE.MOBILE, pokemon, setPokemon, onDismiss }) => {
    const handleDismiss = () => {
        if (onDismiss) {
            onDismiss();
        } else if (setPokemon) {
            setPokemon(undefined);
        }
    };

    if (!pokemon) return null;

    return (
        <div
            className='reveal'
            onClick={handleDismiss}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    handleDismiss();
                }
            }}
        >
            {type === TYPE.MOBILE && <Mobile {...pokemon} />}
        </div>
    );
};

export default Reveal;
