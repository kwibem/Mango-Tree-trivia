import React from "react";
import PointTracker from "../pointTracker";

type INavigation = {
    points: number;
    round: number;
}

const Navigation: React.FC<INavigation>= props => {

    const { points, round } = props
    return (
        <nav style={{
            display: 'flex',
            alignItems: 'center',
            gap: '2rem',
            padding: '1rem 2rem',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            backgroundColor: 'white',
            position: 'sticky',
            top: 0,
            zIndex: 1000,
            width: 'calc(100% + 40px)',
            margin: '-20px -20px 0 -20px'
        }}>
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