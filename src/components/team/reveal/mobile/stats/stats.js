import React from "react";
import './stats.styles.scss';
import Radar from "./radar/radar";


export const Stats = ({stats}) => {
    return (
        <div className='stats'>
            <Radar stats={stats} />
        </div>
    )
};

export default Stats;