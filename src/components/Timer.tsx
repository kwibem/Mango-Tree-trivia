import React, {useEffect, useState} from "react";
interface ITimerProps {
   setQuestionModal: React.Dispatch<React.SetStateAction<boolean>>
}

const Timer: React.FC<ITimerProps> = props => {
    const maxQuestionWaitTime: number = 30 // TODO: Make this a state so that it's more dynamic
    const[seconds, setSeconds] = useState<number>(maxQuestionWaitTime)
    const { setQuestionModal} = props

    useEffect(() => {

        const interval = setInterval(() => {
            if(seconds > 1){
                setSeconds(prevState => prevState - 1)
            }else{
                clearInterval(interval)
                setQuestionModal(prevState => false)
            }
        }, 1000);

        return () => {
            clearInterval(interval)
        }

    }, [seconds, setQuestionModal])


    return (
        <div>
            <p>Timer: <small>{ seconds }</small></p>
        </div>
    );
};

export default Timer;