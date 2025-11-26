import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Button from './Button';

describe('Button Component', () => {
    test('renders button with children', () => {
        render(<Button onClick={() => { }}>Click Me</Button>);
        const buttonElement = screen.getByText(/Click Me/i);
        expect(buttonElement).toBeInTheDocument();
    });

    test('calls onClick handler when clicked', () => {
        const handleClick = jest.fn();
        render(<Button onClick={handleClick}>Click Me</Button>);
        const buttonElement = screen.getByText(/Click Me/i);
        fireEvent.click(buttonElement);
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    test('applies variant class', () => {
        render(<Button onClick={() => { }} variant="secondary">Secondary</Button>);
        const buttonElement = screen.getByText(/Secondary/i);
        expect(buttonElement).toHaveClass('btn-secondary');
    });

    test('is disabled when disabled prop is true', () => {
        render(<Button onClick={() => { }} disabled>Disabled</Button>);
        const buttonElement = screen.getByText(/Disabled/i);
        expect(buttonElement).toBeDisabled();
    });
});
