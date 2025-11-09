import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSnackbar } from "@/hooks/use-snackbar";
import { supabase } from "@/lib/supabase-client";
import { Button } from "@/components/ui/button";
import FormField from "../FormField";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { validateName, validateEmail, validatePassword, validateConfirmPassword } from "@/lib/validation";

interface RegisterFormProps {
  onSuccess: () => void;
  onSwitchMode: (mode: "login") => void;
}

export function RegisterForm({ onSuccess, onSwitchMode }: RegisterFormProps) {
  const { t } = useTranslation();
  const { showSnackbar } = useSnackbar();
  const [form, setForm] = useState({ 
    name: "", 
    email: "", 
    password: "", 
    confirmPassword: "" 
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {
      name: validateName(form.name, t),
      email: validateEmail(form.email, t),
      password: validatePassword(form.password, t),
      confirmPassword: validateConfirmPassword(form.password, form.confirmPassword, t),
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      const { data, error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: {
            full_name: form.name,
          },
        },
      });
      
      if (error) throw error;
      showSnackbar(t("authModal.register.success"), "success");
      onSuccess();
    } catch (err) {
      showSnackbar(t("authModal.authError"), "error");
      console.error("Registration error:", err);
    }
  };

  return (
    <>
      <h2 className="text-xl font-bold mb-4">{t("authModal.register.title")}</h2>
      <FormField label={t("authModal.register.nameLabel")} error={errors.name}>
        <Input
          name="name"
          type="text"
          value={form.name}
          onChange={handleChange}
          placeholder={t("authModal.register.namePlaceholder")}
          className={cn(
            "w-full border p-2 rounded",
            errors.name ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:border-shop-blue-dark focus:ring-shop-blue-dark"
          )}
        />
      </FormField>
      
      <FormField label="Email" error={errors.email}>
        <Input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder={t("authModal.emailPlaceholder")}
          className={cn(
            "w-full border p-2 rounded",
            errors.email ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                       : "border-gray-300 focus:border-shop-blue-dark focus:ring-shop-blue-dark"
          )}
        />
      </FormField>
      
      <FormField label={t("authModal.passwordLabel")} error={errors.password}>
        <Input
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          placeholder={t("authModal.passwordPlaceholder")}
          className={cn(
            "w-full border p-2 rounded",
            errors.password ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:border-shop-blue-dark focus:ring-shop-blue-dark"
          )}
        />
      </FormField>
      
      <FormField 
        label={t("authModal.register.confirmPasswordPlaceholder")} 
        error={errors.confirmPassword}
      >
        <Input
          name="confirmPassword"
          type="password"
          value={form.confirmPassword}
          onChange={handleChange}
          placeholder={t("authModal.register.confirmPasswordPlaceholder")}
          className={cn(
            "w-full border p-2 rounded",
            errors.confirmPassword ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                                : "border-gray-300 focus:border-shop-blue-dark focus:ring-shop-blue-dark"
          )}
        />
      </FormField>

      <Button
        onClick={handleSubmit}
        className="mt-4 w-full bg-shop-blue-dark text-white py-2 rounded hover:bg-shop-blue-dark/90"
      >
        {t("authModal.register.button")}
      </Button>

      <div className="mt-4 text-sm text-center">
        <Button
          className="text-shop-blue-dark underline"
          onClick={() => onSwitchMode("login")}
        >
          {t("authModal.register.hasAccount")}
        </Button>
      </div>
    </>
  );
}
