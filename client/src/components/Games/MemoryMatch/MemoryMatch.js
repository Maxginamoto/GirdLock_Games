import React, { useState, useEffect } from 'react';
import './MemoryMatch.css'; 
import { FaHippo, FaDog, FaCat, FaFrog, FaFish, FaHorse, FaCrow, FaSpider } from 'react-icons/fa';

const ICONS = [
    <FaHippo />, <FaDog />, <FaCat />, <FaFrog />,
    <FaFish />, <FaHorse />, <FaCrow />, <FaSpider />
];

// Function to create and shuffle the deck
const generateShuffledDeck = () => {
    const deck = [...ICONS, ...ICONS].map((icon, index) => ({
        id: index,
        icon: icon,
        isFlipped: false,
        isMatched: false,
    }));
    // Fisher-Yates shuffle algorithm
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
};

const MemoryMatch = () => {
    const [cards, setCards] = useState(generateShuffledDeck());
    const [flippedCards, setFlippedCards] = useState([]);
    const [moves, setMoves] = useState(0);
    const [gameOver, setGameOver] = useState(false);

    useEffect(() => {
        if (flippedCards.length === 2) {
            const [firstCard, secondCard] = flippedCards;
            // Check if the icons have the same type (React components)
            if (firstCard.icon.type === secondCard.icon.type) {
                // It's a match
                setCards(prevCards =>
                    prevCards.map(card =>
                        (card.id === firstCard.id || card.id === secondCard.id)
                            ? { ...card, isMatched: true }
                            : card
                    )
                );
                setFlippedCards([]);
            } else {
                // Not a match, flip them back after a delay
                setTimeout(() => {
                    setCards(prevCards =>
                        prevCards.map(card =>
                            (card.id === firstCard.id || card.id === secondCard.id)
                                ? { ...card, isFlipped: false }
                                : card
                        )
                    );
                    setFlippedCards([]);
                }, 1000); // 1-second delay
            }
        }
    }, [flippedCards]);
    
    useEffect(() => {
        // Check for game over
        const allMatched = cards.every(card => card.isMatched);
        if (allMatched && cards.length > 0) {
            setGameOver(true);
        }
    }, [cards]);

    const handleCardClick = (clickedCard) => {
        if (flippedCards.length === 2 || clickedCard.isFlipped) return;

        setCards(prevCards =>
            prevCards.map(card =>
                card.id === clickedCard.id ? { ...card, isFlipped: true } : card
            )
        );
        setFlippedCards([...flippedCards, clickedCard]);
        setMoves(prev => prev + 1);
    };

    const handleRestart = () => {
        setCards(generateShuffledDeck());
        setFlippedCards([]);
        setMoves(0);
        setGameOver(false);
    };

    return (
        <div className="game-container">
            <h3>Memory Match</h3>
            <p>Moves: {Math.floor(moves / 2)}</p>
            <div className="memory-board">
                {cards.map(card => (
                    <div
                        key={card.id}
                        className={`card-container ${card.isFlipped || card.isMatched ? 'flipped' : ''}`}
                        onClick={() => handleCardClick(card)}
                    >
                        <div className="card-inner">
                            <div className="card-front">?</div>
                            <div className="card-back">{card.icon}</div>
                        </div>
                    </div>
                ))}
            </div>
            {gameOver && (
                <div className="winner-announcement">
                    <h3>You Won!</h3>
                    <p>You completed the game in {Math.floor(moves / 2)} moves.</p>
                    <button onClick={handleRestart} className="btn-grad center">Play Again</button>
                </div>
            )}
        </div>
    );
};

export default MemoryMatch;