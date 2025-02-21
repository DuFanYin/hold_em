import React, { useState, useEffect } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:3000"); // Replace with your server URL

const Card = ({ card }) => (
  <div className="border p-2 rounded bg-white shadow-md">
    {card === "?" ? "?" : `${card.rank} ${card.suit}`}
  </div>
);

const Player = ({ player, isDealer }) => (
  <div className={`p-4 border rounded ${player.hasFolded ? "bg-gray-300" : "bg-gray-200"}`}>
    <h3>
      {player.name} {isDealer && "(Dealer)"}
    </h3>
    <p>Chips: {player.chips}</p>
    <p>Bet: {player.placedChips}</p>
    <p>Status: {player.hasFolded ? "Folded" : "Active"}</p>
    <div className="flex gap-2 mb-2">
      {player.hand.map((card, index) => (
        <Card key={index} card={card} />
      ))}
    </div>
  </div>
);

const Table = ({ table }) => (
  <div className="p-4 border rounded bg-green-300">
    <h2>Table</h2>
    <p>Pot: {table.pot}</p>
    <h3>Community Cards</h3>
    <div className="flex gap-2">
      {table.communityCards.map((card, index) => (
        <Card key={index} card={card} />
      ))}
    </div>
  </div>
);

const GamePage = ({ roomId, userSocketId }) => {
  const [gameState, setGameState] = useState(null);
  const [isUserTurn, setIsUserTurn] = useState(false);
  const [amountToCall, setAmountToCall] = useState(0);
  const [raiseAmount, setRaiseAmount] = useState("");

  useEffect(() => {
    socket.on("updateGameState", (data) => {
      setGameState(data.table);
      setIsUserTurn(false); // Reset turn state
    });

    socket.on("playerTurn", ({ player, amountToCall }) => {
      if (player.socketId === userSocketId) {
        setIsUserTurn(true);
        setAmountToCall(amountToCall);
      } else {
        setIsUserTurn(false);
      }
    });

    return () => {
      socket.off("updateGameState");
      socket.off("playerTurn");
    };
  }, [userSocketId]);

  const handleAction = (action, amount = 0) => {
    socket.emit("playerAction", { roomId, action, amount });
    setIsUserTurn(false); // Prevent multiple actions
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
                onClick={() => handleAction("check")}
              >
                Check
              </button>
              <button
                className={`px-4 py-2 rounded ${isUserTurn ? "bg-green-500 text-white" : "bg-gray-400 text-gray-700 cursor-not-allowed"}`}
                disabled={!isUserTurn}
                onClick={() => handleAction("call", amountToCall)}
              >
                Call ({amountToCall})
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
                onClick={() => handleAction("raise", parseInt(raiseAmount))}
              >
                Raise
              </button>
              <button
                className={`px-4 py-2 rounded ${isUserTurn ? "bg-red-500 text-white" : "bg-gray-400 text-gray-700 cursor-not-allowed"}`}
                disabled={!isUserTurn}
                onClick={() => handleAction("fold")}
              >
                Fold
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default GamePage;