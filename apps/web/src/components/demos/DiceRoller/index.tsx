"use client"

import React, { useState } from 'react'
import DiceRollerComponent from './component/DiceRollerComponent'
import './style.css'


function rollDice(count: number) {
    return Array.from({ length: count }, () => Math.floor(Math.random() * 6) + 1);
}



const DiceRoller = () => {
    // TODO: Implement dice roller logic
    const [numberOfDice, setNumberOfDice] = useState<string>('');
    const [results, setResults] = useState<number[]>([]);

    function handleRollDice() {
        const count = Number(numberOfDice);
        if (isNaN(count) || count < 1 || count > 12) {
            return;
        }
        const rolled = rollDice(count);
        setResults(rolled);
    }

    return (
        <div className="dice-roller-container">
            <div className="dice-roller-input">
                <input
                    type="number"
                    min={1}
                    placeholder='Enter the number of dice to roll'
                    max={12}
                    value={numberOfDice}
                    onChange={(e) => setNumberOfDice(e.target.value)}
                />
                <button onClick={handleRollDice}>Roll Dice</button>
            </div>
            {results.length > 0 && <DiceRollerComponent results={results} />}
        </div>
    )
}

export default DiceRoller

