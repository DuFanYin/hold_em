// src/components/Cards.jsx
import React from 'react';

// Assuming you have images for each card in your public folder
const cardImages = {
  '2_H': '/cards/2_H.png',
  '3_H': '/cards/3_H.png',
  '4_H': '/cards/4_H.png',
  '5_H': '/cards/5_H.png',
  '6_H': '/cards/6_H.png',
  '7_H': '/cards/7_H.png',
  '8_H': '/cards/8_H.png',
  '9_H': '/cards/9_H.png',
  '10_H': '/cards/10_H.png',
  'J_H': '/cards/J_H.png',
  'Q_H': '/cards/Q_H.png',
  'K_H': '/cards/K_H.png',
  'A_H': '/cards/A_H.png',

  '2_C': '/cards/2_C.png',
  '3_C': '/cards/3_C.png',
  '4_C': '/cards/4_C.png',
  '5_C': '/cards/5_C.png',
  '6_C': '/cards/6_C.png',
  '7_C': '/cards/7_C.png',
  '8_C': '/cards/8_C.png',
  '9_C': '/cards/9_C.png',
  '10_C': '/cards/10_C.png',
  'J_C': '/cards/J_C.png',
  'Q_C': '/cards/Q_C.png',
  'K_C': '/cards/K_C.png',
  'A_C': '/cards/A_C.png',

  '2_D': '/cards/2_D.png',
  '3_D': '/cards/3_D.png',
  '4_D': '/cards/4_D.png',
  '5_D': '/cards/5_D.png',
  '6_D': '/cards/6_D.png',
  '7_D': '/cards/7_D.png',
  '8_D': '/cards/8_D.png',
  '9_D': '/cards/9_D.png',
  '10_D': '/cards/10_D.png',
  'J_D': '/cards/J_D.png',
  'Q_D': '/cards/Q_D.png',
  'K_D': '/cards/K_D.png',
  'A_D': '/cards/A_D.png',

  '2_S': '/cards/2_S.png',
  '3_S': '/cards/3_S.png',
  '4_S': '/cards/4_S.png',
  '5_S': '/cards/5_S.png',
  '6_S': '/cards/6_S.png',
  '7_S': '/cards/7_S.png',
  '8_S': '/cards/8_S.png',
  '9_S': '/cards/9_S.png',
  '10_S': '/cards/10_S.png',
  'J_S': '/cards/J_S.png',
  'Q_S': '/cards/Q_S.png',
  'K_S': '/cards/K_S.png',
  'A_S': '/cards/A_S.png',
};

function Card({ card }) {
    if (!cardImages[card]) {
      return <div>Error: Card image not found.</div>;
    }
  
    return (
      <div className="card">
        <img src={cardImages[card]} alt={card} />
      </div>
    );
  }
  
  export default Card;
  
