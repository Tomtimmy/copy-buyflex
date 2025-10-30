import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { MeetingRequest } from '../types';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (request: Omit<MeetingRequest, 'id' | 'status'>) => void;
  initialTopic?: string;
}

export const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, onSubmit, initialTopic }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [topic, setTopic] = useState('');

  useEffect(() => {
    if (isOpen && initialTopic) {
        setTopic(initialTopic);
    } else if (!isOpen) {
        // Reset form on close
        setName('');
        setEmail('');
        setDate('');
        setTime('');
        setTopic('');
    }
  }, [isOpen, initialTopic]);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email && date && time && topic) {
      onSubmit({ name, email, date, time, topic });
    } else {
      alert('Please fill out all fields.');
    }
  };
  
  const today = new Date().toISOString().split('T')[0];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Book a Meeting with Customer Care">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="booking-name" className="block text-sm font-medium text-gray-300">Full Name</label>
          <input type="text" id="booking-name" value={name} onChange={e => setName(e.target.value)} required className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-green-500 focus:border-green-500" />
        </div>
        <div>
          <label htmlFor="booking-email" className="block text-sm font-medium text-gray-300">Email Address</label>
          <input type="email" id="booking-email" value={email} onChange={e => setEmail(e.target.value)} required className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-green-500 focus:border-green-500" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="booking-date" className="block text-sm font-medium text-gray-300">Preferred Date</label>
              <input type="date" id="booking-date" value={date} min={today} onChange={e => setDate(e.target.value)} required className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-green-500 focus:border-green-500" />
            </div>
             <div>
              <label htmlFor="booking-time" className="block text-sm font-medium text-gray-300">Preferred Time</label>
              <input type="time" id="booking-time" value={time} onChange={e => setTime(e.target.value)} required className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-green-500 focus:border-green-500" />
            </div>
        </div>
        <div>
          <label htmlFor="booking-topic" className="block text-sm font-medium text-gray-300">Topic</label>
          <input type="text" id="booking-topic" value={topic} onChange={e => setTopic(e.target.value)} placeholder="e.g., Bulk order inquiry, Support question" required className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-green-500 focus:border-green-500" />
        </div>
        <div className="flex justify-end space-x-3 pt-4">
          <button type="button" onClick={onClose} className="bg-gray-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors">Cancel</button>
          <button type="submit" className="bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600 transition-colors">Submit Request</button>
        </div>
      </form>
    </Modal>
  );
};