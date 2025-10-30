
import React from 'react';
import { User, Order, Review } from '../types';
import { XIcon } from './icons/XIcon';

interface UserProfileProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  orders: Order[];
  reviews: Review[];
}

export const UserProfile: React.FC<UserProfileProps> = ({ isOpen, onClose, currentUser, orders, reviews }) => {
  if (!isOpen) return null;

  const userOrders = orders.filter(o => o.customerId === currentUser.id);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-3xl m-4 transform transition-all duration-300 ease-in-out max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold text-green-400">My Profile</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-700" aria-label="Close modal">
            <XIcon className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto space-y-8">
            {/* User Info */}
            <div>
                <h3 className="text-lg font-semibold text-white mb-2">Account Details</h3>
                <div className="bg-gray-900 p-4 rounded-lg grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div><span className="text-gray-400">Name:</span> <span className="text-white">{currentUser.name}</span></div>
                    <div><span className="text-gray-400">Email:</span> <span className="text-white">{currentUser.email}</span></div>
                    <div><span className="text-gray-400">Member Since:</span> <span className="text-white">{new Date(currentUser.createdAt).toLocaleDateString()}</span></div>
                     <div><span className="text-gray-400">Role:</span> <span className="text-white">{currentUser.role}</span></div>
                </div>
            </div>

            {/* Shipping Address */}
            {currentUser.address && (
                 <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Default Shipping Address</h3>
                    <div className="bg-gray-900 p-4 rounded-lg text-sm text-gray-300">
                        <p className="font-bold text-white">{currentUser.address.fullName}</p>
                        <p>{currentUser.address.street}</p>
                        <p>{currentUser.address.city}, {currentUser.address.state} {currentUser.address.zip}</p>
                        <p>{currentUser.address.country}</p>
                        <p>Phone: {currentUser.address.phone}</p>
                    </div>
                 </div>
            )}

            {/* Order History */}
            <div>
                <h3 className="text-lg font-semibold text-white mb-2">Order History</h3>
                 {userOrders.length > 0 ? (
                    <div className="space-y-4">
                        {userOrders.map(order => (
                            <div key={order.id} className="bg-gray-900 p-4 rounded-lg">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-bold text-white">Order {order.id}</p>
                                        <p className="text-sm text-gray-400">Date: {order.date}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-green-400">${order.total.toFixed(2)}</p>
                                        <p className="text-sm text-yellow-300">{order.status}</p>
                                    </div>
                                </div>
                                <div className="mt-2 text-xs text-gray-400">
                                    {order.items.map(item => item.product.name).join(', ')}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-gray-900 p-4 rounded-lg text-center text-gray-500 text-sm">
                        You haven't placed any orders yet.
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};
