import React from "react";
import "./memberColumn.styles.scss";
import { getMemberColumnIndex } from "../../../../../../services/pokemonService";

export const MemberColumn = ({ id }) => {
    const activeColumnIndex = getMemberColumnIndex(id);
    const getColumnClass = (columnIndex) => (activeColumnIndex === columnIndex ? 'active' : 'inactive');

    return (
        <span className="memberColumn">
            <div className="badge">{id}</div>
            <div className={getColumnClass(0)} />
            <div className={getColumnClass(1)} />
            <div className={getColumnClass(2)} />
            <div className={getColumnClass(3)} />
        </span>
    );
};

export default MemberColumn;
