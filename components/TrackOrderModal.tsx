import React, { useState } from 'react';
import { Modal } from './Modal';
import { Order, OrderStatus } from '../types';

interface TrackOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
}

const statusColors: Record<OrderStatus, string> = {
    Processing: 'bg-blue-500/20 text-blue-300',
    Shipped: 'bg-yellow-500/20 text-yellow-300',
    Delivered: 'bg-green-500/20 text-green-300',
    Cancelled: 'bg-red-500/20 text-red-300',
};

export const TrackOrderModal: React.FC<TrackOrderModalProps> = ({ isOpen, onClose, orders }) => {
  const [orderId, setOrderId] = useState('');
  const [foundOrder, setFoundOrder] = useState<Order | null>(null);
  const [error, setError] = useState('');

  const handleTrackOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setFoundOrder(null);
    if (!orderId) {
        setError('Please enter an Order ID.');
        return;
    }

    const order = orders.find(o => o.id.toLowerCase() === orderId.toLowerCase());
    if (order) {
        setFoundOrder(order);
    } else {
        setError(`Order ID "${orderId}" not found. Please check the ID and try again.`);
    }
  };

  const handleClose = () => {
    setOrderId('');
    setFoundOrder(null);
    setError('');
    onClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Track Your Order">
      <form onSubmit={handleTrackOrder} className="space-y-4">
        <div>
          <label htmlFor="order-id" className="block text-sm font-medium text-gray-300">Enter Your Order ID</label>
          <div className="flex items-center gap-2 mt-1">
            <input 
                type="text" 
                id="order-id" 
                value={orderId} 
                onChange={e => setOrderId(e.target.value)} 
                placeholder="e.g., BFX-001"
                required 
                className="block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-green-500 focus:border-green-500" 
            />
            <button type="submit" className="bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600 transition-colors">Track</button>
          </div>
        </div>
      </form>
      {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
      {foundOrder && (
        <div className="mt-6 border-t border-gray-700 pt-4 animate-fade-in">
            <h3 className="text-lg font-bold text-white">Order Details</h3>
            <div className="mt-2 space-y-2 text-sm grid grid-cols-2 gap-x-4">
                <p><strong>Order ID:</strong> <span className="font-mono">{foundOrder.id}</span></p>
                <p><strong>Date:</strong> {foundOrder.date}</p>
                <p><strong>Status:</strong> <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColors[foundOrder.status]}`}>{foundOrder.status}</span></p>
                {foundOrder.estimatedDelivery && <p><strong>Est. Delivery:</strong> {foundOrder.estimatedDelivery}</p>}
            </div>
             {foundOrder.carrier && foundOrder.trackingNumber && (
                <div className="mt-4 bg-gray-700 p-3 rounded-md">
                    <p className="text-sm"><strong>Carrier:</strong> {foundOrder.carrier.name}</p>
                    <p className="text-sm">
                        <strong>Tracking:</strong>{' '}
                        <a href={`${foundOrder.carrier.trackingUrl}${foundOrder.trackingNumber}`} target="_blank" rel="noopener noreferrer" className="text-green-400 underline hover:text-green-300 font-mono">
                            {foundOrder.trackingNumber}
                        </a>
                    </p>
                </div>
            )}
            <div className="mt-4">
                <h4 className="font-semibold text-green-400">Items:</h4>
                <div className="space-y-2 mt-2">
                    {foundOrder.items.map(({ product, quantity }) => (
                        <div key={product.id} className="flex justify-between items-center bg-gray-700 p-2 rounded-md text-sm">
                            <span className="font-medium">{product.name} (x{quantity})</span>
                            <span className="font-mono">${(product.price * quantity).toFixed(2)}</span>
                        </div>
                    ))}
                </div>
                 <div className="text-right mt-2 font-bold text-lg">
                    Total: ${foundOrder.total.toFixed(2)}
                 </div>
            </div>
        </div>
      )}
    </Modal>
  );
};