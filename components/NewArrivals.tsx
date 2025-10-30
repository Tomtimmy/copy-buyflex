import React from 'react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';

interface NewArrivalsProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
}

export const NewArrivals: React.FC<NewArrivalsProps> = ({ products, onSelectProduct }) => {
  return (
    <section className="animate-fade-in">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">New Arrivals</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map(product => (
            <div key={product.id} onClick={() => onSelectProduct(product)}>
                <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg flex flex-col transform hover:-translate-y-1 transition-all duration-300 ease-in-out group hover:shadow-2xl hover:shadow-green-500/20 cursor-pointer">
                    <div className="relative">
                        <div className="overflow-hidden">
                        <img loading="lazy" className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300 ease-in-out" src={product.imageUrl} alt={product.name} />
                        </div>
                    </div>
                    <div className="p-4 flex flex-col flex-grow">
                        <h3 className="text-lg font-semibold text-white truncate">{product.name}</h3>
                        <p className="text-2xl font-bold text-green-400 mt-2">${product.price.toFixed(2)}</p>
                    </div>
                </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};