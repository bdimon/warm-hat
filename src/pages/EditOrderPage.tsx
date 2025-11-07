import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSnackbar } from '@/hooks/use-snackbar';
import { supabase } from '@/lib/supabase-client';
import OrderForm from '@/components/OrderForm';
import { RegionalPrice } from '@/types/Product';
import { useTranslation } from 'react-i18next';
import { SupportedLanguage, CURRENCY_SYMBOLS } from '@/types/Product';
import {
  formatOrderTotal,
  translateOrderStatus,
} from '@/lib/mappers/orders';
import { formatPrice, getLocalizedValue} from '@/lib/mappers/products';
import { isValidPhoneNumber } from 'react-phone-number-input'; // 1. Импортируем функцию валидации
import PhoneInput from '@/components/ui/phone-input';

// Эти типы используются локально, если они не экспортируются из use-order-form,
// то импорт не нужен. Если экспортируются, раскомментируйте:
// import { OrderFormData, OrderFormErrors } from "@/hooks/use-order-form";

// Локальные определения типов, если не используются из хука
interface OrderFormData {
  name: string;
  address: string;
  phone: string;
}
interface OrderFormErrors {
  name?: string;
  address?: string;
  phone?: string;
}

export default function EditOrderPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar(); // Original showSnackbar
  const { t, i18n } = useTranslation();
  const currentLanguage = (i18n.language as SupportedLanguage) || 'en';
  const currencySymbol = CURRENCY_SYMBOLS[currentLanguage];

  // Ref to hold the latest showSnackbar function
  // This helps if showSnackbar itself is a new function on every render,
  // causing the main data fetching useEffect to re-run.
  const showSnackbarRef = useRef(showSnackbar);
  useEffect(() => {
    showSnackbarRef.current = showSnackbar;
  }, [showSnackbar]);

  const [form, setForm] = useState<OrderFormData>({
    name: '',
    address: '',
    phone: '',
  });
  const [errors, setErrors] = useState<OrderFormErrors>({});
  const [loading, setLoading] = useState(true); // Устанавливаем true изначально, т.к. данные загружаются
  const [userEmail, setUserEmail] = useState('');
  const [total, setTotal] = useState<number | RegionalPrice>(0);
  const [editable, setEditable] = useState(false);
  // Ref to track if the fetch is in progress for the current id
  const isFetchingRef = useRef(false);
  // Ref to track the id for which data was last fetched or being fetched.
  const fetchedIdRef = useRef<string | null | undefined>(null);

  useEffect(() => {
    // console.log(
    //   `[EditOrderPage] useEffect triggered. ID: ${id}, Current isFetching: ${isFetchingRef.current}, Fetched ID: ${fetchedIdRef.current}`
    // );

    if (!id) {
      // console.log('[EditOrderPage] No ID, setting loading to false and returning.');
      setLoading(false);
      // Optionally navigate away if an ID is always expected
      // navigate('/some-error-page-or-back');
      return;
    }

    const fetchOrderData = async () => {
      // Prevent re-entry if already fetching for the *same* id due to rapid effect triggers
      if (isFetchingRef.current && fetchedIdRef.current === id) {
        // console.log(
        //   `[EditOrderPage] Fetch already in progress for ID: ${id}. Aborting subsequent call.`
        // );
        return;
      }

      // console.log(`[EditOrderPage] Starting fetchOrderData for ID: ${id}`);
      isFetchingRef.current = true;
      fetchedIdRef.current = id;
      setLoading(true);

      try {
        const { data: orderData, error: orderError } = await supabase
          .from('orders')
          .select('*, user_id, name, address, phone') // Be specific if possible
          .eq('id', id)
          .single();

        if (orderError || !orderData) {
          console.error('[EditOrderPage] Error fetching order data or no order data:', orderError);
          showSnackbarRef.current(t('adminOrderDetail.errorNotFound'), 'warning');
          navigate('/profile');
          return; // Exit after navigation
        }

        // console.log('[EditOrderPage] Order data fetched:', orderData);
        const {
          total: orderTotalAmount,
          status: orderStatus,
          user_id,
          name: orderSpecificName,
          address: orderSpecificAddress,
          phone: orderSpecificPhone,
        } = orderData;

        setTotal(orderTotalAmount);
        setEditable(orderStatus === 'new');

        // console.log(`[EditOrderPage] Fetching profile data for user_id: ${user_id}`);
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('full_name, address, phone, email')
          .eq('id', user_id)
          .single();

        if (profileError || !profileData) {
          console.error(
            '[EditOrderPage] Error fetching profile data or no profile data:',
            profileError
          );
          showSnackbarRef.current(t('adminOrderDetail.errorLoading'), 'warning');
          setForm({
            name: orderSpecificName || '',
            address: orderSpecificAddress || '',
            phone: orderSpecificPhone || '',
          });
          setUserEmail('');
        } else {
          // console.log('[EditOrderPage] Profile data fetched:', profileData);
          setUserEmail(profileData.email || '');
          setForm({
            name: orderSpecificName || profileData.full_name || '',
            address: orderSpecificAddress || profileData.address || '',
            phone: orderSpecificPhone || profileData.phone || '',
          });
        }
      } catch (e) {
        console.error('[EditOrderPage] Unexpected error in fetchOrderData:', e);
        showSnackbarRef.current(
          'Произошла непредвиденная ошибка при загрузке данных заказа.',
          'error'
        );
      } finally {
        // console.log(
        //   `[EditOrderPage] fetchOrderData finished for ID: ${id}. Setting loading to false.`
        // );
        setLoading(false);
        isFetchingRef.current = false;
      }
    };

    fetchOrderData();
  }, [id, navigate, t]); // `showSnackbar` is now accessed via ref, so it's removed from deps.

  // 2. Отдельный обработчик для номера телефона
  const handlePhoneChange = (phoneNumberE164: string | undefined) => {
    setForm((prev) => ({ ...prev, phone: phoneNumberE164 || '' }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    if (!editable) {
      console.warn('[EditOrderPage] Attempted to change form while not editable.');
      return;
    }
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validate = (): OrderFormErrors => {
    const newErrors: OrderFormErrors = {};
    if (!form.name.trim()) newErrors.name = t('orderFormModal.name');
    if (!form.address.trim()) newErrors.address = t('orderFormModal.address');
    newErrors.phone = form.phone && isValidPhoneNumber(form.phone) ? '' : t('orderFormModal.phone');
    return newErrors;
  };

  const handleSubmit = async () => {
    // console.log('[EditOrderPage] handleSubmit', editable.toString());
    if (!editable) return;

    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.values(validationErrors).some(Boolean)) return;

    setLoading(true);
    // Добавляем { count: 'exact' } и запрашиваем count
    const { error, count } = await supabase
      .from('orders')
      .update(
        {
          // Обновляем поля заказа актуальными данными из формы
          name: form.name,
          address: form.address,
          phone: form.phone,
        },
        { count: 'exact' }
      ) // Опция для получения точного количества измененных строк
      .eq('id', id);

    // console.log('[EditOrderPage] Update result - error:', error, 'count:', count);

    if (error) {
      showSnackbar('Не удалось сохранить: ' + error.message, 'error');
    } else if (count === 0) {
      // Если count === 0, значит RLS политика (USING) не позволила обновить строку,
      // или строка с таким id не найдена.
      showSnackbar(
        'Изменения не были применены. Возможно, заказ нельзя редактировать или он не найден.',
        'error'
      );
    } else {
      showSnackbar('Изменения сохранены', 'success');
      navigate('/profile', { state: { openOrdersModal: true } }); // Возвращаемся к модалке заказов
    }

    setLoading(false);
  };

  return (
    <OrderForm
      form={form}
      errors={errors}
      onChange={handleChange}
      onSubmit={handleSubmit}
      loading={loading}
      total={total}
      userEmail={userEmail}
      disabled={!editable}
      submitText={editable ? 'Сохранить изменения' : 'Редактирование недоступно'}
    />
  );
}
