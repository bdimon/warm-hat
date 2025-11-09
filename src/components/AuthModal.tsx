import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { LoginForm } from './auth/LoginForm';
import { RegisterForm } from './auth/RegisterForm';
import { ForgotPasswordForm } from './auth/ForgotPasswordForm';
import { BaseModal } from '@/components/ui/base-modal';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { t } = useTranslation();
  const [mode, setMode] = useState<'login' | 'register' | 'forgot-password'>('login');

  // Reset mode when modal closes
  useEffect(() => {
    if (!isOpen) {
      setMode('login');
    }
  }, [isOpen]);

  const titles = {
    login: t('authModal.loginTitle'),
    register: t('authModal.registerTitle'),
    'forgot-password': t('authModal.forgotPasswordTitle'),
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title={titles[mode]} maxWidth='sm'>
      {mode === 'login' && <LoginForm onSuccess={onClose} onSwitchMode={setMode} />}
      {mode === 'register' && <RegisterForm onSuccess={onClose} onSwitchMode={setMode} />}
      {mode === 'forgot-password' && (
        <ForgotPasswordForm onSuccess={onClose} onSwitchMode={setMode} />
      )}
    </BaseModal>
  );
}
