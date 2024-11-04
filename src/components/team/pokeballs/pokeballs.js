import React from "react";
import './pokeballs.styles.scss';
import Pokeball, {POKEBALL} from "./pokeball/pokeball";


export const Pokeballs = ({pokeballs, team}) => {
    return (
        <div className='pokeballs'>
            {
                pokeballs.map((pokeball, i) => <Pokeball type={pokeball} pokemonImg={team[i] ? team[i].image.sprite : ''} key={i}/>)
            }
            <Pokeball type={POKEBALL.NORMAL} pokemonImg={''}/>
        </div>
    )
};

export default Pokeballs;