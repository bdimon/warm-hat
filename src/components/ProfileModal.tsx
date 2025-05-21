import { useUser } from "@/hooks/use-user-profile";
import { useUserOrders } from "@/hooks/use-user-orders";
import AuthSettingsForm from "@/components/AuthSettingsForm";
import CustomModal from "@/components/ui/custom-modal";
import { useState, useMemo } from "react";
import OrderCard from "./ui/order-card";

interface ProfileModalProps {
  open: boolean;
  onClose: () => void;
}

export default function ProfileModal({ open, onClose }: ProfileModalProps) {
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

  if (!user) return null;

  return (
    <CustomModal open={open} onClose={() => {
      console.log('Close ProfileModal');
      onClose();
    }} title="Профиль"> 
    <div className="space-y-6">
        <AuthSettingsForm onClose={onClose}/>
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
              ))}

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
    </CustomModal>
  );
}
