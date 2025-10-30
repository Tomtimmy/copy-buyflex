
import React from 'react';
import { CartIcon } from './icons/CartIcon';
import { HeartIcon } from './icons/HeartIcon';
import { SearchIcon } from './icons/SearchIcon';
import { User } from '../types';
import { AdminIcon } from './icons/AdminIcon';

interface HeaderProps {
  cartCount: number;
  wishlistCount: number;
  onCartClick: () => void;
  onWishlistClick: () => void;
  onSearch: (query: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  currentUser: User | null;
  onAuthClick: (mode: 'login' | 'register') => void;
  onLogout: () => void;
  onAdminClick: () => void;
  onLogoClick: () => void;
  onProfileClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  wishlistCount,
  onCartClick,
  onWishlistClick,
  onSearch,
  searchQuery,
  setSearchQuery,
  currentUser,
  onAuthClick,
  onLogout,
  onAdminClick,
  onLogoClick,
  onProfileClick,
}) => {
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <header className="bg-gray-800 text-white shadow-lg sticky top-0 z-40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0">
            <h1 onClick={onLogoClick} className="text-3xl font-bold text-green-400 cursor-pointer">
              Buyflex
            </h1>
          </div>

          <div className="hidden md:block flex-1 max-w-xl mx-4">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for products..."
                className="w-full bg-gray-700 border border-gray-600 rounded-full py-2 px-6 pl-12 text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
              />
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <SearchIcon className="w-5 h-5 text-gray-400" />
              </div>
            </form>
          </div>

          <div className="flex items-center space-x-4">
            <button onClick={onWishlistClick} className="relative p-2 rounded-full hover:bg-gray-700 transition-colors">
              <HeartIcon className="w-6 h-6" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold">
                  {wishlistCount}
                </span>
              )}
            </button>

            <button onClick={onCartClick} className="relative p-2 rounded-full hover:bg-gray-700 transition-colors">
              <CartIcon className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-green-500 text-xs font-bold">
                  {cartCount}
                </span>
              )}
            </button>

            {currentUser ? (
              <div className="relative group">
                 <button onClick={onProfileClick} className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-700 transition-colors">
                    <span className="font-semibold text-sm hidden sm:inline">{currentUser.name.split(' ')[0]}</span>
                    <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center font-bold text-white">
                        {currentUser.name.charAt(0)}
                    </div>
                </button>
                <div className="absolute top-full right-0 mt-2 w-48 bg-gray-700 rounded-md shadow-lg py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none group-hover:pointer-events-auto">
                    {(currentUser.role === 'Admin' || currentUser.role === 'SuperAdmin') && (
                        <button onClick={onAdminClick} className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-gray-200 hover:bg-gray-600">
                           <AdminIcon className="w-4 h-4" /> Admin Panel
                        </button>
                    )}
                     <button onClick={onProfileClick} className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-gray-200 hover:bg-gray-600">
                        Profile
                    </button>
                    <button onClick={onLogout} className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-600">
                        Logout
                    </button>
                </div>

              </div>
            ) : (
              <div className="hidden sm:flex items-center space-x-2">
                <button onClick={() => onAuthClick('login')} className="px-4 py-2 text-sm rounded-md hover:bg-gray-700 transition-colors">Log In</button>
                <button onClick={() => onAuthClick('register')} className="bg-green-500 px-4 py-2 text-sm font-bold rounded-md hover:bg-green-600 transition-colors">Sign Up</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
