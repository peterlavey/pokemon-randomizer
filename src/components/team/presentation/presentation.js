import React, {useCallback, useEffect, useState} from "react";
import './presentation.styles.scss';
import {delay} from "../../../utils/utils";


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
    const prepareMembers = useCallback(() => {
        const _members = [];
        const ordered = team.sort(byHeight);
        _members.push(ordered[5]);
        _members.push(ordered[2]);
        _members.push(ordered[4]);
        _members.push(ordered[1]);
        _members.push(ordered[3]);
        _members.push(ordered[0]);
        setMembers(adjustHeight(_members));
    }, [team]);
    const getScaleHeight = (pokemon) => {
        const scale = 200;
        return (pokemon.height / maxHeight) * scale;
    }
    const teamCry = async () => {
        await delay(1000);
        document.querySelectorAll('audio').forEach((audio) => audio.play());
    }
    useEffect(() => {
        setMaxHeight(Math.max(...members.map(({height}) => height)));
    }, [members]);

    useEffect(() => {
        if (team.length) {
            prepareMembers();
            teamCry();
        }
    }, [team.length, prepareMembers]);

    return (
        <div className='presentation'>
            {
                members.map((pokemon, index) => {
                    const zIndex = Math.round(maxHeight - pokemon.height) * 10;
                    return (
                        <div key={pokemon.id}>
                            <img
                                src={pokemon.image.hires}
                                width={getScaleHeight(pokemon)}
                                className={`member${index}`}
                                style={{zIndex}}
                                alt={pokemon.name.english}
                            />
                            <audio src={pokemon.cry} autoPlay/>
                        </div>
                    );
                })
            }
        </div>
    );
};

export default Presentation;