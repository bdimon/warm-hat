import { useState } from "react";
import { signIn, signUp } from "@/server/routes/auth/authService";

export default function AuthForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fn = isLogin ? signIn : signUp;
    const { error } = await fn(email, password);
    if (error) alert(error.message);
    else alert("Успешно!");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 max-w-sm mx-auto">
      <h2 className="text-xl font-bold">{isLogin ? "Вход" : "Регистрация"}</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2 w-full"
      />
      <input
        type="password"
        placeholder="Пароль"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2 w-full"
      />
      <button className="bg-blue-600 text-white px-4 py-2 rounded w-full" type="submit">
        {isLogin ? "Войти" : "Зарегистрироваться"}
      </button>
      <p onClick={() => setIsLogin(!isLogin)} className="text-blue-600 cursor-pointer text-sm text-center">
        {isLogin ? "Нет аккаунта? Зарегистрируйтесь" : "Уже есть аккаунт? Войти"}
      </p>
    </form>
  );
}
