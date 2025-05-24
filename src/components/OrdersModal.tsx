import React, { useMemo, useState } from 'react';
import { useUserOrders } from '@/hooks/use-user-orders';
import OrderCard from '@/components/ui/order-card';
import { X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface OrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ORDERS_PER_PAGE = 3; // Можно настроить количество заказов на странице для модального окна

const OrdersModal: React.FC<OrdersModalProps> = ({ isOpen, onClose }) => {
  const { orders, loading } = useUserOrders();
  const [page, setPage] = useState(1);

  const totalPages = useMemo(() => Math.ceil(orders.length / ORDERS_PER_PAGE), [orders]);

  const paginatedOrders = useMemo(
    () => orders.slice((page - 1) * ORDERS_PER_PAGE, page * ORDERS_PER_PAGE),
    [orders, page]
  );

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[60] p-4 transition-opacity duration-300 ease-in-out'>
      <div className='bg-white p-6 sm:p-8 rounded-lg shadow-xl max-w-2xl w-full relative max-h-[90vh] flex flex-col transform transition-all duration-300 ease-in-out scale-95 opacity-0 animate-modal-scale-fade-in'>
        <div className='flex justify-between items-center mb-6'>
          <h2 className='text-2xl font-semibold text-shop-text'>Мои заказы</h2>
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
              <p className='ml-2 text-gray-600'>Загрузка заказов...</p>
            </div>
          ) : orders.length === 0 ? (
            <p className='text-center py-10 text-gray-600'>У вас пока нет заказов.</p>
          ) : (
            <ul className='space-y-4'>
              {paginatedOrders.map((order) => (
                <OrderCard key={order.id} order={order} />
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
              ⬅ Назад
            </Button>
            <span className='text-sm text-gray-700'>
              Страница {page} из {totalPages}
            </span>
            <Button
              variant='outline'
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
            >
              Вперёд ➡
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersModal;
