import React, { useMemo, useState, useCallback, useRef, useEffect } from "react";
import './carousel.styles.scss';
import { getPokemonsByPokeball } from "../../../../services/pokemonService";
import { useSoundContext } from "../../../../contexts/soundContext";

export const Carousel = ({ pokeball, onSelect }) => {
    const [isSelected, setIsSelected] = useState(false);
    const { playTick, tickSfx } = useSoundContext();
    const timeoutRef = useRef(null);

    const pokemonImg = useMemo(() => {
        const images = getPokemonsByPokeball(pokeball);
        const repeatCount = pokeball.name === 'Masterball' ? 7 : 4;
        return Array.from({ length: repeatCount }, () => images).flat();
    }, [pokeball]);

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    const handleSelect = useCallback(() => {
        if (playTick) {
            playTick();
        } else if (tickSfx) {
            try {
                tickSfx.currentTime = 0;
                tickSfx.play();
            } catch (e) {}
        }

        onSelect?.(pokeball);

        setIsSelected(true);
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
            setIsSelected(false);
        }, 450);
    }, [playTick, tickSfx, onSelect, pokeball]);

    const selectionClass = isSelected ? `${pokeball.name}Selected` : '';

    return (
        <div
            id={pokeball.name}
            onClick={handleSelect}
            className={`pokeballItem ${selectionClass}`.trim()}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    handleSelect();
                }
            }}
        >
            <img
                src={pokeball.img}
                alt={pokeball.name}
            />
            <div className='roulette'>
                {pokemonImg.map((pokemon, index) => (
                    <img
                        src={pokemon.image?.sprite}
                        alt={pokemon.name?.english || ''}
                        key={`${pokemon.id}-${pokemon.name?.english}-${index}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default Carousel;
