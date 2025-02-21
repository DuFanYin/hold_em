// src/socket.js
import { io } from "socket.io-client";

// Connect to the backend socket server
const socket = io('http://localhost:8080', {
      transports: ['polling', 'websocket'], // Use both polling and websocket transports
    });

export default socket;