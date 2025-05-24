
import React, { useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Benefits from '@/components/Benefits';
import Catalog from '@/components/Catalog';
import Testimonials from '@/components/Testimonials';
import Contact from '@/components/ContactForm';
import Footer from '@/components/Footer';

const Index = () => {
  const location = useLocation();

  const scrollToHash = useCallback((hashToScroll: string) => {
    // console.log('[Index.tsx] scrollToHash called. Attempting to scroll to hash:', hashToScroll);

    if (hashToScroll) { // Убедимся, что хеш не пустой
      const element = document.querySelector(hashToScroll); // Используем hashToScroll
      // console.log('[Index.tsx] Element found for hash:', hashToScroll, element);

      if (element) {
        const offset = 100; // Ваш текущий отступ
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - offset;
        
        //'console.log(`[Index.tsx] Scrolling to element:`, element, `Target Y: ${offsetPosition}`);

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }
  }, []); // Пустой массив зависимостей, т.к. функция не зависит от внешних переменных из props или state

  useEffect(() => {
    // console.log('[Index.tsx] useEffect for location.hash triggered. Current location.hash:', location.hash);
    if (location.hash) {
      // Небольшая задержка, чтобы убедиться, что DOM обновлен
      // Этот блок обрабатывает ссылки типа /#catalog, /#benefits и т.д.
      const timer = setTimeout(() => {
        scrollToHash(location.hash);
      }, 100); // Задержку можно настроить

      return () => clearTimeout(timer); // Очистка таймера
    }else {
      // Если хеш пустой (например, при переходе на / или /#), прокручиваем к самому верху
      // console.log('[Index.tsx] No hash found, scrolling to top (0).');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location.hash, scrollToHash]); // Эффект будет перезапускаться при изменении location.hash или scrollToHash

  return (
    <div className='flex flex-col min-h-screen'>
      <Header />
      <main className='relative z-0'>
        <Hero />
        <Catalog />
        <Benefits />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
