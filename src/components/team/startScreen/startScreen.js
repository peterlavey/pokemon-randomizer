import React, { useEffect, useCallback } from 'react';
import { IMG_MASTERBALL } from '../../../constants/gameConstants';
import './startScreen.styles.scss';

export const StartScreen = ({ onStart }) => {
    const handleStart = useCallback(() => {
        if (onStart) {
            onStart();
        }
    }, [onStart]);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Enter' || event.key === ' ' || event.code === 'Space') {
                event.preventDefault();
                handleStart();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleStart]);

    return (
        <div className="startScreen" onClick={handleStart} role="region" aria-label="Pantalla de inicio">
            <div className="startScreen__content">
                <div className="startScreen__badge">NINTENDO 64</div>
                <h1 className="startScreen__title">
                    <span className="title-pokemon">POKÉMON</span>
                    <span className="title-stadium">STADIUM</span>
                </h1>
                <div className="startScreen__subtitle">TEAM RANDOMIZER</div>

                <div className="startScreen__emblem">
                    <div className="emblem-glow"></div>
                    <img src={IMG_MASTERBALL} alt="Master Ball Emblem" className="emblem-ball" />
                </div>

                <div className="startScreen__action">
                    <button
                        type="button"
                        className="startScreen__button"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleStart();
                        }}
                        autoFocus
                    >
                        <span className="button-text">PRESS START</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StartScreen;
