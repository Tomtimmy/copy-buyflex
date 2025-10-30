import React from 'react';
import { Product } from '../types';
import { HeartIcon } from './icons/HeartIcon';

interface ProductDetailProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
  onToggleWishlist: (productId: number) => void;
  isWishlisted: boolean;
}

const StarIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.007z" clipRule="evenodd" />
    </svg>
);

export const ProductDetail: React.FC<ProductDetailProps> = ({ product, onClose, onAddToCart, onToggleWishlist, isWishlisted }) => {
  const approvedReviews = product.reviews.filter(r => r.status === 'Approved');

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <button onClick={onClose} className="mb-6 inline-flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        Back to Shop
      </button>
      <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/2 overflow-hidden">
            <img className="h-full w-full object-cover transition-transform duration-300 ease-in-out hover:scale-110" src={product.imageUrl} alt={product.name} />
          </div>
          <div className="p-8 md:w-1/2 flex flex-col justify-center">
            <div className="uppercase tracking-wide text-sm text-green-400 font-semibold">{product.category}</div>
            <h1 className="mt-1 text-3xl lg:text-4xl leading-tight font-extrabold text-white">{product.name}</h1>
            
            <div className="flex items-center mt-4">
                <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                        <StarIcon key={i} className={`w-5 h-5 ${i < Math.round(product.rating) ? 'text-yellow-400' : 'text-gray-600'}`} />
                    ))}
                </div>
                <span className="text-gray-400 text-sm ml-3">({product.rating.toFixed(1)} stars / {approvedReviews.length} reviews)</span>
            </div>

            <p className="mt-4 text-lg text-gray-300">{product.description}</p>
            
            <div className="mt-6">
              <span className="text-4xl font-bold text-green-400">${product.price.toFixed(2)}</span>
            </div>
            
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => onAddToCart(product)} 
                className="w-full sm:w-auto bg-green-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-600 transition-colors duration-300 flex-grow"
              >
                Add to Cart
              </button>
              <button 
                onClick={() => onToggleWishlist(product.id)}
                className={`w-full sm:w-auto flex items-center justify-center gap-2 border-2 font-bold py-3 px-6 rounded-lg transition-colors duration-300 ${isWishlisted ? 'border-red-500 text-red-500 bg-red-900/20 hover:bg-red-900/40' : 'border-gray-600 text-gray-300 hover:border-white hover:text-white'}`}
              >
                <HeartIcon isFilled={isWishlisted} className="w-6 h-6" />
                <span>{isWishlisted ? 'In Wishlist' : 'Save'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold text-white mb-4">Customer Reviews</h2>
        <div className="space-y-6">
          {approvedReviews.length > 0 ? (
            approvedReviews.map(review => (
              <div key={review.id} className="bg-gray-800 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                        <StarIcon key={i} className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-600'}`} />
                    ))}
                  </div>
                  <p className="ml-3 font-semibold text-white">{review.author}</p>
                </div>
                <p className="text-gray-400 italic">"{review.comment}"</p>
              </div>
            ))
          ) : (
            <div className="bg-gray-800 p-6 rounded-lg text-center">
              <p className="text-gray-500">No reviews yet for this product.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};