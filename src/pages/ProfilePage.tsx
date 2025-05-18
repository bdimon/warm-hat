// pages/account.tsx (или /profile)
// import  ProfileForm  from "@/components/ProfileForm";
import AuthSettingsForm from "@/components/AuthSettingsForm";
import { useUserOrders } from "@/hooks/use-user-orders";
import { useUser } from "@/hooks/use-user-profile";
import ProfileOrders from "@/components/ProfileOrders";

export default function AccountPage() {
const { user } = useUser();
const { orders, loading } = useUserOrders();

if (!user) return <p>Пожалуйста, войдите в аккаунт.</p>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-xl font-bold mb-4">Профиль</h1>
      {/* <ProfileForm /> */}
      <AuthSettingsForm />
      <ProfileOrders />
      {/* <div>
        <h2 className="text-xl font-semibold mb-2">📦 Мои заказы</h2>
        {loading ? (
          <p>Загрузка...</p>
        ) : orders.length === 0 ? (
          <p>У вас пока нет заказов.</p>
        ) : (
          <ul className="space-y-4">
            {orders.map((order) => (
              <li
                key={order.id}
                className="border p-4 rounded-lg shadow-sm bg-white"
              >
                <div className="font-semibold">Заказ #{order.id}</div>
                <div className="text-sm text-gray-600">
                  📅 {new Date(order.created_at).toLocaleString()}
                </div>
                <div>🧾 Товаров: {order.items.length}
                  <img src={order.items[0].images[0]} alt={order.items[0].name} className="w-16 h-16" />
                </div>
                  
                <div>💰 Сумма: {order.total} ₽</div>
                <div>💳 Оплата: {order.payment_method}</div>
                <div>📦 Статус: {order.status}</div>
              </li>
            ))}
          </ul>
        )}
      </div> */}
    </div>

  );
}
