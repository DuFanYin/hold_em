const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const GameStateManager = require('./gameStateManager');
const AIPlayer = require('./aiPlayer');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const gameManager = new GameStateManager();

io.on('connection', (socket) => {
    console.log('New player connected: ', socket.id);

    socket.on('joinGame', (gameId, playerId) => {
        // Add player to game
        gameManager.players.push({ id: playerId, name: `Player ${playerId}`, chips: 1000 });
    });

    socket.on('playerAction', ({ playerId, action, amount }) => {
        gameManager.processAction(playerId, action, amount);

        // AI makes its move (for empty spots)
        AIPlayer.makeMove(gameManager);

        // Send updated game state to all players
        io.emit('updateGameState', gameManager.updateGameState());
    });

    socket.on('disconnect', () => {
        console.log('Player disconnected: ', socket.id);
    });
});

server.listen(5000, () => {
    console.log('Server running on port 5000');
});