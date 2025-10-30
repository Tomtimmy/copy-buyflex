import React, { useState, useEffect, useCallback } from 'react';
import { Review } from '../types';

interface Testimonial extends Review {
    productName: string;
}

interface TestimonialsProps {
  reviews: Testimonial[];
}

const StarIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.007z" clipRule="evenodd" />
    </svg>
);

export const Testimonials: React.FC<TestimonialsProps> = ({ reviews }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextReview = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % reviews.length);
  }, [reviews.length]);

  useEffect(() => {
    const reviewInterval = setInterval(nextReview, 6000);
    return () => clearInterval(reviewInterval);
  }, [nextReview]);

  if (reviews.length === 0) return null;

  return (
    <section className="bg-gray-800 rounded-lg py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold text-white mb-8">What Our Customers Say</h2>
        <div className="relative h-48 overflow-hidden">
          {reviews.map((review, index) => (
            <div
              key={review.id}
              className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center transition-opacity duration-700 ease-in-out"
              style={{ opacity: index === currentIndex ? 1 : 0 }}
            >
              <p className="text-lg italic text-gray-300 max-w-3xl">"{review.comment}"</p>
              <div className="flex items-center mt-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} className={`w-5 h-5 ${i < review.rating ? 'text-yellow-400' : 'text-gray-600'}`} />
                  ))}
                </div>
              </div>
              <p className="mt-2 text-sm text-white font-semibold">
                {review.author} - <span className="text-green-400 font-normal">{review.productName}</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
