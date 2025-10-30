import React from 'react';
import { Product } from '../types';
import { HeartIcon } from './icons/HeartIcon';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
  onToggleWishlist: (productId: number) => void;
  onQuickView: (product: Product) => void;
  isWishlisted: boolean;
}

const StarIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.007z" clipRule="evenodd" />
    </svg>
);

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, onSelectProduct, onToggleWishlist, onQuickView, isWishlisted }) => {
  const approvedReviewsCount = product.reviews.filter(r => r.status === 'Approved').length;
  
  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg flex flex-col transform hover:-translate-y-1 transition-all duration-300 ease-in-out group hover:shadow-2xl hover:shadow-green-500/20 border-2 border-transparent hover:border-green-500">
      <div className="relative">
        <div onClick={() => onSelectProduct(product)} className="cursor-pointer overflow-hidden">
          <img loading="lazy" className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300 ease-in-out" src={product.imageUrl} alt={product.name} />
        </div>
        <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleWishlist(product.id);
            }}
            className="absolute top-2 right-2 bg-gray-800/50 backdrop-blur-sm rounded-full p-2 text-white hover:text-red-500 focus:outline-none transition-colors duration-200 z-10"
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
            <HeartIcon className="w-5 h-5" isFilled={isWishlisted} />
        </button>
        <div className="absolute top-0 left-0 bg-green-500 text-white px-2 py-1 m-2 rounded-md text-sm font-semibold">{product.category}</div>
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
            <button
                onClick={(e) => { e.stopPropagation(); onQuickView(product); }}
                className="text-white bg-gray-900/70 py-2 px-4 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-4 group-hover:translate-y-0"
            >
                Quick View
            </button>
        </div>
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold text-white truncate cursor-pointer" onClick={() => onSelectProduct(product)}>{product.name}</h3>
        <p className="text-gray-400 mt-1 text-sm h-10 overflow-hidden">{product.description}</p>
        <div className="flex-grow"></div>
        <div className="flex items-center mt-2">
            <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} className={`w-4 h-4 ${i < Math.round(product.rating) ? 'text-yellow-400' : 'text-gray-600'}`} />
                ))}
            </div>
            <span className="text-gray-400 text-xs ml-2">({approvedReviewsCount} reviews)</span>
        </div>
        <div className="flex items-center justify-between mt-4">
          <span className="text-2xl font-bold text-green-400">${product.price.toFixed(2)}</span>
          <button
            onClick={(e) => {
                e.stopPropagation();
                onAddToCart(product);
            }}
            className="bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600 transition-colors duration-300 transform group-hover:scale-105"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};