import React ,{/* useState, useEffect */} from 'react';
import GameLobby from './components/GameLobby.js';
import ContactMe from './components/ContactMe.js';
import { BrowserRouter as Router, Route, Routes, Link/*, useNavigate*/} from 'react-router-dom';
import TicTacToe from './components/Games/TicTacToe/TicTacToe.js';
import HigherLower from './components/Games/HigherLower/HigherLower.js';
import ConnectFour from './components/Games/ConnectFour/ConnectFour.js';
import SnakeGame from './components/Games/Snake/SnakeGame.js';
import LudoSetup from './components/Games/Ludo/LudoSetup.js';
import LudoGame from './components/Games/Ludo/LudoGame.js';
import MemoryMatch from './components/Games/MemoryMatch/MemoryMatch.js';
import './App.css';

function App() {
  
  return (
    <Router>
      <div className="App">
        <nav>
            <Link to="/game">Game Lobby</Link> | <Link to="/contactme">Contact Me</Link>
        </nav>
        
        <Routes>
          <Route path="/" exact element={<GameLobby />} />
          <Route path="/game" element={<GameLobby />} />
          <Route path="/contactme" element={<ContactMe/>}/>
          <Route path="/game/tic-tac-toe" element={<TicTacToe /> } />
          <Route path="/game/higher-or-lower" element={<HigherLower />}/>
          <Route path="/game/connect-four" element={<ConnectFour />} />
          <Route path="/game/snake" element={<SnakeGame />} />
          <Route path="/game/ludo" element={<LudoGame />} />
          <Route path="/game/ludo/setup" element={<LudoSetup />} />
          <Route path="/game/memory-match" element={<MemoryMatch />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;