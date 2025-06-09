// components/ui/OrderCard.tsx
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
// import { Order } from "@/types/supabase"; // Order type is inferred from OrderCardProps
import { useSnackbar } from '@/hooks/use-snackbar';
import { supabase } from '@/lib/supabase-client';
import { formatPrice } from '@/lib/mappers/products';
import { MultilingualString, RegionalPrice, SupportedLanguage } from '@/types/Product';
import { getLocalizedValue } from '@/lib/mappers/products';
import { useTranslation } from 'react-i18next';
import { formatOrderTotal, translatePaymentMethod, translateOrderStatus } from '@/lib/mappers/orders';

interface OrderCardProps {
  order: {
    id: string;
    created_at: string;
    items: Array<{
      // Явно указываем, что items это массив
      name: string | MultilingualString;
      images: string[];
    }>;
    total: number | RegionalPrice;
    payment_method: string;
    status: string;
  };
  onOrderDeleted?: () => void; // Новый проп
}

export default function OrderCard({ order, onOrderDeleted }: OrderCardProps) {
  const getStatusClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'text-green-600 bg-green-100';
      case 'pending':
      case 'new':
        return 'text-yellow-600 bg-yellow-100';
      case 'paid':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language.split('-')[0] as SupportedLanguage;
  const canEdit = order.status === 'new';
  const canDelete = order.status === 'new' || order.status === 'delivered';

  const handleEdit = () => {
    navigate(`/edit-order/${order.id}`);
  };
  const handleDelete = async () => {
    // Запрашиваем error и count
    const { error, count } = await supabase
      .from('orders')
      .delete({ count: 'exact' })
      .eq('id', order.id);
    // console.log('[OrderCard]deleted count', count);

    if (error) {
      showSnackbar(t('adminProducts.errorDeletingAlert'), 'error');
      console.error('Supabase delete error:', error);
    } else if (count === 0) {
      // Это может означать, что заказ уже был удален кем-то другим,
      // или ID был неверным, но операция сама по себе не вызвала ошибку.
      showSnackbar(t('adminOrderDetail.errorNotFound'), 'error');
      if (onOrderDeleted) {
        // Все равно стоит обновить список, на случай если локальное состояние устарело
        onOrderDeleted();
      }
    } else {
      showSnackbar(t('adminOrders.orderDeleted'), 'success');
      if (onOrderDeleted) {
        onOrderDeleted(); // Вызываем колбэк для обновления списка
      }
    }
  };
  return (
    <li className='border rounded-lg p-3 shadow-sm bg-white space-y-3 list-none'>
      <div className='flex justify-between items-center text-sm'>
        <p className='font-semibold text-gray-800'>
          {t('payment.orderNumber')} : <span className='font-mono'>{order.id.substring(0, 8)}...</span>
        </p>
        <p className='text-gray-500'>{new Date(order.created_at).toLocaleDateString()}</p>
      </div>

      <div className='space-y-2'>
        <div className='flex items-center gap-2 text-sm'>
          <span className='text-gray-700'>{t('adminOrderDetail.itemsInOrder')} ({order.items.length}):</span>
          <div className='flex gap-1.5 overflow-x-auto'>
            {order.items.slice(0, 3).map((item, index) => (
              <img
                key={index}
                src={
                  item.images && item.images?.length > 0
                    ? item.images[0]
                    : '/images/placeholder.png'
                }
                alt={getLocalizedValue(item.name, currentLang)}
                className='w-10 h-10 rounded object-cover border border-gray-200'
                loading='lazy'
              />
            ))}
            {order.items.length > 3 && (
              <span className='text-xs self-center ml-1 text-gray-500'>
                +{order.items.length - 3} {t('orderCard.more')}
              </span>
            )}
          </div>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-sm pt-2 border-t border-gray-100 mt-2'>
          <div>
            <span className='text-gray-600'>{t('orderFormModal.total')}</span>{' '}
            <span className='font-semibold text-gray-800'>
              {formatOrderTotal(order.total, currentLang)}
            </span>
          </div>
          <div>
            <span className='text-gray-600'>{t('adminOrderDetail.paymentMethod')}:</span>{' '}
            <span className='text-gray-700'>{translatePaymentMethod(order.payment_method, t)}</span>
          </div>
          <div className='sm:col-span-2'>
            <span className='text-gray-600'>{t('adminOrderDetail.orderStatus')}:</span>{' '}
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusClass(order.status)}`}
            >
              {translateOrderStatus(order.status, t)}
            </span>
          </div>
        </div>
      </div>

      {(canEdit || canDelete) && (
        <div className='flex gap-2 pt-3 border-t border-gray-200'>
          {canEdit && (
            <Button onClick={handleEdit} size='sm' variant='outline' className='text-xs'>
              {t('adminProducts.edit')}
            </Button>
          )}
          {canDelete && (
            <Button variant='destructive' onClick={handleDelete} size='sm' className='text-xs'>
              {t('adminProducts.delete')}
            </Button>
          )}
        </div>
      )}
    </li>
  );
}
