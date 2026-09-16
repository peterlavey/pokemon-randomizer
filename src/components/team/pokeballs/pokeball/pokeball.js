import React, { useEffect, useState, useRef } from "react";
import './pokeball.styles.scss';
import { delay } from "../../../../utils/utils";
import { POKEBALL, TIER } from "../../../../constants/gameConstants";

export { POKEBALL, TIER };

export const Pokeball = ({ type = POKEBALL.NORMAL, pokemonImg }) => {
    const [isCatching, setIsCatching] = useState(false);
    const [pokemonCatched, setPokemonCatched] = useState(false);
    const isMounted = useRef(true);

    useEffect(() => {
        isMounted.current = true;
        let isCancelled = false;

        const reveal = async () => {
            await delay(4000);
            if (isCancelled || !isMounted.current) return;
            setIsCatching(true);

            await delay(500);
            if (isCancelled || !isMounted.current) return;
            setPokemonCatched(true);
        };

        if (pokemonImg) {
            reveal();
        }

        return () => {
            isCancelled = true;
            isMounted.current = false;
        };
    }, [pokemonImg]);

    return (
        <div className='pokeballContainer'>
            <img
                src={type?.img}
                alt={type?.name || 'Pokeball'}
                className={isCatching ? 'catch' : ''}
            />
            {pokemonCatched && (
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
