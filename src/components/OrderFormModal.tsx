
import { useCart } from '@/hooks/use-cart';
import { useSnackbar } from '@/hooks/use-snackbar';
import { supabase } from '@/lib/supabase-client';
import { cn } from '@/lib/utils';
import { Loader2, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import FormField from './FormField';
import { useTranslation } from 'react-i18next';
import { isValidPhoneNumber } from 'react-phone-number-input'; // 1. Импортируем функцию валидации
import PhoneInput from '@/components/ui/phone-input';
import { SupportedLanguage, CURRENCY_SYMBOLS } from '@/types/Product';
import { getLocalizedValue } from '@/lib/mappers/products';
import { loadStripe } from '@stripe/stripe-js';

// Получаем ключ из переменных окружения
const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
// console.log('[OrderFormModal] Publishable Key:', stripePublishableKey); // Для отладки

// Загружаем Stripe один раз при инициализации приложения
const stripePromise = loadStripe(stripePublishableKey);

// Добавьте проверку при загрузке компонента
function CheckStripeKey() {
  useEffect(() => {
    if (!stripePublishableKey) {
      console.error('ОШИБКА: Переменная окружения VITE_STRIPE_PUBLISHABLE_KEY не установлена!');
    }
  }, []);
  return null;
}

// Функция для преобразования относительных URL в абсолютные
const getAbsoluteImageUrl = (relativeUrl) => {
  if (!relativeUrl) return null;
  if (relativeUrl.startsWith('http://') || relativeUrl.startsWith('https://')) {
    return relativeUrl;
  }
  // Используем базовый URL вашего сайта
  return `${window.location.origin}${relativeUrl}`;
};

interface OrderFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  closeCart: () => void;
}

