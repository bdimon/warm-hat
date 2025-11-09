import { TFunction } from 'i18next';

export const validateEmail = (email: string, t: TFunction): string => {
  if (!email.trim()) return t('authModal.validation.emailRequired');

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return t('authModal.validation.emailInvalid');

  return '';
};

export const validatePassword = (password: string, t: TFunction): string => {
  if (!password.trim()) return t('authModal.validation.passwordRequired');
  if (password.length < 6) return t('authModal.validation.passwordTooShort');
  return '';
};

export const validateName = (name: string, t: TFunction): string => {
  if (!name.trim()) return t('authModal.validation.nameRequired');
  return '';
};

export const validateConfirmPassword = (
  password: string,
  confirmPassword: string,
  t: TFunction
): string => {
  if (!confirmPassword.trim()) return t('authModal.validation.confirmPasswordRequired');
  if (password !== confirmPassword) return t('authModal.validation.passwordsDoNotMatch');
  return '';
};

// Small utilities that might be useful elsewhere in app
export const isEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
