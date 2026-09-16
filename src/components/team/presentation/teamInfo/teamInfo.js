import React, { useMemo } from "react";
import MemberInfo from "./memberInfo/memberInfo";
import "./teamInfo.styles.scss";

export const TeamInfo = ({ team = [] }) => {
    const sortedTeam = useMemo(() => {
        return [...team].sort((a, b) => (a.id || 0) - (b.id || 0));
    }, [team]);

    return (
        <div className="teamInfo background">
            {sortedTeam.map((member) => (
                <MemberInfo {...member} key={member.id} />
            ))}
        </div>
    );
};

export default TeamInfo;
