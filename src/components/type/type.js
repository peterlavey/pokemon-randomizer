import React from "react";
import './type.styles.scss';

export const Type = ({type}) => (
    <span className={`type type--${type.toLowerCase()}`}>
        {type}
    </span>
);

export default Type;