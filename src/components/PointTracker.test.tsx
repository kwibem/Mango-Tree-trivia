import React from 'react';
import { render, screen } from '@testing-library/react';
import PointTracker from './pointTracker';

describe('PointTracker Component', () => {
    test('renders points value', () => {
        render(<PointTracker points={1234} />);
        expect(screen.getByText(/Points:/i)).toBeInTheDocument();
        expect(screen.getByText('1234')).toBeInTheDocument();
    });
});
