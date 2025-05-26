import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useSnackbar } from '@/hooks/use-snackbar';
import { useCart } from '@/hooks/use-cart';

export interface OrderFormData {
  name: string;
  address: string;
  phone: string;
  payment: string;
}

export interface OrderFormErrors {
  name?: string;
  address?: string;
  phone?: string;
}

export function useOrderForm() {
  const { cart, clearCart } = useCart();
  const { showSnackbar } = useSnackbar();

  const [form, setForm] = useState<OrderFormData>({
    name: "",
    address: "",
    phone: "",
    payment: "card",
  });

  const [errors, setErrors] = useState<OrderFormErrors>({});
  const [loading, setLoading] = useState(false);
  const [userEmail, setUserEmail] = useState<string>();
  const [profileId, setProfileId] = useState<string>();

  const total = cart.reduce((sum, item) => {
    const price = item.isSale && item.salePrice ? item.salePrice : item.price;
    return sum + price * item.quantity;
  }, 0);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: authData } = await supabase.auth.getUser();
      const user = authData?.user;
      if (!user) return;

      setUserEmail(user.email || "");
      setProfileId(user.id);

      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, address, phone")
        .eq("id", user.id)
        .single();

      if (profile) {
        setForm(prev => ({
          ...prev,
          name: profile.full_name || prev.name,
          address: profile.address || prev.address,
          phone: profile.phone || prev.phone,
        }));
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validate = (): OrderFormErrors => {
    return {
      name: form.name.trim() ? undefined : "Введите имя",
      address: form.address.trim() ? undefined : "Введите адрес",
      phone: /^\+?\d{10,15}$/.test(form.phone) ? undefined : "Введите корректный телефон",
    };
  };

  const handleSubmit = async () => {
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.values(validationErrors).some(Boolean)) return;

    const items = cart.map(item => ({
      id: item.id,
      name: item.name,
      quantity: item.quantity,
      images: item.images,
      price: item.isSale && item.salePrice ? item.salePrice : item.price,
    }));

    setLoading(true);
    const { error } = await supabase.from("orders").insert({
      items,
      total,
      user_id: profileId,
      payment_method: form.payment,
      status: "created",
    });

    if (error) {
      showSnackbar('Ошибка оформления', 'warning');
    } else {
      clearCart();
      showSnackbar("Заказ оформлен!", "success");
    }
    setLoading(false);
  };

  return {
    form,
    errors,
    loading,
    total,
    userEmail,
    handleChange,
    handleSubmit,
  };
}
