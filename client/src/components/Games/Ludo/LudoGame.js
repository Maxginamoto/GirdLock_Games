import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './LudoGame.css';
import { YARD_POSITIONS, generatePlayerPath, SAFE_TILES } from './ludoBoardData';
import Dice from '../Dice';

const PawnIcon = ({ color }) => (
    <svg width="80%" height="80%" viewBox="0 0 100 100" fill={color}>
        <path d="M50 0 A25 25 0 0 1 50 50 A25 25 0 0 1 50 0 M50 40 A30 30 0 0 0 20 70 L80 70 A30 30 0 0 0 50 40 M10 75 H90 V90 H10Z" />
    </svg>
);

const LudoGame = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const [players, setPlayers] = useState([]);
    const [tokens, setTokens] = useState([]);
    const [playerPaths, setPlayerPaths] = useState({});

    const [gameState, setGameState] = useState('rolling');
    const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
    const [diceValue, setDiceValue] = useState(null);
    const [isRolling, setIsRolling] = useState(false);
    const [winner, setWinner] = useState(null);

    // --- Game Initialization ---
    useEffect(() => {
        if (!location.state || !location.state.players) {
            navigate('/game/ludo/setup');
            return;
        }
        const setupPlayers = location.state.players;
        setPlayers(setupPlayers);

        const initialTokens = [];
        const paths = {};
        const colorMap = {
            '#d00000': 'red',
            '#2b9348': 'green',
            '#0077b6': 'blue',
            '#ffdd00': 'yellow',
            '#f77f00': 'orange',
            '#6a00f4': 'purple',
        };

        setupPlayers.forEach((player) => {
            const colorName = colorMap[player.color.toLowerCase()];
            paths[player.id] = generatePlayerPath(colorName);
            for (let i = 0; i < player.numTokens; i++) {
                initialTokens.push({
                    id: `${player.id}-${i}`,
                    playerId: player.id,
                    color: player.color,
                    state: 'yard',
                    position: YARD_POSITIONS[colorName][i],
                    pathIndex: -1,
                });
            }
        });
        setTokens(initialTokens);
        setPlayerPaths(paths);
    }, [location.state, navigate]);

    // --- Turn and Game State Logic ---
    const nextTurn = useCallback(() => {
        setCurrentPlayerIndex(prevIndex => (prevIndex + 1) % players.length);
        setGameState('rolling');
        setDiceValue(null);
    }, [players.length]);

    const hasPossibleMoves = useCallback((player, roll) => {
        const playerTokens = tokens.filter(t => t.playerId === player.id);
        if (roll === 6 && playerTokens.some(t => t.state === 'yard')) return true;
        return playerTokens.some(t => t.state === 'active' && (t.pathIndex + roll) < playerPaths[player.id].length);
    }, [tokens, playerPaths]);

    // --- Dice Roll ---
    const handleDiceRoll = () => {
        if (isRolling || gameState !== 'rolling') return;
        setIsRolling(true);
        setTimeout(() => {
            const roll = Math.floor(Math.random() * 6) + 1;
            setDiceValue(roll);
            setIsRolling(false);

            const currentPlayer = players[currentPlayerIndex];
            if (hasPossibleMoves(currentPlayer, roll)) {
                setGameState('moving');
            } else {
                setTimeout(nextTurn, 1000); // Wait 1 sec before skipping turn
            }
        }, 1000);
    };

    // --- Token Movement and Animation ---
    const moveToken = (token, steps) => {
        const path = playerPaths[token.playerId];
        let currentStep = token.pathIndex;

        const stepInterval = setInterval(() => {
            currentStep++;
            const newPosition = path[currentStep];
            setTokens(prevTokens => prevTokens.map(t =>
                t.id === token.id ? { ...t, position: newPosition } : t
            ));

            if (currentStep === token.pathIndex + steps) {
                clearInterval(stepInterval);
                // Final state update after animation
                finishMove(token, currentStep);
            }
        }, 200); // 200ms per tile
    };

    const finishMove = (movedToken, finalPathIndex) => {
        const finalPosition = playerPaths[movedToken.playerId][finalPathIndex];
        let newTokens = [...tokens];

        // Check for "cutting" other tokens
        const isSafeTile = SAFE_TILES.some(safe => safe.x === finalPosition.x && safe.y === finalPosition.y);
        if (!isSafeTile) {
            newTokens = newTokens.map(t => {
                if (t.playerId !== movedToken.playerId && t.state === 'active' && t.position.x === finalPosition.x && t.position.y === finalPosition.y) {
                    const colorName = players.find(p => p.id === t.playerId).color.toLowerCase();
                    const yardPos = YARD_POSITIONS[colorName][parseInt(t.id.split('-')[1])];
                    return { ...t, state: 'yard', pathIndex: -1, position: yardPos };
                }
                return t;
            });
        }

        // Update the moved token's final state
        const isHome = finalPathIndex === playerPaths[movedToken.playerId].length - 1;
        newTokens = newTokens.map(t =>
            t.id === movedToken.id ? { ...t, state: isHome ? 'home' : 'active', pathIndex: finalPathIndex, position: finalPosition } : t
        );
        setTokens(newTokens);

        // Check for win condition
        const playerTokens = newTokens.filter(t => t.playerId === movedToken.playerId);
        if (playerTokens.every(t => t.state === 'home')) {
            setWinner(players.find(p => p.id === movedToken.playerId));
            setGameState('gameOver');
            return;
        }

        // Handle next turn or extra roll
        if (diceValue === 6) {
            setGameState('rolling'); // Roll again
            setDiceValue(null);
        } else {
            nextTurn();
        }
    };

    const handleTokenClick = (token) => {
        if (gameState !== 'moving' || token.playerId !== players[currentPlayerIndex].id || winner) return;

        // Move token from yard to start
        if (token.state === 'yard' && diceValue === 6) {
            const startPosition = playerPaths[token.playerId][0];
            const updatedToken = { ...token, state: 'active', pathIndex: 0, position: startPosition };
            finishMove(updatedToken, 0); // No animation needed for leaving yard
        } 
        // Move an active token
        else if (token.state === 'active') {
            const newPathIndex = token.pathIndex + diceValue;
            if (newPathIndex < playerPaths[token.playerId].length) {
                setGameState('animating'); // Disable clicks during animation
                moveToken(token, diceValue);
            }
        }
    };

    if (players.length === 0) return <div>Loading Game...</div>;
    const currentPlayer = players[currentPlayerIndex];

    // In LudoGame.js, replace the entire return statement with this:
    return (
        <div className="ludo-container">
            <div className="ludo-board">
                {/* --- Render Path Tiles with Colors --- */}
                {Object.keys(playerPaths).map(playerId => {
                    const player = players.find(p => p.id === parseInt(playerId));
                    // A simple map to get the color name for the CSS class
                    const colorMap = {
                        '#d00000': 'red',
                        '#2b9348': 'green',
                        '#0077b6': 'blue',
                        '#ffdd00': 'yellow',
                        '#f77f00': 'orange',
                        '#6a00f4': 'purple',
                    };
                    const colorName = colorMap[player.color.toLowerCase()];

                    return playerPaths[playerId].map((tile, index) => {
                        const isHomeStretch = index >= 51; // Path has 51 main tiles, rest is home stretch
                        const isSafe = SAFE_TILES.some(safe => safe.x === tile.x && safe.y === tile.y);

                        return (
                            <div
                                key={`${playerId}-${index}`}
                                className={`tile ${isHomeStretch ? `${colorName}-path` : ''} ${isSafe ? 'safe-tile' : ''}`}
                                style={{
                                    gridColumn: tile.x + 1,
                                    gridRow: tile.y + 1,
                                }}
                            ></div>
                        );
                    });
                })}

                {/* --- Render Yards --- */}
                <div className="yard red"></div>
                <div className="yard green"></div>
                <div className="yard blue"></div>
                <div className="yard yellow"></div>

                {/* --- Render Center Home Area --- */}
                <div className="center-home">
                    <div className="home-triangle-red"></div>
                    <div className="home-triangle-blue"></div>
                </div>

                {/* --- Render Tokens --- */}
                {tokens.map(token => (
                    <div
                        key={token.id}
                        className={`token ${token.playerId === currentPlayer.id && gameState === 'moving' ? 'movable' : ''}`}
                        style={{
                            left: `calc(${(token.position.x + 0.5) * (100 / 15)}%)`,
                            top: `calc(${(token.position.y + 0.5) * (100 / 15)}%)`,
                            backgroundColor: token.color,
                        }}
                        onClick={() => handleTokenClick(token)}
                    >
                        <PawnIcon color="white" />
                    </div>
                ))}
            </div>

            {/* --- Render Game Controls --- */}
            <div className="game-controls">
                <h2>Ludo</h2>
                {!winner ? (
                    <>
                        <div className="player-turn" style={{ backgroundColor: currentPlayer.color }}>
                            Turn: {currentPlayer.name}
                        </div>
                        <Dice value={diceValue} isRolling={isRolling} onRoll={handleDiceRoll} />
                        <button
                            onClick={handleDiceRoll}
                            disabled={isRolling || gameState !== 'rolling'}
                            className="btn-grad"
                        >
                            {isRolling ? 'Rolling...' : 'Roll Dice'}
                        </button>
                        {gameState === 'moving' && <p>Click a movable token!</p>}
                    </>
                ) : (
                    <div className="winner-announcement">
                        <h3>Winner!</h3>
                        <p style={{ color: winner.color }}>{winner.name}</p>
                        <button onClick={() => navigate('/game/ludo/setup')} className="btn-grad">Play Again</button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default LudoGame;