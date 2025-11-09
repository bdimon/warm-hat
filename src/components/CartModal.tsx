import { useCart } from '@/hooks/use-cart';
import { X, ArrowUp, ArrowDown } from 'lucide-react';
import OrderFormModal from './OrderFormModal';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BaseModal } from '@/components/ui/base-modal';
import { SupportedLanguage, CURRENCY_SYMBOLS } from '@/types/Product';
import { getLocalizedValue } from '@/lib/mappers/products';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartModal({ isOpen, onClose }: CartModalProps) {
  const { t, i18n } = useTranslation();
  const { cart, removeFromCart, clearCart, addToCart, updateQuantity } = useCart();
  const [isOrderFormOpen, setIsOrderFormOpen] = useState(false);

  // Получаем текущий язык и преобразуем его в SupportedLanguage
  const currentLang = i18n.language.split('-')[0] as SupportedLanguage;

  // Получаем символ валюты для текущего языка
  const currencySymbol = CURRENCY_SYMBOLS[currentLang];

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
    const itemPrice =
      item.isSale && item.salePrice
        ? getLocalizedValue(item.salePrice, currentLang)
        : getLocalizedValue(item.price, currentLang);
    return sum + itemPrice * item.quantity;
  }, 0);

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={`🛒 ${t('cartModal.title')}`}
      maxWidth='md'
      className='h-full !max-w-md !p-0 flex flex-col'
      showCloseButton={false}
    >
      {/* Шапка */}
      <div className='p-4 border-b flex justify-between items-center'>
        <h2 className='text-xl font-bold'>🛒 {t('cartModal.title')}</h2>
        {cart.length > 0 && (
          <button
            onClick={clearCart}
            className='text-sm text-red-500 hover:underline hover:text-red-600 border border-red-500 rounded-md px-2 py-1'
          >
            {t('cartModal.clearCart')}
          </button>
        )}
        <button onClick={onClose} className='text-gray-500 hover:text-black-600'>
          <X size={20} aria-label={t('cartModal.closeAriaLabel')} />
        </button>
      </div>

      {/* Список товаров */}
      <div className='flex-1 overflow-y-auto p-4 space-y-4'>
        {cart.length === 0 ? (
          <div className='text-center text-gray-500 space-y-4'>
            <p>{t('cartModal.emptyCart')}</p>
            <button
              onClick={onClose}
              className='px-4 py-2 rounded bg-shop-blue-dark text-white hover:bg-shop-blue-dark/90'
            >
              {t('cartModal.continueShopping')}
            </button>
          </div>
        ) : (
          cart.map((item) => {
            const localizedName = getLocalizedValue(item.name, currentLang);
            const localizedPrice = getLocalizedValue(
              item.isSale && item.salePrice ? item.salePrice : item.price,
              currentLang
            );

            return (
              <div key={item.id} className='flex gap-4 items-center border-b pb-4'>
                <img
                  src={item.images?.[0] || '/images/placeholder.png'}
                  alt={localizedName}
                  className='w-16 h-16 object-cover rounded'
                />
                <div className='flex-1'>
                  <h3 className='font-semibold text-sm'>{localizedName}</h3>
                  <p className='text-sm text-gray-500 mb-1'>
                    {localizedPrice} {currencySymbol}
                  </p>
                  <div className='flex items-center gap-2'>
                    <button
                      onClick={() => decreaseQuantity(item.id)}
                      className='hover:text-shop-blue-dark'
                      aria-label={t('cartModal.decreaseQuantityAriaLabel')}
                    >
                      <ArrowDown size={24} />
                    </button>
                    <span className='px-2 text-md text-blue'>{item.quantity}</span>
                    <button
                      onClick={() => increaseQuantity(item.id)}
                      className='hover:text-shop-blue-dark'
                      aria-label={t('cartModal.increaseQuantityAriaLabel')}
                    >
                      <ArrowUp size={24} />
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className='text-red-500 text-xs hover:underline hover:text-red-600 border border-red-500 rounded-md px-2 py-1'
                >
                  {t('cartModal.remove')}
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Футер */}
      {cart.length > 0 && (
        <div className='p-4 border-t'>
          <div className='flex justify-between items-center mb-4'>
            <span className='font-semibold'>{t('cartModal.totalLabel')}:</span>
            <span className='text-lg font-bold'>
              {total.toFixed(2)} {currencySymbol}
            </span>
          </div>
          <div className='flex justify-center'>
            <button
              onClick={() => setIsOrderFormOpen(true)}
              className='px-4 py-2 rounded-md bg-shop-blue-dark text-white hover:bg-shop-blue-dark/90'
            >
              {t('cartModal.checkout')}
            </button>

            <OrderFormModal
              isOpen={isOrderFormOpen}
              onClose={() => setIsOrderFormOpen(false)}
              closeCart={onClose}
            />
          </div>
        </div>
      )}
    </BaseModal>
  );
}
