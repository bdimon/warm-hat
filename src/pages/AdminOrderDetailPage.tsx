import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Order as SupabaseOrder} from '@/types/supabase'; // Базовый тип Order из Supabase
import {ProductInCart} from '@/types/cart'
import { useSnackbar } from '@/hooks/use-snackbar';
import { SupportedLanguage, CURRENCY_SYMBOLS } from '@/types/Product';
import { useTranslation } from 'react-i18next';
import { formatPrice, getLocalizedValue } from '@/lib/mappers/products';

// Возможные статусы заказа
const ORDER_STATUSES: SupabaseOrder['status'][] = ['new', 'pending', 'paid', 'delivered'];

// Расширяем тип Order, чтобы включить email пользователя из auth схемы
interface DetailedOrder extends SupabaseOrder {
  auth_user_email?: string;
}

export default function AdminOrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<DetailedOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<DetailedOrder['status'] | ''>('');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language as SupportedLanguage || 'en';
  const currencySymbol = CURRENCY_SYMBOLS[currentLanguage];

  useEffect(() => {
    if (!id) {
      setError(t('adminOrderDetail.errorNoId'));
      setLoading(false);
      return;
    }

    const fetchOrder = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`http://localhost:3010/api/orders/${id}`);
        if (!res.ok) {
          if (res.status === 404) {
            throw new Error(t('adminOrderDetail.errorNotFound'));
          }
          throw new Error(t('adminOrderDetail.errorLoading'));
        }
        const data: DetailedOrder = await res.json();
        setOrder(data);
        setSelectedStatus(data.status);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError(t('adminOrderDetail.errorUnknown'));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, t]);

  const handleStatusChange = async () => {
    if (!order || !selectedStatus || selectedStatus === order.status) {
      showSnackbar(t('adminOrderDetail.statusNoChange'), 'info');
      return;
    }

    setIsUpdatingStatus(true);
    try {
      const res = await fetch(`http://localhost:3010/api/orders/${order.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: selectedStatus }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: t('adminOrderDetail.errorUpdateStatus') }));
        throw new Error(errorData.message || t('adminOrderDetail.errorUpdateStatus'));
      }

      const updatedOrder: DetailedOrder = await res.json();
      setOrder(updatedOrder);
      setSelectedStatus(updatedOrder.status);
      showSnackbar(t('adminOrderDetail.statusUpdateSuccess'), 'success');
    } catch (err) {
      if (err instanceof Error) {
        showSnackbar(err.message, 'error');
      } else {
        showSnackbar(t('adminOrderDetail.errorUpdateUnknown'), 'error');
      }
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  if (loading) {
    return (
      <div className='min-h-screen flex flex-col'>
        <Header showBackButton onBackClick={() => navigate('/admin/dashboard')} />
        <div className='flex-grow flex items-center justify-center'>
          <Loader2 className='h-8 w-8 animate-spin text-shop-blue-dark' />
          <p className='ml-2 text-gray-600'>{t('adminOrderDetail.loading')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='min-h-screen flex flex-col'>
        <Header showBackButton onBackClick={() => navigate('/admin/dashboard')} />
        <div className='flex-grow flex items-center justify-center text-center'>
          <div>
            <p className='text-xl text-red-600 mb-4'>{t('adminOrderDetail.error')}: {error}</p>
            <Button onClick={() => navigate('/admin/dashboard')} className='bg-shop-blue-dark text-white'>
              {t('adminOrderDetail.backToOrders')}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className='min-h-screen flex flex-col'>
        <Header showBackButton onBackClick={() => navigate('/admin/dashboard')} />
        <div className='flex-grow flex items-center justify-center'>
          <p className='text-xl text-gray-700'>{t('adminOrderDetail.orderNotFound')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <Header showBackButton onBackClick={() => navigate('/admin/dashboard')} />
      <div className='container mx-auto pt-24 pb-12 px-4'>
        <h1 className='text-3xl font-bold mb-8 text-shop-text'>
          {t('adminOrderDetail.title')} <span className='font-mono'>{order.id.substring(0, 8)}...</span>
        </h1>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          {/* Информация о заказе и клиенте */}
          <div className='md:col-span-2 bg-white p-6 rounded-lg shadow-md space-y-6'>
            <div>
              <h2 className='text-xl font-semibold text-shop-text mb-3'>{t('adminOrderDetail.customerInfo')}</h2>
              <p>
                <strong>{t('adminOrderDetail.name')}:</strong> {order.name || t('adminOrderDetail.notSpecified')}
              </p>
              <p>
                <strong>{t('adminOrderDetail.email')}:</strong> {order.customer_email || order.auth_user_email || t('adminOrderDetail.notSpecified')}
              </p>
              <p>
                <strong>{t('adminOrderDetail.phone')}:</strong> {order.phone || t('adminOrderDetail.notSpecified')}
              </p>
              <p>
                <strong>{t('adminOrderDetail.address')}:</strong> {order.address || t('adminOrderDetail.notSpecified')}
              </p>
            </div>
            <hr />
            <div>
              <h2 className='text-xl font-semibold text-shop-text mb-3'>
                {t('adminOrderDetail.paymentDeliveryDetails')}
              </h2>
              <p>
                <strong>{t('adminOrderDetail.createdAt')}:</strong> {new Date(order.created_at).toLocaleString(i18n.language)}
              </p>
              <p>
                <strong>{t('adminOrderDetail.totalAmount')}:</strong> {formatPrice(order.total, currentLanguage)}
              </p>
              <p>
                <strong>{t('adminOrderDetail.paymentMethod')}:</strong> {order.payment_method}
              </p>
            </div>
          </div>

          {/* Статус заказа */}
          <div className='bg-white p-6 rounded-lg shadow-md space-y-4'>
            <h2 className='text-xl font-semibold text-shop-text'>{t('adminOrderDetail.orderStatus')}</h2>
            <p className='text-lg font-medium capitalize'>
              {t('adminOrderDetail.current')}:{' '}
              <span
                className={`px-2 py-1 rounded-full text-sm ${
                  order.status === 'delivered'
                    ? 'bg-green-100 text-green-700'
                    : order.status === 'paid'
                      ? 'bg-blue-100 text-blue-700'
                      : order.status === 'pending'
                        ? 'bg-orange-100 text-orange-700'
                        : order.status === 'new'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-gray-100 text-gray-700'
                }`}
              >
                {t(`adminOrderDetail.statuses.${order.status}`)}
              </span>
            </p>
            <div>
              <label
                htmlFor='status-select'
                className='block text-sm font-medium text-gray-700 mb-1'
              >
                {t('adminOrderDetail.changeStatus')}:
              </label>
              <Select
                value={selectedStatus || undefined}
                onValueChange={(value: DetailedOrder['status']) => setSelectedStatus(value)}
              >
                <SelectTrigger id='status-select' className='w-full'>
                  <SelectValue placeholder={t('adminOrderDetail.selectNewStatus')} />
                </SelectTrigger>
                <SelectContent>
                  {ORDER_STATUSES.map((statusValue) => (
                    <SelectItem key={statusValue} value={statusValue} className='capitalize'>
                      {t(`adminOrderDetail.statuses.${statusValue}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              onClick={handleStatusChange}
              disabled={isUpdatingStatus || !selectedStatus || selectedStatus === order.status}
              className='w-full bg-shop-blue-dark text-white hover:bg-shop-blue-dark/90'
            >
              {isUpdatingStatus ? <Loader2 className='mr-2 h-4 w-4 animate-spin' /> : null}
              {t('adminOrderDetail.saveStatus')}
            </Button>
          </div>
        </div>

        {/* Товары в заказе */}
        <div className='mt-8 bg-white p-6 rounded-lg shadow-md'>
          <h2 className='text-xl font-semibold text-shop-text mb-4'>{t('adminOrderDetail.itemsInOrder')}</h2>
          {order.items && order.items.length > 0 ? (
            <ul className='space-y-4'>
              {order.items.map((item: ProductInCart) => (
                <li
                  key={item.id}
                  className='flex items-center gap-4 border-b pb-3 last:border-b-0 last:pb-0'
                >
                  <img
                    src={item.images?.[0] || '/images/placeholder.png'}
                    alt={typeof item.name === 'string' ? item.name : item.name.en || Object.values(item.name)[0] || ''}
                    className='w-16 h-16 object-cover rounded-md'
                  />
                  <div className='flex-grow'>
                    <h3 className='font-medium text-shop-text'>
                      {typeof item.name === 'string' ? item.name : item.name.en || Object.values(item.name)[0] || ''}
                    </h3>
                    <p className='text-sm text-gray-500'>{t('adminOrderDetail.quantity')}: {item.quantity}</p>
                  </div>
                  <p className='text-md font-semibold text-shop-text'>
                    {(getLocalizedValue(item.price, currentLanguage) * item.quantity).toFixed(2)} {currencySymbol}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className='text-gray-500'>{t('adminOrderDetail.noItemsInfo')}</p>
          )}
        </div>
      </div>
    </div>
  );
}
