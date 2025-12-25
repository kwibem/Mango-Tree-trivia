import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import Button from "../../components/Button";

import { usePlayer } from "../../context/PlayerContext";

const Home = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [step, setStep] = useState<number>(1);
    const [playerCount, setPlayerCount] = useState<number>(2);
    const [playerNames, setLocalPlayerNames] = useState<string[]>(Array(2).fill(""));
    const [error, setError] = useState<string | null>(location.state?.error || null);
    const [isVisible, setIsVisible] = useState<boolean>(!!location.state?.error);
    const { setPlayerNames } = usePlayer();

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

    const handlePlayerCountSelect = (count: number) => {
        setPlayerCount(count);
    };

    const handleNext = () => {
        console.log("handleNext called with count:", playerCount);
        if (playerCount < 1) {
            alert("Please enter at least 1 player");
            return;
        }
        if (playerCount > 10) {
            alert("Maximum 10 players allowed");
            return;
        }

        // Resize playerNames array, preserving existing names where possible
        setLocalPlayerNames(prev => {
            const newNames = [...prev];
            if (playerCount > prev.length) {
                // Add empty strings
                for (let i = prev.length; i < playerCount; i++) {
                    newNames.push("");
                }
            } else {
                // Trim array
                newNames.length = playerCount;
            }
            return newNames;
        });
        setStep(2);
    };

    const handleNameChange = (index: number, name: string) => {
        setLocalPlayerNames(prev => {
            const newNames = [...prev];
            newNames[index] = name;
            return newNames;
        });
    };

    const handleStartGame = () => {
        // Validate all names are filled
        if (playerNames.some(name => !name.trim())) {
            alert("Please enter names for all players");
            return;
        }
        setPlayerNames(playerNames);
        navigate("/game");
    };

    const renderStep1 = () => (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', width: '100%' }}>
            <h2 style={{ marginBottom: '10px' }}>How many players?</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', width: '100%', maxWidth: '300px' }}>
                <input
                    type="number"
                    min="1"
                    max="10"
                    value={playerCount}
                    onChange={(e) => handlePlayerCountSelect(parseInt(e.target.value) || 0)}
                    onFocus={(e) => e.target.select()}
                    style={{ padding: '12px', fontSize: '18px', borderRadius: '4px', border: '1px solid #ccc', textAlign: 'center' }}
                />
                <Button onClick={handleNext}>
                    Next
                </Button>
            </div>
        </div>
    );

    const renderStep2 = () => (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', width: '100%' }}>
            <h2 style={{ marginBottom: '10px' }}>Enter Player Names</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '20px', width: '100%', maxWidth: '300px' }}>
                {Array.from({ length: playerCount }).map((_, index) => (
                    <input
                        key={index}
                        type="text"
                        placeholder={`Player ${index + 1} Name`}
                        value={playerNames[index] || ""}
                        onChange={(e) => handleNameChange(index, e.target.value)}
                        style={{ padding: '12px', fontSize: '16px', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                ))}
            </div>

            <div style={{ display: 'flex', gap: '15px', width: '100%', maxWidth: '300px' }}>
                <Button
                    onClick={() => setStep(1)}
                    style={{ backgroundColor: '#666', flex: 1 }}
                >
                    Back
                </Button>
                <Button
                    onClick={handleStartGame}
                    style={{ flex: 1 }}
                >
                    Start Game
                </Button>
            </div>
        </div>
    );

    return (
        <Layout className="layout--centered">
            <h1 style={{ marginBottom: '30px' }}>Mango Tree Trivia</h1>
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

            {step === 1 ? renderStep1() : renderStep2()}
        </Layout>
    );
};

export default Home;
