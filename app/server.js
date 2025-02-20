const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*", methods: ["GET", "POST"] }
});

const games = {}; // Stores game state: { roomId: { players: [], turnIndex: 0, gameState: {} } }

io.on("connection", (socket) => {
    console.log(`Player connected: ${socket.id}`);

    // Player joins a game room
    socket.on("joinGame", ({ roomId, playerName }) => {
        socket.join(roomId);
        
        if (!games[roomId]) {
            games[roomId] = { players: [], turnIndex: 0, gameState: {} };
        }

        games[roomId].players.push({ id: socket.id, name: playerName });

        console.log(`${playerName} joined room ${roomId}`);

        // Notify all players about the updated game state
        io.to(roomId).emit("updateGameState", games[roomId]);

        // If the game has enough players, start the game
        if (games[roomId].players.length >= 2) {
            startNextTurn(roomId);
        }
    });

    // Handle player action
    socket.on("playerAction", ({ roomId, action }) => {
        const game = games[roomId];

        if (!game) return;

        // Identify the current player
        const currentPlayer = game.players[game.turnIndex];

        if (socket.id !== currentPlayer.id) {
            console.log("Not your turn!");
            return;
        }

        console.log(`Player ${currentPlayer.name} performed action: ${action}`);

        // Update game state (skipping validation)
        game.gameState.lastAction = { player: currentPlayer.name, action };

        // Notify all players about the new game state
        io.to(roomId).emit("updateGameState", game);

        // Move to the next player's turn
        game.turnIndex = (game.turnIndex + 1) % game.players.length;
        startNextTurn(roomId);
    });

    // Handle disconnections
    socket.on("disconnect", () => {
        console.log(`Player disconnected: ${socket.id}`);

        for (let roomId in games) {
            games[roomId].players = games[roomId].players.filter(p => p.id !== socket.id);
            io.to(roomId).emit("updateGameState", games[roomId]);
        }
    });
});

// Function to signal the next player
function startNextTurn(roomId) {
    const game = games[roomId];

    if (!game || game.players.length === 0) return;

    const currentPlayer = game.players[game.turnIndex];

    // Define valid moves (e.g., fold, bet, call)
    const validMoves = ["bet", "call", "fold"];

    console.log(`Signaling turn for player: ${currentPlayer.name}`);

    // Notify only the current player that it's their turn
    io.to(currentPlayer.id).emit("yourTurn", { validMoves });
}

server.listen(3000, () => {
    console.log("WebSocket server running on http://localhost:3000");
});