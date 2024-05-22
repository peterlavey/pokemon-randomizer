import React from "react";
import "./memberInfo.styles.scss"
import Type from "../../../reveal/mobile/type/type";
import MemberColumn from "./memberColumn/memberColumn";

const MemberInfo = ({id, image: {sprite}, name: {english}, type, tier}) => {
    return (
        <div className="memberInfo">
            <strong className={'tier-'+tier}>{tier}</strong>
            <img src={sprite} alt={english}/>
            <div>
                <span>{id}</span>
                <span> - </span>
                <span>{english}</span>
                {
                    type.map((_type) => <Type type={_type} key={_type}/>)
                }
                <MemberColumn id={id} />
            </div>
        </div>
    );
};

export default MemberInfo;