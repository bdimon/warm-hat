import { TFunction } from 'i18next';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

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

/**
 * Generic required validator that accepts a translation key for the error message.
 * Useful for fields where the translation key differs (e.g. orderFormModal.name).
 */
export const validateRequired = (value: string, t: TFunction, msgKey: string): string => {
  return value && value.trim() ? '' : t(msgKey);
};

/**
 * Phone validator wrapper using react-phone-number-input's isValidPhoneNumber.
 * Returns translated error message (msgKey) when invalid.
 */
export const validatePhone = (phone: string, t: TFunction, msgKey: string): string => {
  if (!phone) return t(msgKey);
  try {
    const parsed = parsePhoneNumberFromString(phone);
    return parsed && parsed.isValid() ? '' : t(msgKey);
  } catch (e) {
    return t(msgKey);
  }
};
