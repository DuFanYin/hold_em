const { Server } = require("socket.io"); // This imports the "Server" class from socket.io
const express = require("express");
const http = require("http");
const Player = require("./src/models/player"); // Import Player class
const Table = require("./src/models/table");   // Import Table class
const GameController = require("./src/controllers/gameControl")

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000', // The URL of your frontend app
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
  },
});

const rooms = {}; // Store game rooms by roomId

// Express & Socket.IO Setup
app.get("/", (req, res) => {
  res.send("Poker Game Server");
});

io.on("connection", (socket) => {
  console.log(`ID ${socket.id} connected`); // Player joined

  socket.on("joinRoom", ({ roomId, playerName }) => {
    if (!rooms[roomId]) {
      rooms[roomId] = new GameController(io, roomId); // Create new game room
    }

    const gameControl = rooms[roomId];
    const player = new Player(playerName);
    player.socketId = socket.id;
    gameControl.addPlayer(player);
    socket.join(roomId);

    console.log(`Player [${playerName}] joined room [${roomId}]`);

    gameControl.broadcastGameState();

    // Start game if enough players have joined
    if (gameControl.table.players.length === 2) {
     // gameControl.startGame();
    }
  });

  socket.on("startGame", ({roomId}) => {
    const gameControl = rooms[roomId];
    gameControl.startGame();
  });

  socket.on("playerAction", ({ roomId, action, amount }) => {
    const gameControl = rooms[roomId];
    if (gameControl[roomId]) {
        gameControl[roomId].handlePlayerAction(action, amount);
    }
  });

  socket.on("disconnect", () => {
    for (const roomId in rooms) {
      const gameControl = rooms[roomId];
      gameControl.removePlayer(socket.id);

      console.log(`ID ${socket.id} disconnected`); 

      if (gameControl.table.players.length === 0) {
        delete rooms[roomId]; // Clean up empty rooms
      }
    }


  });
});

server.listen(8080, () => {
  console.log("WebSocket server running on http://localhost:8080");
});