// hooks/use-user-orders.ts
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useUser } from "./use-user-profile";
import { Order } from "../types/db"; // если ещё нет — создадим

export function useUserOrders() {
  const { user } = useUser();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setOrders([]);
      setLoading(false);
      return;
    }

    const fetchOrders = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Ошибка загрузки заказов:", error.message);
      } else {
        setOrders(data);
      }

      setLoading(false);
    };

    fetchOrders();
  }, [user]);

  return { orders, loading };
}
