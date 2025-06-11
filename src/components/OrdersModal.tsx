import React, { useMemo, useState, useEffect } from 'react';
import { useUserOrders } from '@/hooks/use-user-orders';
import OrderCard from '@/components/ui/order-card';
import { X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

interface OrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ORDERS_PER_PAGE = 3; // Можно настроить количество заказов на странице для модального окна

const OrdersModal: React.FC<OrdersModalProps> = ({ isOpen, onClose }) => {
  const { orders, loading, refetchOrders } = useUserOrders();
  const [page, setPage] = useState(1);
  const { t } = useTranslation();

  // console.log(
  //   '[OrdersModal] Rendering. Orders count:',
  //   orders.length,
  //   'Loading:',
  //   loading,
  //   'Current Page:',
  //   page
  // );

  const totalPages = useMemo(() => {
    const numPages = Math.ceil(orders.length / ORDERS_PER_PAGE);
    const newTotalPages = numPages > 0 ? numPages : 1; // Гарантируем, что totalPages хотя бы 1
    //  console.log(
    //     '[OrdersModal] Recalculating totalPages. Orders length:',
    //     orders.length,
    //     'New totalPages:',
    //     newTotalPages
    //   );
    return newTotalPages;
  }, [orders]);

  // Эффект для корректировки страницы, если она выходит за пределы после изменения списка заказов
  useEffect(() => {
    // console.log(
    //   '[OrdersModal] Page adjustment useEffect. Current page:',
    //   page,
    //   'Total pages:',
    //   totalPages,
    //   'Orders length:',
    //   orders.length
    // );
    if (page > totalPages) {
      // console.log('[OrdersModal] Current page > totalPages. Adjusting page to:', totalPages);
      setPage(totalPages);
    }
  }, [orders.length, totalPages, page]); // Зависим от orders.length для отслеживания изменений списка

  const paginatedOrders = useMemo(() => {
    const start = (page - 1) * ORDERS_PER_PAGE;
    const end = page * ORDERS_PER_PAGE;
    const sliced = orders.slice(start, end);
    // console.log(
    //   '[OrdersModal] Recalculating paginatedOrders. Page:',
    //   page,
    //   'Start:',
    //   start,
    //   'End:',
    //   end,
    //   'Sliced count:',
    //   sliced.length
    // );
    return sliced;
  }, [orders, page]);

  if (!isOpen) return null;

  const handleOrderDeleted = () => {
    // console.log('[OrdersModal] handleOrderDeleted called. Triggering refetchOrders.');
    refetchOrders();
  };

  return (
    <div className='fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[60] p-4 transition-opacity duration-300 ease-in-out'>
      <div className='bg-white p-6 sm:p-8 rounded-lg shadow-xl max-w-2xl w-full relative max-h-[90vh] flex flex-col transform transition-all duration-300 ease-in-out scale-95 opacity-0 animate-modal-scale-fade-in'>
        <div className='flex justify-between items-center mb-6'>
          <h2 className='text-2xl font-semibold text-shop-text'>{t('profile.orders')}</h2>
          <button
            onClick={onClose}
            className='text-gray-400 hover:text-gray-600 transition-colors'
            aria-label='Закрыть список заказов'
          >
            <X size={24} />
          </button>
        </div>

        <div className='flex-grow overflow-y-auto pr-2'>
          {' '}
          {/* Добавлен pr-2 для предотвращения перекрытия скроллбаром */}
          {loading ? (
            <div className='flex justify-center items-center h-40'>
              <Loader2 className='h-8 w-8 animate-spin text-shop-blue-dark' />
              <p className='ml-2 text-gray-600'>{t('adminOrders.loading')}</p>
            </div>
          ) : orders.length === 0 ? (
            <p className='text-center py-10 text-gray-600'>{t('adminOrders.noOrders')}</p>
          ) : (
            <ul className='space-y-4'>
              {paginatedOrders.map((order) => (
                <OrderCard key={order.id} order={order} onOrderDeleted={handleOrderDeleted} />
              ))}
            </ul>
          )}
        </div>

        {orders.length > 0 && totalPages > 1 && (
          <div className='flex items-center justify-center gap-4 mt-6 pt-4 border-t border-gray-200'>
            <Button
              variant='outline'
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
            >
              ⬅ {t('header.back')}
            </Button>
            <span className='text-sm text-gray-700'>
              {t('orderCard.page')} {page} {t('orderCard.ofTotal', { total: totalPages })}
            </span>
            <Button
              variant='outline'
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
            >
              {t('header.next')} ➡
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersModal;
