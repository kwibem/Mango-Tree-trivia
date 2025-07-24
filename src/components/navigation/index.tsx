import React from "react";
import PointTracker from "../pointTracker";
import "./Navigation.css";

type INavigation = {
    points: number;
    round: number;
}

const Navigation: React.FC<INavigation>= props => {

    const { points, round } = props
    return (
        <nav className="navigation">
            <div>
                Round: <small>{ round }</small>
            </div>
            <div>
                <PointTracker points={points}/>
            </div>
        </nav>
    );
};


export default Navigation;