import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface IPlayer {
    name: string;
    score: number;
}

interface PlayerContextType {
    players: IPlayer[];
    currentPlayerIndex: number;
    setPlayerNames: (names: string[]) => void;
    addScore: (points: number) => void;
    nextTurn: () => void;
    getCurrentPlayer: () => IPlayer | undefined;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // Default to 2 empty players if you like, or empty array initially
    // Based on requirement: "on login the users should enter their names"
    // We can initialize with empty names or wait for setPlayerNames
    const [players, setPlayers] = useState<IPlayer[]>([]);
    const [currentPlayerIndex, setCurrentPlayerIndex] = useState<number>(0);

    const setPlayerNames = (names: string[]) => {
        const initialPlayers = names.map(name => ({ name, score: 0 }));
        setPlayers(initialPlayers);
        setCurrentPlayerIndex(0); // Player 1 starts
    };

    const addScore = (points: number) => {
        setPlayers(prevPlayers => {
            const newPlayers = [...prevPlayers];
            if (newPlayers[currentPlayerIndex]) {
                newPlayers[currentPlayerIndex] = {
                    ...newPlayers[currentPlayerIndex],
                    score: newPlayers[currentPlayerIndex].score + points
                };
            }
            return newPlayers;
        });
    };

    const nextTurn = () => {
        setCurrentPlayerIndex(prevIndex => {
            if (players.length === 0) return 0;
            return (prevIndex + 1) % players.length;
        });
    };

    const getCurrentPlayer = () => {
        return players[currentPlayerIndex];
    };

    return (
        <PlayerContext.Provider value={{ players, currentPlayerIndex, setPlayerNames, addScore, nextTurn, getCurrentPlayer }}>
            {children}
        </PlayerContext.Provider>
    );
};

export const usePlayer = (): PlayerContextType => {
    const context = useContext(PlayerContext);
    if (!context) {
        throw new Error('usePlayer must be used within a PlayerProvider');
    }
    return context;
};
