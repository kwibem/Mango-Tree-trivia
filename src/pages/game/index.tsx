import {useState} from "react";

import response from "./data";
import { IQuestion, IData} from "../../utils/interfaces/questionInterface";

import "./Game.css"
import {QuestionModal} from "../../components/questionModal/QuestionModal";
import {useNavigate} from "react-router-dom";
import Navigation from "../../components/navigation";

const data: IData[] = response
const numRows: number = data.length
const numCols: number = data[0].questions.length
const clickTrackerGrid = (): boolean[][] => Array.from({ length: numRows }, () => Array(numCols).fill(false));

const Game = () => {
    const [showQuestionModal, setShowQuestionModal] = useState<boolean>(false)
    const [monitorGridClick, setMonitorGridClick] = useState<boolean[][]>(clickTrackerGrid())
    const [question, setQuestion] = useState<Partial<IQuestion>>({})
    const [points, setPoints] = useState<number>(0)
    const [pointTracker, setPointTracker] = useState<number>(0)
    const [round, setRound] = useState<number>(1)
    const navigate = useNavigate()

    let areAllCellsClicked: boolean = monitorGridClick.flat().every( isClicked => isClicked )

    function handleCardClick(rowIndex: number, columnIndex: number, question: IQuestion, gamePoints: number) {
        if(monitorGridClick[rowIndex][columnIndex]) return;

        let newTrackerGrid: boolean[][] = [...monitorGridClick]
        newTrackerGrid[rowIndex][columnIndex] = true

        setMonitorGridClick(prevState => newTrackerGrid)
        setQuestion(prevState => question)
        setShowQuestionModal(prevState => true)
        setPointTracker(gamePoints)
    }


    function handleUpdateRound(): void {
        setMonitorGridClick(clickTrackerGrid())
        if(round === 3 ){
            navigate("/final")
            return;
        }
        setRound(prevState => prevState + 1)
    }

    return (
        <div>
            <Navigation round={round}  points={points}/>
            <div className="grid">
                { data.map((data: IData, index: number) => (
                    <div className="column" key={ index }>
                        <div className="card_container">
                            <h3 className="card header"> { data.category }</h3>
                            { data.questions.map((question: IQuestion, count: number) => {
                                let gamePoints: number = (count + 1) * round * 100;

                                return (
                                    <div className={ monitorGridClick[index][count]? "card row seen" : "card row"}
                                         key={`${index}` + count  }
                                         onClick={ showQuestionModal ? undefined :  () => handleCardClick(index, count, question, gamePoints) }
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

            <QuestionModal
                setShowQuestionModal={setShowQuestionModal}
                showQuestionModal={showQuestionModal}
                question={question}
                pointTracker={pointTracker}
                setPoints={setPoints}
            />
            <div>
                { (areAllCellsClicked && !showQuestionModal)?
                    <button
                    onClick={ handleUpdateRound}
                    >
                        { round === 3 ? "Get Scores" : "Go to the Next Round" }
                    </button> : null
                }
            </div>
        </div>
    );
};

export default Game;