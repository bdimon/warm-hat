import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSnackbar } from "@/hooks/use-snackbar";
import { supabase } from "@/lib/supabase-client";
import { Button } from "@/components/ui/button";
import FormField from "../FormField";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { validateEmail, validatePassword } from "./validation.ts";

interface LoginFormProps {
  onSuccess: () => void;
  onSwitchMode: (mode: "register" | "forgot-password") => void;
}

export function LoginForm({ onSuccess, onSwitchMode }: LoginFormProps) {
  const { t } = useTranslation();
  const { showSnackbar } = useSnackbar();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {
      email: validateEmail(form.email, t),
      password: validatePassword(form.password, t),
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
      });
      if (error) throw error;
      
      showSnackbar(t("authModal.login.success"), "success");
      onSuccess();
    } catch (err) {
      showSnackbar(t("authModal.authError"), "error");
      console.error("Login error:", err);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      });
      if (error) throw error;
    } catch (err) {
      showSnackbar(t("authModal.googleLogin.error"), "error");
      console.error("Google OAuth error:", err);
    }
  };

  return (
    <>
      <h2 className="text-xl font-bold mb-4">{t("authModal.login.title")}</h2>
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

      <Button
        className="mt-2 text-sm text-shop-blue-dark underline text-left w-full"
        onClick={() => onSwitchMode("forgot-password")}
      >
        {t("authModal.login.forgotPassword")}
      </Button>

      <Button
        onClick={handleSubmit}
        className="mt-4 w-full bg-shop-blue-dark text-white py-2 rounded hover:bg-shop-blue-dark/90"
      >
        {t("authModal.login.button")}
      </Button>

      <div className="my-4 flex items-center">
        <hr className="flex-grow border-t border-gray-300" />
        <span className="mx-2 text-xs text-gray-500">{t("authModal.login.or")}</span>
        <hr className="flex-grow border-t border-gray-300" />
      </div>

      <Button
        onClick={handleGoogleLogin}
        className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 flex items-center justify-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M21.35,11.1H12.18V13.83H18.69C18.36,17.64 15.19,19.27 12.19,19.27C8.36,19.27 5,16.25 5,12C5,7.9 8.2,4.73 12.19,4.73C15.29,4.73 17.1,6.7 17.1,6.7L19,4.72C19,4.72 16.56,2 12.19,2C6.42,2 2.03,6.8 2.03,12C2.03,17.05 6.16,22 12.19,22C17.6,22 21.5,18.33 21.5,12.33C21.5,11.76 21.35,11.1 21.35,11.1V11.1Z"></path>
        </svg>
        {t("authModal.googleLogin.button")}
      </Button>

      <div className="mt-4 text-sm text-center">
        <Button
          className="text-shop-blue-dark underline"
          onClick={() => onSwitchMode("register")}
        >
          {t("authModal.login.noAccount")}
        </Button>
      </div>
    </>
  );
}
