import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import App from './App';

// Tests for Issue #6: Add Authentication Layer (guest-name flow).
// The blocking modal is triggered from the app root, so these are integration
// tests driven through <App />. The session-scoped name is stored in
// sessionStorage under the key `guestName` (per the issue's Technical Notes).

const GUEST_NAME_KEY = 'guestName';

// Canonical "modal is open" probe: the guest modal exposes a name input and a
// "Continue as guest" submit button.
const getNameInput = (): HTMLElement => screen.getByRole('textbox');
const queryContinueButton = (): HTMLElement | null =>
    screen.queryByRole('button', { name: /continue as guest/i });
const getContinueButton = (): HTMLElement =>
    screen.getByRole('button', { name: /continue as guest/i });

const isModalOpen = (): boolean => queryContinueButton() !== null;

beforeEach(() => {
    sessionStorage.clear();
    // <App /> uses BrowserRouter, which reads the shared jsdom URL. Tests that
    // navigate (Home -> /game) leave the URL at /game, so reset to root to keep
    // each test starting on the default (Home) route.
    window.history.pushState({}, '', '/');
});

afterEach(() => {
    sessionStorage.clear();
});

describe('Auth layer - guest name modal', () => {
    // AC: Given no stored name, when the app loads, a modal prompts the user to
    // "Continue as guest".
    test('shows the blocking guest modal on first launch when no name is stored', () => {
        render(<App />);

        expect(getContinueButton()).toBeInTheDocument();
        expect(getNameInput()).toBeInTheDocument();
    });

    // AC: The modal shows a signup/login option that is visible but disabled and
    // clearly marked "coming soon" (clicking it does nothing).
    test('renders a disabled signup/login option marked "coming soon"', () => {
        render(<App />);

        const comingSoon = screen.getByText(/coming soon/i);
        expect(comingSoon).toBeInTheDocument();

        const control =
            comingSoon.closest('button, a, [role="button"], [aria-disabled]') ?? comingSoon;
        const disabled =
            control.hasAttribute('disabled') ||
            control.getAttribute('aria-disabled') === 'true';
        expect(disabled).toBe(true);
    });

    // Edge case: clicking the disabled signup/login control does nothing - the
    // modal stays open and no name is saved.
    test('clicking the disabled signup/login control does nothing', () => {
        render(<App />);

        const control =
            screen.getByText(/coming soon/i).closest('button, a, [role="button"]') ??
            screen.getByText(/coming soon/i);
        fireEvent.click(control);

        expect(isModalOpen()).toBe(true);
        expect(sessionStorage.getItem(GUEST_NAME_KEY)).toBeNull();
    });

    // AC: Submitting a non-empty name closes the modal and saves the name to
    // sessionStorage.
    test('submitting a non-empty name closes the modal and saves it to sessionStorage', async () => {
        render(<App />);

        fireEvent.change(getNameInput(), { target: { value: 'Alice' } });
        fireEvent.click(getContinueButton());

        await waitFor(() => expect(isModalOpen()).toBe(false));
        expect(sessionStorage.getItem(GUEST_NAME_KEY)).toBe('Alice');
    });

    // Validation: leading/trailing whitespace is trimmed before saving.
    test('trims leading/trailing whitespace before saving', async () => {
        render(<App />);

        fireEvent.change(getNameInput(), { target: { value: '   Bob   ' } });
        fireEvent.click(getContinueButton());

        await waitFor(() => expect(isModalOpen()).toBe(false));
        expect(sessionStorage.getItem(GUEST_NAME_KEY)).toBe('Bob');
    });

    // Validation: submit button is disabled until the input is valid.
    test('keeps the submit button disabled until a valid (non-empty) name is entered', () => {
        render(<App />);

        // Empty -> disabled.
        expect(getContinueButton()).toBeDisabled();

        // Whitespace-only -> still disabled (treated as empty).
        fireEvent.change(getNameInput(), { target: { value: '    ' } });
        expect(getContinueButton()).toBeDisabled();

        // Non-empty -> enabled.
        fireEvent.change(getNameInput(), { target: { value: 'Dana' } });
        expect(getContinueButton()).toBeEnabled();
    });

    // Validation / Edge case: a whitespace-only name is rejected (nothing saved,
    // modal stays open even if a submit is attempted).
    test('rejects a whitespace-only name', () => {
        render(<App />);

        fireEvent.change(getNameInput(), { target: { value: '     ' } });
        fireEvent.click(getContinueButton());

        expect(isModalOpen()).toBe(true);
        expect(sessionStorage.getItem(GUEST_NAME_KEY)).toBeNull();
    });

    // Edge case: a very long name is stored in full (display truncation is CSS).
    test('stores a very long name in full', async () => {
        render(<App />);

        const longName = 'A'.repeat(60);
        fireEvent.change(getNameInput(), { target: { value: longName } });
        fireEvent.click(getContinueButton());

        await waitFor(() => expect(isModalOpen()).toBe(false));
        expect(sessionStorage.getItem(GUEST_NAME_KEY)).toBe(longName);
    });

    // AC: Given a stored name, when the app loads, the modal is not shown.
    test('does not show the modal when a name is already stored for the session', () => {
        sessionStorage.setItem(GUEST_NAME_KEY, 'Carol');

        render(<App />);

        expect(isModalOpen()).toBe(false);
    });

    // AC: Given a name has been saved, when the user reloads / re-mounts the app,
    // the name persists and the modal does not reappear.
    test('persists the name across a reload (re-mount) and does not re-show the modal', async () => {
        const { unmount } = render(<App />);

        fireEvent.change(getNameInput(), { target: { value: 'Erin' } });
        fireEvent.click(getContinueButton());
        await waitFor(() => expect(isModalOpen()).toBe(false));

        unmount();

        // Simulate a reload: a fresh mount with sessionStorage still populated.
        render(<App />);

        expect(sessionStorage.getItem(GUEST_NAME_KEY)).toBe('Erin');
        expect(isModalOpen()).toBe(false);
    });

    // AC: Given a new tab / new session (sessionStorage cleared), the modal
    // appears again (session-scoped persistence).
    test('shows the modal again in a new session (sessionStorage cleared)', async () => {
        const { unmount } = render(<App />);
        fireEvent.change(getNameInput(), { target: { value: 'Frank' } });
        fireEvent.click(getContinueButton());
        await waitFor(() => expect(isModalOpen()).toBe(false));
        unmount();

        // New session: sessionStorage does not carry over.
        sessionStorage.clear();
        render(<App />);

        expect(isModalOpen()).toBe(true);
    });

    // AC / Edge case: the modal is blocking - pressing Esc does not dismiss it
    // while no name has been entered.
    test('does not close on Escape while no name is entered (blocking)', () => {
        render(<App />);

        fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });
        fireEvent.keyDown(getNameInput(), { key: 'Escape', code: 'Escape' });

        expect(isModalOpen()).toBe(true);
        expect(sessionStorage.getItem(GUEST_NAME_KEY)).toBeNull();
    });

    // AC / Edge case: clicking outside the modal does not dismiss it (blocking).
    test('does not close when clicking outside while no name is entered (blocking)', () => {
        render(<App />);

        fireEvent.mouseDown(document.body);
        fireEvent.click(document.body);

        expect(isModalOpen()).toBe(true);
        expect(sessionStorage.getItem(GUEST_NAME_KEY)).toBeNull();
    });
});

