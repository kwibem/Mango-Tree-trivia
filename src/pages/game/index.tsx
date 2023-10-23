import { useState } from "react";

import response from "./data";
import { IQuestion, IData} from "../../utils/interfaces/questionInterface";
import PointTracker from "../../components/pointTracker";

import "./Game.css"
import {QuestionModal} from "../../components/QuestionModal";

const data: IData[] = response
const numRows: number = data.length
const numCols: number = data[0].questions.length
const clickTrackerGrid: boolean[][] = Array.from({ length: numRows }, () => Array(numCols).fill(false));

const Game = () => {
    const [showQuestionModal, setShowQuestionModal] = useState<boolean>(false)
    const [monitorGridClick, setMonitorGridClick] = useState<boolean[][]>(clickTrackerGrid)
    const [question, setQuestion] = useState<Partial<IQuestion>>({})
    const [points, setPoints] = useState<number>(0)
    const [pointTracker, setPointTracker] = useState<number>(0)
    // this is the ordinal value for "a" we are using it to label the multiple choices dynamically.

    const roundOnePointsMultiplier: number  = 100;
    let areAllCellsClicked: boolean = monitorGridClick.flat().every( isClicked => isClicked )

    function handleCardClick(rowIndex: number, columnIndex: number, question: IQuestion) {
        if(clickTrackerGrid[rowIndex][columnIndex] || showQuestionModal){
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
            <nav>
                <PointTracker points={points}/>
            </nav>
            <div className="grid">
                { data.map((data: IData, index: number) => (
                    <div className="column" key={ index }>
                        <h3> { data.category }</h3>
                        <div className="card_container">
                            { data.questions.map((question: IQuestion, count: number) => {
                                let gamePoints: number = (count + 1) * roundOnePointsMultiplier;

                                return (
                                    <div className={ monitorGridClick[index][count]? "card seen" : "card"}
                                         key={ `${index}` + count }
                                         onClick={ () => {
                                             handleCardClick(index, count, question)
                                             setPointTracker(gamePoints)
                                         } }
                                    >
                                        <span>{ gamePoints  } </span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {/*show the modal whenever available*/}

            {  showQuestionModal ? <QuestionModal
                setShowQuestionModal={setShowQuestionModal}
                showQuestionModal={showQuestionModal}
                question={question}
                pointTracker={pointTracker}
                setPoints={setPoints}
            /> : null}
            <div>
                { areAllCellsClicked ? <button> Go to the Next Stage </button> : null }
            </div>
        </div>
    );
};

export default Game;