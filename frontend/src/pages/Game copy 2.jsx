import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import Player from "../components/Player"; // Component to display player info

const socket = io("http://localhost:8080");

function Game() {
  const { roomId, playerName } = useParams(); // Get roomId and playerName from URL params

  useEffect(() => {
    // Join the game room when the component mounts
    socket.emit("joinRoom", { roomId, playerName });

    console.log({ roomId, playerName });

    // Listen for game state updates
    socket.on("updateGameState", (updatedGameState) => {
      console.log(updatedGameState); // Log it for reference
    });

    return () => {
      socket.off("updateGameState");
    };
  }, [roomId, playerName]);

  const startGame = () => {
    socket.emit("startGame", { roomId });
  };

  return (
    <div>
      <h1>Game Room: {roomId}</h1>
      <p>Player: {playerName}</p>
      <button onClick={startGame}>Start Game</button>
    </div>
  );
}

export default Game;

