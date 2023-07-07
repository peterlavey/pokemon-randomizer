import React from "react";
import './mobile.styles.scss';
import Type from "../../type/type";
import Stats from "./stats/stats";

export const Mobile = ({infoRef, imageRef, id, name, type, base}) => {
    return (
        <div className='mobile'>
            <div className='reveal'>
                <div className={'container ' + type[0].toLowerCase()}>
                    <img src={`images/${id}.png`} alt={''} ref={imageRef}/>

                    <div ref={infoRef} align='center'>
                        <h1>{`#${id}-${name.english}`}</h1>
                        <div className='stats'>
                            {
                               type.map((_type) => <Type type={_type}/>)
                            }
                            <Stats {...base}/>
                        </div>
                    </div>

                    <audio src={`sfx/${id}.wav`} autoPlay/>
                </div>
            </div>
        </div>
    )
};

export default Mobile;