import React from "react";
import PointTracker from "../pointTracker";
import { getGuestName } from "../../utils/guestName";
import "./Navigation.css";

type INavigation = {
    points: number;
    round: number;
}

const Navigation: React.FC<INavigation>= props => {

    const { points, round } = props
    const guestName = getGuestName();
    return (
        <nav className="navigation">
            <div>
                Round: <small>{ round }</small>
            </div>
            <div className="navigation__right">
                <PointTracker points={points}/>
                {guestName && (
                    <span className="navigation__guest-name" title={guestName}>
                        {guestName}
                    </span>
                )}
            </div>
        </nav>
    );
};


export default Navigation;
