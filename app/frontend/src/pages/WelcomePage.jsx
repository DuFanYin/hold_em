// src/components/WelcomePage.jsx
import React, { useState } from 'react';

function WelcomePage({ onStartGame }) {
  const [numPlayers, setNumPlayers] = useState(2);

  const handleStartGame = () => {
    onStartGame(numPlayers);
  };

  return (
    <div>
      <h1>Welcome to the Game!</h1>
      <div>
        <label>Choose number of players: </label>
        <input
          type="number"
          value={numPlayers}
          onChange={(e) => setNumPlayers(parseInt(e.target.value))}
          min="2"
          max="10"
        />
      </div>
      <button onClick={handleStartGame}>Start Game</button>
    </div>
  );
}

export default WelcomePage;