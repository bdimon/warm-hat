import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { type Order as SupabaseOrder } from '@/types/supabase';
import { useSnackbar } from "@/hooks/use-snackbar";
import { Loader2 } from "lucide-react";
import Header from "@/components/Header"; // Add Header import
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
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("http://localhost:3010/api/orders");

        if (!res.ok) {
          const errorText = await res.text().catch(() => "Could not read error text from response");
          console.error(`[AdminDashboard] Fetch error, response not ok. Status: ${res.status}. Response text: ${errorText}`);
          throw new Error(t('adminDashboard.errorLoading'));
        }

        const data = await res.json();
        // console.log('[AdminDashboard] Data received from API for orders:', data);
        setOrders(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message || t('adminDashboard.errorLoading'));
        } else {
          setError(t('adminDashboard.errorUnknown'));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [t]);

  const confirmDeleteOrder = async () => {
    if (!orderToDelete) return;

    try {
      const res = await fetch(`http://localhost:3010/api/orders/${orderToDelete}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: t('adminDashboard.errorDelete') }));
        throw new Error(errorData.message || t('adminDashboard.errorDelete'));
      }
      setOrders(prevOrders => prevOrders.filter(order => order.id !== orderToDelete));
      showSnackbar(t('adminDashboard.orderDeleted'), "success");
    } catch (err) {
      console.error(t('adminDashboard.errorDelete'), err);
      const errorMessage = err instanceof Error ? err.message : t('adminDashboard.errorDelete');
      setError(errorMessage);
      showSnackbar(errorMessage, "error");
    } finally {
      setOrderToDelete(null); // Сбрасываем ID заказа для удаления
    }
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col">
      <Header showBackButton onBackClick={() => navigate('/')} />
      <div className="flex-grow flex items-center justify-center min-h-[300px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-shop-blue-dark mx-auto mb-2" />
          <div>{t('adminDashboard.loading')}</div>
        </div>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex flex-col">
      <Header showBackButton onBackClick={() => navigate('/')} />
      <div className="flex-grow flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-red-600 mb-4">{t('adminDashboard.error')}: {error}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className='min-h-screen flex flex-col bg-gray-50'>
      <Header showBackButton onBackClick={() => navigate('/')} />
      <div className='container mx-auto pt-24 pb-12 px-4'>
        <h1 className='text-3xl font-bold mb-8 text-shop-text'>{t('adminDashboard.title')}</h1>
        {orders.length === 0 ? (
          <p className='text-center text-gray-500 my-8'>{t('adminDashboard.noOrders')}</p>
        ) : (
          <div className='overflow-x-auto bg-white rounded-lg shadow'>
            <table className='min-w-full table-auto'>
              <thead className='bg-gray-100'>
                <tr>
                  <th className='px-4 py-3 text-left text-sm font-medium text-gray-600'>
                    {t('adminDashboard.date')}
                  </th>
                  <th className='px-4 py-3 text-left text-sm font-medium text-gray-600'>
                    {t('adminDashboard.name')}
                  </th>
                  <th className='px-4 py-3 text-left text-sm font-medium text-gray-600'>
                    {t('adminDashboard.email')}
                  </th>
                  <th className='px-4 py-3 text-left text-sm font-medium text-gray-600'>
                    {t('adminDashboard.amount')}
                  </th>
                  <th className='px-4 py-3 text-left text-sm font-medium text-gray-600'>
                    {t('adminDashboard.status')}
                  </th>
                  <th className='px-4 py-3 text-sm font-medium text-gray-600'>
                    {t('adminDashboard.actions')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className='border-t'>
                    <td className='px-4 py-2'>{new Date(order.created_at).toLocaleString()}</td>
                    <td className='px-4 py-2'>{order.name}</td>
                    <td className='px-4 py-2 text-sm'>
                      {order.customer_email || order.auth_user_email || '-'}
                    </td>
                    <td className='px-4 py-2'>{order.total.toFixed(2)} ₽</td>
                    <td className='px-4 py-2'>
                      <span
                        className={`px-2 py-1 text-sm rounded ${
                          order.status === 'new'
                            ? 'bg-yellow-100 text-yellow-800'
                            : order.status === 'paid'
                              ? 'bg-green-100 text-green-800'
                              : order.status === 'delivered'
                                ? 'bg-blue-100 text-blue-800'
                                : order.status === 'pending'
                                  ? 'bg-orange-200 text-orange-800'
                                  : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className='px-4 py-2 text-center'>
                      <button
                        className='text-sm text-blue-600 hover:underline mr-2'
                        onClick={() => navigate(`/admin/order/edit/${order.id}`)}
                      >
                        {t('adminDashboard.details')}
                      </button>
                      <Button
                        variant='link'
                        className='text-sm text-red-600 hover:underline p-0 h-auto'
                        onClick={() => setOrderToDelete(order.id)}
                      >
                        {t('adminDashboard.delete')}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {/* AlertDialog вынесен за пределы map, чтобы он был один на всю таблицу */}
        <AlertDialog
          open={!!orderToDelete}
          onOpenChange={(isOpen) => !isOpen && setOrderToDelete(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className='text-red-600 text-xl text-center'>
                {t('adminDashboard.deleteConfirmTitle')}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {t('adminDashboard.deleteConfirmDescription')}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setOrderToDelete(null)}>
                {t('adminDashboard.deleteConfirmCancel')}
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDeleteOrder}
                className={buttonVariants({ variant: 'destructive' })}
              >
                {t('adminDashboard.deleteConfirmAction')}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
