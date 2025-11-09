// Re-export centralized validators so older relative imports continue to work.
export {
  validateEmail,
  validatePassword,
  validateName,
  validateConfirmPassword,
} from '@/lib/validation';
