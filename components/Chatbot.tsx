
import React, { useState, useRef, useEffect } from 'react';
import { Product } from '../types';
import { getRecommendedProducts, Recommendation } from '../services/geminiService';
import { ChatIcon } from './icons/ChatIcon';
import { XIcon } from './icons/XIcon';

interface ChatbotProps {
  products: Product[];
}

interface Message {
  sender: 'user' | 'bot';
  text: string;
  recommendations?: Product[];
}

const BotMessage: React.FC<{ message: Message }> = ({ message }) => (
    <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-500 flex items-center justify-center font-bold text-white">B</div>
        <div className="bg-gray-700 p-3 rounded-lg max-w-xs md:max-w-md">
            <p className="text-sm">{message.text}</p>
            {message.recommendations && message.recommendations.length > 0 && (
                <div className="mt-3 space-y-2">
                    {message.recommendations.map(product => (
                        <div key={product.id} className="flex items-center space-x-2 bg-gray-800 p-2 rounded-md">
                            <img src={product.imageUrl} alt={product.name} className="w-12 h-12 object-cover rounded-md" />
                            <div>
                                <p className="font-semibold text-xs">{product.name}</p>
                                <p className="text-green-400 font-bold text-sm">${product.price.toFixed(2)}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    </div>
);

const UserMessage: React.FC<{ message: Message }> = ({ message }) => (
    <div className="flex justify-end">
        <div className="bg-green-600 text-white p-3 rounded-lg max-w-xs md:max-w-md">
            <p className="text-sm">{message.text}</p>
        </div>
    </div>
);

export const Chatbot: React.FC<ChatbotProps> = ({ products }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'bot', text: "Hello! I'm FlexBot, your shopping assistant. How can I help you find the perfect tech accessory today?" }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = async () => {
    if (inputValue.trim() === '' || isLoading) return;

    const userMessage: Message = { sender: 'user', text: inputValue };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const { textResponse, recommendations } = await getRecommendedProducts(inputValue, products);
      
      const recommendedProducts = recommendations
        .map(rec => products.find(p => p.id === rec.id))
        .filter((p): p is Product => p !== undefined);

      const botMessage: Message = { sender: 'bot', text: textResponse, recommendations: recommendedProducts };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error(error);
      const errorMessage: Message = { sender: 'bot', text: 'Sorry, I had trouble connecting. Please try again.' };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className={`fixed bottom-0 right-0 m-6 transition-all duration-300 ${isOpen ? 'opacity-0 scale-90' : 'opacity-100 scale-100'}`}>
        <button onClick={() => setIsOpen(true)} className="bg-green-500 text-white rounded-full p-4 shadow-lg hover:bg-green-600 transition-colors">
          <ChatIcon className="w-8 h-8" />
        </button>
      </div>

      <div className={`fixed bottom-0 right-0 md:m-6 bg-gray-800/80 backdrop-blur-md rounded-lg shadow-2xl w-full h-full md:w-[400px] md:h-[600px] flex flex-col transition-all duration-300 ease-in-out z-50 ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
        <div className="flex items-center justify-between p-4 bg-gray-900 border-b border-gray-700 rounded-t-lg">
          <h3 className="font-bold text-lg text-green-400">FlexBot Assistant</h3>
          <button onClick={() => setIsOpen(false)} className="p-1 rounded-full hover:bg-gray-700">
            <XIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {messages.map((msg, index) => (
            msg.sender === 'user' ? <UserMessage key={index} message={msg} /> : <BotMessage key={index} message={msg} />
          ))}
          {isLoading && (
            <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-500 flex items-center justify-center font-bold text-white">B</div>
                <div className="bg-gray-700 p-3 rounded-lg">
                    <div className="flex space-x-1">
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-75"></span>
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-150"></span>
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-300"></span>
                    </div>
                </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 bg-gray-900 border-t border-gray-700 rounded-b-lg">
          <div className="flex items-center bg-gray-700 rounded-full">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask for recommendations..."
              className="w-full bg-transparent px-4 py-2 text-white placeholder-gray-400 focus:outline-none"
              disabled={isLoading}
            />
            <button onClick={handleSendMessage} disabled={isLoading} className="p-2 text-green-400 hover:text-green-300 disabled:text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.428A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
