import React from "react";
import './mobile.styles.scss';
import Type from "./type/type";
import Stats from "./stats/stats";

export const Mobile = ({infoRef, imageRef, id, image: { hires }, cry, name, species, type, description, height, weight, base}) => {
    return (
        <div className='mobile'>
            <div className={'container ' + type[0].toLowerCase()}>
                <img src={hires} alt={''} ref={imageRef}/>

                <div ref={infoRef} align='center' className='info'>
                    <h1>{`#${id}-${name.english}`}</h1>
                    <h3>{species}</h3>
                    <div className='stats'>
                        {
                            type.map((_type) => <Type type={_type} key={_type}/>)
                        }
                        <p>{description}</p>
                        <p>
                            <strong>Height:</strong> {height}m - <strong>Weight:</strong> {weight}kg
                        </p>
                        <Stats {...base}/>
                    </div>
                </div>

                <audio src={cry} autoPlay/>
            </div>
        </div>
    )
};

export default Mobile;