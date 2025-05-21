// components/ui/OrderCard.tsx

interface OrderCardProps {
    order: {
      id: string;
      created_at: string;
      items: {
        name: string;
        images: string[];
      }[];
      total: number;
      payment_method: string;
      status: string;
    };
  }
  
  export default function OrderCard({ order }: OrderCardProps) {
    return (
      <li className="border p-4 rounded-lg shadow-sm bg-white">
        <div className="font-semibold">Заказ #{order.id}</div>
        <div className="text-sm text-gray-600">
          📅 {new Date(order.created_at).toLocaleString()}
        </div>
        <div className="flex gap-2 mt-2 overflow-x-auto">
          🧾 Товаров: {order.items.length}
          {order.items.map((item, index) => (
            <img
              key={index}
              src={item.images[0]}
              alt={item.name}
              className="w-16 h-16 rounded object-cover"
            />
          ))}
        </div>
        <div>💰 Сумма: {order.total} ₽</div>
        <div>💳 Оплата: {order.payment_method}</div>
        <div>📦 Статус: {order.status}</div>
        <div>📦 Статус: {order.payment_method}</div>
      </li>
    );
  }
  