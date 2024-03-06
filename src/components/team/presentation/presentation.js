import React, {useCallback, useEffect, useState} from "react";
import './presentation.styles.scss';
import {delay} from "../../../utils/utils";
import TeamInfo from "./teamInfo/teamInfo";
import {SFX_POKEMON_TEAM} from "../../../utils/constants";

// isFlying top: 5%
// isJumping top: 25%
export const Presentation = ({team}) => {
    const [members, setMembers] = useState([]);
    const [maxHeight, setMaxHeight] = useState();
    const byHeight = (a,b) => a.height - b.height;
    const adjustHeight = pokemons => pokemons.map((pokemon) => ({...pokemon, height: pokemon.height / pokemon.rolls}));

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
                    let top = 'initial';
                    if (pokemon.isFlying) {
                        top = '5%';
                    } else if (pokemon.isJumping) {
                        top = '25%';
                    }
                    return (
                        <div key={pokemon.id}>
                            <img
                                src={pokemon.image.hires}
                                width={getScaleHeight(pokemon)}
                                className={`member${index}`}
                                style={{zIndex, top}}
                                alt={pokemon.name.english}
                            />
                            <audio src={pokemon.cry} autoPlay/>
                        </div>
                    );
                })
            }
            <audio src={SFX_POKEMON_TEAM} autoPlay/>
            <TeamInfo team={team} />
        </div>
    );
};

export default Presentation;