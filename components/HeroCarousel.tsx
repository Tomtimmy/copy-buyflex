import React, { useState, useEffect, useCallback } from 'react';

const slides = [
  {
    image: 'https://picsum.photos/seed/slide1/1600/600',
    title: 'Experience True Sound',
    subtitle: 'With our new FreePods Pro. Active Noise Cancellation for immersive audio.',
    buttonText: 'Shop Earbuds',
    category: 'Earbuds',
  },
  {
    image: 'https://picsum.photos/seed/slide2/1600/600',
    title: 'Power On The Go',
    subtitle: 'Never run out of battery with the Powerank 20K. Fast, reliable, and massive capacity.',
    buttonText: 'Shop Power Banks',
    category: 'Power Banks',
  },
  {
    image: 'https://picsum.photos/seed/slide3/1600/600',
    title: 'Smart, Sleek, Stylish',
    subtitle: 'Track your fitness and stay connected with the WatchFit 2. The ultimate smartwatch.',
    buttonText: 'Shop Watches',
    category: 'Smart Watches',
  },
];

interface HeroCarouselProps {
  onCategorySelect: (category: string) => void;
}

export const HeroCarousel: React.FC<HeroCarouselProps> = ({ onCategorySelect }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
  }, []);

  useEffect(() => {
    const slideInterval = setInterval(nextSlide, 5000); // Change slide every 5 seconds
    return () => clearInterval(slideInterval);
  }, [nextSlide]);

  const goToSlide = (slideIndex: number) => {
    setCurrentIndex(slideIndex);
  };

  return (
    <section className="relative w-full h-[60vh] max-h-[600px] overflow-hidden mb-12">
      <div
        className="relative h-full w-full flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div key={index} className="relative h-full w-full flex-shrink-0">
            <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="text-center text-white p-4 max-w-2xl">
                {currentIndex === index && (
                  <>
                    <h1 
                      className="text-4xl md:text-6xl font-extrabold leading-tight"
                      style={{ animation: 'textFadeInUp 0.8s ease-out forwards' }}
                    >
                      {slide.title}
                    </h1>
                    <p 
                      className="mt-4 text-lg text-gray-200"
                      style={{ animation: 'textFadeInUp 0.8s 0.2s ease-out forwards', opacity: 0 }}
                    >
                      {slide.subtitle}
                    </p>
                    <button 
                      onClick={() => onCategorySelect(slide.category)}
                      className="mt-8 bg-green-500 text-white font-bold py-3 px-8 rounded-full hover:bg-green-600 transition-transform transform hover:scale-105 duration-300"
                      style={{ animation: 'textFadeInUp 0.8s 0.4s ease-out forwards', opacity: 0 }}
                    >
                      {slide.buttonText}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex space-x-2">
        {slides.map((_, slideIndex) => (
          <button
            key={slideIndex}
            onClick={() => goToSlide(slideIndex)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              currentIndex === slideIndex ? 'bg-green-500 scale-125' : 'bg-white/50 hover:bg-white'
            }`}
            aria-label={`Go to slide ${slideIndex + 1}`}
          />
        ))}
      </div>
    </section>
  );
};