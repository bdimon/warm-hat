import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase-client";
import FormField from "@/components/FormField";
import { User } from "@supabase/supabase-js";
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import {Loader2} from 'lucide-react'



type FormState = {
  email: string;
  password: string;
  confirmPassword: string;
};

interface AuthSettingsFormProps {
  onClose?: () => void; // Добавляем опциональный проп для закрытия
}

type FormErrors = Partial<Record<keyof FormState, string>>;

export default function AuthSettingsForm({ onClose }: AuthSettingsFormProps) {
  const { t } = useTranslation();
  const [form, setForm] = useState<FormState>({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [user, setUser] = useState<User | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    fetchUser();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = (): boolean => {
    const errors = { email: '', password: '', confirmPassword: '' };
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

    if (!form.confirmPassword.trim()) {
      errors.confirmPassword = t('authModal.validation.confirmPasswordRequired');
    } else if (form.password !== form.confirmPassword) {
      errors.confirmPassword = t('authModal.validation.passwordsDoNotMatch');
    }

    setFormErrors(errors);

    return !Object.values(errors).some((e) => e);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    if (!validate()) return;

    setLoading(true);

    const updates: {
      email?: string;
      password?: string;
    } = {};

    if (form.email.trim()) updates.email = form.email.trim();
    if (form.password.trim()) updates.password = form.password;

    const { error: updateError } = await supabase.auth.updateUser(updates);

    if (updateError) {
      setError("t('authSettings.error')): " + updateError.message);
    } else {
      let successMsg = t('authSettings.successPassword');
      if (updates.email && updates.password) {
        successMsg = t('authSettings.successAll');
      } else if (updates.email) {
        successMsg = t('authSettings.successEmail');
      }
      setMessage(successMsg);

      // очищаем только поля пароля
      setForm((prev) => ({
        ...prev,
        password: '',
        confirmPassword: '',
      }));

      setTimeout(() => {
        navigate('/');
      }, 1500);
    }

    setLoading(false);
  };

  if (!user) return <p>{t('authSettings.timeout')}</p>;

  return (
    <form onSubmit={handleSubmit} className='max-w-md space-y-4'>
      <h2 className='text-lg font-semibold'>{t('authSettings.title')}</h2>
      <p className='text-sm text-gray-600'>
        {t('authSettings.oldEmail')}: <span className='font-medium'>{user.email}</span>
      </p>

      <FormField label={t('authSettings.email')} error={formErrors.email}>
        <input
          name='email'
          type='email'
          value={form.email}
          onChange={handleChange}
          placeholder='example@mail.com'
          className={cn(
            'rounded border w-full p-2',
            formErrors.email
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500' // Стили для ошибки
              : 'border-gray-300   focus:border-shop-blue-dark focus:ring-shop-blue-dark' // Стили по умолчанию/при фокусе) ${
            // Базовые стили, включая border
          )}
        />
      </FormField>

      <FormField label={t('authSettings.password')} error={formErrors.password}>
        <input
          name='password'
          type='password'
          value={form.password}
          onChange={handleChange}
          placeholder={t('authModal.passwordPlaceholder')}
          className={cn(
            'rounded border w-full p-2',
            formErrors.password
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500' // Стили для ошибки
              : 'border-gray-300  focus:border-shop-blue-dark focus:ring-shop-blue-dark' // Стили по умолчанию/при фокусе) ${
            // Базовые стили, включая border
          )}
        />
      </FormField>

      <FormField label={t('authSettings.confirm')} error={formErrors.confirmPassword}>
        <input
          name='confirmPassword'
          type='password'
          value={form.confirmPassword}
          onChange={handleChange}
          placeholder={t('authSettings.confirm')}
          className={cn(
            'rounded border w-full p-2',
            formErrors.confirmPassword
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500' // Стили для ошибки
              : 'border-gray-300  focus:border-shop-blue-dark focus:ring-shop-blue-dark' // Стили по умолчанию/при фокусе) ${
            // Базовые стили, включая border
          )}
        />
      </FormField>

      {error && <p className='text-red-500 text-sm'>{error}</p>}
      {message && <p className='text-green-600 text-sm'>{message}</p>}
      <div className='flex items-center space-x-3 pt-2'>
        <button
          type='submit'
          disabled={loading}
          className='flex items-center justify-center bg-shop-blue-dark text-white px-4 py-2 rounded disabled:opacity-50'
        >
          {loading ? (
            <>
              <Loader2 className='mr-2 h-5 w-5 animate-spin' />
              {t('authSettings.loading')}
            </>
          ) : (
            t('authSettings.save')
          )}
        </button>
        {onClose && (
          <button
            type='button'
            onClick={onClose}
            className='px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-shop-blue-dark rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors duration-150'
            disabled={loading}
          >
            {t('authSettings.cancel')}
          </button>
        )}
      </div>
    </form>
  );
}
