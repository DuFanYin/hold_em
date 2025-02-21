import React from "react";
import Card from "./Card"; // Import the Card component to render the player's cards

function Player({ player, handleAction }) {
    // Set default value for cards in case it is undefined or null
    const cards = player.cards || [];

    return (
        <div className="player">
            {/* Display Player Info */}
            <h3>{player.name}</h3>
            <p>Total Chips: {player.totalChips}</p>
            <p>Chips Placed: {player.chipsPlaced}</p>
            <p>Action: {player.action}</p>

            {/* Cards Display */}
            <div className="player-cards">
                {cards.map((card, index) => (
                    <Card key={index} card={card} />
                ))}
            </div>

            {/* Button to take action (e.g., Bet, Fold, etc.) */}
            <button onClick={() => handleAction(player)}>Take Action</button>
        </div>
    );
}

export default Player;