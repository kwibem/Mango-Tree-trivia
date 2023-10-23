import React from "react";

import {IQuestion} from "../utils/interfaces/questionInterface";

import Timer from "./Timer";

interface IQuestionModalProps {
    question: Partial<IQuestion>;
    pointTracker: number;
    showQuestionModal: boolean;
    setPoints: React.Dispatch<React.SetStateAction<number>>;
    setShowQuestionModal:  React.Dispatch<React.SetStateAction<boolean>>;
}

export const QuestionModal: React.FC<IQuestionModalProps> = (props) => {
    const { question, pointTracker, showQuestionModal, setShowQuestionModal, setPoints } = props
    const ordinalNumberForAtA: number = 97;
    const multiple_choices: string[] | void = shuffleQuestionChoices(question.incorrect_answers, question.correct_answer)

    function shuffleQuestionChoices(incorrect_responses: string[] | undefined, correct_response: string | undefined): string[] | void {
        if (typeof incorrect_responses === "undefined" || typeof correct_response === "undefined") {
            return;
        }

        let multipleChoices = [...incorrect_responses, correct_response]

        for (let count: number = multipleChoices.length - 1; count > 0; count--) {
            if(showQuestionModal) continue; // prevents auto_refresh when the page is clicked

            const shuffle = Math.floor(Math.random() * (count + 1));
            [multipleChoices[count], multipleChoices[shuffle]] = [multipleChoices[shuffle], multipleChoices[count]]; // Swap elements
        }
        return multipleChoices
    }

    const handlePointUpdate = (event: { currentTarget: { innerText: string; }; }): void => {
        if (typeof question.correct_answer === "undefined") {
            return;
        }

        (event.currentTarget.innerText.toLowerCase()  === question.correct_answer.toLowerCase()) ?
            setPoints(prevPoints => prevPoints += pointTracker)
            :  setPoints(prevPoints => prevPoints -= pointTracker)

        setShowQuestionModal(prevState => false)

    }
    return (
        <>
            <Timer setQuestionModal={setShowQuestionModal}/>
            <div className="question modal">
                { <p> { question.question } </p> }

                <div>
                    {
                        multiple_choices?.map((choice: string, index: number) => {
                            return (
                                <div key={ index }>
                                    <span> { String.fromCharCode(ordinalNumberForAtA + index).toUpperCase() }</span>
                                    <button
                                        onClick={ handlePointUpdate }
                                    > { choice } </button>
                                </div>)
                        })
                    }
                </div>
            </div>
        </>
    );
};