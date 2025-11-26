import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import GameGrid from './GameGrid';
import { IData } from '../../utils/interfaces/questionInterface';

const mockData: IData[] = [
    {
        category: 'Test Category',
        questions: [
            {
                difficulty: 'easy',
                question: 'Test Question',
                correct_answer: 'Answer',
                incorrect_answers: ['Wrong']
            }
        ]
    }
];

const mockMonitorGridClick = [[false]];

describe('GameGrid Component', () => {
    test('renders categories', () => {
        render(
            <GameGrid
                data={mockData}
                monitorGridClick={mockMonitorGridClick}
                round={1}
                onCardClick={() => { }}
            />
        );
        expect(screen.getByText('Test Category')).toBeInTheDocument();
    });

    test('renders correct number of cards', () => {
        render(
            <GameGrid
                data={mockData}
                monitorGridClick={mockMonitorGridClick}
                round={1}
                onCardClick={() => { }}
            />
        );
        // 1 category * 1 question = 1 card
        const cards = screen.getAllByText(/\d+/); // Points are numbers
        expect(cards).toHaveLength(1);
    });

    test('calls onCardClick with correct arguments', () => {
        const handleCardClick = jest.fn();
        render(
            <GameGrid
                data={mockData}
                monitorGridClick={mockMonitorGridClick}
                round={1}
                onCardClick={handleCardClick}
            />
        );

        const card = screen.getByText('100'); // (0+1) * 1 * 100 = 100
        fireEvent.click(card);

        expect(handleCardClick).toHaveBeenCalledWith(
            0, // rowIndex
            0, // columnIndex
            mockData[0].questions[0], // question
            100 // points
        );
    });
});
