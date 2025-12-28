"use client"

import React from 'react'
import '../style.css'

const MemoryGameComponent = (
    { onCardClick, cards }: { onCardClick: (args: any) => void, cards: any[] }) => {
    // TODO: Implement memory game component

    return (
        <div className="memory-game">
            <div className="cards">
                {
                    cards.map((card, index) => (
                        <div
                            className={`card ${card.isMatched ? "matched" : card.isFlipped ? "flipped" : ""}`}
                            key={card.id}
                            onClick={() => onCardClick(index)}
                        >
                            {card.isFlipped || card.isMatched ? card.value : ""}
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default MemoryGameComponent
