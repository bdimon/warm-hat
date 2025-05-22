// components/ui/OrderCard.tsx
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Order } from "@/types/db";
import { useSnackbar } from "@/context/SnackbarContext";
import { supabase } from "@/lib/supabase";

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

    const navigate = useNavigate();
    const { showSnackbar } = useSnackbar();
  
    const canEdit = order.status === "new";
    const canDelete = order.status === "new" || order.status === "delivered";
  
    const handleEdit = () => {
      navigate(`/edit-order/${order.id}`);
    };
    const handleDelete = async () => {
      const { error } = await supabase.from("orders").delete().eq("id", order.id);
  
      if (error) {
        showSnackbar("Ошибка при удалении заказа", "error");
      } else {
        showSnackbar("Заказ удалён", "success");
        window.location.reload(); // или обновление стейта родителя
      }
    };
    return (
      <div className="border rounded-lg p-4 shadow-sm space-y-2 bg-white">

        <p className="text-sm text-gray-700">
          <strong>Заказ №:</strong> {order.id}
        </p>
        
        <p className="text-sm text-gray-600">
          📅 {new Date(order.created_at).toLocaleString()}
        </p>

        <div className="flex gap-2 mt-2 overflow-x-auto">
          🧾 Товаров: {order.items.length}
          {order.items.map((item, index) => (
            <img
              key={index}
              src={item.images && item.images?.length > 0 ? item.images[0] : "/images/placeholder.png"}
              alt={item.name}
              className="w-16 h-16 rounded object-cover"
            />
          ))}
        

        <div>💰 Сумма: {order.total} ₽</div>
        <div>💳 Оплата: {order.payment_method}</div>
        <div>📦 Статус: {order.status}</div>
        {/* <div>📦 Метод оплаты: {order.payment_method}</div> */}
      
        {/* Остальная информация заказа */}
  
        <div className="flex gap-2 mt-4">
          {canEdit && (
            <Button onClick={handleEdit} className="text-sm">
              ✏️ Редактировать
            </Button>
          )}
          {canDelete && (
            <Button
              variant="destructive"
              onClick={handleDelete}
              className="text-sm"
            >
              🗑 Удалить
            </Button>
          )}
        </div>
      </div>
      </div>
    );
  }
    // return (
    //   <div  className="border p-4 rounded-lg shadow-sm bg-white">
    //     <p className="text-sm text-gray-700">
    //     <strong>Заказ №:</strong> {order.id}
    //   </p>
    //   <p className="text-sm text-gray-700">
    //     <strong>Статус:</strong> {order.status}
    //   </p>
    
    
    //   <div className="flex gap-2 mt-4">
    //   {canEdit && (
    //     <Button onClick={handleEdit} className="text-sm">
    //       ✏️ Редактировать
    //     </Button>
    //   )}
    //   {canDelete && (
    //     <Button
    //       variant="destructive"
    //       onClick={handleDelete}
    //       className="text-sm"
    //     >
    //       🗑 Удалить
    //     </Button>
    //   )}
    // </div>
    //   </div>
    // );
  // }
  