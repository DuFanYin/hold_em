import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import { useParams } from "react-router-dom";

import Player from "../components/Player"; // Component to display player info
import Table from "../components/Table"; // Component to display player info

const socket = io("http://localhost:8080"); // Replace with your server URL


const GamePage = () => {
  const [gameState, setGameState] = useState(null);
  const { roomId, playerName } = useParams();

  const [isUserTurn, setIsUserTurn] = useState(false);
  // const [bet, setbet] = useState(0);
  const [raiseAmount, setRaiseAmount] = useState("");

  useEffect(() => {
    socket.emit("joinRoom", { roomId, playerName });

    console.log({ roomId, playerName });

    socket.on("updateGameState", (data) => {
      setGameState(data.table);
      setIsUserTurn(false); // Reset turn state
    });

    socket.on("playerTurn", () => {
      setIsUserTurn(true);
      // setbet(bet); // Uncomment if needed in the future
    });

    return () => {
      socket.off("updateGameState");
      socket.off("playerTurn");
    };
  }, []);

  if (!gameState) return <p>Loading game...</p>;

  const playerAction = (action, amount = 0) => {
    socket.emit("playerAction", { roomId, action, amount });
    setIsUserTurn(false); // Prevent multiple actions
  };

  const startGame = () => {
    socket.emit("startGame", { roomId });
  };

  
  return (
    <div className="p-4">
      {gameState && (
        <>
          <Table table={gameState} />
          <div className="grid grid-cols-2 gap-4 mt-4">
            {gameState.players.map((player, index) => (
              <Player key={player.socketId} player={player} isDealer={index === gameState.dealerPosition} />
            ))}
          </div>
          <div className="mt-4 flex flex-col items-center">
            <h3 className="text-lg font-semibold">Your Turn: {isUserTurn ? "Yes" : "No"}</h3>
            <div className="flex gap-2 mt-2">
              <button
                className={`px-4 py-2 rounded ${isUserTurn ? "bg-blue-500 text-white" : "bg-gray-400 text-gray-700 cursor-not-allowed"}`}
                disabled={!isUserTurn}
                onClick={() => playerAction("check")}
              >
                Check
              </button>
              <button
                className={`px-4 py-2 rounded ${isUserTurn ? "bg-green-500 text-white" : "bg-gray-400 text-gray-700 cursor-not-allowed"}`}
                disabled={!isUserTurn}
                onClick={() => playerAction("call")}
              >
                Call 
              </button>
              <input
                type="number"
                className="border p-1 rounded"
                value={raiseAmount}
                onChange={(e) => setRaiseAmount(e.target.value)}
                disabled={!isUserTurn}
              />
              <button
                className={`px-4 py-2 rounded ${isUserTurn ? "bg-yellow-500 text-white" : "bg-gray-400 text-gray-700 cursor-not-allowed"}`}
                disabled={!isUserTurn || !raiseAmount}
                onClick={() => playerAction("raise", parseInt(raiseAmount))}
              >
                Raise
              </button>
              <button
                className={`px-4 py-2 rounded ${isUserTurn ? "bg-red-500 text-white" : "bg-gray-400 text-gray-700 cursor-not-allowed"}`}
                disabled={!isUserTurn}
                onClick={() => playerAction("fold")}
              >
                Fold
              </button>
            </div>
          </div>

          <button onClick={startGame}>Start Game</button>
        </>
      )}
    </div>
  );
};

export default GamePage;