import React from "react";
import "./memberInfo.styles.scss"
import Type from "../../../reveal/mobile/type/type";

const MemberInfo = ({image: {sprite}, name: {english}, type}) => {
    return (
        <div className="memberInfo">
            <img src={sprite} alt={english}/>
            <div>
                <span>{english}</span>
                {
                    type.map((_type) => <Type type={_type} key={_type}/>)
                }
            </div>
        </div>
    );
};

export default MemberInfo;