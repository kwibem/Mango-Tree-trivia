import React from "react";
import useTimeCounter from "../utils/hooks/useTimeCounter";

interface ITimerProps {
   setQuestionModal: React.Dispatch<React.SetStateAction<boolean>>
}

const Timer: React.FC<ITimerProps> = props => {
    const { setQuestionModal} = props

    const seconds = useTimeCounter(setQuestionModal)
    return (
        <div>
            <p>Timer: <small>{ seconds }</small></p>
        </div>
    );
};

export default Timer;