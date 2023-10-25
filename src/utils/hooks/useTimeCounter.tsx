import {useEffect, useState} from "react";
const useTimeCounter  = (setQuestionModal: (value: (((prevState: boolean) => boolean) | boolean)) => void): number => {

    const[seconds, setSeconds] = useState<number>(10)

    useEffect(() => {

        const interval = setInterval(() => {
            if(seconds > 1){
                setSeconds(prevState => prevState - 1)
            }else{
                clearInterval(interval)
                setQuestionModal(false)
            }
        }, 500);

        return () => {
            clearInterval(interval)
        }

    }, [seconds, setQuestionModal])

    return seconds
}

export default useTimeCounter;