import { useState } from "react";
import { signUp } from "@/server/routes/auth/authService";

export default function SignUpForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error, data } = await signUp(email, password);
    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Письмо с подтверждением отправлено. Проверьте почту.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 space-y-4 border rounded shadow">
      <h2 className="text-2xl font-bold text-center">Регистрация</h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="w-full border px-4 py-2 rounded"
      />
      <input
        type="password"
        placeholder="Пароль"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className="w-full border px-4 py-2 rounded"
      />
      <button type="submit" className="w-full bg-shop-blue-dark text-white py-2 rounded hover:bg-shop-blue-dark/90">
        Зарегистрироваться
      </button>

      {message && <p className="text-center text-sm text-shop-text mt-2">{message}</p>}
    </form>
  );
}
