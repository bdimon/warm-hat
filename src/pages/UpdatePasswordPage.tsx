// src/pages/UpdatePasswordPage.tsx (пример)
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase'; // Ваш экземпляр supabase

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isRecoverySession, setIsRecoverySession] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Supabase SDK автоматически обрабатывает токен из URL, если он есть,
    // и устанавливает сессию для восстановления пароля.
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        // Пользователь находится в процессе восстановления пароля.
        // 'session' не будет null, и можно обновлять пароль.
        setIsRecoverySession(true);
      } else if (event === 'USER_UPDATED' && isRecoverySession) {
        // Это событие срабатывает после успешного supabase.auth.updateUser
        setMessage('Пароль успешно обновлен! Теперь вы можете войти с новым паролем.');
        setLoading(false);
        setTimeout(() => {
          supabase.auth.signOut(); // Завершаем сессию восстановления
          navigate('/login'); // Перенаправляем на страницу входа
        }, 3000);
      }
    });

    // Проверка на случай, если пользователь попал на страницу с ошибкой в URL
    // (например, токен истек или недействителен)
    if (window.location.hash.includes('error_description')) {
      const params = new URLSearchParams(window.location.hash.substring(1));
      setError(decodeURIComponent(params.get('error_description') || 'Произошла ошибка при сбросе пароля.'));
      setIsRecoverySession(false); // Явно указываем, что сессии восстановления нет
    }


    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate, isRecoverySession]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (!isRecoverySession) {
      setError('Недействительная сессия для восстановления пароля. Пожалуйста, запросите сброс пароля снова.');
      return;
    }
    if (password.length < 6) {
      setError('Пароль должен содержать не менее 6 символов.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Пароли не совпадают.');
      return;
    }

    setLoading(true);
    // Когда пользователь находится в сессии PASSWORD_RECOVERY,
    // supabase.auth.updateUser можно вызвать только с новым паролем.
    const { error: updateError } = await supabase.auth.updateUser({ password });
    
    if (updateError) {
      setError(updateError.message);
      setLoading(false);
    }
    // Сообщение об успехе обрабатывается в onAuthStateChange 'USER_UPDATED'
  };

  // Если есть ошибка из URL и сессия восстановления не установлена
  if (error && !isRecoverySession) {
    return (
      <div className="container mx-auto p-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Сброс пароля</h1>
        <p className="text-red-500">{error}</p>
        <p className="mt-2">Пожалуйста, попробуйте <a href="/login" className="text-blue-600 hover:underline">запросить сброс пароля</a> еще раз.</p>
      </div>
    );
  }
  
  // Можно добавить состояние ожидания, пока onAuthStateChange определит сессию
  // if (!isRecoverySession && !error) {
  //   return <p>Проверка ссылки для сброса пароля...</p>;
  // }


  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-2xl font-bold mb-6 text-center">Установить новый пароль</h1>
      {isRecoverySession ? (
         <form onSubmit={handleSubmit} className="space-y-4">
           <div>
             <label htmlFor="password_reset_password">Новый пароль:</label>
             <input
               id="password_reset_password"
               type="password"
               value={password}
               onChange={(e) => setPassword(e.target.value)}
               required
               className="w-full p-2 border rounded mt-1"
             />
           </div>
           <div>
             <label htmlFor="password_reset_confirm_password">Подтвердите новый пароль:</label>
             <input
               id="password_reset_confirm_password"
               type="password"
               value={confirmPassword}
               onChange={(e) => setConfirmPassword(e.target.value)}
               required
               className="w-full p-2 border rounded mt-1"
             />
           </div>
           {error && <p className="text-red-500 text-sm">{error}</p>}
           {message && <p className="text-green-600 text-sm">{message}</p>}
           <button 
             type="submit" 
             disabled={loading}
             className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
           >
             {loading ? 'Обновление...' : 'Обновить пароль'}
           </button>
         </form>
      ) : (
         <p className="text-center text-gray-600">Проверка ссылки... Если эта страница не изменится, возможно, ссылка недействительна или истек срок ее действия. Попробуйте запросить сброс пароля снова.</p>
      )}
    </div>
  );
}
