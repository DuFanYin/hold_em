import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import Player from './components/Player';

// Update the URL to connect to the correct server on port 8080
const socket = io("http://localhost:8080");

function PokerGame() {
    const [gameState, setGameState] = useState({});
    const [playerName, setPlayerName] = useState("");
    const [roomId, setRoomId] = useState("");
    const [validMoves, setValidMoves] = useState([]);
    const [isMyTurn, setIsMyTurn] = useState(false);
    const [players, setPlayers] = useState([]);

    useEffect(() => {
        // Listen for game state updates
        socket.on("updateGameState", (state) => {
            setGameState(state);
            setPlayers(state.players); // Update the players state from the game state
            setIsMyTurn(false);
            setValidMoves([]);
        });

        // Listen for the "yourTurn" event to update the player's turn
        socket.on("yourTurn", ({ validMoves }) => {
            setIsMyTurn(true);
            setValidMoves(validMoves);
        });

        // Cleanup the socket listeners when the component is unmounted
        return () => {
            socket.off("updateGameState");
            socket.off("yourTurn");
        };
    }, []);

    const joinGame = () => {
        if (playerName && roomId) {
            socket.emit("joinGame", { roomId, playerName });
        }
    };

    const sendAction = (action) => {
        if (isMyTurn) {
            socket.emit("playerAction", { roomId, action });
            setIsMyTurn(false);
        }
    };

    const handleAction = (player) => {
        // Handle player action (e.g., betting, folding)
        console.log(`${player.name} is taking an action.`);
        // Add logic here for player actions
    };

    return (
        <div>
            <h1>Poker Game</h1>

            {/* Input to join the game */}
            <input
                type="text"
                placeholder="Enter Name"
                onChange={(e) => setPlayerName(e.target.value)}
            />
            <input
                type="text"
                placeholder="Enter Room ID"
                onChange={(e) => setRoomId(e.target.value)}
            />
            <button onClick={joinGame}>Join Game</button>

            {/* Game State Display */}
            <h2>Game State:</h2>
            <pre>{JSON.stringify(gameState, null, 2)}</pre>

            {/* Player List Section */}
            <div className="player-list">
                {players.map((player, index) => (
                    <Player key={index} player={player} handleAction={handleAction} />
                ))}
            </div>

            {/* Show action buttons when it's the player's turn */}
            {isMyTurn && (
                <div>
                    <h2>Your Turn</h2>
                    {validMoves.map((move) => (
                        <button key={move} onClick={() => sendAction(move)}>
                            {move}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

export default PokerGame;