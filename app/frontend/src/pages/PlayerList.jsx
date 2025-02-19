// src/components/PlayerList.jsx
import React from 'react';
import Card from '../components/Card';
import Table from '../components/Table';

function PlayerList({ players, gameState, onPlayerAction }) {
  const handleAction = (player) => {
    // This could be more complex, depending on your game's action logic
    const action = `${player.name} took their turn`;
    onPlayerAction(action); // Send action to backend via socket
  };

  if (!gameState) {
    return <div>Loading game state...</div>;
  }

  return (
    <div className="game-container">
      <h1>Game Status: {gameState.gameStatus}</h1>
      <h2>Current Turn: {gameState.currentTurn}</h2>

      {/* Player List Section */}
      <div className="player-list">
        {players.map((player, index) => (
          <div key={index} className="player">
            <div className="player-info">
              <h3>{player.name}</h3>
              <div className="cards-container">
                {/* Display player cards as images */}
                {player.cards.map((card, cardIndex) => (
                  <Card key={cardIndex} card={card} />
                ))}
              </div>
            </div>
            <button onClick={() => handleAction(player)}>Take Action</button>
          </div>
        ))}
      </div>

      {/* Table with Community Cards */}
      <div className="community-cards">
        <h3>Community Cards:</h3>
        <div className="cards-container">
          {gameState.communityCards && gameState.communityCards.length > 0 ? (
            gameState.communityCards.map((card, index) => (
              <Card key={index} card={card} />
            ))
          ) : (
            <div>No community cards available.</div>
          )}
        </div>
      </div>

      {/* Actions Log */}
      <h3>Actions:</h3>
      <ul>
        {gameState.actions.map((action, index) => (
          <li key={index}>{action}</li>
        ))}
      </ul>
    </div>
  );
}

export default PlayerList;