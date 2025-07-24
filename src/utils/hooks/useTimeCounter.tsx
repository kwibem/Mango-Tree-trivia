import {useEffect, useState, useRef, useCallback} from "react";
const useTimeCounter  = (setQuestionModal: (value: (((prevState: boolean) => boolean) | boolean)) => void): number => {

    const[seconds, setSeconds] = useState<number>(10)
    const intervalRef = useRef<NodeJS.Timeout | null>(null)

    const closeModal = useCallback(() => {
        setQuestionModal(false)
    }, [setQuestionModal])

    useEffect(() => {
        intervalRef.current = setInterval(() => {
            setSeconds(prevSeconds => {
                if(prevSeconds > 1){
                    return prevSeconds - 1
                } else {
                    if(intervalRef.current) {
                        clearInterval(intervalRef.current)
                    }
                    // Use setTimeout to defer the state update to the next tick
                    setTimeout(() => closeModal(), 0)
                    return 0
                }
            })
        }, 500);

        return () => {
            if(intervalRef.current) {
                clearInterval(intervalRef.current)
            }
        }

    }, [closeModal])

    return seconds
}

export default useTimeCounter;