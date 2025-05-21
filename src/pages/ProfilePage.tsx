// pages/account.tsx (или /profile)
// import  ProfileForm  from "@/components/ProfileForm";
import AuthSettingsForm from "@/components/AuthSettingsForm";
import { useUserOrders } from "@/hooks/use-user-orders";
import { useUser } from "@/hooks/use-user-profile";
import OrderCard from "@/components/ui/order-card";
import { useMemo, useState } from "react";

// interface ProfilePageProps {
//   open: boolean;
//   onClose: () => void;
// }

// export default function AccountPage({ open, onClose }: ProfilePageProps)  {
export default function AccountPage()  {
  const { user } = useUser();
  const { orders, loading } = useUserOrders();
  const [page, setPage] = useState(1);

  const ORDERS_PER_PAGE = 10;


  const totalPages = useMemo(
    () => Math.ceil(orders.length / ORDERS_PER_PAGE),
    [orders]
  );

  const paginatedOrders = useMemo(
    () =>
      orders.slice(
        (page - 1) * ORDERS_PER_PAGE,
        page * ORDERS_PER_PAGE
      ),
    [orders, page]
  );

  if (!user) return <p>Пожалуйста, войдите в аккаунт.</p>;

    return (
      // Добавляем контейнер для страницы и отступы, как обычно для страниц
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Профиль</h1>
        <div className="space-y-8"> {/* Увеличим немного отступ между блоками */}
          <AuthSettingsForm /> {/* onClose не передаем, кнопка "Выйти без сохранения" не будет рендериться */}
        
        <div>
          <h2 className="text-xl font-semibold mb-2">📦 Мои заказы</h2>
          {loading ? (
            <p>Загрузка...</p>
          ) : orders.length === 0 ? (
            <p>У вас пока нет заказов.</p>
          ) : (
           <ul className="space-y-4">
            {paginatedOrders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))
              }              
            <div className="flex items-center justify-center gap-4 mt-4">
              <button
                  className="px-3 py-1 border rounded disabled:opacity-50"
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  disabled={page === 1}
              >
                  ⬅ Назад
              </button>
              <span>
                  Страница {page} из {totalPages}
              </span>
              <button
                  className="px-3 py-1 border rounded disabled:opacity-50"
                  onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                  disabled={page === totalPages}
              >
                  Вперёд ➡
              </button>
            </div>
          </ul>              
        )}
        </div>
      
    </div>
    </div>
    

    );
}
