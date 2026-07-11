import React, { createContext, useContext, useState } from "react";

// Shared game status (points + round) lifted to the App level so the single
// app-wide navbar can display live values on the game route. The game page is
// the sole writer; the navbar is a reader.
interface IGameStatus {
    points: number;
    round: number;
    setPoints: React.Dispatch<React.SetStateAction<number>>;
    setRound: React.Dispatch<React.SetStateAction<number>>;
}

const GameStatusContext = createContext<IGameStatus | undefined>(undefined);

export const GameStatusProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [points, setPoints] = useState<number>(0);
    const [round, setRound] = useState<number>(1);

    return (
        <GameStatusContext.Provider value={{ points, round, setPoints, setRound }}>
            {children}
        </GameStatusContext.Provider>
    );
};

export const useGameStatus = (): IGameStatus => {
    const ctx = useContext(GameStatusContext);
    if (!ctx) {
        throw new Error("useGameStatus must be used within a GameStatusProvider");
    }
    return ctx;
};
