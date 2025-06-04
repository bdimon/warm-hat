// hooks/use-user-orders.ts
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase-client";
import { useUser } from "@/hooks/use-user-profile";
import { Order } from '@/types/supabase'; // если ещё нет — создадим

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

    // Выносим fetchOrders, чтобы его можно было вызвать повторно
    const fetchUserOrders = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        console.log('[useUserOrders] Fetching orders from Supabase...', data);

      if (error) {
        console.error('Ошибка загрузки заказов:', error.message);
        setOrders([]); // В случае ошибки лучше очистить список или оставить предыдущий
      } else {
        setOrders(data || []); // Убедимся, что data не null
      }

      setLoading(false);
    };

    fetchUserOrders();
  }, [user]);

  // Функция для принудительного обновления
  const refetchOrders = async () => {
    // console.log('[useUserOrders] refetchOrders called. User ID:', user?.id);
    if (!user) {
      // console.log('[useUserOrders] No user, aborting refetch.');
      return;
    }
    setLoading(true);
    // console.log('[useUserOrders] Fetching orders from Supabase...');
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[useUserOrders] Error during refetch:', error.message, error);
      // Оставляем существующие заказы при ошибке рефетча, чтобы не очищать список
    } else {
      // console.log('[useUserOrders] Refetch successful. Data received:', data);
      setOrders(data || []);
    }
    setLoading(false);
    // console.log('[useUserOrders] refetchOrders finished.');
  };

  return { orders, loading, refetchOrders };
}
