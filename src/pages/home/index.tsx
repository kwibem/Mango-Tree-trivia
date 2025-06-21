import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import Button from "../../components/Button";

const Home = () => {
    const navigate = useNavigate();

    return (
        <Layout className="layout--centered">
            <h1>Mango Tree Trivia</h1>
            <Button onClick={() => navigate("/game")}>
                Start the Game
            </Button>
        </Layout>
    );
};

export default  Home;
