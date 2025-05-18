import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useUser } from "@/hooks/use-user-profile";

interface Order {
  id: string;
  created_at: string;
  items: {
    id: string;
    name: string;
    quantity: number;
    price: number;
  }[];
  total: number;
  status: string;
  payment_method: string;
}

export default function ProfileOrders() {
  const { user } = useUser();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Ошибка загрузки заказов:", error.message);
        return;
      }

      setOrders(data || []);
    };

    fetchOrders();
  }, [user]);

  if (!user) return null;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Мои заказы</h2>

      {orders.length === 0 ? (
        <p className="text-gray-600">Заказов пока нет.</p>
      ) : (
        orders.map((order) => (
          <div key={order.id} className="border rounded-lg p-4 shadow-sm">
            <div className="mb-2 text-sm text-gray-500">
              Заказ от {new Date(order.created_at).toLocaleString()}
            </div>
            <div className="mb-2 text-sm">Статус: <strong>{order.status}</strong></div>
            <div className="mb-2 text-sm">Оплата: <strong>{order.payment_method}</strong></div>
            <ul className="space-y-1 text-sm">
              {order.items.map((item) => (
                <li key={item.id} className="flex justify-between">
                  <span>{item.name} × {item.quantity}</span>
                  <span>{item.price * item.quantity} ₽</span>
                </li>
              ))}
            </ul>
            <div className="mt-2 text-right font-bold">Итого: {order.total.toFixed(2)} ₽</div>
          </div>
        ))
      )}
    </div>
  );
}
