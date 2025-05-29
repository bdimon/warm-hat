import { useState, useEffect } from "react";
import { X } from "lucide-react";
import FormField from "./FormField";
import { supabase } from "@/lib/supabase";
import { useSnackbar } from '@/hooks/use-snackbar';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {Input} from "@/components/ui/input";


interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { t, i18n } = useTranslation(); // Получаем i18n для доступа к текущему языку
  const currentLanguage = i18n.language.split('-')[0]; // Берем базовый язык, например, 'ru' из 'ru-RU'
  const [mode, setMode] = useState<'login' | 'register' | 'forgot-password'>('login');
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [resetEmail, setResetEmail] = useState('');
  const [formErrors, setFormErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const { showSnackbar } = useSnackbar();

  // Эффект для сброса состояния формы при закрытии модального окна
  useEffect(() => {
    // Когда модальное окно закрывается (isOpen становится false),
    // сбрасываем все внутренние состояния, связанные с формой.
    // Это гарантирует, что при повторном открытии модального окна (например, после смены языка),
    // оно начнется с чистого состояния, и любые последующие ошибки валидации
    // будут использовать текущий язык.
    if (!isOpen) {
      setForm({ name: '', email: '', password: '', confirmPassword: '' });
      setFormErrors({ name: '', email: '', password: '', confirmPassword: '' });
      setResetEmail('');
      setMode('login'); // Сброс в режим по умолчанию
    }
  }, [isOpen]); // Этот эффект выполняется при изменении пропа `isOpen`.

  // Эффект для сброса ошибок формы при смене режима (логин, регистрация, сброс пароля)
  useEffect(() => {
    // Очищаем ошибки формы каждый раз, когда меняется режим.
    // Это предотвращает отображение нерелевантных ошибок из предыдущего режима.
    setFormErrors({ name: '', email: '', password: '', confirmPassword: '' });

    // Также очищаем поле resetEmail, если мы не в режиме 'forgot-password'.
    if (mode !== 'forgot-password') {
      setResetEmail('');
    }
  }, [mode]); // Этот эффект выполняется при изменении состояния `mode`.

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validate = () => {
    const errors = { name: '', email: '', password: '', confirmPassword: '' };
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!form.email.trim()) {
      errors.email = t('authModal.validation.emailRequired');
    } else if (!emailRegex.test(form.email)) {
      errors.email = t('authModal.validation.emailInvalid');
    }

    if (!form.password.trim()) {
      errors.password = t('authModal.validation.passwordRequired');
    } else if (form.password.length < 6) {
      errors.password = t('authModal.validation.passwordTooShort');
    }

    if (mode === 'register') {
      if (!form.name.trim()) {
        errors.name = t('authModal.validation.nameRequired');
      }
      if (!form.confirmPassword.trim()) {
        errors.confirmPassword = t('authModal.validation.confirmPasswordRequired');
      } else if (form.password !== form.confirmPassword) {
        errors.confirmPassword = t('authModal.validation.passwordsDoNotMatch');
      }
    }

    setFormErrors(errors);
    return !Object.values(errors).some((e) => e);
  };

  const handlePasswordResetRequest = async () => {
    if (!resetEmail.trim()) {
      showSnackbar(t('authModal.forgotPassword.enterEmail'), 'info');
      return;
    }
    try {
      // URL, на который Supabase перенаправит пользователя после клика по ссылке в письме
      // Убедитесь, что этот URL соответствует пути к вашей UpdatePasswordPage
      const redirectUrl = `${window.location.origin}/update-password`;
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: redirectUrl,
      });
      if (error) throw error;
      showSnackbar(t('authModal.forgotPassword.resetLinkSent'), 'info');
      onClose(); // Закрыть модальное окно после отправки
    } catch (err: unknown) {
      showSnackbar(t('authModal.forgotPassword.resetError'), 'error');
      if (err instanceof Error) {
        console.error('Password reset request error:', err.message, err);
      } else {
        console.error('Unexpected error:', err);
      }
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`, // Or any other page you want to redirect to after login
        },
      });
      if (error) throw error;
      // // Supabase handles redirection, so we might not need a success snackbar here immediately
      // // or to close the modal, as the page will redirect.
      // // showSnackbar(t("authModal.googleLogin.redirecting"), "info");
    } catch (err: unknown) {
      showSnackbar(t('authModal.googleLogin.error'), 'error');
      if (err instanceof Error) {
        console.error('Google OAuth error:', err.message);
      } else {
        console.error('Unexpected Google OAuth error:', err);
      }
    }
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      if (mode === 'register') {
        const { data, error } = await supabase.auth.signUp({
          email: form.email,
          password: form.password,
          options: {
            data: {
              full_name: form.name, // Передаем имя для использования в триггерах или для авто-создания профиля
            },
          },
        });
        if (error) throw error;
        showSnackbar(t('authModal.register.success'), 'success');
        // if (data.user) await createProfile(data.user.id, form.name);

        onClose();
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: form.email,
          password: form.password,
        });
        if (error) throw error;
        showSnackbar(t('authModal.login.success'), 'success');
        onClose();
      }
    } catch (err: unknown) {
      showSnackbar(t('authModal.authError'), 'error');

      if (err instanceof Error) {
        console.error('Auth error:', err.message);
      } else {
        console.error('Unexpected error:', err);
      }
    }
  };

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

        {/* Основная форма входа/регистрации */}
        {mode !== 'forgot-password' && (
          <>
            <h2 className='text-xl font-bold mb-4'>
              {t(mode === 'login' ? 'authModal.login.title' : 'authModal.register.title')}
            </h2>
            {mode === 'register' && (
              <FormField label={t('authModal.register.nameLabel')} error={formErrors.name}>
                <Input
                  name='name'
                  type='text'
                  value={form.name}
                  onChange={handleChange}
                  placeholder={t('authModal.register.namePlaceholder')}
                  className={cn(
                    'w-full border p-2 rounded',
                    formErrors.name
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500' // Стили для ошибки
                      : 'border-gray-300 focus:border-shop-blue-dark focus:ring-shop-blue-dark' // Стили по умолчанию/при фокусе) ${
                    // Базовые стили, включая border
                  )}
                />
              </FormField>
            )}
            <FormField label='Email' error={formErrors.email}>
              <Input
                name='email'
                type='email'
                value={form.email}
                onChange={handleChange}
                placeholder={t('authModal.emailPlaceholder')}
                className={cn(
                  'w-full border p-2 rounded',
                  formErrors.email
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500' // Стили для ошибки
                    : 'border-gray-300 focus:border-shop-blue-dark focus:ring-shop-blue-dark' // Стили по умолчанию/при фокусе) ${
                  // Базовые стили, включая border
                )}
              />
            </FormField>
            <FormField label={t('authModal.passwordLabel')} error={formErrors.password}>
              <Input
                name='password'
                type='password'
                value={form.password}
                onChange={handleChange}
                placeholder={t('authModal.passwordPlaceholder')}
                className={cn(
                  'w-full border p-2 rounded',
                  formErrors.password
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500' // Стили для ошибки
                    : 'border-gray-300 focus:border-shop-blue-dark focus:ring-shop-blue-dark' // Стили по умолчанию/при фокусе) ${
                  // Базовые стили, включая border
                )}
              />
            </FormField>
            {mode === 'register' && (
              <FormField label={t('authModal.register.confirmPasswordPlaceholder')} error={formErrors.confirmPassword}>
                <Input
                  name='confirmPassword'
                  type='password'
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder={t('authModal.register.confirmPasswordPlaceholder')}
                  className={cn(
                    'w-full border p-2 rounded',
                    formErrors.confirmPassword
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500' // Стили для ошибки
                      : 'border-gray-300 focus:border-shop-blue-dark focus:ring-shop-blue-dark' // Стили по умолчанию/при фокусе) ${
                    // Базовые стили, включая border
                  )}
                />
              </FormField>
            )}

            {mode === 'login' && (
              <Button
                className='mt-2 text-sm text-shop-blue-dark underline text-left w-full'
                onClick={() => setMode('forgot-password')}
              >
                {t('authModal.login.forgotPassword')}
              </Button>
            )}

            <Button
              onClick={handleSubmit}
              className='mt-4 w-full bg-shop-blue-dark text-white py-2 rounded hover:bg-shop-blue-dark/90'
            >
              {t(mode === 'login' ? 'authModal.login.button' : 'authModal.register.button')}
            </Button>

            <div className='my-4 flex items-center'>
              <hr className='flex-grow border-t border-gray-300' />
              <span className='mx-2 text-xs text-gray-500'>{t('authModal.login.or')}</span>
              <hr className='flex-grow border-t border-gray-300' />
            </div>
            <Button
              onClick={handleGoogleLogin}
              className='w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 flex items-center justify-center gap-2'
            >
              {' '}
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='18'
                height='18'
                viewBox='0 0 24 24'
                fill='currentColor'
              >
                <path d='M21.35,11.1H12.18V13.83H18.69C18.36,17.64 15.19,19.27 12.19,19.27C8.36,19.27 5,16.25 5,12C5,7.9 8.2,4.73 12.19,4.73C15.29,4.73 17.1,6.7 17.1,6.7L19,4.72C19,4.72 16.56,2 12.19,2C6.42,2 2.03,6.8 2.03,12C2.03,17.05 6.16,22 12.19,22C17.6,22 21.5,18.33 21.5,12.33C21.5,11.76 21.35,11.1 21.35,11.1V11.1Z'></path>
              </svg>{' '}
              {t('authModal.googleLogin.button')}
            </Button>

            <div className='mt-4 text-sm text-center'>
              {mode === 'login' ? (
                <>
                  {' '}
                  <Button
                    className='text-shop-blue-dark underline'
                    onClick={() => setMode('register')}
                  >
                    {t('authModal.login.noAccount')}
                  </Button>
                </>
              ) : (
                <>
                  {' '}
                  <Button
                    className='text-shop-blue-dark underline'
                    onClick={() => setMode('login')}
                  >
                    {t('authModal.register.hasAccount')}
                  </Button>
                </>
              )}
            </div>
          </>
        )}

        {/* Форма сброса пароля */}
        {mode === 'forgot-password' && (
          <>
            <h2 className='text-xl font-bold mb-4'>{t('authModal.forgotPassword.title')}</h2>
            <p className='text-sm text-gray-600 mb-4'>
              {t('authModal.forgotPassword.description')}
            </p>
            <FormField label={t('authModal.emailLabel')}>
              <input
                name='resetEmail'
                type='email'
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                placeholder={t('authModal.emailPlaceholder')}
              />
            </FormField>
            <Button
              onClick={handlePasswordResetRequest}
              className='mt-4 w-full bg-shop-blue-dark text-white py-2 rounded hover:bg-shop-blue-dark/90'
            >
              {t('authModal.forgotPassword.sendResetLink')}
            </Button>
            <div className='mt-4 text-sm text-center'>
              <Button
                className='text-shop-blue-dark underline'
                onClick={() => {
                  setMode('login');
                  setResetEmail(''); // Очистить поле при возврате
                }}
              >
                {t('authModal.forgotPassword.backToLogin')}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
