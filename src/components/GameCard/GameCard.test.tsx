import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import GameCard from './GameCard';

describe('GameCard Component', () => {
    test('renders points', () => {
        render(<GameCard points={100} isClicked={false} onClick={() => { }} />);
        const pointsElement = screen.getByText('100');
        expect(pointsElement).toBeInTheDocument();
    });

    test('calls onClick handler when clicked', () => {
        const handleClick = jest.fn();
        render(<GameCard points={100} isClicked={false} onClick={handleClick} />);
        const cardElement = screen.getByText('100').closest('.game-card');
        fireEvent.click(cardElement!);
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    test('does not call onClick when disabled', () => {
        const handleClick = jest.fn();
        render(<GameCard points={100} isClicked={false} onClick={handleClick} disabled />);
        const cardElement = screen.getByText('100').closest('.game-card');
        fireEvent.click(cardElement!);
        expect(handleClick).not.toHaveBeenCalled();
    });

    test('applies clicked class when isClicked is true', () => {
        render(<GameCard points={100} isClicked={true} onClick={() => { }} />);
        const cardElement = screen.getByText('100').closest('.game-card');
        expect(cardElement).toHaveClass('game-card--clicked');
    });
});
