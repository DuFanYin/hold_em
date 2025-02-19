// server/server.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
      origin: 'http://localhost:3000', // The URL of your frontend app
      methods: ['GET', 'POST'],
      allowedHeaders: ['Content-Type'],
    },
  });

// Initial game state
let gameState = {
  players: ['Player 1', 'Player 2'],  // Example players
  gameStatus: 'waiting',  // Could be 'waiting', 'in-progress', etc.
  currentTurn: null,
  actions: []  // List of actions
};

app.get('/', (req, res) => {
  res.send('Server is running');
});

// Handling player actions and updating game state
io.on('connection', (socket) => {
  console.log('A user connected');  // This will only log once the frontend connects
  
  // Send current game state to the newly connected player
  socket.emit('gameStateUpdate', gameState);
  
  // Listen for player actions from the frontend
  socket.on('playerAction', (action) => {
    console.log('Player action received:', action);
    
    // Update the game state based on the action
    gameState.actions.push(action);  // Example: track player actions
    gameState.currentTurn = gameState.players[gameState.actions.length % gameState.players.length];
    
    // Update game status
    if (gameState.actions.length >= 5) {
      gameState.gameStatus = 'in-progress'; // Example: Game starts after 5 actions
    }

    // Broadcast updated game state to all connected players
    io.emit('gameStateUpdate', gameState);
  });
  
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Server listens on port 8080
server.listen(8080, () => {
  console.log('Server listening on port 8080');
});