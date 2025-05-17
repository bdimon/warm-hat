import { useState } from "react";
import { X } from "lucide-react";
import FormField from "./FormField";
import { supabase } from "@/lib/supabase";
import { useSnackbar } from "@/context/SnackbarContext";

// const supabase = createClient(
//   import.meta.env.VITE_SUPABASE_URL!,
//   import.meta.env.VITE_SUPABASE_ANON_KEY!
// );

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [form, setForm] = useState({ email: "", password: "", confirmPassword: "" });
  const [formErrors, setFormErrors] = useState({ email: "", password: "", confirmPassword: "" });
  const { showSnackbar } = useSnackbar();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validate = () => {
    const errors = { email: "", password: "", confirmPassword: "" };
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!form.email.trim()) {
      errors.email = "Введите email";
    } else if (!emailRegex.test(form.email)) {
      errors.email = "Некорректный email";
    }

    if (!form.password.trim()) {
      errors.password = "Введите пароль";
    } else if (form.password.length < 6) {
      errors.password = "Минимум 6 символов";
    }

    if (mode === "register") {
        if (!form.confirmPassword.trim()) {
          errors.confirmPassword = "Подтвердите пароль";
        } else if (form.password !== form.confirmPassword) {
          errors.confirmPassword = "Пароли не совпадают";
        }
      }

    setFormErrors(errors);
    return !Object.values(errors).some((e) => e);
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    // if (mode === "register" && form.password !== form.confirmPassword) {
    //     setFormErrors({ ...formErrors, confirmPassword: "Пароли не совпадают" });
    //     return;
    //   }
      

    try {
        if (mode === "register") {
            const { error } = await supabase.auth.signUp({
              email: form.email,
              password: form.password,
            });
            if (error) throw error;
            showSnackbar("Регистрация успешна. Подтвердите email.", "success");
            onClose();
          } else {
            const { error } = await supabase.auth.signInWithPassword({
              email: form.email,
              password: form.password,
            });
            if (error) throw error;
            showSnackbar("Вход выполнен", "success");
            onClose();
          }
        } catch (err: unknown) {
        showSnackbar("Ошибка авторизации", "error");
      
        if (err instanceof Error) {
          console.error("Auth error:", err.message);
        } else {
          console.error("Unexpected error:", err);
        }
      }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-sm rounded-lg p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="absolute top-3 right-3 text-gray-500" onClick={onClose}>
          <X />
        </button>
        <h2 className="text-xl font-bold mb-4">
          {mode === "login" ? "Вход" : "Регистрация"}
        </h2>

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
        {mode === "register" && (
          <FormField
            label="Подтвердите пароль"
            name="confirmPassword"
            type="password"
            value={form.confirmPassword}
            onChange={handleChange}
            error={formErrors.confirmPassword}
            placeholder="Подтвердите пароль"
          />
        )}

        <button
          onClick={handleSubmit}
          className="mt-4 w-full bg-shop-blue-dark text-white py-2 rounded hover:bg-shop-blue-dark/90"
        >
          {mode === "login" ? "Войти" : "Зарегистрироваться"}
        </button>

        <div className="mt-4 text-sm text-center">
          {mode === "login" ? (
            <>
              Нет аккаунта?{" "}
              <button className="text-shop-blue-dark underline" onClick={() => setMode("register")}>
                Зарегистрируйтесь
              </button>
            </>
          ) : (
            <>
              Уже есть аккаунт?{" "}
              <button className="text-shop-blue-dark underline" onClick={() => setMode("login")}>
                Войти
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
