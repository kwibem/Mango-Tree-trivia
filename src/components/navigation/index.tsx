import React from "react";
import PointTracker from "../pointTracker";

type INavigation = {
    points: number;
    round: number;
}

const Navigation: React.FC<INavigation>= props => {

    const { points, round } = props
    return (
        <nav>
            <PointTracker points={points}/>
            Round: <small>{ round }</small>
        </nav>
    );
};


export default Navigation;