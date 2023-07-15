import React from "react";
import MemberInfo from "./memberInfo/memberInfo";
import "./teamInfo.styles.scss"

const TeamInfo = ({team}) => {
    return (
        <div className="teamInfo">
            {
                team.map(member => <MemberInfo {...member} />)
            }
        </div>
    );
};

export default TeamInfo;