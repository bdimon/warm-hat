import { useCart } from "@/context/CartContext";
import { X } from "lucide-react";
import { useState } from "react";
import { useSnackbar } from "@/context/SnackbarContext";
import FormField from "./FormField";
import { useUser, useUserProfile } from "@/hooks/use-user-profile";

interface OrderFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  closeCart: () => void;
}



export default function OrderFormModal({ isOpen, onClose, closeCart }: OrderFormModalProps) {
  const { cart, clearCart } = useCart();
  const { showSnackbar } = useSnackbar();

  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    phone: "",
    payment: "card",
  });

  const [formErrors, setFormErrors] = useState({
    name: "",
    email: "",
    address: "",
    phone: "",
  });

  const { user } = useUser();       // из Supabase auth
  const { profile } = useUserProfile(); // из твоего хука

  if (!user || !profile) {
    showSnackbar("Вы не вошли в систему", "error");
    return;
}


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
      email: "",
      address: form.address.trim() ? "" : "Введите адрес",
      phone: "",
    };
  
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email.trim()) {
      errors.email = "Введите email";
    } else if (!emailRegex.test(form.email)) {
      errors.email = "Некорректный email";
    }

    if (form.phone && !/^\+?\d{10,15}$/.test(form.phone)) {
      errors.phone = "Введите корректный номер телефона";
    }
  
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
      price: item.price,
    }));
    
      

    try {

      const res = await fetch("http://localhost:3010/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          total,
          profile_id: profile.id,
          customer_name: form.name,
          customer_email: form.email,
          customer_address: form.address,
          customer_phone: form.phone,
          payment_method: form.payment,
          status: "created",
        }),
      });

      if (!res.ok) {const errText = await res.text();
      console.error("Ошибка сервера:", errText);
      showSnackbar("Ошибка сервера", "error");
      return;}

      clearCart();
      onClose(); 
      closeCart();     
      showSnackbar("Заказ оформлен успешно!", "success");
      
    } catch (err) {
      console.error(err);
      showSnackbar("Ошибка оформления заказа", "error");
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-lg rounded-lg p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
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
          {/* {formErrors.name && <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>} */}
          <FormField
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            error={formErrors.email}
            placeholder="Введите email"
          />
          {/* {formErrors.email && <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>} */}
          <FormField
            label="Адрес доставки"
            name="address"
            type="text"
            value={form.address}
            onChange={handleChange}
            error={formErrors.address}
            placeholder="Введите адрес"
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
          {/* {formErrors.address && <p className="text-red-500 text-sm mt-1">{formErrors.address}</p>} */}
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
          className="mt-6 w-full bg-shop-blue-dark text-white py-2 rounded hover:bg-shop-blue-dark/90"
        >
          Подтвердить заказ
        </button>
      </div>
    </div>
  );
}

