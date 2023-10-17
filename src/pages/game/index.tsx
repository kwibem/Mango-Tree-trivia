import { useState } from "react";

import "./Game.css"
import response from "./data";

type TQuestion = {
    difficulty: string;
    question: string;
    correct_answer: string;
    incorrect_answers: string[];
}

interface IData {
    category: string;
    questions: TQuestion[];
}

const data: IData[] = response
const numRows: number = data.length
const numCols: number = data[0].questions.length
const clickTrackerGrid: boolean[][] = Array.from({ length: numRows }, () => Array(numCols).fill(false));

function shuffleQuestionChoices(incorrect_responses: string[] | undefined, correct_response: string | undefined): string[] | void {
    if (typeof incorrect_responses === "undefined" || typeof correct_response === "undefined") {
        return;
    }

    let multipleChoices = [...incorrect_responses, correct_response]

    for (let count: number = multipleChoices.length - 1; count > 0; count--) {
        const shuffle = Math.floor(Math.random() * (count + 1));
        [multipleChoices[count], multipleChoices[shuffle]] = [multipleChoices[shuffle], multipleChoices[count]]; // Swap elements
    }
    return multipleChoices
}

const Game = () => {
    const [showQuestionModal, setShowQuestionModal] = useState<boolean>(false)
    const [monitorGridClick, setMonitorGridClick] = useState<boolean[][]>(clickTrackerGrid)
    const [question, setQuestion] = useState<Partial<TQuestion>>({})
    // this is the ordinal value for "a" we are using it to label the multiple choices dynamically.
    const ordinalNumberForAtA: number = 97;

    const roundOnePointsMultiplier: number  = 100;
    const multiple_choices: string[] | void = shuffleQuestionChoices(question.incorrect_answers, question.correct_answer)
    let areAllCellsClicked: boolean = monitorGridClick.flat().every( isClicked => isClicked )

    function handleCardClick(rowIndex: number, columnIndex: number, question: TQuestion) {
        if(clickTrackerGrid[rowIndex][columnIndex]){
            return;
        }

        let newTrackerGrid: boolean[][] = [...clickTrackerGrid]
        newTrackerGrid[rowIndex][columnIndex] = true

        setMonitorGridClick(prevState => newTrackerGrid)
        setQuestion(prevState => question)
        setShowQuestionModal(prevState => true)
    }

    return (
        <div>
            <div className="grid">
                { data.map((data: IData, index: number) => (
                    <div className="column" key={ index }>
                        <h3> { data.category }</h3>

                        { data.questions.map((question: TQuestion, count: number) => {
                            let points: number = (count + 1) * roundOnePointsMultiplier;

                            return (
                                    <div className="card" key={ `${index}` + count }>
                                        <span onClick={ () => {
                                            handleCardClick(index, count, question)
                                        } }>
                                            { points  }
                                        </span>
                                    </div>
                            )
                        })}
                    </div>
                ))}
            </div>

            {  showQuestionModal ?
                <div className="question modal">
                    { <p> { question.question } </p> }

                    <div>
                        {
                            multiple_choices?.map((choice: string, index: number) => {
                                return (
                                    <div key={ index }>
                                        <span> { String.fromCharCode(ordinalNumberForAtA + index).toUpperCase() }</span>
                                        <button
                                            onClick={ event => {
                                                if (typeof question.correct_answer === "undefined") {
                                                    return;
                                                }
                                                if (event.currentTarget.innerText.toLowerCase()  === question.correct_answer.toLowerCase()) {
                                                    alert("correct")
                                                    setShowQuestionModal(prevState => false)
                                                    return;
                                                }
                                            }}
                                        > { choice } </button>
                                    </div>)
                            })
                        }
                    </div>
                </div> :
                null
            }
            <div>
                { areAllCellsClicked ? <button> Go to the Next Stage </button> : null }
            </div>
        </div>
    );
};

export default Game;