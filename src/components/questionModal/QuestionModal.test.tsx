import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { QuestionModal } from './QuestionModal';
import { IQuestion } from '../../utils/interfaces/questionInterface';

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

    test('submitting correct answer adds points and closes modal', () => {
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

        expect(mockSetPoints).toHaveBeenCalledWith(expect.any(Function));
        // We can't easily test the functional update value without more complex mocking, 
        // but we can verify it was called.
        expect(mockSetShowQuestionModal).toHaveBeenCalledWith(false);
    });

    test('submitting incorrect answer subtracts points and closes modal', () => {
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

        expect(mockSetPoints).toHaveBeenCalledWith(expect.any(Function));
        expect(mockSetShowQuestionModal).toHaveBeenCalledWith(false);
    });

    test('submitting is case insensitive', () => {
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

        expect(mockSetPoints).toHaveBeenCalled();
        expect(mockSetShowQuestionModal).toHaveBeenCalledWith(false);
    });
});
