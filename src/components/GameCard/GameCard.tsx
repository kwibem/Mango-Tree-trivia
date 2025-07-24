import React from 'react';
import './GameCard.css';

interface GameCardProps {
  points: number;
  isClicked: boolean;
  onClick: () => void;
  disabled?: boolean;
}

const GameCard: React.FC<GameCardProps> = React.memo(({ 
  points, 
  isClicked, 
  onClick, 
  disabled = false 
}) => {
  return (
    <div 
      className={`game-card ${isClicked ? 'game-card--clicked' : ''}`}
      onClick={disabled ? undefined : onClick}
    >
      <span className="game-card__points">{points}</span>
    </div>
  );
});

export default GameCard;