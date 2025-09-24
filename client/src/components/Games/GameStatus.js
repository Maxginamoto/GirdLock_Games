import React from 'react';
import './GameStatus.css'; // We'll create this next

const GameStatus = ({ players, currentTurn, playerRole }) => {
  return (
    <div className="game-status-container">
      {players.map((player) => (
        <div
          key={player.role}
          className={`player-info ${currentTurn === player.role ? 'active-player' : ''}`}
        >
          <span className="player-name">{player.name}</span>
          <span className="player-role">({player.role})</span>
          {playerRole === player.role && <span className="you-indicator">(You)</span>}
        </div>
      ))}
    </div>
  );
};

export default GameStatus;