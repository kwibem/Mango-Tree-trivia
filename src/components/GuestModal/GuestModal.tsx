import React from "react";
import "./GuestModal.css";

interface IGuestModalProps {
    onSubmit: (name: string) => void;
}

const MAX_NAME_LENGTH = 20;

export const GuestModal: React.FC<IGuestModalProps> = ({ onSubmit }) => {
    const [name, setName] = React.useState<string>("");

    const trimmed = name.trim();
    const isValid = trimmed.length > 0;

    const handleSubmit = (): void => {
        if (!isValid) return;
        onSubmit(trimmed);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
        if (e.key === "Enter") {
            handleSubmit();
        }
    };

    return (
        <div className="modal-overlay" data-testid="guest-modal-overlay">
            <div className="guest modal">
                <h2 className="guest-modal__title">Welcome to Mango Tree Trivia</h2>
                <p className="guest-modal__subtitle">Enter a name to continue as a guest.</p>

                <div className="input-container">
                    <input
                        type="text"
                        className="modal__input"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Your name"
                        maxLength={MAX_NAME_LENGTH}
                        autoFocus
                    />
                    <button
                        className="modal__submit-btn"
                        onClick={handleSubmit}
                        disabled={!isValid}
                    >
                        Continue as guest
                    </button>
                </div>

                <div className="guest-modal__divider">or</div>

                <button
                    className="guest-modal__signup-btn"
                    type="button"
                    disabled
                    aria-disabled="true"
                    tabIndex={-1}
                >
                    Sign up / Log in <span className="guest-modal__badge">coming soon</span>
                </button>
            </div>
        </div>
    );
};

export default GuestModal;
