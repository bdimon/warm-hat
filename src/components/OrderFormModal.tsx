import { useCart } from '@/hooks/use-cart';
import { useSnackbar } from '@/hooks/use-snackbar';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';
import { Loader2, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import FormField from './FormField';

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
        showSnackbar('Не удалось загрузить пользователя', 'error');
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
  }, [isOpen, showSnackbar]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const total = cart.reduce((sum, item) => {
    const price = item.isSale && item.salePrice ? item.salePrice : item.price;
    return sum + price * item.quantity;
  }, 0);

  const handleSubmit = async () => {
    const errors = {
      name: form.name.trim() ? '' : 'Введите имя',
      address: form.address.trim() ? '' : 'Введите адрес',
      phone: /^\+?\d{10,15}$/.test(form.phone) ? '' : 'Введите корректный телефон',
    };

    setFormErrors(errors);
    const hasErrors = Object.values(errors).some(Boolean);
    if (hasErrors || cart.length === 0) {
      if (cart.length === 0) showSnackbar('Корзина пуста', 'warning');
      return;
    }

    const items = cart.map((item) => ({
      id: item.id,
      name: item.name,
      quantity: item.quantity,
      images: item.images,
      price: item.isSale && item.salePrice ? item.salePrice : item.price,
    }));

    setLoading(true);
    try {
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
        showSnackbar('Ошибка сервера', 'error');
        return;
      }

      clearCart();
      onClose();
      closeCart();
      showSnackbar('Заказ оформлен успешно!', 'success');
    } catch (err) {
      console.error(err);
      showSnackbar('Ошибка оформления заказа', 'error');
    } finally {
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
        <h2 className='text-xl font-bold mb-4'>Оформление заказа</h2>

        <div className='space-y-4'>
          <FormField label='Имя и фамилия' error={formErrors.name}>
            <input
              name='name'
              value={form.name}
              onChange={handleChange}
              placeholder='Введите имя'
              className='w-full border p-2 rounded border-gray-300'
            />
          </FormField>

          <div className='text-sm text-gray-500 pt-1'>
            Email: <span className='font-medium'>{userEmail}</span>
          </div>

          <FormField label='Адрес доставки' error={formErrors.address}>
            <textarea
              name='address'
              value={form.address}
              onChange={handleChange}
              placeholder='Введите адрес'
              className='w-full border p-2 rounded border-gray-300'
              rows={4}
            />
          </FormField>

          <FormField label='Телефон' error={formErrors.phone}>
            <input
              name='phone'
              type='tel'
              value={form.phone}
              onChange={handleChange}
              placeholder='+7...'
              className='w-full border p-2 rounded border-gray-300'
            />
          </FormField>

          <FormField label='Способ оплаты'>
            <select
              name='payment'
              value={form.payment}
              onChange={handleChange}
              className={cn(
                'w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 text-sm',
                'focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-shop-blue-dark focus:border-shop-blue-dark'
              )}
            >
              <option value='card'>Карта онлайн</option>
              <option value='cod'>Наложенный платёж</option>
              <option value='pickup'>Самовывоз</option>
            </select>
          </FormField>
        </div>

        <div className='mt-6 flex justify-between items-center'>
          <span className='font-semibold'>Сумма:</span>
          <span className='text-lg font-bold'>{total.toFixed(2)} ₽</span>
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
              Отправка...
            </>
          ) : (
            'Подтвердить заказ'
          )}
        </button>
      </div>
    </div>
  );
}
