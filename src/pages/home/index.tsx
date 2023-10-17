import {useNavigate} from "react-router-dom";

const Home  = () => {
    const navigate = useNavigate();

    return (
        <div>
            <button onClick={ ()=> { navigate("/game") }}>
                Start the Game
            </button>
        </div>
    );
};

export default  Home;
