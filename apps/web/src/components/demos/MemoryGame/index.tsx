"use client"

import React, { useState } from 'react'
import MemoryGameComponent from './component/MemoryGameComponent'
import './style.css'

const emojis = [
    '🐵', '🐶', '🦊', '🐱', '🦁', '🐯', '🐴', '🦄',
    '🦓', '🦌', '🐮', '🐷', '🐭', '🐹', '🐻',
    '🐨', '🐼', '🐽', '🐸', '🐰', '🐙',
];

const getShuffledCards = () => {
    const selected = emojis.slice(0, 8);
    const pairs = [...selected, ...selected];


    return pairs.map((item, index) => (
        {
            id: index,
            value: item,
            isFlipped: false,
            isMatched: false
        }
    )).sort(() => Math.random() - .5)
}


const MemoryGame = () => {
    // TODO: Implement memory game logic
    const [cards, setCards] = useState(getShuffledCards());
    const [selectedIndex, setSelectedIndex] = useState<any>([]);
    const [lockBoard, setLockBoard] = useState(false);
    const [moves, setMoves] = useState(0);
    const [gameOver, setGameOver] = useState(false);

    const handleCardClick = (id: number) => {
        if (lockBoard) return;

        const card = cards[id];

        if (card.isFlipped || card.isMatched) return;

        // lets make a new card
        const newCards = [...cards];
        newCards[id] = { ...card, isFlipped: true }; // mark the card as flipped
        setCards(newCards);

        // selected index logic
        const newSelected = [...selectedIndex, id];
        setSelectedIndex(newSelected);

        if (newSelected.length === 2) {
            setMoves(prev => prev + 1)
            checkMatch(newSelected, newCards)
        }

    }



    const checkMatch = (selectedIndexes: any, updatedCard: any[]) => {
        const [first, second] = selectedIndexes;

        // if its a match
        if (updatedCard[first].value === updatedCard[second].value) {
            const matchedCards = [...updatedCard];

            matchedCards[first].isMatched = true;
            matchedCards[second].isMatched = true;

            setCards(matchedCards);
            setSelectedIndex([]);
            checkGameOver(matchedCards);
        }// if not then
        else {
            setLockBoard(true);

            // if the options are wrong, then selected will be reset

            setTimeout(() => {
                const resetCards = [...cards];

                resetCards[first].isFlipped = false;
                resetCards[second].isFlipped = false;

                setSelectedIndex([]);
                setCards(resetCards);
                setLockBoard(false);
            }, 800)
        }
    }

    const checkGameOver = (cardList: any[]) => {
        const allMatched = cardList.every(card => card.isMatched);

        if (allMatched) {
            setGameOver(true);
        }
    }

    const resetGame = () => {
        setCards(getShuffledCards());
        setSelectedIndex([]);
        setMoves(0);
        setGameOver(false);
        setLockBoard(false);
    };


    return (
        <div className="memory-game-container">
            <div className="top">
                <div className="moves">
                    {"No of moves"} : {moves}
                </div>
                {gameOver &&
                    <button onClick={resetGame} >Play Again</button>
                }
            </div>
            <MemoryGameComponent onCardClick={handleCardClick} cards={cards} />
        </div>
    )
}

export default MemoryGame

