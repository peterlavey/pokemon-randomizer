import React from "react";
import './stats.styles.scss';

export const Stats = ({hp, attack, defense, spAttack, spDefense, speed}) => {
    return (
        <div className='stats'>
            <p>
                <strong>HP:</strong> {hp} - <strong>Speed:</strong> {speed}
            </p>
            <p>
                <strong>Attack:</strong> {attack} - <strong>Sp.Attack:</strong> {spAttack}
            </p>
            <p>
                <strong>Defense:</strong> {defense} - <strong>Sp.Defense:</strong> {spDefense}
            </p>
        </div>
    )
};

export default Stats;