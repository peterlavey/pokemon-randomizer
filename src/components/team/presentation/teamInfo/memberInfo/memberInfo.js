import React from "react";
import "./memberInfo.styles.scss"
import Type from "../../../reveal/mobile/type/type";
import MemberColumn from "./memberColumn/memberColumn";
import {getPokeballByTier} from "../../../../../utils/utils";

const MemberInfo = ({id, image: {sprite}, name: {english}, type, tier}) => {
    return (
        <div className="memberInfo">
            <div className="firstColumn">
                {<img src={getPokeballByTier(tier).img} alt={getPokeballByTier(tier).name} className="pokeball"/>}
                <MemberColumn id={id}/>
            </div>
            <div className="secondColumn">
                <img src={sprite} alt={english}/>
                <span>{english}</span>
            </div>
            <div className="thirdColumn">
            {
                    type.map((_type) => <Type type={_type} key={_type}/>)
                }
            </div>
        </div>
    );
};

export default MemberInfo;