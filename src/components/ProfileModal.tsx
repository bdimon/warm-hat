import React from 'react';
import AuthSettingsForm from './AuthSettingsForm';
import { X } from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[60] p-4 transition-opacity duration-300 ease-in-out'>
      <div className='bg-white p-6 sm:p-8 rounded-lg shadow-xl max-w-md w-full relative transform transition-all duration-300 ease-in-out scale-95 opacity-0 animate-modal-scale-fade-in'>
        <button
          onClick={onClose}
          className='absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors'
          aria-label='Закрыть настройки профиля'
        >
          <X size={24} />
        </button>
        <AuthSettingsForm onClose={onClose} /> {/* Передаем onClose в AuthSettingsForm */}
      </div>
    </div>
  );
};

export default ProfileModal;
