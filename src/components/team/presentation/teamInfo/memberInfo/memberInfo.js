import React from "react";
import "./memberInfo.styles.scss"
import Type from "../../../reveal/mobile/type/type";
import MemberColumn from "./memberColumn/memberColumn";
import {getPokeballByTier} from "../../../../../utils/utils";

const MemberInfo = ({id, image: {sprite}, name: {english}, type, tier}) => {
    return (
        <div className="memberInfo">
            <strong className={'tier-'+tier}>{tier}</strong>
            <img src={sprite} alt={english}/>
            <div>
                <div>
                    <span>{id}</span>
                    <span> - </span>
                    <span>{english}</span>
                    <MemberColumn id={id}/>
                </div>
                {
                    type.map((_type) => <Type type={_type} key={_type}/>)
                }
                {<img src={getPokeballByTier(tier).img} alt={getPokeballByTier(tier).name} className="pokeball" />}
            </div>
        </div>
    );
};

export default MemberInfo;