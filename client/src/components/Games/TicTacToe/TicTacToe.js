import React, { useState } from 'react';
import Board from './Board';
import GameOverModal from '../GameOverModal';
import GameStatus from '../GameStatus';

// Helper function can live inside or outside the component
function calculateWinner(board) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  if (board.every(square => square !== null)) {
    return 'Draw';
  }
  return null;
}

const TicTacToe = () => {
    const [board, setBoard] = useState(Array(9).fill(null));
    const [xIsNext, setXIsNext] = useState(true);
    const winner = calculateWinner(board);

    const handleClick = (i) => {
        if (winner || board[i]) {
            return; // Ignore click if game is over or square is taken
        }
        const newBoard = [...board];
        newBoard[i] = xIsNext ? 'X' : 'O';
        setBoard(newBoard);
        setXIsNext(!xIsNext);
    };

    const handleRestart = () => {
        setBoard(Array(9).fill(null));
        setXIsNext(true);
    };

    const players = [
        { name: 'Player 1', role: 'X' },
        { name: 'Player 2', role: 'O' }
    ];

    return (
        <div className="game-container">
            <h3>Tic Tac Toe</h3>
            <GameStatus
                players={players}
                currentTurn={xIsNext ? 'X' : 'O'}
            />
            <Board squares={board} onClick={handleClick} />
            <GameOverModal winner={winner} onRestart={handleRestart} />
        </div>
    );
};

export default TicTacToe;