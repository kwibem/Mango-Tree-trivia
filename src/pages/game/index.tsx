import {useState} from "react";

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
const grid: boolean[][] = Array.from({ length: numRows }, () => Array(numCols).fill(false));

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
    const [monitorGridClick, setMonitorGridClick] = useState<boolean[][]>(grid)
    const [question, setQuestion] = useState<Partial<TQuestion>>({})

    const roundOnePointsMultiplier: number  = 100;
    const choices = shuffleQuestionChoices(question.incorrect_answers, question.correct_answer)
    let areAllCellsClicked: boolean = monitorGridClick.flat().every( isClicked => isClicked )

    function handleCardClick(rowIndex: number, columnIndex: number, question: TQuestion) {
        if(grid[rowIndex][columnIndex]){
            return;
        }

        let newGrid: boolean[][] = [...grid]
        newGrid[rowIndex][columnIndex] = true

        setMonitorGridClick(prevState => newGrid)
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

            <div className="question modal">
                { showQuestionModal ? <p> { question.question } </p> : null }

                <div>
                    {
                        choices?.map((choice: string, index, number) => {
                            return <button key={ index }> { choice } </button>
                        })
                    }
                </div>
            </div>

            <div>
                { areAllCellsClicked ? <button> Go to the Next Stage </button> : null }
            </div>
        </div>
    );
};

export default Game;