import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import FormField from "@/components/FormField";
import { User } from "@supabase/supabase-js";
import { useNavigate } from 'react-router-dom';


type FormState = {
  email: string;
  password: string;
  confirmPassword: string;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

export default function AuthSettingsForm() {
  const [form, setForm] = useState<FormState>({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [user, setUser] = useState<User | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    fetchUser();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = (): boolean => {
    const nextErrors: FormErrors = {};

    const { email, password, confirmPassword } = form;

    if (!email.trim() && !password.trim()) {
      nextErrors.email = "Введите email или пароль";
    }

    if (password && password.length < 6) {
      nextErrors.password = "Минимум 6 символов";
    }

    if (password && password !== confirmPassword) {
      nextErrors.confirmPassword = "Пароли не совпадают";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    if (!validate()) return;

    setLoading(true);

    const updates: {
      email?: string;
      password?: string;
    } = {};

    if (form.email.trim()) updates.email = form.email.trim();
    if (form.password.trim()) updates.password = form.password;

    const { error: updateError } = await supabase.auth.updateUser(updates);

    if (updateError) {
      setError("Ошибка: " + updateError.message);
    } else {
      if (updates.email && updates.password) {
        setMessage("Email и пароль обновлены. Проверьте почту для подтверждения email.");
      } else if (updates.email) {
        setMessage("Email обновлён. Проверьте почту для подтверждения.");
      } else {
        setMessage("Пароль успешно обновлён.");
      }

      // очищаем только поля пароля
      setForm((prev) => ({
        ...prev,
        password: "",
        confirmPassword: "",
      }));

      setTimeout(() => {
        navigate("/");
      }, 1500);
    }

    setLoading(false);
  };

  if (!user) return <p>Загрузка…</p>;

  return (
    <form onSubmit={handleSubmit} className="max-w-md space-y-4">
      <h2 className="text-lg font-semibold">Сменить email / пароль</h2>
      <p className="text-sm text-gray-600">
        Текущий email: <span className="font-medium">{user.email}</span>
      </p>

      <FormField
        label="Новый Email"
        name="email"
        type="email"
        value={form.email}
        onChange={handleChange}
        error={errors.email}
        placeholder="example@mail.com"
      />

      <FormField
        label="Новый пароль"
        name="password"
        type="password"
        value={form.password}
        onChange={handleChange}
        error={errors.password}
        placeholder="Не менее 6 символов"
      />

      <FormField
        label="Повторите пароль"
        name="confirmPassword"
        type="password"
        value={form.confirmPassword}
        onChange={handleChange}
        error={errors.confirmPassword}
        placeholder="Повторите новый пароль"
      />

      {error && <p className="text-red-500 text-sm">{error}</p>}
      {message && <p className="text-green-600 text-sm">{message}</p>}

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? "Сохранение…" : "Сохранить изменения"}
      </button>
    </form>
  );
}
