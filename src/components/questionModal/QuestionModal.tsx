import React from "react";
import {IQuestion} from "../../utils/interfaces/questionInterface";

import Timer from "../Timer";
import "./QuestionModal.css"

interface IQuestionModalProps {
    question: Partial<IQuestion>;
    pointTracker: number;
    showQuestionModal: boolean;
    setPoints: React.Dispatch<React.SetStateAction<number>>;
    setShowQuestionModal:  React.Dispatch<React.SetStateAction<boolean>>;
}

export const QuestionModal: React.FC<IQuestionModalProps> = (props) => {
    const { question, showQuestionModal, pointTracker, setShowQuestionModal, setPoints } = props
    const [userAnswer, setUserAnswer] = React.useState<string>("");

    const handleSubmit = (): void => {
        if (typeof question.correct_answer === "undefined") return;

        const isCorrect = userAnswer.trim().toLowerCase() === question.correct_answer.toLowerCase();

        if (isCorrect) {
            setPoints(prevPoints => prevPoints + pointTracker);
        } else {
            setPoints(prevPoints => prevPoints - pointTracker);
        }

        setUserAnswer(""); // Reset answer
        setShowQuestionModal(false);
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSubmit();
        }
    }

    return (
        <>
            {showQuestionModal && (
                <div className="modal-overlay">
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
                            />
                            <button className="modal__submit-btn" onClick={handleSubmit}>
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};