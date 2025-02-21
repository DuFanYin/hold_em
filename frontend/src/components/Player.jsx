import React from "react";
import Card from "./Card"; // Import the Card component to render the player's cards

const Player = ({ player }) => {
    const playerBgColor = player.hasFolded ? "bg-gray-300" : "bg-blue-300";
  
    return (
      <div className={`flex items-center p-4 border rounded ${playerBgColor}`}>
        <div className="flex-1"> {/* Player info on the left */}
          <h3 className="font-semibold">{player.name}</h3>
          <h2>{player.position}</h2>
          <p>Chips: {player.chips}</p>
          <p>Bet: {player.placedChips}</p>
        </div>
        
        <div className="flex gap-2"> {/* Cards beside player info */}
          {player.hand.map((card, index) => (
            <Card key={index} card={card} />
          ))}
        </div>
      </div>
    );
  };

export default Player;