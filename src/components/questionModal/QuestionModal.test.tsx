import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QuestionModal } from './QuestionModal';
import { IQuestion } from '../../utils/interfaces/questionInterface';
import { validateAnswerWithLLM } from '../../services/llmService';
import * as PlayerContext from '../../context/PlayerContext';

// Mock the LLM service
jest.mock('../../services/llmService');
jest.mock('../../context/PlayerContext');

const mockQuestion: Partial<IQuestion> = {
    question: 'What is the capital of France?',
    correct_answer: 'Paris',
    incorrect_answers: ['London', 'Berlin', 'Madrid']
};

describe('QuestionModal Component', () => {
    const mockSetShowQuestionModal = jest.fn();
    const mockAddScore = jest.fn();
    const mockNextTurn = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        // Default mock implementation to return true (correct answer)
        (validateAnswerWithLLM as jest.Mock).mockResolvedValue(true);
        (PlayerContext.usePlayer as jest.Mock).mockReturnValue({
            addScore: mockAddScore,
            nextTurn: mockNextTurn,
            players: [{ name: 'Player 1', score: 0 }],
            currentPlayerIndex: 0
        });
    });

    test('renders nothing when showQuestionModal is false', () => {
        render(
            <QuestionModal
                question={mockQuestion}
                pointTracker={100}
                showQuestionModal={false}
                setShowQuestionModal={mockSetShowQuestionModal}
            />
        );
        expect(screen.queryByText('What is the capital of France?')).not.toBeInTheDocument();
    });

    test('renders question and input when open', () => {
        render(
            <QuestionModal
                question={mockQuestion}
                pointTracker={100}
                showQuestionModal={true}
                setShowQuestionModal={mockSetShowQuestionModal}
            />
        );
        expect(screen.getByText('What is the capital of France?')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Answer as Player 1...')).toBeInTheDocument();
        expect(screen.getByText('Submit')).toBeInTheDocument();
    });

    test('submitting correct answer adds points and closes modal', async () => {
        (validateAnswerWithLLM as jest.Mock).mockResolvedValue(true);

        const { container } = render(
            <QuestionModal
                question={mockQuestion}
                pointTracker={100}
                showQuestionModal={true}
                setShowQuestionModal={mockSetShowQuestionModal}
            />
        );

        const input = screen.getByPlaceholderText('Answer as Player 1...');
        fireEvent.change(input, { target: { value: 'Paris' } });

        const submitBtn = screen.getByText('Submit');
        fireEvent.click(submitBtn);

        // Expect button to show loading state
        expect(screen.getByText('Checking...')).toBeInTheDocument();

        // Wait for validation state (button text changes)
        await waitFor(() => {
            expect(screen.getByText('Checking...')).toBeInTheDocument();
        });

        // Verify Timer is NOT in the document
        const progressBar = container.querySelector('.timer-progress-fill');
        expect(progressBar).not.toBeInTheDocument();

        // Wait for feedback state
        await waitFor(() => {
            const overlay = screen.getByTestId('modal-overlay');
            expect(overlay).toHaveClass('correct');
        });

        // Wait for modal to close (after delay)
        await waitFor(() => {
            expect(mockAddScore).toHaveBeenCalledWith(100);
            expect(mockSetShowQuestionModal).toHaveBeenCalledWith(false);
            expect(mockNextTurn).toHaveBeenCalled();
        }, { timeout: 1000 });
    });

    test('submitting incorrect answer subtracts points and closes modal', async () => {
        (validateAnswerWithLLM as jest.Mock).mockResolvedValue(false);

        render(
            <QuestionModal
                question={mockQuestion}
                pointTracker={100}
                showQuestionModal={true}
                setShowQuestionModal={mockSetShowQuestionModal}
            />
        );

        const input = screen.getByPlaceholderText('Answer as Player 1...');
        fireEvent.change(input, { target: { value: 'Wrong' } });

        const submitBtn = screen.getByText('Submit');
        fireEvent.click(submitBtn);

        // Wait for feedback state
        await waitFor(() => {
            const overlay = screen.getByTestId('modal-overlay');
            expect(overlay).toHaveClass('incorrect');
        });

        await waitFor(() => {
            expect(mockAddScore).toHaveBeenCalledWith(-100);
            expect(mockSetShowQuestionModal).toHaveBeenCalledWith(false);
            expect(mockNextTurn).toHaveBeenCalled();
        }, { timeout: 1000 });
    });

    test('submitting is case insensitive (handled by service/mock)', async () => {
        (validateAnswerWithLLM as jest.Mock).mockResolvedValue(true);

        render(
            <QuestionModal
                question={mockQuestion}
                pointTracker={100}
                showQuestionModal={true}
                setShowQuestionModal={mockSetShowQuestionModal}
            />
        );

        const input = screen.getByPlaceholderText('Answer as Player 1...');
        fireEvent.change(input, { target: { value: 'paris' } }); // lowercase

        const submitBtn = screen.getByText('Submit');
        fireEvent.click(submitBtn);

        await waitFor(() => {
            expect(mockAddScore).toHaveBeenCalled();
            expect(mockSetShowQuestionModal).toHaveBeenCalledWith(false);
        });
    });

    test('submitting answer with minor typo is accepted (handled by service/mock)', async () => {
        (validateAnswerWithLLM as jest.Mock).mockResolvedValue(true);

        render(
            <QuestionModal
                question={mockQuestion}
                pointTracker={100}
                showQuestionModal={true}
                setShowQuestionModal={mockSetShowQuestionModal}
            />
        );

        const input = screen.getByPlaceholderText('Answer as Player 1...');
        fireEvent.change(input, { target: { value: 'Pari' } });

        const submitBtn = screen.getByText('Submit');
        fireEvent.click(submitBtn);

        await waitFor(() => {
            expect(mockAddScore).toHaveBeenCalledWith(100);
            expect(mockSetShowQuestionModal).toHaveBeenCalledWith(false);
        });
    });
});
