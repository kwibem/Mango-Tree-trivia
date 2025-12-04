import React from 'react';
import Button from '../Button';
import './RoundSplash.css';

interface RoundSplashProps {
    round: number;
    onStart: () => void;
}

const RoundSplash: React.FC<RoundSplashProps> = ({ round, onStart }) => {
    return (
        <div className="round-splash-overlay">
            <div className="round-splash-content">
                <h1 className="round-splash-title">Round {round}</h1>
                <p className="round-splash-subtitle">Are you ready?</p>
                <Button onClick={onStart}>
                    Start Round
                </Button>
            </div>
        </div>
    );
};

export default RoundSplash;
