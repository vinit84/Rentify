import React, { useEffect, useRef, useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import './Carousel.css'; // Import the CSS file for custom styles

const Carousel = ({ images }) => {
  const trackRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const track = trackRef.current;
    const slides = Array.from(track.children);
    if (slides.length === 0) return; // Add this check

    const slideWidth = slides[0].getBoundingClientRect().width;

    slides.forEach((slide, index) => {
      slide.style.left = slideWidth * index + 'px';
    });
  }, [images]);

  const moveToSlide = (targetIndex) => {
    const track = trackRef.current;
    const slides = Array.from(track.children);
    const currentSlide = track.querySelector('.current-slide');
    const targetSlide = slides[targetIndex];

    track.style.transform = 'translateX(-' + targetSlide.style.left + ')';
    currentSlide.classList.remove('current-slide');
    targetSlide.classList.add('current-slide');
    setCurrentIndex(targetIndex);
  };

  const handleNext = () => {
    const nextIndex = currentIndex + 1;
    if (nextIndex < images.length) {
      moveToSlide(nextIndex);
    }
  };

  const handlePrev = () => {
    const prevIndex = currentIndex - 1;
    if (prevIndex >= 0) {
      moveToSlide(prevIndex);
    }
  };

  const handleDotClick = (index) => {
    moveToSlide(index);
  };

  const handlers = useSwipeable({
    onSwipedLeft: () => handleNext(),
    onSwipedRight: () => handlePrev(),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true
  });

  return (
    <div className="relative w-72 h-40 mx-auto mb-5" {...handlers}>
      <div className="relative h-full w-full overflow-hidden rounded-2xl bg-gray-200">
        <ul ref={trackRef} className="absolute top-0 left-0 h-full w-full transition-transform duration-300 ease-in-out">
          {images.map((image, index) => (
            <li key={index} className={`absolute top-0 bottom-0 w-full ${index === 0 ? 'current-slide' : ''}`}>
              <img src={image} alt={`Slide ${index}`} className="w-full h-full rounded-2xl object-cover" />
            </li>
          ))}
        </ul>
      </div>
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex justify-center py-2 gap-2">
        {images.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full ${index === currentIndex ? 'bg-green-500' : 'bg-white'}`}
            onClick={() => handleDotClick(index)}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default Carousel;