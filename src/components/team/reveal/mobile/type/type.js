import React from "react";
import './type.styles.scss';
import '../../../team.styles.scss';

export const Type = ({type}) => (
    <span className={`type bg-${type.toLowerCase()}`}>
        {type}
    </span>
);

export default Type;