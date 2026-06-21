import React from 'react';
import { render, screen, within } from '@testing-library/react';
import Navigation from './index';

// Tests for Issue #6: the navbar must display the stored guest name (the navbar
// reads it from the same source of truth - sessionStorage key `guestName`).

const GUEST_NAME_KEY = 'guestName';

beforeEach(() => {
    sessionStorage.clear();
});

afterEach(() => {
    sessionStorage.clear();
});

describe('Navigation - guest name display', () => {
    // AC: Given a name has been saved, when the user is anywhere in the app, the
    // name is visible in the navbar.
    test('shows the stored guest name in the navbar', () => {
        sessionStorage.setItem(GUEST_NAME_KEY, 'Grace');

        render(<Navigation points={0} round={1} />);

        const nav = screen.getByRole('navigation');
        expect(within(nav).getByText('Grace')).toBeInTheDocument();
    });

    // Edge case: a very long name is rendered in full in the DOM (the visual
    // truncation / ellipsis is handled by CSS, but the text content is complete).
    test('renders the full long name in the navbar DOM', () => {
        const longName = 'Bartholomew Maximilian Featherstonehaugh';
        sessionStorage.setItem(GUEST_NAME_KEY, longName);

        render(<Navigation points={0} round={1} />);

        const nav = screen.getByRole('navigation');
        expect(within(nav).getByText(longName)).toBeInTheDocument();
    });
});