export default function OrderFormModal({ isOpen, onClose, closeCart }: OrderFormModalProps) {
  const { cart, clearCart } = useCart();
  const { showSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [profileId, setProfileId] = useState('');
  const [form, setForm] = useState({
    name: '',
    address: '',
    phone: '',
    payment: 'card',
  });
  const { t, i18n } = useTranslation();

  // Получаем текущий язык и преобразуем его в SupportedLanguage
  const currentLang = i18n.language.split('-')[0] as SupportedLanguage;
  
  // Получаем символ валюты для текущего языка
  const currencySymbol = CURRENCY_SYMBOLS[currentLang];

  const [formErrors, setFormErrors] = useState({
    name: '',
    address: '',
    phone: '',
  });

  useEffect(() => {
    let isMounted = true;

    const fetchProfile = async () => {
      const { data: authData, error: authError } = await supabase.auth.getUser();
      // console.log('[OrderFormModal]fetchProfile', authData);
      if (!isMounted) return;

      if (authError) {
        console.error(authError.message);
        showSnackbar(t('orderFormModal.errorNoUser'), 'error');
        setUserEmail('');
        setProfileId('');
        return;
      }

      const user = authData?.user;
      if (!user) {
        setUserEmail('');
        setProfileId('');
        return;
      }

      setUserEmail(user.email || '');
      setProfileId(user.id);

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('full_name, address, phone')
        .eq('id', user.id)
        .single();

      if (!isMounted) return;

      if (profileError && profileError.code !== 'PGRST116') {
        console.error(profileError.message);
        showSnackbar('Ошибка загрузки профиля', 'error');
        return;
      }

      if (profile) {
        setForm((prev) => ({
          ...prev,
          name: profile.full_name || prev.name,
          address: profile.address || prev.address,
          phone: profile.phone || prev.phone,
        }));
      }
    };

    if (isOpen) fetchProfile();
    return () => {
      isMounted = false;
    };
  }, [isOpen, showSnackbar, t]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // 2. Отдельный обработчик для номера телефона
  const handlePhoneChange = (phoneNumberE164: string | undefined) => {
    setForm((prev) => ({ ...prev, phone: phoneNumberE164 || '' }));
  };

  const total = cart.reduce((sum, item) => {
    const price = item.isSale && item.salePrice 
      ? getLocalizedValue(item.salePrice, currentLang)
      : getLocalizedValue(item.price, currentLang);
    return sum + price * item.quantity;
  }, 0);

  const handleSubmit = async () => {
    // console.log('1. handleSubmit начал выполнение, метод оплаты:', form.payment);
    
    const errors = {
      name: form.name.trim() ? '' : t('orderFormModal.name'),
      address: form.address.trim() ? '' : t('orderFormModal.address'),
      phone: form.phone && isValidPhoneNumber(form.phone) ? '' : t('orderFormModal.phone'),
      payment: form.payment ? '' : t('orderFormModal.payment'),
    };

    setFormErrors(errors);
    const hasErrors = Object.values(errors).some(Boolean);
    // console.log('2. Валидация формы:', hasErrors ? 'есть ошибки' : 'форма валидна');
    
    if (hasErrors || cart.length === 0) {
      if (cart.length === 0) showSnackbar(t('cartModal.emptyCart'), 'warning');
      // console.log('3. Выход из handleSubmit из-за ошибок или пустой корзины');
      return;
    }

    const items = cart.map((item) => ({
      id: item.id,
      name: item.name,
      quantity: item.quantity,
      images: item.images,
      price: item.isSale && item.salePrice ? item.salePrice : item.price,
    }));

    // console.log('4. Подготовленные товары:', items);
    // console.log('5. Общая сумма:', total);

    setLoading(true);
    try {
      if (form.payment === 'card') {
        // console.log('6. Начинаем обработку оплаты картой');
        
        // Создаем заказ в Supabase
        // console.log('7. Создаем заказ в Supabase');
        const { data: orderData, error } = await supabase.from('orders').insert({
          items,
          total,
          user_id: profileId,
          payment_method: form.payment,
          status: 'pending',
          name: form.name,
          address: form.address,
          phone: form.phone,
        }).select().single();

        if (error) {
          console.error('8. Ошибка при создании заказа:', error);
          throw error;
        }

        // console.log('9. Заказ успешно создан:', orderData);

        // Создаем Checkout Session на сервере
        // console.log('10. Отправляем запрос на создание Checkout Session');
        const response = await fetch('http://localhost:3010/api/payments/create-checkout-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId: orderData.id,
            items: cart.map(item => ({
              name: item.name,
              price: item.price,
              quantity: item.quantity,
              // Преобразуем относительные URL в абсолютные
              images: item.images && item.images.length > 0 
                ? [getAbsoluteImageUrl(item.images[0])]
                : []
            }))
          }),
        });

        // console.log('11. Получен ответ от сервера:', response.status, response.statusText);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('12. Ошибка ответа сервера:', errorText);
          throw new Error(`Ошибка сервера: ${response.status} ${response.statusText}`);
        }

        const responseData = await response.json();
        // console.log('13. Данные ответа:', responseData);
        
        // Перенаправляем на Checkout
        console.log('14. Загружаем Stripe');
        const stripe = await stripePromise;
        console.log('15. Перенаправляем на Checkout с sessionId:', responseData.sessionId);
        const { error: stripeError } = await stripe.redirectToCheckout({
          sessionId: responseData.sessionId
        });
        
        if (stripeError) {
          console.error('16. Ошибка Stripe redirectToCheckout:', stripeError);
          throw stripeError;
        }
      } else {
        console.log('6. Начинаем обработку другого метода оплаты:', form.payment);
        // Обработка для других методов оплаты (наличные, самовывоз)
        const { error } = await supabase.from('orders').insert({
          items,
          total,
          user_id: profileId,
          payment_method: form.payment,
          status: 'new',
          name: form.name,
          address: form.address,
          phone: form.phone,
        });

        if (error) {
          console.error('7. Ошибка при создании заказа:', error);
          showSnackbar(t('orderFormModal.serverError'), 'error');
          return;
        }

        // console.log('8. Заказ успешно создан, очищаем корзину и закрываем модальное окно');
        clearCart();
        onClose();
        closeCart();
        showSnackbar(t('orderFormModal.orderSuccess'), 'success');
      }
    } catch (err) {
      console.error('Ошибка при оформлении заказа:', err);
      showSnackbar(t('orderFormModal.orderError'), 'error');
    } finally {
      // console.log('17. Завершение handleSubmit, устанавливаем loading в false');
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className='fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center'
      onClick={onClose}
    >
      <div
        className='bg-white w-full max-w-lg rounded-lg p-4 sm:p-6 relative shadow-xl'
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className='absolute top-3 right-3 text-gray-500 hover:text-gray-700 transition-colors'
          onClick={onClose}
        >
          <X />
        </button>
        <h2 className='text-xl font-bold mb-4'>{t('orderFormModal.title')}</h2>

        <div className='space-y-4'>
          <FormField label={t('orderFormModal.labelName')} error={formErrors.name}>
            <input
              name='name'
              value={form.name}
              onChange={handleChange}
              placeholder={t('orderFormModal.name')}
              className={cn(
                'rounded border w-full p-2',
                formErrors.name
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500' // Стили для ошибки
                  : 'border-gray-300 focus:border-shop-blue-dark focus:ring-shop-blue-dark' // Стили по умолчанию/при фокусе) ${
                // Базовые стили, включая border
              )}
            />
          </FormField>

          <div className='text-sm text-gray-500 pt-1'>
            Email: <span className='font-medium'>{userEmail}</span>
          </div>

          <FormField label={t('orderFormModal.labelAddress')} error={formErrors.address}>
            <textarea
              name='address'
              value={form.address}
              onChange={handleChange}
              placeholder={t('orderFormModal.address')}
              className={cn(
                'rounded border w-full p-2',
                formErrors.address
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500' // Стили для ошибки
                  : 'border-gray-300 focus:border-shop-blue-dark focus:ring-shop-blue-dark' // Стили по умолчанию/при фокусе) ${
                // Базовые стили, включая border
              )}
              rows={4}
            />
          </FormField>

          <FormField label={t('orderFormModal.labelPhone')} error={formErrors.phone}>
            <PhoneInput
              value={form.phone}
              onChange={handlePhoneChange}
              inputClassName={cn(
                'rounded border w-full p-2',
                formErrors.phone
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500' // Стили для ошибки
                  : 'border-gray-300 focus:border-shop-blue-dark focus:ring-shop-blue-dark'
              )}
            />
          </FormField>

          <FormField label={t('orderFormModal.labelPayment')}>
            <select
              name='payment'
              value={form.payment}
              onChange={handleChange}
              className={cn(
                'w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 text-sm',
                'focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-shop-blue-dark focus:border-shop-blue-dark'
              )}
            >
              <option value='card'>{t('orderFormModal.card')}</option>
              <option value='cod'>{t('orderFormModal.cod')}</option>
              <option value='pickup'>{t('orderFormModal.pickup')}</option>
            </select>
          </FormField>
        </div>

        <div className='mt-6 flex justify-between items-center'>
          <span className='font-semibold text-shop-blue-dark'>{t('orderFormModal.total')}</span>
          <span className='text-lg font-bold'>{total.toFixed(2)} {currencySymbol}</span>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className={cn(
            'mt-6 w-full flex items-center justify-center bg-shop-blue-dark text-white py-2.5 rounded-md hover:bg-shop-blue-dark/90 transition-colors',
            'disabled:opacity-60 disabled:cursor-not-allowed'
          )}
        >
          {loading ? (
            <>
              <Loader2 className='mr-2 h-5 w-5 animate-spin' />
              {t('orderFormModal.loading')}
            </>
          ) : (
            t('orderFormModal.confirm')
          )}
        </button>
      </div>
    </div>
  );
}
