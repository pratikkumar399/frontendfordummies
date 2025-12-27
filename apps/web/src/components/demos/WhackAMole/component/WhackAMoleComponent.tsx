"use client"

import React from 'react'
import '../style.css'

const WhackAMoleComponent = ({ onWhack, activeIndex }: { onWhack: (args: number) => void, activeIndex: number | null }) => {

    return (
        <div className="whack-a-mole">
            <div className="grid">
                {Array.from({ length: 9 }).map((_, index) => (
                    <div
                        key={index}
                        className="hole"
                        onClick={() => onWhack(index)}
                    >
                        {activeIndex === index && "🐹"}
                    </div>
                ))}
            </div>

        </div>
    )
}

export default WhackAMoleComponent

