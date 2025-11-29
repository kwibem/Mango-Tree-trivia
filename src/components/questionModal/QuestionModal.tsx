import React from "react";
import { IQuestion } from "../../utils/interfaces/questionInterface";

import Timer from "../Timer";
import "./QuestionModal.css"

import { validateAnswerWithLLM } from "../../services/llmService";

interface IQuestionModalProps {
    question: Partial<IQuestion>;
    pointTracker: number;
    showQuestionModal: boolean;
    setPoints: React.Dispatch<React.SetStateAction<number>>;
    setShowQuestionModal: React.Dispatch<React.SetStateAction<boolean>>;
}



export const QuestionModal: React.FC<IQuestionModalProps> = (props) => {
    const { question, showQuestionModal, pointTracker, setShowQuestionModal, setPoints } = props
    const [userAnswer, setUserAnswer] = React.useState<string>("");
    const [isValidating, setIsValidating] = React.useState<boolean>(false);
    const [feedbackStatus, setFeedbackStatus] = React.useState<'idle' | 'correct' | 'incorrect'>('idle');

    const handleSubmit = async (): Promise<void> => {
        if (typeof question.correct_answer === "undefined" || typeof question.question === "undefined") return;

        setIsValidating(true);

        try {
            const isCorrect = await validateAnswerWithLLM(
                question.question,
                question.correct_answer,
                userAnswer
            );

            if (isCorrect) {
                setFeedbackStatus('correct');
                // Wait for animation
                await new Promise(resolve => setTimeout(resolve, 500));
                setPoints(prevPoints => prevPoints + pointTracker);
            } else {
                setFeedbackStatus('incorrect');
                // Wait for animation
                await new Promise(resolve => setTimeout(resolve, 500));
                setPoints(prevPoints => prevPoints - pointTracker);
            }

            setUserAnswer(""); // Reset answer
            setFeedbackStatus('idle');
            setShowQuestionModal(false);
        } catch (error) {
            console.error("Error validating answer:", error);
            // Handle error appropriately, maybe show a message
        } finally {
            setIsValidating(false);
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !isValidating) {
            handleSubmit();
        }
    }

    return (
        <>
            {showQuestionModal && (
                <div className={`modal-overlay ${feedbackStatus}`} data-testid="modal-overlay">
                    <div className="question modal">
                        <div className="modal__header">
                            <Timer setQuestionModal={setShowQuestionModal} />
                        </div>

                        <p className="modal__question">{question.question}</p>

                        <div className="input-container">
                            <input
                                type="text"
                                className="modal__input"
                                value={userAnswer}
                                onChange={(e) => setUserAnswer(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Type your answer..."
                                autoFocus
                                disabled={isValidating}
                            />
                            <button
                                className={`modal__submit-btn ${isValidating ? 'validating' : ''}`}
                                onClick={handleSubmit}
                                disabled={isValidating}
                            >
                                {isValidating ? "Checking..." : "Submit"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};