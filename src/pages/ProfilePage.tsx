// pages/account.tsx (или /profile)
import { useUserProfile } from '@/hooks/use-user-profile';
import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { useNavigate } from 'react-router-dom';
import ProfileModal from '@/components/ProfileModal';
import OrdersModal from '@/components/OrdersModal';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function AccountPage() {
  // Добавим userLoading для индикации загрузки пользователя
  const { user, loading: userLoading } = useUserProfile();
  const navigate = useNavigate();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isOrdersModalOpen, setIsOrdersModalOpen] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    if (!userLoading && !user) {
      navigate('/');
    }
  }, [user, userLoading, navigate]);

  if (userLoading) {
    return (
      <div className='min-h-screen bg-gray-100 flex flex-col'>
        <Header showBackButton onBackClick={() => navigate('/')} />
        <div className='flex-grow flex items-center justify-center'>
          <Loader2 className='h-8 w-8 animate-spin text-shop-blue-dark' />
          <p className='text-gray-600'>{t('profile.loading')}</p>
        </div>
      </div>
    );
  }

  if (!user) {
    // Можно добавить редирект на главную или страницу логина, если пользователь не авторизован
    // setTimeout(() => navigate('/'), 100);
    // Условие !user будет обработано useEffect выше,
    // поэтому здесь можно просто вернуть null или другой плейсхолдер,
    // пока useEffect не выполнит редирект.
    // Либо, если вы хотите показать сообщение перед редиректом,
    // то текущий подход с setTimeout допустим, но менее "чистый".
    return (
      <div className='min-h-screen bg-gray-100 flex flex-col'>
        <Header showBackButton onBackClick={() => navigate('/')} />
        <div className='flex-grow flex items-center justify-center'>
          <div className='text-center'>
            <p className='text-xl text-gray-700 mb-4'>{t('profile.loading')}</p>
            {/* Можно убрать кнопку, если редирект автоматический */}
            {/* <Button onClick={() => navigate('/')} className='bg-shop-blue-dark text-white'>
              На главную
            </Button> */}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className='min-h-screen bg-gray-100'>
        <Header showBackButton onBackClick={() => navigate('/')} />

        <div className='container mx-auto pt-32 pb-20 px-4'>
          <h1 className='text-4xl font-bold mb-12 text-center text-shop-text'>
            {t('profile.title')}
          </h1>

          <div className='max-w-lg mx-auto bg-white p-8 rounded-xl shadow-lg space-y-8'>
            <div className='text-center'>
              <h2 className='text-2xl font-semibold text-shop-text mb-2'>{t('profile.info')}</h2>
              <p className='text-gray-700'>
                Email: <span className='font-medium text-shop-blue-dark'>{user.email}</span>
              </p>
              {/* Здесь можно добавить другую информацию о пользователе, если она доступна */}
            </div>

            <div className='flex flex-col sm:flex-row justify-center items-center gap-4'>
              <Button
                onClick={() => setIsProfileModalOpen(true)}
                className='w-full sm:w-auto bg-shop-blue-dark text-white hover:bg-shop-blue-dark/90 px-6 py-3 text-base'
              >
                {t('profile.edit')}
              </Button>
              <Button
                onClick={() => setIsOrdersModalOpen(true)}
                className='w-full sm:w-auto bg-shop-peach text-shop-text hover:bg-shop-peach-dark hover:text-white px-6 py-3 text-base'
              >
                {t('profile.orders')}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <ProfileModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} />
      <OrdersModal isOpen={isOrdersModalOpen} onClose={() => setIsOrdersModalOpen(false)} />
    </>
  );
}
