import React from 'react';
import { Product } from '../types';
import { Modal } from './Modal';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({ product, onClose, onAddToCart }) => {
  if (!product) return null;

  const handleAddToCartClick = () => {
    onAddToCart(product);
    onClose();
  };

  return (
    <Modal isOpen={!!product} onClose={onClose} title={product.name}>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/2">
          <img src={product.imageUrl} alt={product.name} className="w-full h-auto object-cover rounded-lg" />
        </div>
        <div className="md:w-1/2 flex flex-col">
          <p className="text-gray-400 mt-2">{product.description}</p>
          <div className="flex-grow"></div>
          <div className="flex items-center justify-between mt-6">
            <span className="text-3xl font-bold text-green-400">${product.price.toFixed(2)}</span>
            <button
              onClick={handleAddToCartClick}
              className="bg-green-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-green-600 transition-colors duration-300"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};