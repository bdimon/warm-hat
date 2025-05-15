import { useCart } from "@/context/CartContext";
import { X } from "lucide-react";
import { useState } from "react";
import { useSnackbar } from "@/context/SnackbarContext";

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
    payment: "card",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const total = cart.reduce((sum, item) => {
    const price = item.isSale && item.salePrice ? item.salePrice : item.price;
    return sum + price * item.quantity;
  }, 0);

  const handleSubmit = async () => {
    // Простая валидация
  if (!form.name.trim() || !form.email.trim() || !form.address.trim()) {
    showSnackbar("Пожалуйста, заполните все поля", "error");
    return;
  }

  // Проверка email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(form.email)) {
    showSnackbar("Введите корректный email", "error");
    return;
  }

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
          customer_name: form.name,
          customer_email: form.email,
          customer_address: form.address,
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
          <input
            type="text"
            name="name"
            placeholder="Имя и фамилия"
            value={form.name}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
          <input
            type="text"
            name="address"
            placeholder="Адрес доставки"
            value={form.address}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
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
          className="mt-6 w-full bg-shop-blue-dark text-white py-2 rounded hover:bg-shop-blue-dark/90"
        >
          Подтвердить заказ
        </button>
      </div>
    </div>
  );
}

