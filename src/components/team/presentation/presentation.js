import React, {useEffect, useState} from "react";
import './presentation.styles.scss';


export const Presentation = ({team}) => {
    const [members, setMembers] = useState([]);
    const [maxHeight, setMaxHeight] = useState();
    const byHeight = (a,b) => a.height - b.height;

    const adjustHeight = pokemons => {
        const ekans = {id: 23, rolls: 3};
        const arbok = {id: 24, rolls: 3};
        const onix = {id: 95, rolls: 2};
        const gyarados = {id: 130, rolls: 2};
        const dratini = {id: 147, rolls: 2};
        const dragonair = {id: 148, rolls: 2};
        const dewgong = {id: 87, rolls: 1.5};
        const exceptions = [ekans, arbok, onix, gyarados, dratini, dragonair, dewgong];
        return pokemons.map((pokemon) => {
            const exception = exceptions.find((exception) => exception.id === pokemon.id);
            if (exception) {
                return {...pokemon, height: pokemon.height / exception.rolls}
            }
            return pokemon
        });
    }
    const prepareMembers = () => {
        const _members = [];
        const ordered = team.sort(byHeight);
        _members.push(ordered[5]);
        _members.push(ordered[2]);
        _members.push(ordered[4]);
        _members.push(ordered[1]);
        _members.push(ordered[3]);
        _members.push(ordered[0]);
        setMembers(adjustHeight(_members));
    };
    const getScaleHeight = (pokemon) => {
        const scale = 200;
        return (pokemon.height / maxHeight) * scale;
    }
    useEffect(() => {
        if (team.length) {
            prepareMembers();
        }
    }, [team]);
    useEffect(() => {
        setMaxHeight(Math.max(...members.map(({height}) => height)));
    }, [members]);

    return (
        <div className='presentation'>
            {
                members.map((pokemon, index) => {
                    const zIndex = Math.round(maxHeight - pokemon.height) * 10;
                    console.log(`pokemon: ${pokemon.name.english} height: ${pokemon.height}`)
                    return (
                        <img
                            src={`images/${pokemon.id}.png`}
                            width={getScaleHeight(pokemon)}
                            className={`member${index}`}
                            style={{zIndex}}
                            key={pokemon.id}
                            alt={pokemon.name.english}
                        />
                    );
                })
            }
        </div>
    );
};

export default Presentation;