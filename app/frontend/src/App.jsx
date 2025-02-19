// src/App.jsx
import React, { useState, useEffect } from 'react';
import WelcomePage from './pages/WelcomePage';
import PlayerList from './pages/PlayerList';
import socket from './utilities/socket';

function App() {
  const [players, setPlayers] = useState([]);
  const [gameState, setGameState] = useState(null);
  const [page, setPage] = useState('welcome'); // 'welcome' or 'game'

  useEffect(() => {
    // Listen for game state updates from the backend
    socket.on('gameStateUpdate', (newGameState) => {
      setGameState(newGameState);
    });

    return () => {
      socket.off('gameStateUpdate'); // Cleanup listener on unmount
    };
  }, []);

  const handlePlayerAction = (action) => {
    socket.emit('playerAction', action);  // Send action to backend
  };

  // This will handle when the game starts, initializing players and game state
  const startGame = (numPlayers) => {
    // Create dummy player data for the demo (You'd get this from the backend)
    const dummyPlayers = Array.from({ length: numPlayers }, (_, index) => ({
      name: `Player ${index + 1}`,
      cards: [
        '10_H', // 10 of Hearts
        'J_C'    // Jack of Clubs
      ]
    }));

    // Set dummy community cards (This would come from the backend too)
    const communityCards = [
      'A_H', // Ace of Hearts
      'Q_S', // Queen of Spades
      '7_D', // 7 of Diamonds
      '3_C', // 3 of Clubs
      '9_H'  // 9 of Hearts
    ];

    setPlayers(dummyPlayers);
    setGameState({
      gameStatus: 'waiting',
      currentTurn: 'Player 1',
      actions: [],
      communityCards: communityCards
    });

    setPage('game');
  };

  return (
    <div className="App">
      {page === 'welcome' ? (
        <WelcomePage onStartGame={startGame} />
      ) : (
        <PlayerList
          players={players}
          gameState={gameState}
          onPlayerAction={handlePlayerAction}
        />
      )}
    </div>
  );
}

export default App;