import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

export default function PaymentSuccessPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

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