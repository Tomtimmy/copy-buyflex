import React from 'react';
import { CartIcon } from './icons/CartIcon';
import { AdminIcon } from './icons/AdminIcon';
import { HeartIcon } from './icons/HeartIcon';
import { SearchIcon } from './icons/SearchIcon';
import { User } from '../types';

interface HeaderProps {
  cartCount: number;
  wishlistCount: number;
  onCartClick: () => void;
  onWishlistClick: () => void;
  currentUser: User | null;
  onLogin: (role: User['role']) => void;
  onLogout: () => void;
  onNavigate: (view: 'shop' | 'admin') => void;
  currentView: 'shop' | 'admin';
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  cartCount, 
  wishlistCount, 
  onCartClick, 
  onWishlistClick, 
  currentUser, 
  onLogin, 
  onLogout, 
  onNavigate, 
  currentView,
  searchQuery,
  onSearchChange,
}) => {
  return (
    <header className="bg-gray-900/80 backdrop-blur-md sticky top-0 z-40 w-full border-b border-gray-700">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <button onClick={() => { onNavigate('shop'); onSearchChange(''); }} className="text-2xl font-bold text-green-400">
              Buyflex
            </button>
          </div>

          <div className="flex-1 flex justify-center px-2 lg:ml-6 lg:justify-end">
            <div className="max-w-md w-full lg:max-w-xs">
              <label htmlFor="search" className="sr-only">Search</label>
              <div className="relative text-gray-400 focus-within:text-gray-200">
                <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
                  <SearchIcon className="h-5 w-5" />
                </div>
                <input
                  id="search"
                  className="block w-full bg-gray-800 border border-transparent rounded-md py-2 pl-10 pr-3 leading-5 text-gray-300 placeholder-gray-400 focus:outline-none focus:bg-gray-700 focus:border-gray-600 focus:ring-gray-600 sm:text-sm"
                  placeholder="Search products..."
                  type="search"
                  name="search"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  onFocus={() => onNavigate('shop')}
                />
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
             {currentUser?.role === 'Admin' || currentUser?.role === 'SuperAdmin' ? (
                <button 
                  onClick={() => onNavigate('admin')} 
                  className={`hidden md:flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${currentView === 'admin' ? 'bg-green-500 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
                >
                  <AdminIcon className="h-5 w-5" />
                  Admin
                </button>
              ) : null}
            {currentUser ? (
              <div className="hidden md:flex items-center space-x-4">
                <span className="text-gray-300 hidden sm:block">Welcome, {currentUser.name}</span>
                <button onClick={onLogout} className="text-sm bg-gray-700 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300">Logout</button>
              </div>
            ) : (
                <div className="hidden md:flex items-center space-x-2">
                    <button onClick={() => onLogin('Customer')} className="text-sm bg-transparent border border-green-500 text-green-400 hover:bg-green-500 hover:text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300">
                        Login
                    </button>
                    <button onClick={() => onLogin('Admin')} className="text-sm bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300">
                        Admin Login
                    </button>
                </div>
            )}
            <button
              onClick={onWishlistClick}
              className="relative text-gray-300 hover:text-red-400 p-2 rounded-full transition-colors duration-200"
              aria-label="Open wishlist"
            >
              <HeartIcon className="h-6 w-6" />
              {wishlistCount > 0 && (
                <span className="absolute top-0 right-0 block h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>
            <button
              onClick={onCartClick}
              className="relative text-gray-300 hover:text-green-400 p-2 rounded-full transition-colors duration-200"
              aria-label="Open cart"
            >
              <CartIcon className="h-6 w-6" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 block h-5 w-5 rounded-full bg-green-500 text-white text-xs flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};