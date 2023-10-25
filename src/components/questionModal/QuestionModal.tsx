import React from "react";
import {IQuestion} from "../../utils/interfaces/questionInterface";

import Timer from "../Timer";
import "./QuestionModal.css"

interface IQuestionModalProps {
    question: Partial<IQuestion>;
    pointTracker: number;
    setPoints: React.Dispatch<React.SetStateAction<number>>;
    setShowQuestionModal:  React.Dispatch<React.SetStateAction<boolean>>;
}

export const QuestionModal: React.FC<IQuestionModalProps> = (props) => {
    const { question, pointTracker, setShowQuestionModal, setPoints } = props
    const multiple_choices: string[] | void = shuffleQuestionChoices(question.incorrect_answers, question.correct_answer)

    function shuffleQuestionChoices(incorrect_responses: string[] | undefined, correct_response: string | undefined): string[] | void {
        if (typeof incorrect_responses === "undefined" || typeof correct_response === "undefined") return;

        let multipleChoices = [...incorrect_responses, correct_response]

        for (let count: number = multipleChoices.length - 1; count > 0; count--) {
            const shuffle = Math.floor(Math.random() * (count + 1));
            // Swap elements
            [multipleChoices[count], multipleChoices[shuffle]] = [multipleChoices[shuffle], multipleChoices[count]];
        }
        return multipleChoices
    }

    const handlePointUpdate = (event: { currentTarget: { innerText: string; }; }): void => {
        if (typeof question.correct_answer === "undefined")  return;

        (event.currentTarget.innerText.toLowerCase()  === question.correct_answer.toLowerCase()) ?
            setPoints(prevPoints => prevPoints + pointTracker)
            :  setPoints(prevPoints => prevPoints - pointTracker)

        setShowQuestionModal(prevState => false)
    }

    return (
        <>
            <div className="question modal">
                <Timer setQuestionModal={setShowQuestionModal}/>
                { <p> { question.question } </p> }

                <div className="question_grid">
                    {
                        multiple_choices?.map((choice: string, index: number) => {
                            return (
                                <div key={ index } className="question_column" onClick={ handlePointUpdate }>
                                    { choice }
                                </div>)
                        })
                    }
                </div>
            </div>
        </>
    );
};