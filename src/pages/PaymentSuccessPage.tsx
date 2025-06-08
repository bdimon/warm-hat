import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { CheckCircle, Loader2 } from 'lucide-react';

export default function PaymentSuccessPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const checkPaymentStatus = async () => {
      try {
        // Получаем session_id из URL
        const params = new URLSearchParams(location.search);
        const sessionId = params.get('session_id');
        
        if (!sessionId) {
          setError('Не найден идентификатор сессии');
          setLoading(false);
          return;
        }
        
        // Проверяем статус платежа
        const response = await fetch(`http://localhost:3010/api/payments/check-status?session_id=${sessionId}`);
        
        if (!response.ok) {
          throw new Error('Ошибка при проверке статуса платежа');
        }
        
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Произошла ошибка');
        setLoading(false);
      }
    };
    
    checkPaymentStatus();
  }, [location]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header showBackButton onBackClick={() => navigate('/')} />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-shop-blue-dark mx-auto mb-2" />
            <p>Проверка статуса платежа...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header showBackButton onBackClick={() => navigate('/')} />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center max-w-md mx-auto p-6">
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={() => navigate('/cart')} className="w-full">
              Вернуться в корзину
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header showBackButton onBackClick={() => navigate('/')} />
      <div className="flex-grow flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-4">Оплата прошла успешно!</h1>
          <p className="mb-6">Ваш заказ принят и будет обработан в ближайшее время.</p>
          <Button onClick={() => navigate('/profile')} className="w-full">
            Мои заказы
          </Button>
        </div>
      </div>
    </div>
  );
}
