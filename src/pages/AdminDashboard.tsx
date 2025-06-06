import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { type Order as SupabaseOrder } from '@/types/supabase';
import { useSnackbar } from "@/hooks/use-snackbar"; // Импортируем useSnackbar
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button, buttonVariants } from '@/components/ui/button';

// Расширяем тип Order для дашборда, чтобы включить email пользователя из auth схемы и убедиться, что все необходимые поля для отображения присутствуют
interface DashboardOrder extends SupabaseOrder {
  auth_user_email?: string;
  customer_email?: string; // Email, указанный при оформлении заказа name поле уже должно быть в SupabaseOrder для имени клиента
}
  
export default function AdminDashboard() {
  const [orders, setOrders] = useState<DashboardOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null);
  const { showSnackbar } = useSnackbar(); // Используем useSnackbar

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("http://localhost:3010/api/orders");

        if (!res.ok) {
          const errorText = await res.text().catch(() => "Could not read error text from response");
          console.error(`[AdminDashboard] Fetch error, response not ok. Status: ${res.status}. Response text: ${errorText}`);
          throw new Error(`Ошибка при загрузке заказов. Статус: ${res.status}.`);
        }

        const data = await res.json();
        // console.log('[AdminDashboard] Data received from API for orders:', data);
        setOrders(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message || 'Ошибка при загрузке заказов');
        } else {
          setError("Неизвестная ошибка");
        }
     } finally {
        setLoading(false);
      }
      
    };
 
    fetchOrders();
  }, []);

  const confirmDeleteOrder = async () => {
    if (!orderToDelete) return;

    try {
      const res = await fetch(`http://localhost:3010/api/orders/${orderToDelete}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: "Ошибка при удалении" }));
        throw new Error(errorData.message || `Ошибка при удалении заказа (статус: ${res.status})`);
      }
      setOrders(prevOrders => prevOrders.filter(order => order.id !== orderToDelete));
      showSnackbar("Заказ успешно удален", "success");
    } catch (err) {
      console.error("Ошибка удаления заказа:", err);
      const errorMessage = err instanceof Error ? err.message : "Не удалось удалить заказ";
      setError(errorMessage);
      showSnackbar(errorMessage, "error");
    } finally {
      setOrderToDelete(null); // Сбрасываем ID заказа для удаления
    }
  };



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
                <th className="px-4 py-2 text-left">Email</th>
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
                  <td className="px-4 py-2">{order.name}</td>
                  <td className="px-4 py-2 text-sm">
                    {order.customer_email || order.auth_user_email || '-'}
                  </td>
                  <td className="px-4 py-2">{order.total.toFixed(2)} ₽</td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-1 text-sm rounded ${
                        order.status === "new"
                          ? "bg-yellow-100 text-yellow-800"
                          : order.status === "paid"
                          ? "bg-green-100 text-green-800"
                          : order.status === "delivered"
                          ? "bg-blue-100 text-blue-800"
                          : order.status === "pending"
                          ? "bg-orange-200 text-orange-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-center">
                    <button
                      className="text-sm text-blue-600 hover:underline mr-2"
                      onClick={() => navigate(`/admin/order/edit/${order.id}`)}
                    >
                      Подробнее
                    </button>
                      <Button
                        variant="link"
                        className="text-sm text-red-600 hover:underline p-0 h-auto"
                        onClick={() => setOrderToDelete(order.id)}
                      >
                        Удалить
                      </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {/* AlertDialog вынесен за пределы map, чтобы он был один на всю таблицу */}
      <AlertDialog open={!!orderToDelete} onOpenChange={(isOpen) => !isOpen && setOrderToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Вы уверены?</AlertDialogTitle>
            <AlertDialogDescription>
              Это действие необратимо. Заказ будет удален навсегда.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setOrderToDelete(null)}>Отмена</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteOrder} className={buttonVariants({ variant: "destructive" })}>
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
