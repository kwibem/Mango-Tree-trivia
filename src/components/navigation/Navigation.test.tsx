import React from 'react';
import { render, screen } from '@testing-library/react';
import Navigation from './index';

describe('Navigation Component', () => {
    test('renders round number', () => {
        render(<Navigation round={5} points={100} />);
        expect(screen.getByText(/Round:/i)).toBeInTheDocument();
        expect(screen.getByText('5')).toBeInTheDocument();
    });

    test('renders points via PointTracker', () => {
        render(<Navigation round={1} points={500} />);
        expect(screen.getByText(/Points:/i)).toBeInTheDocument();
        expect(screen.getByText('500')).toBeInTheDocument();
    });
});
