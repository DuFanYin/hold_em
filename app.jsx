import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

function PokerGame() {
    const [gameState, setGameState] = useState({});
    const [playerName, setPlayerName] = useState("");
    const [roomId, setRoomId] = useState("");
    const [validMoves, setValidMoves] = useState([]);
    const [isMyTurn, setIsMyTurn] = useState(false);

    useEffect(() => {
        // Listen for game state updates
        socket.on("updateGameState", (state) => {
            setGameState(state);
            setIsMyTurn(false);
            setValidMoves([]);
        });

        // Listen for turn signal
        socket.on("yourTurn", ({ validMoves }) => {
            setIsMyTurn(true);
            setValidMoves(validMoves);
        });

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

    return (
        <div>
            <h1>Poker Game</h1>
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

            <h2>Game State:</h2>
            <pre>{JSON.stringify(gameState, null, 2)}</pre>

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