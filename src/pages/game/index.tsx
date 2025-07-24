import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import response from "./data";
import { IQuestion, IData } from "../../utils/interfaces/questionInterface";
import { QuestionModal } from "../../components/questionModal/QuestionModal";
import Navigation from "../../components/navigation";
import Layout from "../../components/Layout";
import GameGrid from "../../components/GameGrid";
import Button from "../../components/Button";

import "./Game.css"

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

    const areAllCellsClicked: boolean = useMemo(() => 
        monitorGridClick.flat().every(isClicked => isClicked), 
        [monitorGridClick]
    )

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
        <Layout>
            <Navigation round={round} points={points} />
            <GameGrid
                data={data}
                monitorGridClick={monitorGridClick}
                round={round}
                onCardClick={handleCardClick}
                disabled={showQuestionModal}
            />

            {/*show the modal whenever available*/}

            <QuestionModal
                setShowQuestionModal={setShowQuestionModal}
                showQuestionModal={showQuestionModal}
                question={question}
                pointTracker={pointTracker}
                setPoints={setPoints}
            />
            {(areAllCellsClicked && !showQuestionModal) && (
                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                    <Button onClick={handleUpdateRound}>
                        {round === 3 ? "Get Scores" : "Go to the Next Round"}
                    </Button>
                </div>
            )}
        </Layout>
    );
};

export default Game;