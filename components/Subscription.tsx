import React, { useState } from 'react';

interface SubscriptionProps {
    onSubscribe: (email: string) => void;
}

export const Subscription: React.FC<SubscriptionProps> = ({ onSubscribe }) => {
    const [email, setEmail] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (email) {
            onSubscribe(email);
            setEmail('');
        }
    };

  return (
    <section className="bg-gray-800 py-16 animate-fade-in">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold text-white">Stay in the Loop</h2>
        <p className="text-gray-400 mt-2 max-w-2xl mx-auto">Subscribe to our newsletter to get the latest updates on new arrivals, special offers, and exclusive deals.</p>
        <form onSubmit={handleSubmit} className="mt-8 max-w-lg mx-auto flex flex-col sm:flex-row gap-2">
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Enter your email address"
            className="flex-grow w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-3 px-4 text-white focus:outline-none focus:ring-green-500 focus:border-green-500"
            aria-label="Email address"
          />
          <button type="submit" className="bg-green-500 text-white font-bold py-3 px-6 rounded-md hover:bg-green-600 transition-colors">
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
};