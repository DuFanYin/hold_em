import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const [playerName, setPlayerName] = useState("");
  const [roomId, setroomId] = useState("");
  const navigate = useNavigate();

  const joinGame = () => {
    if (playerName && roomId) {
      navigate(`/game/${roomId}/${playerName}`); // Redirect to Game Page
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-sm w-full">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
          Join Poker Game
        </h1>

        <div className="mb-4">
          <label
            htmlFor="playerName"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Player Name
          </label>
          <input
            type="text"
            id="playerName"
            placeholder="Enter your name"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="roomId"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            room ID
          </label>
          <input
            type="text"
            id="roomId"
            placeholder="Enter room ID"
            value={roomId}
            onChange={(e) => setroomId(e.target.value)}
            className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <button
          onClick={joinGame}
          className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Join Game
        </button>
      </div>
    </div>
  );
}

export default Home;