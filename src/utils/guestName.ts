// Session-scoped key under which the guest name is persisted (see Issue #6).
export const GUEST_NAME_KEY = "guestName";

// Single source of truth for reading the stored guest name. Returns null when
// no name has been entered for the current session.
export const getGuestName = (): string | null =>
    sessionStorage.getItem(GUEST_NAME_KEY);
