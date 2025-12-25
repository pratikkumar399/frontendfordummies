"use client"

import React, { useState } from 'react'
import ImageCarouselComponent from './component/ImageCarouselComponent';

const imageUrls = [
    "https://placehold.co/800x600/14b8a6/ffffff/png?text=image+1+teal",
    "https://placehold.co/800x600/f43f5e/ffffff/png?text=image+2+red",
    "https://placehold.co/800x600/6366f1/ffffff/png?text=image+3+indigo",
    "https://placehold.co/800x600/22d3ee/000000/png?text=image+4+cyan",
    "https://placehold.co/800x600/f59e42/000000/png?text=image+5+orange"
]

const ImageCarouselHome = () => {

    const [currentIndex, setCurrentIndex] = useState(0);
    const total = imageUrls.length;


    function handlePrevClick() {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + total) % total);
    }

    function handleNextClick() {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % total);
    }

    return (
        <div>Image Carousel
            <ImageCarouselComponent images={imageUrls} onPrev={handlePrevClick} onNext={handleNextClick} currentIndex={currentIndex} />
        </div>
    )
}

export default ImageCarouselHome;