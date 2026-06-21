import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
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
