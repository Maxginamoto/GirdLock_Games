import React from 'react';
import './GameOverModal.css';

const GameOverModal = ({ winner, onRestart }) => {
  if (!winner) return null;

  let message = '';
  if (winner === 'Draw') {
    message = "It's a Draw!";
  } else {
    message = `Winner: ${winner}`;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Game Over</h2>
        <p>{message}</p>
        <button className="btn-grad" onClick={onRestart}>Play Again</button>
      </div>
    </div>
  );
};

export default GameOverModal;