// components/LoginModal.tsx
import { useState } from "react";
import { X } from "lucide-react";
import { supabase } from "@/lib/supabase";
import FormField from "./FormField";
import { useSnackbar } from "@/context/SnackbarContext";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const { showSnackbar } = useSnackbar();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [formErrors, setFormErrors] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validate = () => {
    const errors = {
      email: "",
      password: "",
    };

    if (!form.email.trim()) {
      errors.email = "Введите email";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.email = "Некорректный email";
    }

    if (!form.password) {
      errors.password = "Введите пароль";
    }

    setFormErrors(errors);
    return Object.values(errors).every((e) => !e);
  };

  const handleLogin = async () => {
    if (!validate()) return;

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
      });

      if (error) {
        showSnackbar("Неверные данные", "error");
        console.error(error);
        return;
      }

      showSnackbar("Успешный вход!", "success");
      onClose();
    } catch (err: unknown) {
      showSnackbar("Ошибка авторизации", "error");
      console.error(err);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-md rounded-lg p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="absolute top-3 right-3 text-gray-500" onClick={onClose}>
          <X />
        </button>
        <h2 className="text-xl font-bold mb-4">Вход</h2>

        <FormField
          label="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          error={formErrors.email}
          placeholder="Введите email"
        />

        <FormField
          label="Пароль"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          error={formErrors.password}
          placeholder="Введите пароль"
        />

        <button
          onClick={handleLogin}
          className="mt-6 w-full bg-shop-blue-dark text-white py-2 rounded hover:bg-shop-blue-dark/90"
        >
          Войти
        </button>
      </div>
    </div>
  );
}
