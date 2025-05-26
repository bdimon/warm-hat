import { useCart } from '@/hooks/use-cart';
import { X, ArrowUp, ArrowDown } from 'lucide-react';
import OrderFormModal from './OrderFormModal';
import { useState } from 'react';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartModal({ isOpen, onClose }: CartModalProps) {
  const { cart, removeFromCart, clearCart, addToCart, updateQuantity } = useCart();
  const [isOrderFormOpen, setIsOrderFormOpen] = useState(false);

  const decreaseQuantity = (id: string) => {
    const item = cart.find((i) => i.id === id);
    if (!item) return;
    if (item.quantity === 1) {
      removeFromCart(id);
    } else {
      updateQuantity(id, item.quantity - 1);
    }
  };

  const increaseQuantity = (id: string) => {
    const item = cart.find((i) => i.id === id);
    if (item) {
      updateQuantity(id, item.quantity + 1);
    }
  };

  const total = cart.reduce((sum, item) => {
    const price = item.isSale && item.salePrice ? item.salePrice : item.price;
    return sum + price * item.quantity;
  }, 0);

  if (!isOpen) return null;
  return (
    <div className='fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-end' onClick={onClose}>
      <div
        className='w-full max-w-md bg-white h-full flex flex-col shadow-lg relative'
        onClick={(e) => e.stopPropagation()}
      >
        {/* Шапка */}
        <div className='p-4 border-b flex justify-between items-center'>
          <h2 className='text-xl font-bold'>🛒 Ваша корзина</h2>
          {cart.length > 0 && (
            <button
              onClick={clearCart}
              className='text-sm text-red-500 hover:underline hover:text-red-600 border border-red-500 rounded-md px-2 py-1'
            >
              Очистить
            </button>
          )}
          <button onClick={onClose} className='text-gray-500 hover:text-black-600'>
            <X size={20} aria-label='Закрыть корзину' />
          </button>
        </div>

        {/* Список товаров */}
        <div className='flex-1 overflow-y-auto p-4 space-y-4'>
          {cart.length === 0 ? (
            <div className='text-center text-gray-500 space-y-4'>
              <p>Корзина пуста</p>
              <button
                onClick={onClose}
                className='px-4 py-2 rounded bg-shop-blue-dark text-white hover:bg-shop-blue-dark/90'
              >
                Продолжить покупки
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className='flex gap-4 items-center border-b pb-4'>
                <img
                  src={item.images?.[0] || '/images/placeholder.png'}
                  alt={item.name}
                  className='w-16 h-16 object-cover rounded'
                />
                <div className='flex-1'>
                  <h3 className='font-semibold text-sm'>{item.name}</h3>
                  <p className='text-sm text-gray-500 mb-1'>{item.price} ₽</p>
                  <div className='flex items-center gap-2'>
                    <button
                      onClick={() => decreaseQuantity(item.id)}
                      className='hover:text-shop-blue-dark'
                      aria-label='Уменьшить количество'
                    >
                      <ArrowDown size={24} />
                    </button>
                    <span className='px-2 text-md text-blue'>{item.quantity}</span>
                    <button
                      onClick={() => increaseQuantity(item.id)}
                      className='hover:text-shop-blue-dark'
                      aria-label='Увеличить количество'
                    >
                      <ArrowUp size={24} />
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className='text-red-500 text-xs hover:underline hover:text-red-600 border border-red-500 rounded-md px-2 py-1'
                >
                  Удалить
                </button>
              </div>
            ))
          )}
        </div>

        {/* Футер */}
        {cart.length > 0 && (
          <div className='p-4 border-t'>
            <div className='flex justify-between items-center mb-4'>
              <span className='font-semibold'>Итого:</span>
              <span className='text-lg font-bold'>{total.toFixed(2)} ₽</span>
            </div>
            <div className='flex justify-center'>
              {/* <button
              onClick={clearCart}
              className="text-sm text-red-500 hover:underline"
            >
              Очистить
            </button> */}
              {/* {cart.length > 0 && ( */}
              <button
                onClick={() => setIsOrderFormOpen(true)}
                className='px-4 py-2 rounded-md bg-shop-blue-dark text-white hover:bg-shop-blue-dark/90'
              >
                Оформить заказ
              </button>
              {/* // )} */}

              <OrderFormModal
                isOpen={isOrderFormOpen}
                onClose={() => setIsOrderFormOpen(false)}
                closeCart={onClose}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
