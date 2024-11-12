import React, {useEffect, useState} from "react";
import "./memberInfo.styles.scss"
import Type from "../../../reveal/mobile/type/type";
import MemberColumn from "./memberColumn/memberColumn";
import {getPokeballByTier} from "../../../../../utils/utils";

const MemberInfo = ({id, image: {sprite}, name: {english}, type, tier, cry}) => {
    const [crySfx, setCrySfx] = useState(null);
    
    const makeCry = () => {
        crySfx.currentTime = 0;
        crySfx.play();
    };
    
    useEffect(() => {
        setCrySfx(new Audio(cry));
    }, [cry]);
    
    return (
        <div className="memberInfo" onClick={makeCry}>
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