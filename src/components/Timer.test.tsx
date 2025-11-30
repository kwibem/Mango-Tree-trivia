import React from 'react';
import { render, screen } from '@testing-library/react';
import Timer from './Timer';

import useTimeCounter from '../utils/hooks/useTimeCounter';

// Mock the custom hook
jest.mock('../utils/hooks/useTimeCounter');

describe('Timer Component', () => {
    beforeEach(() => {
        (useTimeCounter as jest.Mock).mockReturnValue(5);
    });

    test('renders progress bar', () => {
        const { container } = render(<Timer setQuestionModal={() => { }} />);
        const progressBar = container.querySelector('.timer-progress-fill');
        expect(progressBar).toBeInTheDocument();
    });

});
