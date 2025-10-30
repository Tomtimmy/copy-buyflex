import React, { useState, useEffect } from 'react';
import { Address, CartItem, User } from '../types';
import { XIcon } from './icons/XIcon';

interface CheckoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    cartItems: CartItem[];
    currentUser: User | null;
    onPlaceOrder: (shippingDetails: Address) => void;
}

// Sub-components defined within the same file for simplicity

const ShippingForm: React.FC<{ address: Address, onAddressChange: (field: keyof Address, value: string) => void }> = ({ address, onAddressChange }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onAddressChange(e.target.name as keyof Address, e.target.value);
    }
    return (
        <div className="space-y-4">
            <h3 className="text-lg font-bold text-green-400">Shipping Information</h3>
            <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-300">Full Name</label>
                <input type="text" name="fullName" id="fullName" value={address.fullName} onChange={handleChange} required className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-green-500 focus:border-green-500" />
            </div>
            <div>
                <label htmlFor="street" className="block text-sm font-medium text-gray-300">Street Address</label>
                <input type="text" name="street" id="street" value={address.street} onChange={handleChange} required className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-green-500 focus:border-green-500" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-300">City</label>
                    <input type="text" name="city" id="city" value={address.city} onChange={handleChange} required className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-green-500 focus:border-green-500" />
                </div>
                 <div>
                    <label htmlFor="state" className="block text-sm font-medium text-gray-300">State / Province</label>
                    <input type="text" name="state" id="state" value={address.state} onChange={handleChange} required className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-green-500 focus:border-green-500" />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="zip" className="block text-sm font-medium text-gray-300">ZIP / Postal Code</label>
                    <input type="text" name="zip" id="zip" value={address.zip} onChange={handleChange} required className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-green-500 focus:border-green-500" />
                </div>
                 <div>
                    <label htmlFor="country" className="block text-sm font-medium text-gray-300">Country</label>
                    <input type="text" name="country" id="country" value={address.country} onChange={handleChange} required className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-green-500 focus:border-green-500" />
                </div>
            </div>
            <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-300">Phone Number</label>
                <input type="tel" name="phone" id="phone" value={address.phone} onChange={handleChange} required className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-green-500 focus:border-green-500" />
            </div>
        </div>
    );
};

