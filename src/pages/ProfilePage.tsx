// pages/account.tsx (или /profile)
// import  ProfileForm  from "@/components/ProfileForm";
// import AuthSettingsForm from "@/components/AuthSettingsForm"; // Больше не нужен здесь напрямую
// import { useUserOrders } from "@/hooks/use-user-orders"; // Логика заказов перенесена в OrdersModal
import { useUserProfile } from "@/hooks/use-user-profile";
import { useState } from 'react';
import  Header from "@/components/Header";
import { useNavigate } from 'react-router-dom';
import ProfileModal from '@/components/ProfileModal';
import OrdersModal from '@/components/OrdersModal';
import { Button } from '@/components/ui/button';


// interface ProfilePageProps {
//   open: boolean;
//   onClose: () => void;
// }

// export default function AccountPage({ open, onClose }: ProfilePageProps)  {
export default function AccountPage()  {
  const { user, loading: userLoading } = useUserProfile(); // Добавим userLoading для индикации загрузки пользователя
  const navigate = useNavigate();

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isOrdersModalOpen, setIsOrdersModalOpen] = useState(false);

  if (userLoading) {
    return (
      <div className='min-h-screen bg-gray-100 flex flex-col'>
        <Header showBackButton onBackClick={() => navigate('/')} />
        <div className='flex-grow flex items-center justify-center'>
          <p className='text-gray-600'>Загрузка данных пользователя...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    // Можно добавить редирект на главную или страницу логина, если пользователь не авторизован
    // setTimeout(() => navigate('/'), 100); // Пример редиректа
    return (
      <div className='min-h-screen bg-gray-100 flex flex-col'>
        <Header showBackButton onBackClick={() => navigate('/')} />
        <div className='flex-grow flex items-center justify-center'>
          <div className='text-center'>
            <p className='text-xl text-gray-700 mb-4'>
              Пожалуйста, войдите в аккаунт, чтобы просмотреть эту страницу.
            </p>
            <Button onClick={() => navigate('/')} className='bg-shop-blue-dark text-white'>
              На главную
            </Button>
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
          <h1 className='text-4xl font-bold mb-12 text-center text-shop-text'>Мой аккаунт</h1>

          <div className='max-w-lg mx-auto bg-white p-8 rounded-xl shadow-lg space-y-8'>
            <div className='text-center'>
              <h2 className='text-2xl font-semibold text-shop-text mb-2'>
                Информация о пользователе
              </h2>
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
                Редактировать профиль
              </Button>
              <Button
                onClick={() => setIsOrdersModalOpen(true)}
                className='w-full sm:w-auto bg-shop-peach text-shop-text hover:bg-shop-peach-dark hover:text-white px-6 py-3 text-base'
              >
                Мои заказы
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
