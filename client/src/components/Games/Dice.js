// client/src/components/Dice.js
import React from 'react';
import './Dice.css';

const Dice = ({ value, isRolling, onRoll }) => {
    return (
        <div className="dice-container" onClick={onRoll}>
            <div className={`dice ${isRolling ? 'rolling' : ''}`} data-face={value || 1}>
                <div className="face front"></div>
                <div className="face back"></div>
                <div className="face top"></div>
                <div className="face bottom"></div>
                <div className="face right"></div>
                <div className="face left"></div>
            </div>
        </div>
    );
};

export default Dice;