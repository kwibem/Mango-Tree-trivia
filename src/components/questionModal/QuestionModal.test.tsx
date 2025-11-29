import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QuestionModal } from './QuestionModal';
import { IQuestion } from '../../utils/interfaces/questionInterface';
import { validateAnswerWithLLM } from '../../services/llmService';

// Mock the LLM service
jest.mock('../../services/llmService');

const mockQuestion: Partial<IQuestion> = {
    question: 'What is the capital of France?',
    correct_answer: 'Paris',
    incorrect_answers: ['London', 'Berlin', 'Madrid']
};

describe('QuestionModal Component', () => {
    const mockSetPoints = jest.fn();
    const mockSetShowQuestionModal = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        // Default mock implementation to return true (correct answer)
        (validateAnswerWithLLM as jest.Mock).mockResolvedValue(true);
    });

    test('renders nothing when showQuestionModal is false', () => {
        render(
            <QuestionModal
                question={mockQuestion}
                pointTracker={100}
                showQuestionModal={false}
                setPoints={mockSetPoints}
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
                setPoints={mockSetPoints}
                setShowQuestionModal={mockSetShowQuestionModal}
            />
        );
        expect(screen.getByText('What is the capital of France?')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Type your answer...')).toBeInTheDocument();
        expect(screen.getByText('Submit')).toBeInTheDocument();
    });

    test('submitting correct answer adds points and closes modal', async () => {
        (validateAnswerWithLLM as jest.Mock).mockResolvedValue(true);

        render(
            <QuestionModal
                question={mockQuestion}
                pointTracker={100}
                showQuestionModal={true}
                setPoints={mockSetPoints}
                setShowQuestionModal={mockSetShowQuestionModal}
            />
        );

        const input = screen.getByPlaceholderText('Type your answer...');
        fireEvent.change(input, { target: { value: 'Paris' } });

        const submitBtn = screen.getByText('Submit');
        fireEvent.click(submitBtn);

        // Expect button to show loading state
        expect(screen.getByText('Checking...')).toBeInTheDocument();

        await waitFor(() => {
            expect(mockSetPoints).toHaveBeenCalledWith(expect.any(Function));
            expect(mockSetShowQuestionModal).toHaveBeenCalledWith(false);
        });
    });

    test('submitting incorrect answer subtracts points and closes modal', async () => {
        (validateAnswerWithLLM as jest.Mock).mockResolvedValue(false);

        render(
            <QuestionModal
                question={mockQuestion}
                pointTracker={100}
                showQuestionModal={true}
                setPoints={mockSetPoints}
                setShowQuestionModal={mockSetShowQuestionModal}
            />
        );

        const input = screen.getByPlaceholderText('Type your answer...');
        fireEvent.change(input, { target: { value: 'Wrong' } });

        const submitBtn = screen.getByText('Submit');
        fireEvent.click(submitBtn);

        await waitFor(() => {
            expect(mockSetPoints).toHaveBeenCalledWith(expect.any(Function));
            expect(mockSetShowQuestionModal).toHaveBeenCalledWith(false);
        });
    });

    test('submitting is case insensitive (handled by service/mock)', async () => {
        (validateAnswerWithLLM as jest.Mock).mockResolvedValue(true);

        render(
            <QuestionModal
                question={mockQuestion}
                pointTracker={100}
                showQuestionModal={true}
                setPoints={mockSetPoints}
                setShowQuestionModal={mockSetShowQuestionModal}
            />
        );

        const input = screen.getByPlaceholderText('Type your answer...');
        fireEvent.change(input, { target: { value: 'paris' } }); // lowercase

        const submitBtn = screen.getByText('Submit');
        fireEvent.click(submitBtn);

        await waitFor(() => {
            expect(mockSetPoints).toHaveBeenCalled();
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
                setPoints={mockSetPoints}
                setShowQuestionModal={mockSetShowQuestionModal}
            />
        );

        const input = screen.getByPlaceholderText('Type your answer...');
        fireEvent.change(input, { target: { value: 'Pari' } });

        const submitBtn = screen.getByText('Submit');
        fireEvent.click(submitBtn);

        await waitFor(() => {
            expect(mockSetPoints).toHaveBeenCalledWith(expect.any(Function));
            expect(mockSetShowQuestionModal).toHaveBeenCalledWith(false);
        });
    });
});
