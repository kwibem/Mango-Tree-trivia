import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import Button from "../../components/Button";

const Home = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [error, setError] = useState<string | null>(location.state?.error || null);
    const [isVisible, setIsVisible] = useState<boolean>(!!location.state?.error);

    useEffect(() => {
        if (error) {
            // Wait 3000ms before starting to fade
            const fadeTimer = setTimeout(() => {
                setIsVisible(false);
            }, 3000);

            // Wait 3000ms + 500ms (transition time) before removing from DOM
            const removeTimer = setTimeout(() => {
                setError(null);
                window.history.replaceState({}, document.title);
            }, 3500);

            return () => {
                clearTimeout(fadeTimer);
                clearTimeout(removeTimer);
            };
        }
    }, [error]);

    return (
        <Layout className="layout--centered">
            <h1>Mango Tree Trivia</h1>
            {error && (
                <div style={{
                    backgroundColor: '#ff4444',
                    color: 'white',
                    padding: '10px 20px',
                    borderRadius: '5px',
                    marginBottom: '20px',
                    fontWeight: 'bold',
                    opacity: isVisible ? 1 : 0,
                    transition: 'opacity 0.5s ease-in-out'
                }}>
                    {error}
                </div>
            )}
            <Button onClick={() => navigate("/game")}>
                Start the Game
            </Button>
        </Layout>
    );
};

export default Home;
