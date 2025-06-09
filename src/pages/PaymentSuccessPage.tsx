import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCart } from '@/hooks/use-cart'; // Импортируем useCart
// import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { CheckCircle, Loader2 } from 'lucide-react';
export default function PaymentSuccessPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { clearCart } = useCart(); // Получаем функцию clearCart
  useEffect(() => {
    const checkPaymentStatus = async () => {
      try {
        // Получаем session_id из URL
        const params = new URLSearchParams(location.search);
        const sessionId = params.get('session_id');
        
        if (!sessionId) {
          setError(t('payment.errorNoSessionId'));
          setLoading(false);
          return;
        }
        
        // Проверяем статус платежа
        const response = await fetch(`http://localhost:3010/api/payments/check-status?session_id=${sessionId}`);

        if (!response.ok) {
          throw new Error(t('payment.errorCheckingStatus'));
        }

        const data = await response.json();

        if (data.paymentStatus === 'paid') {
          clearCart(); // Очищаем корзину, если платеж успешен
          setLoading(false);
        } else {
          // Если статус не 'paid', показываем ошибку
          // Рекомендую добавить такой ключ в файлы локализации, например:
          // "payment.errorPaymentNotCompleted": "Payment not completed. Status: {{status}}"
          setError(t('payment.errorPaymentNotCompleted', { status: data.paymentStatus || 'unknown' }));
          setLoading(false);
        }
      } catch (err) {
        setError((err as Error).message || t('payment.errorUnknown'));
        setLoading(false);
      }
    };
    checkPaymentStatus();
  }, [location, t, clearCart]); // Добавляем clearCart в зависимости

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        {/* <Header showBackButton onBackClick={() => navigate('/')} /> */}
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-shop-blue-dark mx-auto mb-2" />
            <p>{t('payment.checkingStatus')}</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        {/* <Header showBackButton onBackClick={() => navigate('/')} /> */}
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center max-w-md mx-auto p-6">
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={() => navigate('/cart')} className="w-full">
              {t('payment.returnToCart')}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* <Header showBackButton onBackClick={() => navigate('/')} /> */}
      <div className="flex-grow flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6 border rounded-lg shadow-sm">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">{t('payment.successTitle')}</h1>
          <p className="mb-4">{t('payment.successMessage')}</p>
          
          <Button onClick={() => navigate('/')} className="w-full">
            {t('payment.continueShopping')}
          </Button>
        </div>
      </div>
    </div>
  );
}
