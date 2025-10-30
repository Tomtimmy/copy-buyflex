import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { User } from '../types';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialMode: 'login' | 'register';
    onLoginSubmit: (credentials: { email: string; password?: string; }) => Promise<void>;
    onRegisterSubmit: (details: { name: string, email: string; password?: string; }) => Promise<void>;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialMode, onLoginSubmit, onRegisterSubmit }) => {
    const [mode, setMode] = useState(initialMode);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setMode(initialMode);
        setError('');
    }, [initialMode, isOpen]);
    
    const handleClose = () => {
        // Reset form state on close
        setName('');
        setEmail('');
        setPassword('');
        setError('');
        setIsLoading(false);
        onClose();
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            if (mode === 'login') {
                await onLoginSubmit({ email, password });
            } else {
                await onRegisterSubmit({ name, email, password });
            }
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const toggleMode = () => {
        setMode(prev => prev === 'login' ? 'register' : 'login');
        setError('');
    }

    return (
        <Modal 
            isOpen={isOpen} 
            onClose={handleClose} 
            title={mode === 'login' ? 'Welcome Back!' : 'Create Your Account'}
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                {mode === 'register' && (
                    <div>
                        <label htmlFor="auth-name" className="block text-sm font-medium text-gray-300">Full Name</label>
                        <input type="text" id="auth-name" value={name} onChange={e => setName(e.target.value)} required className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-green-500 focus:border-green-500" />
                    </div>
                )}
                <div>
                    <label htmlFor="auth-email" className="block text-sm font-medium text-gray-300">Email Address</label>
                    <input type="email" id="auth-email" value={email} onChange={e => setEmail(e.target.value)} required className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-green-500 focus:border-green-500" />
                </div>
                 <div>
                    <label htmlFor="auth-password" className="block text-sm font-medium text-gray-300">Password</label>
                    <input type="password" id="auth-password" value={password} onChange={e => setPassword(e.target.value)} required className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-green-500 focus:border-green-500" />
                </div>

                {error && <p className="text-sm text-red-400">{error}</p>}

                <div className="pt-2">
                    <button type="submit" disabled={isLoading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-500 disabled:cursor-not-allowed">
                        {isLoading ? (
                           <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                           </svg>
                        ) : (
                            mode === 'login' ? 'Log In' : 'Create Account'
                        )}
                    </button>
                </div>
            </form>
            <div className="mt-4 text-center">
                <p className="text-sm text-gray-400">
                    {mode === 'login' ? "Don't have an account?" : "Already have an account?"}
                    <button onClick={toggleMode} className="ml-2 font-medium text-green-400 hover:text-green-300">
                         {mode === 'login' ? "Sign up" : "Log in"}
                    </button>
                </p>
            </div>
        </Modal>
    );
};