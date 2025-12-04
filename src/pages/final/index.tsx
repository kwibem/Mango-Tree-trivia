import { useLocation, Navigate } from "react-router-dom";
import Layout from "../../components/Layout";

const Final = () => {
    const location = useLocation();

    if (!location.state?.completed) {
        return <Navigate to="/" replace state={{ error: "You must play the game to see the results!" }} />;
    }

    return (
        <Layout className="layout--centered">
            <h1>Yay! You made it 🎉</h1>
            <p>Congratulations on completing the trivia game!</p>
        </Layout>
    );
};

export default Final;