import React from 'react';
import { render, screen } from '@testing-library/react';
import Navigation from './index';
import * as PlayerContext from '../../context/PlayerContext';

jest.mock('../../context/PlayerContext');

describe('Navigation Component', () => {
    beforeEach(() => {
        (PlayerContext.usePlayer as jest.Mock).mockReturnValue({
            players: [
                { name: 'Player 1', score: 100 },
                { name: 'Player 2', score: 200 }
            ],
            currentPlayerIndex: 0
        });
    });

    test('renders round number', () => {
        render(<Navigation round={5} />);
        expect(screen.getByText(/Round:/i)).toBeInTheDocument();
        expect(screen.getByText('5')).toBeInTheDocument();
    });

    test('renders players and scores', () => {
        render(<Navigation round={1} />);
        expect(screen.getByText(/Player 1: 100/i)).toBeInTheDocument();
        expect(screen.getByText(/Player 2: 200/i)).toBeInTheDocument();
    });

    test('highlights active player', () => {
        const { container } = render(<Navigation round={1} />);
        // First player should be active based on mock currentPlayerIndex: 0
        const player1Div = screen.getByText(/Player 1: 100/i);
        expect(player1Div).toHaveClass('active-player');

        const player2Div = screen.getByText(/Player 2: 200/i);
        expect(player2Div).not.toHaveClass('active-player');
    });
});
