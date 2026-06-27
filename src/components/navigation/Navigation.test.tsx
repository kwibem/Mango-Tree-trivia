import React from 'react';
import { render, screen, within } from '@testing-library/react';
import Navigation from './index';
import { GUEST_NAME_KEY } from '../../utils/guestName';

// New contract (Option A): <Navigation> is the single consolidated navbar. It
// renders the guest name on every route, and shows Round + Points only when those
// are provided (i.e. on the game route). Round/points are therefore optional.
//
// The guest name comes from the established single source of truth - the
// sessionStorage key `guestName` (see src/utils/guestName.ts).

beforeEach(() => {
    sessionStorage.clear();
});

afterEach(() => {
    sessionStorage.clear();
});

describe('Navigation Component', () => {
    test('renders inside a navigation landmark', () => {
        render(<Navigation round={1} points={0} />);
        expect(screen.getByRole('navigation')).toBeInTheDocument();
    });

    test('shows the stored guest name in the navbar', () => {
        sessionStorage.setItem(GUEST_NAME_KEY, 'Grace');

        render(<Navigation round={1} points={0} />);

        const nav = screen.getByRole('navigation');
        expect(within(nav).getByText('Grace')).toBeInTheDocument();
    });

    test('renders the round number when provided', () => {
        render(<Navigation round={5} points={100} />);
        expect(screen.getByText(/Round:/i)).toBeInTheDocument();
        expect(screen.getByText('5')).toBeInTheDocument();
    });

    test('renders points via PointTracker when provided', () => {
        render(<Navigation round={1} points={500} />);
        expect(screen.getByText(/Points:/i)).toBeInTheDocument();
        expect(screen.getByText('500')).toBeInTheDocument();
    });

    // On non-game routes the navbar still shows the name, but the round/points
    // indicators are omitted (they are optional and game-only).
    test('omits round/points when they are not provided (non-game routes)', () => {
        sessionStorage.setItem(GUEST_NAME_KEY, 'Grace');

        render(<Navigation />);

        // Name still shows app-wide...
        const nav = screen.getByRole('navigation');
        expect(within(nav).getByText('Grace')).toBeInTheDocument();

        // ...but the game-only indicators do not.
        expect(screen.queryByText(/Round:/i)).toBeNull();
        expect(screen.queryByText(/Points:/i)).toBeNull();
    });
});
