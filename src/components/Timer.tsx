import React from "react";
import useTimeCounter from "../utils/hooks/useTimeCounter";
import './Timer.css';

interface ITimerProps {
    setQuestionModal: React.Dispatch<React.SetStateAction<boolean>>;
    isPaused?: boolean;
}

const Timer: React.FC<ITimerProps> = props => {
    const { setQuestionModal, isPaused = false } = props;
    const seconds = useTimeCounter(setQuestionModal, isPaused);
    const timerDuration = Number(process.env.REACT_APP_TIMER_DURATION) || 10;
    const progress = (seconds / timerDuration) * 100;

    return (
        <div className="timer-container">
            <div className="timer-progress-bar">
                <div
                    className="timer-progress-fill"
                    style={{ width: `${progress}%` }}
                ></div>
            </div>
            {/* <div className="timer-text">
                Time remaining: {seconds}s
            </div> */}
        </div>
    );
};

export default Timer;