import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import Player from "../components/Player"; // Component to display player info

const socket = io("http://localhost:8080");

function Game() {
  const { roomId, playerName } = useParams(); // Get roomId and playerName from URL params
  const [gameState, setGameState] = useState(null);
  const [action, setAction] = useState(""); // Track the current player's action

  useEffect(() => {
    // Join the game room when the component mounts
    socket.emit("joinRoom", { roomId, playerName });

    // Listen for game state updates
    socket.on("updateGameState", (updatedGameState) => {
      setGameState(updatedGameState);
    });

    // Clean up when the component unmounts
    return () => {
      socket.off("updateGameState");
    };
  }, [roomId, playerName]);

  const handleAction = (action) => {
    if (!gameState) return;

    // Send the player's action to the server
    socket.emit("playerAction", { roomId, action });

    // Reset action after sending it
    setAction("");
  };

  const renderPlayers = () => {
    if (!gameState) return null;

    return gameState.room.table.players.map((player) => (
      <Player key={player.socketId} player={player} handleAction={handleAction} />
    ));
  };

  return (
    <div className="game p-4 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-4">
        Poker Game - Room: {roomId}
      </h1>
      <p className="text-xl text-center mb-6">Welcome, {playerName}!</p>

      {/* Render the players */}
      <div className="players grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
        {renderPlayers()}
      </div>

      {/* Actions (Bet, Fold, etc.) */}
      <div className="actions flex justify-center space-x-4 mb-6">
        <button
          onClick={() => handleAction("bet")}
          className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300"
        >
          Bet
        </button>
        <button
          onClick={() => handleAction("fold")}
          className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300"
        >
          Fold
        </button>
      </div>

      {/* Display the current action */}
      <div className="current-action text-center mb-6">
        <p className="text-xl text-gray-700">Current Action: {action}</p>
      </div>

      {/* Display the table and pot */}
      <div className="table-info text-center">
        <p className="text-lg text-gray-800">Pot: {gameState ? gameState.room.pot : 0}</p>
      </div>
    </div>
  );
}

export default Game;