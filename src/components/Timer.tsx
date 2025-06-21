import React from "react";
import useTimeCounter from "../utils/hooks/useTimeCounter";
import './Timer.css';

interface ITimerProps {
   setQuestionModal: React.Dispatch<React.SetStateAction<boolean>>
}

const Timer: React.FC<ITimerProps> = props => {
    const { setQuestionModal } = props;
    const seconds = useTimeCounter(setQuestionModal);
    const progress = (seconds / 10) * 100;

    return (
        <div className="timer-container">
            <div className="timer-progress-bar">
                <div 
                    className="timer-progress-fill" 
                    style={{ width: `${progress}%` }}
                ></div>
            </div>
            <div className="timer-text">
                Time remaining: {seconds}s
            </div>
        </div>
    );
};

export default Timer;