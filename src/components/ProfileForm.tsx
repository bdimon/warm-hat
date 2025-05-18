import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useUserProfile } from "@/hooks/use-user-profile";
import FormField from "@/components/FormField";
import { Profile } from "@/types/db";
import { User } from "@supabase/supabase-js";
import { useSnackbar } from "@/context/SnackbarContext";


/* ---------- локальные типы ---------- */

type FormState = {
  full_name: string;
  phone: string;
  address: string;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

/* ---------- компонент ---------- */

export default function ProfileForm() {
  /* данные пользователя и профиля */
  const { user, profile, loading } = useUserProfile();
  const { showSnackbar } = useSnackbar();

  /* состояние формы + валид-ошибки */
  const [form, setForm] = useState<FormState>({
    full_name: "",
    phone: "",
    address: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [saving, setSaving] = useState(false);

  /* когда профиль загрузился — проставляем поля формы */
  useEffect(() => {
    if (profile) {
      setForm({
        full_name: profile.full_name ?? "",
        phone: profile.phone ?? "",
        address: profile.address ?? "",
      });
    }
  }, [profile]);

  /* ---------- helpers ---------- */

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = (): boolean => {
    const nextErrors: FormErrors = {};
    if (!form.full_name.trim()) nextErrors.full_name = "Введите имя и фамилию";
    if (!form.phone.trim()) nextErrors.phone = "Введите номер телефона";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !validate()) return;

    setSaving(true);

    /* upsert в таблицу profiles */
    const { error } = await supabase.from("profiles").upsert({
      id: user.id,
      full_name: form.full_name,
      phone: form.phone,
      address: form.address,
      updated_at: new Date().toISOString(),
    });

    if (error) {
      showSnackbar("Ошибка при сохранении профиля: ", "error");
    } else {
      showSnackbar("Профиль успешно обновлён", "success");
    }
    setSaving(false);
  };

  /* ---------- рендер ---------- */

  if (loading) return <p>Загрузка профиля…</p>;
  if (!user) return <p>Вы не авторизованы.</p>;

  return (
    <form onSubmit={handleSubmit} className="max-w-md space-y-4">
      <FormField
        label="Имя и фамилия"
        name="full_name"
        required
        value={form.full_name}
        onChange={handleChange}
        error={errors.full_name}
        placeholder="Например: Иван Иванов"
      />

      <FormField
        label="Телефон"
        name="phone"
        type="tel"
        required
        value={form.phone}
        onChange={handleChange}
        error={errors.phone}
        placeholder="+48 123 456 789"
      />

      <FormField
        label="Адрес доставки"
        name="address"
        textarea
        value={form.address}
        onChange={handleChange}
        placeholder="Улица, дом, город, индекс"
      />

      <button
        type="submit"
        disabled={saving}
        className="rounded bg-blue-600 px-4 py-2 font-medium text-white disabled:opacity-50"
      >
        {saving ? "Сохранение…" : "Сохранить"}
      </button>
    </form>
  );
}
