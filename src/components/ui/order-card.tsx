// components/ui/OrderCard.tsx
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
// import { Order } from "@/types/db"; // Order type is inferred from OrderCardProps
import { useSnackbar } from "@/context/SnackbarContext";
import { supabase } from "@/lib/supabase";

interface OrderCardProps {
  order: {
    id: string;
    created_at: string;
    items: Array<{
      // Явно указываем, что items это массив
      name: string;
      images: string[];
    }>;
    total: number;
    payment_method: string;
    status: string;
  };
}
  
  export default function OrderCard({ order }: OrderCardProps) {
    const getStatusClass = (status: string) => {
      switch (status.toLowerCase()) {
        case 'delivered':
          return 'text-green-600 bg-green-100';
        case 'processing':
        case 'new':
          return 'text-yellow-600 bg-yellow-100';
        case 'cancelled':
          return 'text-red-600 bg-red-100';
        default:
          return 'text-gray-600 bg-gray-100';
      }
    };

    const navigate = useNavigate();
    const { showSnackbar } = useSnackbar();

    const canEdit = order.status === 'new';
    const canDelete = order.status === 'new' || order.status === 'delivered';

    const handleEdit = () => {
      navigate(`/edit-order/${order.id}`);
    };
    const handleDelete = async () => {
      const { error } = await supabase.from('orders').delete().eq('id', order.id);

      if (error) {
        showSnackbar('Ошибка при удалении заказа', 'error');
      } else {
        showSnackbar('Заказ удалён', 'success');
        window.location.reload(); // или обновление стейта родителя
      }
    };
    return (
      <li className='border rounded-lg p-3 shadow-sm bg-white space-y-3 list-none'>
        <div className='flex justify-between items-center text-sm'>
          <p className='font-semibold text-gray-800'>
            Заказ №: <span className='font-mono'>{order.id.substring(0, 8)}...</span>
          </p>
          <p className='text-gray-500'>{new Date(order.created_at).toLocaleDateString()}</p>
        </div>

        <div className='space-y-2'>
          <div className='flex items-center gap-2 text-sm'>
            <span className='text-gray-700'>Товары ({order.items.length}):</span>
            <div className='flex gap-1.5 overflow-x-auto'>
              {order.items.slice(0, 3).map((item, index) => (
                <img
                  key={index}
                  src={
                    item.images && item.images?.length > 0
                      ? item.images[0]
                      : '/images/placeholder.png'
                  }
                  alt={item.name}
                  className='w-10 h-10 rounded object-cover border border-gray-200'
                  loading='lazy'
                />
              ))}
              {order.items.length > 3 && (
                <span className='text-xs self-center ml-1 text-gray-500'>
                  +{order.items.length - 3} еще
                </span>
              )}
            </div>
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-sm pt-2 border-t border-gray-100 mt-2'>
            <div>
              <span className='text-gray-600'>Сумма:</span>{' '}
              <span className='font-semibold text-gray-800'>{order.total.toFixed(2)} ₽</span>
            </div>
            <div>
              <span className='text-gray-600'>Оплата:</span>{' '}
              <span className='text-gray-700'>{order.payment_method}</span>
            </div>
            <div className='sm:col-span-2'>
              <span className='text-gray-600'>Статус:</span>{' '}
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusClass(order.status)}`}
              >
                {order.status}
              </span>
            </div>
          </div>
        </div>

        {(canEdit || canDelete) && (
          <div className='flex gap-2 pt-3 border-t border-gray-200'>
            {canEdit && (
              <Button onClick={handleEdit} size='sm' variant='outline' className='text-xs'>
                Редактировать
              </Button>
            )}
            {canDelete && (
              <Button variant='destructive' onClick={handleDelete} size='sm' className='text-xs'>
                Удалить
              </Button>
            )}
          </div>
        )}
      </li>
    );
  }