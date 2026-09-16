import React, { useEffect, useState, useRef } from "react";
import './pokeball.styles.scss';
import { delay } from "../../../../utils/utils";
import { POKEBALL, TIER } from "../../../../constants/gameConstants";

export { POKEBALL, TIER };

export const Pokeball = ({
    type = POKEBALL.NORMAL,
    pokemonImg,
    isRevealed = false,
    isCurrent = true,
}) => {
    const [isCatching, setIsCatching] = useState(false);
    const [pokemonCatched, setPokemonCatched] = useState(false);
    const isMounted = useRef(true);

    useEffect(() => {
        isMounted.current = true;

        if (!pokemonImg) {
            setIsCatching(false);
            setPokemonCatched(false);
            return;
        }

        if (isRevealed || !isCurrent) {
            setIsCatching(true);
            setPokemonCatched(true);
            return;
        }

        let isCancelled = false;

        const reveal = async () => {
            await delay(2300);
            if (isCancelled || !isMounted.current) return;
            setIsCatching(true);

            await delay(400);
            if (isCancelled || !isMounted.current) return;
            setPokemonCatched(true);
        };

        reveal();

        return () => {
            isCancelled = true;
            isMounted.current = false;
        };
    }, [pokemonImg, isRevealed, isCurrent]);

    const isDone = Boolean(pokemonImg) && (isRevealed || (isCatching && pokemonCatched));

    return (
        <div className={`pokeballContainer ${isDone ? 'revealed' : ''}`.trim()}>
            <img
                src={type?.img}
                alt={type?.name || 'Pokeball'}
                className={isCatching && Boolean(pokemonImg) ? 'catch' : ''}
            />
            {pokemonCatched && Boolean(pokemonImg) && (
                <img
                    src={pokemonImg}
                    alt={type?.name || 'Caught Pokemon'}
                    className='pokemon'
                />
            )}
        </div>
    );
};

export default Pokeball;
