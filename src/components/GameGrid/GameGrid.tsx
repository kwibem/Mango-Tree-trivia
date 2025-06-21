import React from 'react';
import GameCard from '../GameCard';
import { IData, IQuestion } from '../../utils/interfaces/questionInterface';
import './GameGrid.css';

interface GameGridProps {
  data: IData[];
  monitorGridClick: boolean[][];
  round: number;
  onCardClick: (rowIndex: number, columnIndex: number, question: IQuestion, gamePoints: number) => void;
  disabled?: boolean;
}

const GameGrid: React.FC<GameGridProps> = ({ 
  data, 
  monitorGridClick, 
  round, 
  onCardClick, 
  disabled = false 
}) => {
  return (
    <div className="game-grid">
      {data.map((category: IData, index: number) => (
        <div className="game-grid__column" key={index}>
          <div className="game-grid__category">
            <h3 className="game-grid__category-title">{category.category}</h3>
            {category.questions.map((question: IQuestion, count: number) => {
              const gamePoints: number = (count + 1) * round * 100;
              
              return (
                <GameCard
                  key={`${index}-${count}`}
                  points={gamePoints}
                  isClicked={monitorGridClick[index][count]}
                  onClick={() => onCardClick(index, count, question, gamePoints)}
                  disabled={disabled}
                />
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default GameGrid;