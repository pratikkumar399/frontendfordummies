"use client"

import React from 'react'
import '../style.css'

const getDotPositions = (value: number): string[] => {
    const positions: Record<number, string[]> = {
        1: ['center'],
        2: ['top-left', 'bottom-right'],
        3: ['top-left', 'center', 'bottom-right'],
        4: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
        5: ['top-left', 'top-right', 'center', 'bottom-left', 'bottom-right'],
        6: ['top-left', 'top-right', 'middle-left', 'middle-right', 'bottom-left', 'bottom-right']
    };
    return positions[value] || [];
};

const DiceRollerComponent = ({ results }: { results: number[] }) => {
    return (
        <div className="dice-roller">
            {results.map((result, index) => {
                const dotPositions = getDotPositions(result);
                return (
                    <div key={index} className="dice-face">
                        {dotPositions.map((position, dotIndex) => (
                            <span key={dotIndex} className={`dot ${position}`}></span>
                        ))}
                    </div>
                );
            })}
        </div>
    )
}

export default DiceRollerComponent

