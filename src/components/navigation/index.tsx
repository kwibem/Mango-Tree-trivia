import React from "react";
import PointTracker from "../pointTracker";
import { getGuestName } from "../../utils/guestName";
import "./Navigation.css";

// Single consolidated navbar (Option A). Renders the guest name on every route
// and the game-only Round + Points indicators when those props are provided.
// Pure & Router-free so it can be rendered standalone in unit tests.
type INavigation = {
    points?: number;
    round?: number;
}

const Navigation: React.FC<INavigation> = props => {

    const { points, round } = props
    const guestName = getGuestName();
    return (
        <nav className="navigation">
            {round !== undefined && (
                <div>
                    Round: <small>{ round }</small>
                </div>
            )}
            <div className="navigation__right">
                {points !== undefined && <PointTracker points={points}/>}
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