const PaymentForm: React.FC<{ onConfirmPayment: () => void }> = ({ onConfirmPayment }) => {
    const [paymentMethod, setPaymentMethod] = useState('card');
    return (
        <div className="space-y-4">
            <h3 className="text-lg font-bold text-green-400">Payment Details</h3>
            <div className="flex gap-2 bg-gray-700 p-1 rounded-lg">
                <button onClick={() => setPaymentMethod('card')} className={`flex-1 px-3 py-2 text-sm rounded-md ${paymentMethod === 'card' ? 'bg-green-500 text-white' : 'text-gray-300'}`}>Card</button>
                <button onClick={() => setPaymentMethod('paypal')} className={`flex-1 px-3 py-2 text-sm rounded-md ${paymentMethod === 'paypal' ? 'bg-green-500 text-white' : 'text-gray-300'}`}>PayPal</button>
                <button onClick={() => setPaymentMethod('africa')} className={`flex-1 px-3 py-2 text-sm rounded-md ${paymentMethod === 'africa' ? 'bg-green-500 text-white' : 'text-gray-300'}`}>African Gateway</button>
            </div>
            {paymentMethod === 'card' && (
                <div className="space-y-3 p-4 bg-gray-900/50 rounded-md">
                    <input placeholder="Card Number" className="w-full bg-gray-700 p-2 rounded-md text-white border border-gray-600" />
                    <div className="flex gap-2">
                        <input placeholder="MM/YY" className="w-1/2 bg-gray-700 p-2 rounded-md text-white border border-gray-600" />
                        <input placeholder="CVC" className="w-1/2 bg-gray-700 p-2 rounded-md text-white border border-gray-600" />
                    </div>
                </div>
            )}
             {paymentMethod !== 'card' && (
                <div className="p-4 bg-gray-900/50 rounded-md text-center">
                    <p>You will be redirected to complete your payment securely.</p>
                </div>
             )}
            <button onClick={onConfirmPayment} className="w-full mt-4 bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg transition-colors">
                Confirm & Pay
            </button>
        </div>
    );
};

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose, cartItems, currentUser, onPlaceOrder }) => {
    if (!isOpen) return null;

    const [step, setStep] = useState<'shipping' | 'payment'>('shipping');
    const initialAddress: Address = {
        fullName: currentUser?.address?.fullName || currentUser?.name || '',
        street: currentUser?.address?.street || '',
        city: currentUser?.address?.city || '',
        state: currentUser?.address?.state || '',
        zip: currentUser?.address?.zip || '',
        country: currentUser?.address?.country || '',
        phone: currentUser?.address?.phone || '',
    };
    const [shippingAddress, setShippingAddress] = useState<Address>(initialAddress);

    const handleAddressChange = (field: keyof Address, value: string) => {
        setShippingAddress(prev => ({ ...prev, [field]: value }));
    };

    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shippingFee = subtotal >= 50 ? 0 : 5;
    const total = subtotal + shippingFee;

    const handleProceedToPayment = (e: React.FormEvent) => {
        e.preventDefault();
        setStep('payment');
    };
    
    const handleConfirmPayment = () => {
        // Here you would process payment. For this demo, we assume it's successful.
        onPlaceOrder(shippingAddress);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
                <div className="flex items-center justify-between p-4 border-b border-gray-700">
                    <h2 className="text-xl font-bold text-green-400">Checkout</h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-700" aria-label="Close modal">
                        <XIcon className="w-6 h-6" />
                    </button>
                </div>
                {!currentUser ? (
                     <div className="p-8 text-center">
                        <p className="text-lg text-gray-300">Please log in to proceed with your order.</p>
                        <p className="text-sm text-gray-500 mt-2">Login is required to save your shipping details and order history.</p>
                     </div>
                ) : (
                    <div className="flex-grow overflow-y-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
                            {/* Left side: Form */}
                            <div className="md:border-r md:border-gray-700 md:pr-8">
                                <form onSubmit={handleProceedToPayment}>
                                    {step === 'shipping' && <ShippingForm address={shippingAddress} onAddressChange={handleAddressChange} />}
                                    {step === 'payment' && <PaymentForm onConfirmPayment={handleConfirmPayment} />}

                                    {step === 'shipping' && (
                                        <button type="submit" className="w-full mt-6 bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg transition-colors">
                                            Proceed to Payment
                                        </button>
                                    )}
                                     {step === 'payment' && (
                                        <button type="button" onClick={() => setStep('shipping')} className="w-full mt-2 text-sm text-gray-400 hover:text-white">
                                            &larr; Back to Shipping
                                        </button>
                                     )}
                                </form>
                            </div>
                            {/* Right side: Summary */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-bold text-green-400">Order Summary</h3>
                                <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                                    {cartItems.map(item => (
                                        <div key={item.id} className="flex justify-between items-center text-sm">
                                            <span className="text-white">{item.name} <span className="text-gray-400">x{item.quantity}</span></span>
                                            <span className="font-mono text-gray-300">${(item.price * item.quantity).toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="border-t border-gray-700 pt-4 space-y-2">
                                     <div className="flex justify-between text-sm">
                                        <span className="text-gray-400">Subtotal</span>
                                        <span className="font-mono text-gray-300">${subtotal.toFixed(2)}</span>
                                     </div>
                                      <div className="flex justify-between text-sm">
                                        <span className="text-gray-400">Shipping</span>
                                        <span className="font-mono text-gray-300">{shippingFee > 0 ? `$${shippingFee.toFixed(2)}` : 'FREE'}</span>
                                     </div>
                                      <div className="flex justify-between font-bold text-lg">
                                        <span className="text-white">Total</span>
                                        <span className="font-mono text-green-400">${total.toFixed(2)}</span>
                                     </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
