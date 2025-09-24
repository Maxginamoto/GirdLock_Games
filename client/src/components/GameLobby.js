import React from 'react';
import { Link } from 'react-router-dom';
import './GameLobby.css'; // Import the new CSS file
import { CgHashtag } from "react-icons/cg"; // Tic Tac Toe Icon
// import { IoGameControllerOutline } from "react-icons/io5"; // Generic Game Icon
import { BsArrowDownUp, BsFillGrid3X3GapFill } from "react-icons/bs"; 
import { GiSandSnake } from "react-icons/gi";
// import { FaChessPawn } from "react-icons/fa";
import { BsQuestionSquareFill } from "react-icons/bs";

const GameLobby = () => {
  return (
    <div>
      <h2>Game Lobby</h2>
      <p>Please select a game to play:</p>
      <div className="game-lobby">

        {/* Tic Tac Toe Card */}
        <Link to="/game/tic-tac-toe" className="game-card">
          <div className="player-count">2P</div> {/* Example player count badge */}
          <CgHashtag className="game-icon" />
          <h3>Tic Tac Toe</h3>
        </Link>

        {/* Connect Four Card */}
        <Link to="/game/connect-four" className="game-card">
          <div className="player-count">2P</div>
          <BsFillGrid3X3GapFill className="game-icon" />
          <h3>Connect Four</h3>
        </Link>

        {/* Higher or Lower Card */}
        <Link to="/game/higher-or-lower" className="game-card">
          <div className="player-count">1P</div>
          <BsArrowDownUp className="game-icon" />
          <h3>Higher or Lower</h3>
        </Link>

        {/* Snake Game Card */}
        <Link to="/game/snake" className="game-card">
          <div className="player-count">1P</div>
          <GiSandSnake className="game-icon" />
          <h3>Snake Game</h3>
        </Link>
        {/* <Link to="/game/ludo/setup" className="game-card">
          <div className="player-count">2-4P</div>
          <FaChessPawn className="game-icon" />
          <h3>Ludo</h3>
        </Link> */}
        <Link to="/game/memory-match" className="game-card">
        <div className='player-count'>1P</div>
          <BsQuestionSquareFill className="game-icon" />
          <h3>Memory Match</h3>
        </Link>

      </div>
    </div>
  );
};

export default GameLobby;