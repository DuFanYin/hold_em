// src/components/Table.jsx
import React from 'react';
import Card from './Card';

const Table = ({ table }) => {
  return (
    <div className="p-4 border rounded bg-green-300">
      <h2>Table</h2>
      <h3>Current round: {table.roundPhase}</h3>
      <h3>bet amount: {table.betAmount}</h3>
      <p>Pot: {table.pot}</p>
      <h3>Community Cards</h3>
      <div className="flex gap-2">
        {table.communityCards.map((card, index) => (
          <Card key={index} card={card} />
        ))}
      </div>
    </div>
  );
};

export default Table;