import { createContext, useContext, useEffect, useState } from "react";
import { useUser } from "@/hooks/use-user-profile";
import { supabase } from "@/lib/supabase";
import { ProductInCart } from "@/types/cart";

interface CartContextType {
  cart: ProductInCart[];
  addToCart: (item: ProductInCart) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  setCart: (items: ProductInCart[]) => void;
  updateQuantity: (id: string, quantity: number) => void;  
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useUser();
  const [cart, setCart] = useState<ProductInCart[]>([]);

  // Загрузить корзину из Supabase
  useEffect(() => {
    const fetchCart = async () => {
      if (!user){
        // setCart([]);
        return;
      };

      const { data, error } = await supabase
        .from("carts")
        .select("items")
        .eq("user_id", user.id)
        .single();

      if (error) {
        if (error.code !== "PGRST116") console.error("Ошибка загрузки корзины:", error.message);
        return;
      }

      if (data?.items) {
        setCart(data.items);
      }
    };
    if (!user) {
        setCart([]); // Если пользователя нет, устанавливаем пустую корзину
    } else {
      fetchCart(); // Иначе загружаем корзину
    }
  }, [user]);

  // Сохранить корзину в Supabase при изменении
  useEffect(() => {
    const saveCart = async () => {
      if (!user) return;

      const { error } = await supabase
        .from("carts")
        .upsert({ user_id: user.id, items: cart }, { onConflict: "user_id" });

      if (error) {
        console.error("Ошибка сохранения корзины:", error.message);
      }
    };
    // if (user && cart.length > 0) saveCart();
    // Сохраняем корзину, если пользователь авторизован.
    // Это включает сохранение пустого состояния корзины в БД,
    // если пользователь удалил все товары.
    if (user) saveCart();
  }, [cart, user]);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") {
        setCart([]); // <== очищаем корзину
      }
    });
  
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);


  const addToCart = (item: ProductInCart) => {
    const safeQuantity = item.quantity ?? 1;
    setCart((prevCart) => {
      const existingItem = prevCart.find((p) => p.id === item.id);
      if (existingItem) {
        return prevCart.map((p) =>
          p.id === item.id ? { ...p, quantity: p.quantity + safeQuantity } : p
        );
      }
      return [...prevCart, { ...item, quantity: safeQuantity }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };
  

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, setCart, updateQuantity }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart должен использоваться внутри CartProvider");
  }
  return context;
};
