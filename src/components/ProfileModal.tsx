import React from 'react';
import AuthSettingsForm from './AuthSettingsForm';
import { BaseModal } from '@/components/ui/base-modal';
import { useTranslation } from 'react-i18next';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title={t('profileModal.title')} maxWidth='md'>
      <AuthSettingsForm onClose={onClose} />
    </BaseModal>
  );
};

export default ProfileModal;
