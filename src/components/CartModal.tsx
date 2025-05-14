import { useCart } from "@/context/CartContext";
import { X, Plus, Minus } from "lucide-react";
import { useMemo } from 'react';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartModal({ isOpen, onClose }: CartModalProps) {
  const { cart, removeFromCart, clearCart, addToCart } = useCart();
  const showClearButton = useMemo(() => cart.length > 0, [cart]);


  const decreaseQuantity = (id: string) => {
    const item = cart.find((i) => i.id === id);
    if (!item) return;
    if (item.quantity === 1 || item.quantity !== undefined) {
      removeFromCart(id);
    } else {
      const updated = { ...item, quantity: item.quantity - 1 };
      removeFromCart(id);
      addToCart(updated); // hack: add updated item
    }
  };

  const total = cart.length === 0 ? 0 : cart.reduce((sum, item) => {
    const price = item.isSale && item.salePrice ? item.salePrice : item.price;
    return sum + price * item.quantity;
  }, 0);

  if (!isOpen) return null;


  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-end" onClick={(e) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    }}>
      <div className="w-full max-w-md bg-white h-full p-6 overflow-y-auto shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-black"
        >
          <X />
        </button>
        <div className="flex justify-center items-center mb-2 mr-2">
        <h2 className="text-shop-blue-dark text-2xl font-bold">Корзина</h2></div>
        <div className="flex justify-center items-center mb-4">
          {showClearButton && (
            <button
            onClick={clearCart}
            className="text-sm text-red-500 hover:underline  border border-red-500 rounded-md px-4 py-2"
          >
            Очистить корзину
          </button>
            
            )}
        
          </div>

        {cart.length === 0 ? (
          <p className="text-center text-gray-500">Вы еще ничего не добавили</p>
        ) : (
          <ul className="space-y-4 mb-6">
            {cart.map((item) => (
              <li key={item.id} className="flex gap-4 items-center">
                <img
                  src={item.images?.[0]}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded"
                />
                <div className="flex-1">
                  <h3 className="font-semibold shop-text-dark-blue">{item.name}</h3>
                  <p className="text-sm text-gray-500">{item.price} ₽</p>
                  <div className="flex items-center mt-1 space-x-2">
                    <button onClick={() => decreaseQuantity(item.id)}><Minus size={16} /></button>
                    <span>{item.quantity}</span>
                    <button onClick={() => addToCart(item)}><Plus size={16} /></button>
                  </div>
                </div>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-500 hover:underline text-sm border border-red-500 rounded-md px-4 py-2"
                >
                  Удалить
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="border-t pt-4 flex justify-between items-center">
          <span className="font-bold text-lg">Итого:</span>
          <span className="text-lg">{total.toFixed(2)} ₽</span>
        </div>

        <div className="mt-6 flex justify-between">
          {cart.length > 0 &&
        <button className="bg-shop-blue-dark text-white px-4 py-2 rounded hover:bg-shop-blue-dark/90">
            Оформить заказ
          </button>
          }
          <button onClick={onClose} className="bg-shop-blue-dark text-white px-4 py-2 rounded hover:bg-shop-blue-dark/90">          
            Продолжить покупки
          </button>
          
        </div>
      </div>
    </div>
  );
}
