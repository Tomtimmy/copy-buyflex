import React from 'react';
import { Modal } from './Modal';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose, title, children }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="text-gray-300 space-y-4 max-h-[60vh] overflow-y-auto pr-2">
        {children}
      </div>
    </Modal>
  );
};
