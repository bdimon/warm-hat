import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { LoginForm } from './auth/LoginForm';
import { RegisterForm } from './auth/RegisterForm';
import { ForgotPasswordForm } from './auth/ForgotPasswordForm';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot-password'>('login');

  // Reset mode when modal closes
  useEffect(() => {
    if (!isOpen) {
      setMode('login');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className='fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center'
      onClick={onClose}
    >
      <div
        className='bg-white w-full max-w-sm rounded-lg p-6 relative'
        onClick={(e) => e.stopPropagation()}
      >
        <Button className='absolute top-3 right-3 text-gray-500' onClick={onClose}>
          <X />
        </Button>

        {mode === 'login' && <LoginForm onSuccess={onClose} onSwitchMode={setMode} />}

        {mode === 'register' && <RegisterForm onSuccess={onClose} onSwitchMode={setMode} />}

        {mode === 'forgot-password' && (
          <ForgotPasswordForm onSuccess={onClose} onSwitchMode={setMode} />
        )}
      </div>
    </div>
  );
}
