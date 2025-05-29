import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Order as SupabaseOrder} from '@/types/supabase'; // Базовый тип Order из Supabase
import {ProductInCart} from '@/types/cart'
import { useSnackbar } from '@/hooks/use-snackbar';

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

  useEffect(() => {
    if (!id) {
      setError('ID заказа не указан.');
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
            throw new Error('Заказ не найден.');
          }
          throw new Error('Ошибка при загрузке данных заказа.');
        }
        const data: DetailedOrder = await res.json();
        setOrder(data);
        setSelectedStatus(data.status);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Произошла неизвестная ошибка.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  const handleStatusChange = async () => {
    if (!order || !selectedStatus || selectedStatus === order.status) {
      showSnackbar('Статус не изменен или не выбран.', 'info');
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
        const errorData = await res.json().catch(() => ({ message: 'Ошибка обновления статуса заказа.' }));
        throw new Error(errorData.message || 'Ошибка обновления статуса заказа.');
      }

      const updatedOrder: DetailedOrder = await res.json();
      setOrder(updatedOrder);
      setSelectedStatus(updatedOrder.status);
      showSnackbar('Статус заказа успешно обновлен!', 'success');
    } catch (err) {
      if (err instanceof Error) {
        showSnackbar(err.message, 'error');
      } else {
        showSnackbar('Произошла неизвестная ошибка при обновлении статуса.', 'error');
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
          <p className='ml-2 text-gray-600'>Загрузка данных заказа...</p>
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
            <p className='text-xl text-red-600 mb-4'>Ошибка: {error}</p>
            <Button onClick={() => navigate('/admin/dashboard')} className='bg-shop-blue-dark text-white'>
              Вернуться к заказам
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
          <p className='text-xl text-gray-700'>Заказ не найден.</p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <Header showBackButton onBackClick={() => navigate('/admin/dashboard')} />
      <div className='container mx-auto pt-24 pb-12 px-4'>
        <h1 className='text-3xl font-bold mb-8 text-shop-text'>
          Детали заказа № <span className='font-mono'>{order.id.substring(0, 8)}...</span>
        </h1>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          {/* Информация о заказе и клиенте */}
          <div className='md:col-span-2 bg-white p-6 rounded-lg shadow-md space-y-6'>
            <div>
              <h2 className='text-xl font-semibold text-shop-text mb-3'>Информация о клиенте</h2>
              <p>
                <strong>Имя:</strong> {order.name || 'Не указано'}
              </p>
              <p>
                {/* Отображаем customer_email, если есть, иначе auth_user_email, иначе "Не указан" */}
                <strong>Email:</strong> {order.customer_email || order.auth_user_email || 'Не указан'}
              </p>
              <p>
                <strong>Телефон:</strong> {order.phone || 'Не указан'}
              </p>
              <p>
                <strong>Адрес доставки:</strong> {order.address || 'Не указан'}
              </p>
            </div>
            <hr />
            <div>
              <h2 className='text-xl font-semibold text-shop-text mb-3'>
                Детали платежа и доставки
              </h2>
              <p>
                <strong>Дата создания:</strong> {new Date(order.created_at).toLocaleString()}
              </p>
              <p>
                <strong>Сумма заказа:</strong> {order.total.toFixed(2)} ₽
              </p>
              <p>
                <strong>Метод оплаты:</strong> {order.payment_method}
              </p>
            </div>
          </div>

          {/* Статус заказа */}
          <div className='bg-white p-6 rounded-lg shadow-md space-y-4'>
            <h2 className='text-xl font-semibold text-shop-text'>Статус заказа</h2>
            <p className='text-lg font-medium capitalize'>
              Текущий:{' '}
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
                {order.status}
              </span>
            </p>
            <div>
              <label
                htmlFor='status-select'
                className='block text-sm font-medium text-gray-700 mb-1'
              >
                Изменить статус:
              </label>
              <Select
                value={selectedStatus || undefined}
                onValueChange={(value: DetailedOrder['status']) => setSelectedStatus(value)}
              >
                <SelectTrigger id='status-select' className='w-full'>
                  <SelectValue placeholder='Выберите новый статус' />
                </SelectTrigger>
                <SelectContent>
                  {ORDER_STATUSES.map((statusValue) => (
                    <SelectItem key={statusValue} value={statusValue} className='capitalize'>
                      {statusValue}
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
              Сохранить статус
            </Button>
          </div>
        </div>

        {/* Товары в заказе */}
        <div className='mt-8 bg-white p-6 rounded-lg shadow-md'>
          <h2 className='text-xl font-semibold text-shop-text mb-4'>Товары в заказе</h2>
          {order.items && order.items.length > 0 ? (
            <ul className='space-y-4'>
              {order.items.map((item: ProductInCart, index: number) => (
                // <li key={item.id + '-' + index} className='flex items-center gap-4 border-b pb-3 last:border-b-0 last:pb-0'>
                <li
                  key={item.id}
                  className='flex items-center gap-4 border-b pb-3 last:border-b-0 last:pb-0'
                >
                  <img
                    src={item.images?.[0] || '/images/placeholder.png'}
                    alt={item.name}
                    className='w-16 h-16 object-cover rounded-md'
                  />
                  <div className='flex-grow'>
                    <h3 className='font-medium text-shop-text'>{item.name}</h3>
                    <p className='text-sm text-gray-500'>Количество: {item.quantity}</p>
                  </div>
                  <p className='text-md font-semibold text-shop-text'>
                    {(item.price * item.quantity).toFixed(2)} ₽
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className='text-gray-500'>Информация о товарах отсутствует.</p>
          )}
        </div>
      </div>
    </div>
  );
}
