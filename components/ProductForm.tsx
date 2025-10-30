import React, { useState, useEffect, useRef } from 'react';
import { Product } from '../types';

interface ProductFormProps {
  product?: Product | null;
  onSubmit: (product: Omit<Product, 'id' | 'reviews' | 'rating'> | Product) => void;
  onCancel: () => void;
}

// FIX: Added manufacturingDate to satisfy the Omit type which retains this required property from Product.
const initialFormState: Omit<Product, 'id' | 'rating' | 'reviews'> = {
  name: '',
  category: '',
  price: 0,
  imageUrl: '',
  description: '',
  stock: 0,
  manufacturingDate: '',
};

export const ProductForm: React.FC<ProductFormProps> = ({ product, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<Omit<Product, 'id' | 'rating' | 'reviews' > | Product>(initialFormState);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (product) {
      setFormData(product);
      setImagePreview(product.imageUrl);
    } else {
      setFormData(initialFormState);
      setImagePreview(null);
    }
  }, [product]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value,
    }));
  };
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        setFormData(prev => ({ ...prev, imageUrl: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.imageUrl) {
        // Provide a default placeholder image if none is uploaded
        const placeholder = `https://picsum.photos/seed/${formData.name.replace(/\s+/g, '-')}/400/400`;
        onSubmit({ ...formData, imageUrl: placeholder });
    } else {
        onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-300">Product Name</label>
        <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-green-500 focus:border-green-500" />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-300">Description</label>
        <textarea name="description" id="description" value={formData.description} onChange={handleChange} required rows={3} className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-green-500 focus:border-green-500"></textarea>
      </div>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-300">Category</label>
            <input type="text" name="category" id="category" value={formData.category} onChange={handleChange} required className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-green-500 focus:border-green-500" />
          </div>
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-300">Price</label>
            <input type="number" name="price" id="price" value={formData.price} onChange={handleChange} required min="0" step="0.01" className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-green-500 focus:border-green-500" />
          </div>
       </div>
      <div>
        <label className="block text-sm font-medium text-gray-300">Product Image</label>
        <div className="mt-1 flex items-center space-x-4">
            {imagePreview ? (
              <img src={imagePreview} alt="Product preview" className="w-20 h-20 object-cover rounded-md bg-gray-700" />
            ) : (
              <div className="w-20 h-20 rounded-md bg-gray-700 flex items-center justify-center text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              </div>
            )}
            <input type="file" accept="image/*" onChange={handleImageChange} ref={fileInputRef} className="hidden" />
            <button type="button" onClick={() => fileInputRef.current?.click()} className="px-3 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700">
              {imagePreview ? 'Change Image' : 'Upload Image'}
            </button>
        </div>
      </div>
       <div>
          <label htmlFor="stock" className="block text-sm font-medium text-gray-300">Stock</label>
          <input type="number" name="stock" id="stock" value={formData.stock} onChange={handleChange} required min="0" className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-green-500 focus:border-green-500" />
        </div>
      <div className="flex justify-end space-x-3 pt-4">
        <button type="button" onClick={onCancel} className="bg-gray-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors">Cancel</button>
        <button type="submit" className="bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600 transition-colors">Save Product</button>
      </div>
    </form>
  );
};