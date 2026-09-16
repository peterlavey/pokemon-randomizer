import React from "react";
import './mobile.styles.scss';
import Type from "./type/type";
import Stats from "./stats/stats";
import Particles from "../particles/particles";

export const Mobile = ({
    id,
    image,
    cry,
    name,
    species,
    type = [],
    description,
    height,
    weight,
    base,
    isAnimationFinished = false,
}) => {
    const hires = image?.hires || '';
    const englishName = name?.english || '';
    const primaryType = type[0]?.toLowerCase() || 'normal';

    return (
        <div className='mobile'>
            <div className={`container ${primaryType}`}>
                <Particles types={type} isAnimationFinished={isAnimationFinished} />
                <img src={hires} alt={englishName} className='revealImage' />

                <div align='center' className='info revealInfo'>
                    <h1>{`#${id}-${englishName}`}</h1>

                    <div className='stats'>
                        {type.map((_type) => <Type type={_type} key={_type} />)}
                        <p>
                            <strong>{species}</strong> - {description}
                        </p>
                        <p>
                            <strong>Height:</strong> {height}m - <strong>Weight:</strong> {weight}kg
                        </p>
                        {base && <Stats stats={base} />}
                    </div>
                </div>

                {cry && <audio src={cry} autoPlay />}
            </div>
        </div>
    );
};

export default Mobile;
