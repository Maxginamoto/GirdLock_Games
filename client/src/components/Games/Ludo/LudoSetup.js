import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './LudoSetup.css'; // We'll create this next

const availableColors = [
    { name: 'Red', hex: '#d00000' },
    { name: 'Green', hex: '#2b9348' },
    { name: 'Blue', hex: '#0077b6' },
    { name: 'Yellow', hex: '#ffdd00' },
    { name: 'Orange', hex: '#f77f00' },
    { name: 'Purple', hex: '#6a00f4' },
];

const LudoSetup = () => {
    const [numPlayers, setNumPlayers] = useState(2);
    const [players, setPlayers] = useState([]);
    const navigate = useNavigate();

    // Effect to initialize or update player settings when numPlayers changes
    useEffect(() => {
        setPlayers(prevPlayers => {
            const newPlayers = [];
            for (let i = 0; i < numPlayers; i++) {
                if (prevPlayers[i]) {
                    newPlayers.push(prevPlayers[i]);
                } else {
                    // Find the first available color for the new player
                    const firstAvailableColor = availableColors.find(
                        c => !newPlayers.some(p => p.color === c.hex)
                    );
                    newPlayers.push({
                        id: i + 1,
                        name: `Player ${i + 1}`,
                        color: firstAvailableColor.hex,
                        numTokens: 4,
                    });
                }
            }
            return newPlayers;
        });
    }, [numPlayers]);

    const handlePlayerDetailChange = (index, field, value) => {
        const newPlayers = [...players];
        newPlayers[index][field] = value;
        setPlayers(newPlayers);
    };

    const handleStartGame = () => {
        // Pass the final player setup to the game board component
        navigate('/game/ludo', { state: { players } });
    };

    const selectedColors = players.map(p => p.color);

    return (
        <div className="ludo-setup-container">
            <h2>Ludo Game Setup</h2>

            <div className="setup-option">
                <label>Number of Players: {numPlayers}</label>
                <input
                    type="range"
                    min="2"
                    max="4"
                    value={numPlayers}
                    onChange={(e) => setNumPlayers(parseInt(e.target.value))}
                />
            </div>

            <div className="player-configs">
                {players.map((player, index) => (
                    <div key={player.id} className="player-card" style={{ borderColor: player.color }}>
                        <h3>Player {player.id}</h3>
                        <input
                            type="text"
                            value={player.name}
                            onChange={(e) => handlePlayerDetailChange(index, 'name', e.target.value)}
                            placeholder="Enter Name"
                        />
                        <select
                            value={player.color}
                            onChange={(e) => handlePlayerDetailChange(index, 'color', e.target.value)}
                        >
                            {availableColors.map(color => (
                                // A color is only available if it's the current player's color OR not selected by anyone else
                                (player.color === color.hex || !selectedColors.includes(color.hex)) && (
                                    <option key={color.hex} value={color.hex}>
                                        {color.name}
                                    </option>
                                )
                            ))}
                        </select>
                        <div className="token-select">
                            <label>Tokens: {player.numTokens}</label>
                            <input
                                type="range"
                                min="1"
                                max="4"
                                value={player.numTokens}
                                onChange={(e) => handlePlayerDetailChange(index, 'numTokens', parseInt(e.target.value))}
                            />
                        </div>
                    </div>
                ))}
            </div>

            <button className="btn-grad" onClick={handleStartGame}>
                Start Game
            </button>
        </div>
    );
};

export default LudoSetup;