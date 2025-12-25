import React from "react";
import { usePlayer } from "../../context/PlayerContext";
import "./Navigation.css";

type INavigation = {
    round: number;
}

const Navigation: React.FC<INavigation> = props => {
    const { round } = props;
    const { players, currentPlayerIndex } = usePlayer();

    return (
        <nav className="navigation">
            <div>
                Round: <small>{round}</small>
            </div>
            <div style={{ display: 'flex', gap: '20px' }}>
                {players.map((player, index) => (
                    <div key={index} className={index === currentPlayerIndex ? "active-player" : ""}>
                        {player.name}: {player.score}
                    </div>
                ))}
            </div>
        </nav>
    );
};

export default Navigation;