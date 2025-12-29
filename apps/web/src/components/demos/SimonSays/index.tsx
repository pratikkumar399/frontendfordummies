"use client";

import React, { useEffect, useRef, useState } from "react";
import "./style.css";

const COLORS = ["green", "red", "yellow", "blue", "purple", "orange", "pink", "brown", "gray"];

const getRandomColor = () =>
    COLORS[Math.floor(Math.random() * COLORS.length)];

const SimonSays = () => {
    const [sequence, setSequence] = useState<string[]>([]);
    const [userSequence, setUserSequence] = useState<string[]>([]);
    const [activeColor, setActiveColor] = useState<string | null>(null);
    const [isUserTurn, setIsUserTurn] = useState(false);
    const [level, setLevel] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);

    const timeoutRef = useRef<number | null>(null);

    const startGame = () => {
        resetGame();
        setIsPlaying(true);
        nextRound([]);
    };

    const resetGame = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setSequence([]);
        setUserSequence([]);
        setActiveColor(null);
        setIsUserTurn(false);
        setLevel(0);
    };

    const nextRound = (prevSequence: string[]) => {
        const next = [...prevSequence, getRandomColor()];
        setSequence(next);
        setLevel(next.length);
        playSequence(next);
    };

    const playSequence = async (seq: string[]) => {
        setIsUserTurn(false);

        for (let i = 0; i < seq.length; i++) {
            await flash(seq[i]);
        }

        setUserSequence([]);
        setIsUserTurn(true);
    };

    const flash = (color: string) => {
        return new Promise<void>((resolve) => {
            setActiveColor(color);

            timeoutRef.current = window.setTimeout(() => {
                setActiveColor(null);

                timeoutRef.current = window.setTimeout(() => {
                    resolve();
                }, 200);
            }, 500);
        });
    };

    const flashUserClick = (color: string) => {
        setActiveColor(color);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = window.setTimeout(() => {
            setActiveColor(null);
        }, 200);
    };

    const handleClick = (color: string) => {
        if (!isUserTurn) return;

        // Flash the clicked pad
        flashUserClick(color);

        const nextInput = [...userSequence, color];
        setUserSequence(nextInput);

        const currentIndex = nextInput.length - 1;

        // wrong input
        if (sequence[currentIndex] !== color) {
            gameOver();
            return;
        }

        // completed round
        if (nextInput.length === sequence.length) {
            setIsUserTurn(false);
            setTimeout(() => {
                nextRound(sequence);
            }, 800);
        }
    };

    const gameOver = () => {
        alert("Game Over");
        resetGame();
        setIsPlaying(false);
    };

    return (
        <div className="simon-container">
            <h2>Simon Says</h2>
            <p>Level: {level}</p>

            {!isPlaying && (
                <button onClick={startGame} className="start-btn">
                    Start Game
                </button>
            )}

            <div className="board">
                {COLORS.map(color => (
                    <div
                        key={color}
                        className={`pad ${color} ${activeColor === color ? "active" : ""
                            }`}
                        onClick={() => handleClick(color)}
                    />
                ))}
            </div>
        </div>
    );
};

export default SimonSays;
