import React from "react";
import MemberInfo from "./memberInfo/memberInfo";
import "./teamInfo.styles.scss"

const TeamInfo = ({team}) => {
    const byId = (a, b) => a.id - b.id;
    return (
        <div className="teamInfo background">
            {
                team.sort(byId).map(member => <MemberInfo {...member} key={member.id}/>)
            }
        </div>
    );
};

export default TeamInfo;