import React from "react";
import './stats.styles.scss';

export const Stats = ({hp, attack, defense, spAttack, spDefense, speed}) => {
    return (
        <div className='stats'>
            <p>HP: {hp}</p>
            <p>Attack: {attack}</p>
            <p>Defense: {defense}</p>
            <p>Sp.Attack: {spAttack}</p>
            <p>Sp.Defense: {spDefense}</p>
            <p>Speed: {speed}</p>
        </div>
    )
};

export default Stats;