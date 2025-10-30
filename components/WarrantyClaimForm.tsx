import React, { useState } from 'react';
import { WarrantyClaim } from '../types';

interface WarrantyClaimFormProps {
  onSubmit: (claimData: Omit<WarrantyClaim, 'id' | 'status'>) => void;
}

export const WarrantyClaimForm: React.FC<WarrantyClaimFormProps> = ({ onSubmit }) => {
    const [productName, setProductName] = useState('');
    const [purchaseDate, setPurchaseDate] = useState('');
    const [issueDescription, setIssueDescription] = useState('');
    const [fileName, setFileName] = useState('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFileName(e.target.files[0].name);
        } else {
            setFileName('');
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (productName && purchaseDate && issueDescription) {
            onSubmit({ productName, purchaseDate, issueDescription, fileName });
        } else {
            alert('Please fill out all required fields.');
        }
    };
    
    const today = new Date().toISOString().split('T')[0];

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="claim-product" className="block text-sm font-medium text-gray-300">Product Name</label>
                <input type="text" id="claim-product" value={productName} onChange={e => setProductName(e.target.value)} required className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-green-500 focus:border-green-500" />
            </div>
            <div>
                <label htmlFor="claim-date" className="block text-sm font-medium text-gray-300">Date of Purchase</label>
                <input type="date" id="claim-date" value={purchaseDate} max={today} onChange={e => setPurchaseDate(e.target.value)} required className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-green-500 focus:border-green-500" />
            </div>
            <div>
                <label htmlFor="claim-description" className="block text-sm font-medium text-gray-300">Describe the Issue</label>
                <textarea id="claim-description" value={issueDescription} onChange={e => setIssueDescription(e.target.value)} required rows={4} className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-green-500 focus:border-green-500"></textarea>
            </div>
            <div>
                <label htmlFor="claim-file" className="block text-sm font-medium text-gray-300">Upload Photo/Video (Optional)</label>
                <div className="mt-1 flex items-center">
                    <label className="w-full flex items-center px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 cursor-pointer hover:bg-gray-600">
                        <svg className="w-5 h-5 mr-2" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                            <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4 4-4-4h3V3h2v8z" />
                        </svg>
                        <span className="truncate">{fileName || 'Choose a file...'}</span>
                        <input type='file' id="claim-file" className="hidden" onChange={handleFileChange} accept="image/*,video/*" />
                    </label>
                </div>
            </div>
            <div className="flex justify-end pt-4">
                <button type="submit" className="bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600 transition-colors">Submit Claim</button>
            </div>
        </form>
    );
};