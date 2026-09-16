import React, { useEffect, useState, useCallback } from "react";
import "./memberInfo.styles.scss";
import Type from "../../../reveal/mobile/type/type";
import MemberColumn from "./memberColumn/memberColumn";
import { getPokeballByTier } from "../../../../../services/pokemonService";
import { preloadAudioIos } from "../../../../../utils/utils";

export const MemberInfo = ({ id, image, name, type = [], tier, cry }) => {
    const [crySfx, setCrySfx] = useState(null);
    const sprite = image?.sprite || '';
    const englishName = name?.english || '';
    const pokeball = getPokeballByTier(tier);

    const makeCry = useCallback(() => {
        if (!crySfx) return;
        try {
            if (typeof crySfx.seek === 'function') {
                crySfx.seek(0);
                crySfx.play();
            } else if (typeof crySfx.play === 'function') {
                crySfx.currentTime = 0;
                crySfx.play();
            }
        } catch (e) {}
    }, [crySfx]);

    useEffect(() => {
        if (cry) {
            setCrySfx(preloadAudioIos(cry));
        }
    }, [cry]);

    return (
        <div
            className="memberInfo"
            onClick={makeCry}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    makeCry();
                }
            }}
        >
            <div className="firstColumn">
                <img src={pokeball.img} alt={pokeball.name} className="pokeball" />
                <MemberColumn id={id} />
            </div>
            <div className="secondColumn">
                <img src={sprite} alt={englishName} />
                <span>{englishName}</span>
            </div>
            <div className="thirdColumn">
                {type.map((_type) => (
                    <Type type={_type} key={_type} />
                ))}
            </div>
        </div>
    );
};

export default MemberInfo;
