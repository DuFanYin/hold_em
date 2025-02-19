import React, { useState, useEffect } from 'react';
import socketIOClient from 'socket.io-client';

const SOCKET_URL = 'http://localhost:5000';  // Update with your server's URL

const App = () => {
    const [gameState, setGameState] = useState(null);
    const [playerAction, setPlayerAction] = useState('');

    useEffect(() => {
        const socket = socketIOClient(SOCKET_URL);

        socket.on('updateGameState', (data) => {
            setGameState(data);
        });

        return () => socket.disconnect();
    }, []);

    const handleAction = (action) => {
        setPlayerAction(action);
        // Emit player action to the backend
        socket.emit('playerAction', { action, amount: 10 });
    };

    return (
        <div>
            <h1>Texas Hold'em</h1>
            <div>
                {gameState?.players.map((player) => (
                    <div key={player.id}>{player.name}: {player.chips} chips</div>
                ))}
            </div>
            <button onClick={() => handleAction('CALL')}>Call</button>
            <button onClick={() => handleAction('RAISE')}>Raise</button>
            <button onClick={() => handleAction('FOLD')}>Fold</button>
        </div>
    );
};

export default App;