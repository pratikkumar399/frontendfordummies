"use client";

import React, { useEffect, useRef, useState } from "react";
import "./style.css";
import WhackAMoleComponent from "./component/WhackAMoleComponent";

const TOTAL_TIME = 15;
const MOLE_LIFETIME = 1500;
const GRID_SIZE = 9;

const getRandomIndex = () => Math.floor(Math.random() * GRID_SIZE);

const WhackAMole = () => {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
    const [isPlaying, setIsPlaying] = useState(false);

    const moleTimeoutRef = useRef<number | null>(null);
    const gameTimerRef = useRef<number | null>(null);
    const moleHitRef = useRef<boolean>(false);

    const spawnMole = () => {
        moleHitRef.current = false;
        const index = getRandomIndex();
        setActiveIndex(index);

        moleTimeoutRef.current = window.setTimeout(() => {
            setActiveIndex(null);

            if (isPlaying) {
                spawnMole();
            }
        }, MOLE_LIFETIME);
    };

    const startGame = () => {
        stopGame();

        setScore(0);
        setTimeLeft(TOTAL_TIME);
        setIsPlaying(true);

        spawnMole();

        gameTimerRef.current = window.setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    stopGame();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const stopGame = () => {
        if (moleTimeoutRef.current) clearTimeout(moleTimeoutRef.current);
        if (gameTimerRef.current) clearInterval(gameTimerRef.current);

        setActiveIndex(null);
        setIsPlaying(false);
    };

    const handleWhack = (index: number) => {
        if (!isPlaying || index !== activeIndex) return;
        if (moleHitRef.current) return;

        moleHitRef.current = true;

        setScore(prev => prev + 1);

        if (moleTimeoutRef.current) {
            clearTimeout(moleTimeoutRef.current);
        }

        setActiveIndex(null);
        spawnMole();
    };

    useEffect(() => {
        return () => {
            if (moleTimeoutRef.current) clearTimeout(moleTimeoutRef.current);
            if (gameTimerRef.current) clearInterval(gameTimerRef.current);
        };
    }, []);

    return (
        <div className="whack-a-mole-container">
            <div className="game-info">
                <div className="score">Score: {score}</div>

                {!isPlaying && (
                    <div className="button">
                        <button onClick={startGame}>Lets play</button>
                    </div>
                )}

                <div className="time">Time: {timeLeft}</div>
            </div>

            <div className="game-board">
                <WhackAMoleComponent
                    activeIndex={activeIndex}
                    onWhack={handleWhack}
                />
            </div>
        </div>
    );
};

export default WhackAMole;
