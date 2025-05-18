import { useCart } from "@/context/CartContext";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { useSnackbar } from "@/context/SnackbarContext";
import FormField from "./FormField";
import { supabase } from "@/lib/supabase";

interface OrderFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  closeCart: () => void;
}

export default function OrderFormModal({ isOpen, onClose, closeCart }: OrderFormModalProps) {
  const { cart, clearCart } = useCart();
  const { showSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [profileId, setProfileId] = useState("");
  const [form, setForm] = useState({
    name: "",
    address: "",
    phone: "",
    payment: "card",
  });

  const [formErrors, setFormErrors] = useState({
    name: "",
    address: "",
    phone: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: authData } = await supabase.auth.getUser();
      const user = authData.user;
      if (!user) return;

      setUserEmail(user.email || "");

      const { data: profile } = await supabase
        .from("profiles")
        .select("id, full_name, address, phone")
        .eq("id", user.id)
        .single();

      if (profile) {
        setProfileId(profile.id);
        setForm({
          name: profile.full_name || "",
          address: profile.address || "",
          phone: profile.phone || "",
          payment: "card",
        });
      }
    };

    if (isOpen) fetchProfile();
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const total = cart.reduce((sum, item) => {
    const price = item.isSale && item.salePrice ? item.salePrice : item.price;
    return sum + price * item.quantity;
  }, 0);

  const handleSubmit = async () => {
    const errors = {
      name: form.name.trim() ? "" : "Введите имя",
      address: form.address.trim() ? "" : "Введите адрес",
      phone: form.phone && /^\+?\d{10,15}$/.test(form.phone) ? "" : "Введите корректный телефон",
    };

    

    setFormErrors(errors);

    const hasErrors = Object.values(errors).some((e) => e);
    if (hasErrors) return;

    if (cart.length === 0) {
      showSnackbar("Корзина пуста", "error");
      return;
    }



    const items = cart.map((item) => ({
      id: item.id,
      name: item.name,
      quantity: item.quantity,
      price: item.isSale && item.salePrice ? item.salePrice : item.price,
    }));

    setLoading(true);

    try {
      const { error } = await supabase.from("orders").insert({
        items,
        total,
        profile_id: profileId,
        payment_method: form.payment,
        status: "created",
      });

      if (error) {
        console.error(error);
        showSnackbar("Ошибка сервера", "error");
        return;
      }

      clearCart();
      onClose();
      closeCart();
      showSnackbar("Заказ оформлен успешно!", "success");
    } catch (err) {
      console.error(err);
      showSnackbar("Ошибка оформления заказа", "error");
    }

    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="bg-white w-full max-w-lg rounded-lg p-6 relative" onClick={(e) => e.stopPropagation()}>
        <button className="absolute top-3 right-3 text-gray-500" onClick={onClose}>
          <X />
        </button>
        <h2 className="text-xl font-bold mb-4">Оформление заказа</h2>

        <div className="space-y-4">
          <FormField
            label="Имя и фамилия"
            name="name"
            value={form.name}
            onChange={handleChange}
            error={formErrors.name}
            placeholder="Введите имя"
          />

          <div className="text-sm text-gray-500">
            Email: <span className="font-medium">{userEmail}</span>
          </div>

          <FormField
            label="Адрес доставки"
            name="address"
            value={form.address}
            onChange={handleChange}
            error={formErrors.address}
            placeholder="Введите адрес"
            textarea
          />
          <FormField
            label="Телефон"
            name="phone"
            type="tel"
            value={form.phone}
            onChange={handleChange}
            error={formErrors.phone}
            placeholder="+7..."
          />

          <select
            name="payment"
            value={form.payment}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="card">Карта онлайн</option>
            <option value="cod">Наложенный платёж</option>
            <option value="pickup">Самовывоз</option>
          </select>
        </div>

        <div className="mt-6 flex justify-between items-center">
          <span className="font-semibold">Сумма:</span>
          <span className="text-lg font-bold">{total.toFixed(2)} ₽</span>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="mt-6 w-full bg-shop-blue-dark text-white py-2 rounded hover:bg-shop-blue-dark/90"
        >
           {loading ? "Отправка..." : "Подтвердить заказ"}
        </button>
      </div>
    </div>
  );
}
