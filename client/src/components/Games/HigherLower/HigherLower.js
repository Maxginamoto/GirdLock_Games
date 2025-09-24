import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './HigherLower.css';

const HigherLower = () => {
    const [currentNumber, setCurrentNumber] = useState(null);
    const [currentStreak, setCurrentStreak] = useState(0);
    const [highScore, setHighScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [resultMessage, setResultMessage] = useState('');

    useEffect(() => {
        axios.get('/api/game/highscore')
            .then(res => setHighScore(res.data.highScore))
            .catch(err => console.error(err));
        startGame();
    }, []);

    const startGame = () => {
        setCurrentNumber(Math.floor(Math.random() * 9) + 1);
        setGameOver(false);
        setResultMessage('');
    };

    const handleGuess = (guess) => {
        if (gameOver) return;

        const nextNumber = Math.floor(Math.random() * 9) + 1;
        let isCorrect = false;

        if (guess === 'higher' && nextNumber > currentNumber) {
            isCorrect = true;
        } else if (guess === 'lower' && nextNumber < currentNumber) {
            isCorrect = true;
        } else if (nextNumber === currentNumber) {
            isCorrect = true; 
        }

        if (isCorrect) {
            setCurrentStreak(prevStreak => prevStreak + 1);
            setResultMessage(`Correct! Next number was ${nextNumber}.`);
            setCurrentNumber(nextNumber);
        } else {
            setResultMessage(`Wrong! The number was ${nextNumber}.`);
            setGameOver(true);
            if (currentStreak > highScore) {
                setHighScore(currentStreak);
                axios.post('/api/game/highscore', { newScore: currentStreak });
            }
        }
    };

    const handlePlayAgain = () => {
        setCurrentStreak(0);
        startGame();
    };

    return (
        <div className="higher-lower-container">
            <h2>Higher or Lower</h2>
            <div className="scores">
                <p>Current Streak: {currentStreak}</p>
                <p>Global Highest Score: {highScore}</p>
            </div>
            {resultMessage && <p className="result-message">{resultMessage}</p>}
            {gameOver && <button onClick={handlePlayAgain} className="btn-grad">Play Again</button>}
            <div className="game-cards">
                <div className="card guess-card" onClick={() => handleGuess('higher')}>Higher</div>
                <div className={`card number-card ${gameOver ? 'game-over' : ''}`}>{currentNumber}</div>
                <div className="card guess-card" onClick={() => handleGuess('lower')}>Lower</div>
            </div>
        </div>
    );
};

export default HigherLower;