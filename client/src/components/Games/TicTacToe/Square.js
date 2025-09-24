import React from 'react';
import './Board.js'; // We will create this CSS file next

const Square = ({ value, onClick }) => {
  return (
    <button className="square" onClick={onClick}>
      {value}
    </button>
  );
};

export default Square;