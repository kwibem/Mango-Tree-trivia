import {useEffect, useState, useRef, useCallback} from "react";
const useTimeCounter  = (setQuestionModal: (value: (((prevState: boolean) => boolean) | boolean)) => void): number => {

    const timerDuration = Number(process.env.REACT_APP_TIMER_DURATION) || 10
    const[seconds, setSeconds] = useState<number>(timerDuration)
    const intervalRef = useRef<NodeJS.Timeout | null>(null)

    const closeModal = useCallback(() => {
        setQuestionModal(false)
    }, [setQuestionModal])

    useEffect(() => {
        intervalRef.current = setInterval(() => {
            setSeconds(prevSeconds => {
                if (prevSeconds > 1) {
                    return prevSeconds - 1;
                } else {
                    if (intervalRef.current) {
                        clearInterval(intervalRef.current);
                    }
                    // Use setTimeout to defer the state update to the next tick
                    setTimeout(() => closeModal(), 0);
                    return 0;
                }
            });
        }, 1000);

        return () => {
            if(intervalRef.current) {
                clearInterval(intervalRef.current)
            }
        }

    }, [closeModal])

    return seconds
}

export default useTimeCounter;
