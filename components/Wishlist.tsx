import React from 'react';
import { Product } from '../types';
import { XIcon } from './icons/XIcon';
import { CartIcon } from './icons/CartIcon';

interface WishlistProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistItems: Product[];
  onRemoveItem: (productId: number) => void;
  onMoveToCart: (product: Product) => void;
}

export const Wishlist: React.FC<WishlistProps> = ({ isOpen, onClose, wishlistItems, onRemoveItem, onMoveToCart }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-end" onClick={onClose}>
      <div
        className="w-full max-w-md h-full bg-gray-800 text-white shadow-xl flex flex-col transform transition-transform duration-300 ease-in-out"
        onClick={(e) => e.stopPropagation()}
        style={{ transform: isOpen ? 'translateX(0)' : 'translateX(100%)' }}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold text-red-400">Your Wishlist</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-700">
            <XIcon className="w-6 h-6" />
          </button>
        </div>

        {wishlistItems.length === 0 ? (
          <div className="flex-grow flex items-center justify-center">
            <p className="text-gray-400">Your wishlist is empty.</p>
          </div>
        ) : (
          <div className="flex-grow overflow-y-auto p-4 space-y-4">
            {wishlistItems.map((item) => (
              <div key={item.id} className="flex items-start space-x-4 bg-gray-900 p-3 rounded-lg">
                <img src={item.imageUrl} alt={item.name} className="w-20 h-20 object-cover rounded-md" />
                <div className="flex-grow">
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-green-400 font-bold">${item.price.toFixed(2)}</p>
                  <div className="mt-2 flex items-center space-x-2">
                    <button onClick={() => onMoveToCart(item)} className="text-xs flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white font-bold py-1 px-2 rounded-md transition-colors">
                      <CartIcon className="w-4 h-4" />
                      Move to Cart
                    </button>
                  </div>
                </div>
                <button onClick={() => onRemoveItem(item.id)} className="text-gray-500 hover:text-red-500 flex-shrink-0">
                  <XIcon className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
