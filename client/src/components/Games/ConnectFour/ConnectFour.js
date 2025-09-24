import React, { useState } from 'react';
import GameOverModal from '../GameOverModal';
import GameStatus from '../GameStatus';
import './ConnectFour.css';

function checkConnectFourWinner(board) {
    const rows = 6;
    const cols = 7;
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (board[r][c]) {
                if (c + 3 < cols && board[r][c] === board[r][c + 1] && board[r][c] === board[r][c + 2] && board[r][c] === board[r][c + 3]) return board[r][c];
                if (r + 3 < rows && board[r][c] === board[r + 1][c] && board[r][c] === board[r + 2][c] && board[r][c] === board[r + 3][c]) return board[r][c];
                if (r + 3 < rows && c + 3 < cols && board[r][c] === board[r + 1][c + 1] && board[r][c] === board[r + 2][c + 2] && board[r][c] === board[r + 3][c + 3]) return board[r][c];
                if (r - 3 >= 0 && c + 3 < cols && board[r][c] === board[r - 1][c + 1] && board[r][c] === board[r - 2][c + 2] && board[r][c] === board[r - 3][c + 3]) return board[r][c];
            }
        }
    }
}

const ConnectFour = () => {
    const [board, setBoard] = useState(Array(6).fill(null).map(() => Array(7).fill(null)));
    const [isRedNext, setIsRedNext] = useState(true);
    const winner = checkConnectFourWinner(board);

    const handleColumnClick = (colIndex) => {
        if (winner) return;

        const newBoard = board.map(row => [...row]);
        let rowPlaced = -1;

        for (let r = 5; r >= 0; r--) {
            if (!newBoard[r][colIndex]) {
                newBoard[r][colIndex] = isRedNext ? 'R' : 'Y';
                rowPlaced = r;
                break;
            }
        }

        if (rowPlaced !== -1) {
            setBoard(newBoard);
            setIsRedNext(!isRedNext);
        }
    };

    const handleRestart = () => {
        setBoard(Array(6).fill(null).map(() => Array(7).fill(null)));
        setIsRedNext(true);
    };

    const players = [
        { name: 'Red', role: 'R' },
        { name: 'Yellow', role: 'Y' }
    ];

    const winnerName = winner ? (winner === 'Draw' ? 'Draw' : (winner === 'R' ? 'Red' : 'Yellow')) : null;

    return (
        <div className="game-container">
            <h3>Connect Four</h3>
            <GameStatus
                players={players}
                currentTurn={isRedNext ? 'R' : 'Y'}
            />
            <div className="connect-four-board">
                {board.map((row, rowIndex) => (
                    <div key={rowIndex} className="board-row">
                        {row.map((cell, colIndex) => (
                            <div key={colIndex} className="board-col" onClick={() => handleColumnClick(colIndex)}>
                                <div className={`piece ${cell || ''}`}></div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
            <GameOverModal winner={winnerName} onRestart={handleRestart} />
        </div>
    );
};

export default ConnectFour;