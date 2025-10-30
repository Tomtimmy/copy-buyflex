import React, { useState } from 'react';
import { Modal } from './Modal';
import { Product } from '../types';

interface ProductAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onReportIssue: (serial: string) => void;
}

interface AuthResult {
    status: 'success' | 'error';
    message: string;
    product?: Product;
}

export const ProductAuthModal: React.FC<ProductAuthModalProps> = ({ isOpen, onClose, products, onReportIssue }) => {
    const [serial, setSerial] = useState('');
    const [result, setResult] = useState<AuthResult | null>(null);

    const handleCheckSerial = (e: React.FormEvent) => {
        e.preventDefault();
        setResult(null);

        if(!serial) {
            setResult({ status: 'error', message: 'Please enter a serial number.'});
            return;
        }

        // Demo logic: PROD-<product_id>-<5_alphanumeric_chars>
        const regex = /^PROD-(\d+)-([A-Z0-9]{5})$/i;
        const match = serial.match(regex);

        if (match) {
            const productId = parseInt(match[1], 10);
            const product = products.find(p => p.id === productId);
            if(product) {
                setResult({ status: 'success', message: 'This product is authentic!', product });
            } else {
                 setResult({ status: 'error', message: 'This serial number is not associated with any of our products.' });
            }
        } else {
             setResult({ status: 'error', message: 'Invalid serial number format. Please try again.' });
        }
    };

    const handleClose = () => {
        setSerial('');
        setResult(null);
        onClose();
    }
    
    const getWarrantyStatus = (mfgDate: string) => {
        const manufacturingDate = new Date(mfgDate);
        const oneYearLater = new Date(manufacturingDate.setFullYear(manufacturingDate.getFullYear() + 1));
        const isUnderWarranty = new Date() < oneYearLater;
        return {
            isUnderWarranty: isUnderWarranty,
            expiryDate: oneYearLater.toLocaleDateString(),
        };
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title="Product Authentication">
            <form onSubmit={handleCheckSerial} className="space-y-4">
                 <div>
                    <label htmlFor="serial-number" className="block text-sm font-medium text-gray-300">Enter Product Serial Number</label>
                    <div className="flex items-center gap-2 mt-1">
                        <input 
                            type="text" 
                            id="serial-number" 
                            value={serial}
                            onChange={e => setSerial(e.target.value)}
                            placeholder="e.g., PROD-1-ABC12"
                            required 
                            className="block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-green-500 focus:border-green-500" 
                        />
                        <button type="submit" className="bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600 transition-colors">Verify</button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">For demo, use format: PROD-&lt;product id&gt;-&lt;5 chars&gt;. E.g., PROD-1-XYZ12 for FreePods Pro.</p>
                </div>
            </form>
            {result && (
                <div className="mt-6 border-t border-gray-700 pt-4 animate-fade-in">
                    <p className={`font-bold ${result.status === 'success' ? 'text-green-400' : 'text-red-400'}`}>{result.message}</p>
                    {result.product && (
                        <div className="mt-4 space-y-4">
                            <div className="flex items-center gap-4 bg-gray-700 p-3 rounded-lg">
                                <img src={result.product.imageUrl} alt={result.product.name} className="w-16 h-16 object-cover rounded-md" />
                                <div>
                                    <p className="font-semibold text-white">{result.product.name}</p>
                                    <p className="text-sm text-gray-300">{result.product.category}</p>
                                </div>
                            </div>
                            <div className="text-sm space-y-1">
                                <p><strong>Manufacturing Date:</strong> {new Date(result.product.manufacturingDate).toLocaleDateString()}</p>
                                {(() => {
                                    const warranty = getWarrantyStatus(result.product.manufacturingDate);
                                    return (
                                        <p>
                                            <strong>Warranty Status:</strong> 
                                            <span className={warranty.isUnderWarranty ? 'text-green-400' : 'text-red-400'}>
                                                {warranty.isUnderWarranty ? ' Active' : ' Expired'}
                                            </span>
                                            (until {warranty.expiryDate})
                                        </p>
                                    );
                                })()}
                            </div>
                        </div>
                    )}
                    {result.status === 'error' && (
                        <div className="mt-4">
                            <button onClick={() => onReportIssue(serial)} className="text-sm bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                                Report an Issue with this Serial
                            </button>
                        </div>
                    )}
                </div>
            )}
        </Modal>
    )
};