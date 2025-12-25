import "../style.css"

const ImageCarouselComponent = ({
    images,
    onPrev,
    onNext,
    currentIndex
}: {
    images: Array<string>,
    onPrev: () => void,
    onNext: () => void,
    currentIndex: number
}) => {
    return (
        <div className="image-container">
            <button onClick={onPrev}>{" <- Left"}</button>

            <div className="viewport">
                <div
                    className="track"
                    style={{
                        transform: `translateX(-${(currentIndex * 100) / images.length}%)`,
                        width: `${images.length * 100}%`,
                        borderRadius: '10px'
                    }}
                >
                    {images.map((image, index) => (
                        <img key={index} src={image}
                            style={{
                                width: `${100 / images.length}%`,
                                height: '300px',
                                objectFit: 'contain',
                                borderRadius: '10px'
                            }}
                        />
                    ))}
                </div>
            </div>

            <button onClick={onNext}>{" Right ->"}</button>
        </div>
    )
}

export default ImageCarouselComponent