// AC 5: "Given a name has been saved, when the user is ANYWHERE in the app, then
// the name is visible in the top-right of the navbar." These are <App /> level
// integration tests that prove the name is shown app-wide, not just on /game.
//
// Today the guest name is only rendered by <Navigation>, which is only mounted on
// the /game route. Immediately after submitting a name the user is on the Home /
// landing route, where the name is NOT shown - so the first test here fails
// against the current code (RED). The Navigation.guestName unit test never caught
// this because it renders <Navigation> in isolation.
describe('Auth layer - guest name is visible app-wide (AC 5)', () => {
    // Robust, layout-agnostic probe for the displayed name: prefer a navbar /
    // header landmark if the app exposes one, otherwise fall back to the whole
    // document. Deliberately does NOT pin to a specific CSS class.
    const expectNameVisible = (name: string): void => {
        const banner = screen.queryByRole('banner'); // <header>
        const nav = screen.queryByRole('navigation'); // <nav>
        const region = banner ?? nav ?? document.body;
        expect(within(region).getByText(name)).toBeInTheDocument();
    };

    const submitName = async (name: string): Promise<void> => {
        fireEvent.change(getNameInput(), { target: { value: name } });
        fireEvent.click(getContinueButton());
        await waitFor(() => expect(isModalOpen()).toBe(false));
    };

    // KEY TEST (expected to FAIL now): right after submit the user is on the
    // Home / landing route. The name must already be visible there - without
    // navigating into the game.
    test('shows the submitted name on the Home/landing route immediately after submit', async () => {
        render(<App />);

        await submitName('Penny');

        // We are still on the default (Home) route - prove it by the Home CTA.
        expect(
            screen.getByRole('button', { name: /start the game/i })
        ).toBeInTheDocument();

        // The name must be visible here, anywhere in the document / navbar.
        expectNameVisible('Penny');
    });

    // The name must REMAIN visible after navigating away from Home into the game
    // view (app-wide, not just a one-route accident).
    test('keeps the name visible after navigating from Home into the game view', async () => {
        render(<App />);

        await submitName('Quinn');

        // Navigate Home -> /game via the app's own CTA.
        fireEvent.click(screen.getByRole('button', { name: /start the game/i }));

        // Wait until the game view is mounted (its navbar landmark appears).
        await screen.findByRole('navigation');

        expectNameVisible('Quinn');
    });

    // The app-header is the SINGLE owner of the guest-name display. On /game the
    // name must therefore render EXACTLY ONCE - not duplicated by both the
    // app-header and the old guest-name span inside <Navigation>. Against current
    // code this fails (length 2) until the duplicate is removed from <Navigation>.
    test('renders the name exactly once on the game view (no duplicate navbar copy)', async () => {
        render(<App />);

        await submitName('Robin');

        // Navigate Home -> /game via the app's own CTA.
        fireEvent.click(screen.getByRole('button', { name: /start the game/i }));

        // Wait until the game view is mounted (its navbar landmark appears).
        await screen.findByRole('navigation');

        expect(screen.getAllByText('Robin')).toHaveLength(1);
    });
});
