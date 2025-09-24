import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './SnakeGame.css'; 

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 8, y: 8 }];
const INITIAL_FOOD = { x: 5, y: 5 };

const SnakeGame = () => {
    const [snake, setSnake] = useState(INITIAL_SNAKE);
    const [food, setFood] = useState(INITIAL_FOOD);
    const [direction, setDirection] = useState({ x: 0, y: -1 }); // Start moving up
    const [speed, setSpeed] = useState(200); // Milliseconds per move
    const [gameOver, setGameOver] = useState(false);
    const [score, setScore] = useState(0);
    const [globalHighScore, setGlobalHighScore] = useState(0);

    useEffect(() => {
        axios.get('/api/game/snake-highscore')
            .then(res => setGlobalHighScore(res.data.highScore))
            .catch(err => console.error('Could not fetch high score', err));
    }, []);

    const generateFood = useCallback(() => {
        const newFood = {
            x: Math.floor(Math.random() * GRID_SIZE),
            y: Math.floor(Math.random() * GRID_SIZE),
        };
        setFood(newFood);
    }, []);

    const handleKeyDown = useCallback((e) => {
        switch (e.key) {
            case 'ArrowUp':
                if (direction.y === 0) setDirection({ x: 0, y: -1 });
                break;
            case 'ArrowDown':
                if (direction.y === 0) setDirection({ x: 0, y: 1 });
                break;
            case 'ArrowLeft':
                if (direction.x === 0) setDirection({ x: -1, y: 0 });
                break;
            case 'ArrowRight':
                if (direction.x === 0) setDirection({ x: 1, y: 0 });
                break;
            default:
                break;
        }
    }, [direction]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleKeyDown]);

    const gameLoop = useCallback(() => {
        if (gameOver) return;

        setSnake(prevSnake => {
            const newSnake = [...prevSnake];
            const head = { ...newSnake[0] };

            head.x += direction.x;
            head.y += direction.y;

            // Wall collision
            if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
                setGameOver(true);
                if (score > globalHighScore) {
                    setGlobalHighScore(score);
                    axios.post('/api/game/snake-highscore', { newScore: score });
                }
                return prevSnake;
            }

            // Self collision
            for (let i = 1; i < newSnake.length; i++) {
                if (head.x === newSnake[i].x && head.y === newSnake[i].y) {
                    setGameOver(true);
                    if (score > globalHighScore) {
                        setGlobalHighScore(score);
                        axios.post('/api/game/snake-highscore', { newScore: score });
                    }
                    return prevSnake;
                }
            }
            
            newSnake.unshift(head);

            // Food collision
            if (head.x === food.x && head.y === food.y) {
                setScore(prev => prev + 1);
                setSpeed(prev => Math.max(50, prev * 0.95)); // Increase speed
                generateFood();
            } else {
                newSnake.pop();
            }

            return newSnake;
        });
    }, [direction, food, gameOver, generateFood, globalHighScore, score]);

    useEffect(() => {
        const intervalId = setInterval(gameLoop, speed);
        return () => clearInterval(intervalId);
    }, [gameLoop, speed]);

    const handleRestart = () => {
        setSnake(INITIAL_SNAKE);
        setFood(INITIAL_FOOD);
        setDirection({ x: 0, y: -1 });
        setSpeed(200);
        setGameOver(false);
        setScore(0);
    };

    return (
        <div className="game-container">
            <h3>Snake</h3>
            <p>Score: {score}</p>
            <p>All-Time High Score: {globalHighScore}</p>
            <div className="snake-game-board">
                {gameOver && (
                    <div className="game-over-overlay">
                        <div>Game Over!</div>
                        <button className="btn-grad" onClick={handleRestart}>Play Again</button>
                    </div>
                )}
                {Array.from({ length: GRID_SIZE }).map((_, y) =>
                    Array.from({ length: GRID_SIZE }).map((_, x) => {
                        let cellClass = 'cell';
                        if (snake.some(seg => seg.x === x && seg.y === y)) {
                            cellClass += ' snake';
                        }
                        if (food.x === x && food.y === y) {
                            cellClass += ' food';
                        }
                        return <div key={`${x}-${y}`} className={cellClass}></div>;
                    })
                )}
            </div>
        </div>
    );
};

export default SnakeGame;
