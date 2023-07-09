import React, {useEffect, useState} from "react";
import './presentation.styles.scss';

// con el tanh no queda a escala pero se ve bien
// poner al mas grande detras del mas pequeño, en orden asc sería ([6 <- 1], [5 <- 2], [4 <- 3])

export const Presentation = ({team}) => {
    const [members, setMembers] = useState([]);
    const [scale, setScale] = useState(151);
    const byHeight = (a,b) => a.height - b.height;
    const prepareMembers = () => {
        const _members = [];
        const ordered = team.sort(byHeight);
        _members.push(ordered[5]);
        _members.push(ordered[2]);
        _members.push(ordered[4]);
        _members.push(ordered[1]);
        _members.push(ordered[3]);
        _members.push(ordered[0]);
        setMembers(_members);
    };
    useEffect(() => {
        if (team.length) {
            prepareMembers();
        }
    }, [team]);

    return (
        <div className='presentation'>
            {
                members.map((pokemon, index) => {
                    const zIndex = parseInt(Math.max(...members.map(({height}) => height)) - pokemon.height) * 10;
                    console.log(`pokemon: ${pokemon.name.english} zIndex: ${zIndex}`)
                    return (
                        <img
                            src={`images/${pokemon.id}.png`}
                            width={Math.tanh(pokemon.height) * scale}
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