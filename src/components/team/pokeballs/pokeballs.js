import React from "react";
import './pokeballs.styles.scss';
import Pokeball from "./pokeball/pokeball";


export const Pokeballs = ({pokeballs, team}) => {
    return (
        <div className='pokeballs'>
            {
                pokeballs.map((pokeball, i) => <Pokeball type={pokeball} pokemonId={team[i] ? team[i].id : 0} key={i}/>)
            }
        </div>
    )
};

export default Pokeballs;