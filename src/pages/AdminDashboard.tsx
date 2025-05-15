import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Order {
  id: string;
  customer_name: string;
  total: number;
  status: string;
  created_at: string;
}

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("http://localhost:3010/api/orders");
        if (!res.ok) throw new Error("Ошибка при загрузке заказов");
        const data = await res.json();
        setOrders(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Неизвестная ошибка");
        }
     } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <div className="p-6">Загрузка заказов...</div>;
  if (error) return <div className="p-6 text-red-600">Ошибка: {error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Админка — Заказы</h1>
      {orders.length === 0 ? (
        <p>Нет заказов</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border border-gray-300 rounded">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">Дата</th>
                <th className="px-4 py-2 text-left">Имя</th>
                <th className="px-4 py-2 text-left">Сумма</th>
                <th className="px-4 py-2 text-left">Статус</th>
                <th className="px-4 py-2">Действия</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-t">
                  <td className="px-4 py-2">
                    {new Date(order.created_at).toLocaleString()}
                  </td>
                  <td className="px-4 py-2">{order.customer_name}</td>
                  <td className="px-4 py-2">{order.total.toFixed(2)} ₽</td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-1 text-sm rounded ${
                        order.status === "created"
                          ? "bg-yellow-100 text-yellow-800"
                          : order.status === "paid"
                          ? "bg-green-100 text-green-800"
                          : order.status === "shipped"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-center">
                    <button
                      className="text-sm text-blue-600 hover:underline"
                      onClick={() => navigate(`/admin/order/${order.id}`)}
                    >
                      Подробнее
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
