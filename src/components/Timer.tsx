import React, {useEffect, useState} from "react";
interface ITimerProps {
   setQuestionModal: React.Dispatch<React.SetStateAction<boolean>>
}

const Timer: React.FC<ITimerProps> = props => {
    const maxQuestionWaitTime: number = 6 // TODO: Make this a state so that it's more dynamic
    const[seconds, setSeconds] = useState<number>(maxQuestionWaitTime)
    const { setQuestionModal} = props

    useEffect(() => {

        const interval = setInterval(() => {
            if(seconds > 0){
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
        <>
            <div>
                Timer: { seconds }
            </div>
        </>
    );
};

export default Timer;