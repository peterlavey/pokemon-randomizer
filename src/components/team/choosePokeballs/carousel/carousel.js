import React, { useMemo, useState, useCallback, useRef, useEffect } from "react";
import './carousel.styles.scss';
import { getPokemonsByPokeball } from "../../../../services/pokemonService";
import { useSoundContext } from "../../../../contexts/soundContext";

const getPokeballDisplayName = (name) => {
    switch (name) {
        case 'Pokeball':
            return 'Poké Ball';
        case 'Superball':
            return 'Super Ball';
        case 'Ultraball':
            return 'Ultra Ball';
        case 'Masterball':
            return 'Master Ball';
        default:
            return name;
    }
};

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

    const ballKey = (pokeball.name || '').toLowerCase();
    const selectionClass = isSelected ? `${pokeball.name}Selected` : '';

    return (
        <div
            id={pokeball.name}
            onClick={handleSelect}
            className={`pokeballItem pokeballItem--${ballKey} ${selectionClass}`.trim()}
            role="button"
            tabIndex={0}
            aria-label={`Select ${getPokeballDisplayName(pokeball.name)} tier`}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    handleSelect();
                }
            }}
        >
            <div className="pokeballItem__ballWrapper">
                <img
                    className="pokeballItem__ballImg"
                    src={pokeball.img}
                    alt={pokeball.name}
                />
            </div>

            <div className="pokeballItem__content">
                <div className="pokeballItem__meta">
                    <span className="pokeballItem__name">
                        {getPokeballDisplayName(pokeball.name)}
                    </span>
                    <div className="pokeballItem__tiers">
                        {pokeball.tiers?.map((tier) => (
                            <span key={tier} className={`tierBadge tierBadge--${tier}`}>
                                TIER {tier}
                            </span>
                        ))}
                    </div>
                </div>

                <div className='roulette'>
                    <div className='rouletteTrack'>
                        {pokemonImg.map((pokemon, index) => (
                            <img
                                src={pokemon.image?.sprite}
                                alt={pokemon.name?.english || ''}
                                key={`${pokemon.id}-${pokemon.name?.english}-${index}`}
                            />
                        ))}
                    </div>
                </div>
            </div>

            <div className="pokeballItem__arrow" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                </svg>
            </div>
        </div>
    );
};

export default Carousel;
