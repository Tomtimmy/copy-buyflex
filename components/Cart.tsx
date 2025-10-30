import React from 'react';
import { CartItem } from '../types';
import { XIcon } from './icons/XIcon';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: number, newQuantity: number) => void;
  onRemoveItem: (productId: number) => void;
  onCheckout: () => void;
}

export const Cart: React.FC<CartProps> = ({ isOpen, onClose, cartItems, onUpdateQuantity, onRemoveItem, onCheckout }) => {
  if (!isOpen) return null;

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleRemoveWithConfirm = (item: CartItem) => {
    if (window.confirm(`Are you sure you want to remove "${item.name}" from your cart?`)) {
      onRemoveItem(item.id);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-end" onClick={onClose}>
      <div
        className="w-full max-w-md h-full bg-gray-800 text-white shadow-xl flex flex-col transform transition-transform duration-300 ease-in-out"
        onClick={(e) => e.stopPropagation()}
        style={{ transform: isOpen ? 'translateX(0)' : 'translateX(100%)' }}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold text-green-400">Your Cart</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-700">
            <XIcon className="w-6 h-6" />
          </button>
        </div>

        {cartItems.length === 0 ? (
          <div className="flex-grow flex items-center justify-center">
            <p className="text-gray-400">Your cart is empty.</p>
          </div>
        ) : (
          <div className="flex-grow overflow-y-auto p-4 space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center space-x-4 bg-gray-900 p-2 rounded-lg">
                <img src={item.imageUrl} alt={item.name} className="w-16 h-16 object-cover rounded-md" />
                <div className="flex-grow">
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-green-400">${item.price.toFixed(2)}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button onClick={() => onUpdateQuantity(item.id, item.quantity - 1)} className="w-6 h-6 bg-gray-700 rounded-full">-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)} className="w-6 h-6 bg-gray-700 rounded-full">+</button>
                </div>
                <button onClick={() => handleRemoveWithConfirm(item)} className="text-gray-500 hover:text-red-500">
                  <XIcon className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        )}

        {cartItems.length > 0 && (
          <div className="p-4 border-t border-gray-700">
            <div className="flex justify-between items-center text-lg">
              <span>Subtotal</span>
              <span className="font-bold">${subtotal.toFixed(2)}</span>
            </div>
            <button 
              onClick={onCheckout}
              className="w-full mt-4 bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg transition-colors"
            >
              Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};