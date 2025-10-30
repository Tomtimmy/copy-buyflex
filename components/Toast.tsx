import React from 'react';

interface ToastProps {
  message: string;
}

export const Toast: React.FC<ToastProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 animate-slide-in-up animate-fade-out">
      <div className="bg-green-500 text-white font-semibold py-2 px-6 rounded-full shadow-lg">
        {message}
      </div>
    </div>
  );
};