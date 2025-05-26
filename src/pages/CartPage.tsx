import { useCart } from '@/hooks/use-cart';

export default function CartPage() {
  const { cart, removeFromCart, clearCart } = useCart();

  const total = cart.reduce((sum, item) => {
    const price = item.isSale && item.salePrice ? item.salePrice : item.price;
    return sum + price * item.quantity;
  }, 0);

  if (cart.length === 0) {
    return <div className='p-6 text-center'>Корзина пуста</div>;
  }

  return (
    <div className='p-6 max-w-4xl mx-auto'>
      <h1 className='text-2xl font-bold mb-4'>🛒 Ваша корзина</h1>
      <ul className='space-y-4 mb-6'>
        {cart.map((item) => (
          <li key={item.id} className='flex justify-between items-center border p-4 rounded'>
            <div>
              <h2 className='font-semibold'>{item.name}</h2>
              <p className='text-gray-500'>
                {item.quantity} × {item.price} ₽
              </p>
            </div>
            <button
              onClick={() => removeFromCart(item.id)}
              className='text-red-500 hover:underline'
            >
              Удалить
            </button>
          </li>
        ))}
      </ul>

      <p className='text-xl font-bold mb-4'>Итого: {total.toFixed(2)} ₽</p>

      <button
        onClick={clearCart}
        className='bg-red-500 text-white px-6 py-3 rounded hover:bg-red-600'
      >
        Очистить корзину
      </button>
    </div>
  );
}
