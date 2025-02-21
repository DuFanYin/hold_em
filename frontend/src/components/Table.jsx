// src/components/Table.jsx
import React from 'react';
import Card from './Card';

function Table({ communityCards }) {
  return (
    <div className="table">
      <h2>Community Cards</h2>
      <div className="community-cards">
        {communityCards.map((card, index) => (
          <Card key={index} rank={card.rank} suit={card.suit} />
        ))}
      </div>
    </div>
  );
}

export default Table;