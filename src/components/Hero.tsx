
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useTranslation, Trans } from 'react-i18next';

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    // Set a timeout to allow the component to mount and the animation to happen
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const handleCatalog = () => {
    navigate('/#catalog');
  };
  const handleAbout = () => {
    navigate('/#contact');
  };

  return (
    <section className='min-h-[90vh] flex items-center bg-gradient-to-br from-shop-blue/40 to-shop-peach/40 pt-24'>
      <div className='container mx-auto grid md:grid-cols-2 gap-12 items-center'>
        <div
          className={`space-y-6 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
        >
          <h1 className='text-4xl md:text-6xl font-bold text-shop-text'>
            <Trans i18nKey='hero.welcome'>
              Добро пожаловать в наш <span className='text-shop-blue-dark'>теплый магазин</span>
            </Trans>
          </h1>
          <p className='text-lg text-gray-600 max-w-lg'>{t('hero.description')}</p>
          <div className='flex flex-wrap gap-4'>
            <Button
              onClick={handleCatalog}
              className='bg-shop-blue-dark text-white hover:bg-shop-blue-dark/90 hover:shadow-lg text-lg py-6 px-8 rounded-full'
            >
              {t('hero.toCatalog')}
            </Button>
            <Button
              onClick={handleAbout}
              variant='outline'
              className='text-shop-text border-shop-peach-dark hover:bg-shop-peach/50 text-lg py-6 px-8 rounded-full'
            >
              {t('hero.aboutUs')}
            </Button>
          </div>
          <div className='flex items-center gap-6 mt-8'>
            <div>
              <p className='text-3xl font-bold text-shop-blue-dark'>1,000+</p>
              <p className='text-sm text-gray-600'>{t('hero.happy')}</p>
            </div>
            <div className='h-12 w-px bg-gray-200'></div>
            <div>
              <p className='text-3xl font-bold text-shop-blue-dark'>24/7</p>
              <p className='text-sm text-gray-600'>{t('hero.support')}</p>
            </div>
            <div className='h-12 w-px bg-gray-200'></div>
            <div>
              <p className='text-3xl font-bold text-shop-blue-dark'>100%</p>
              <p className='text-sm text-gray-600'>{t('hero.guarantee')}</p>
            </div>
          </div>
        </div>
        <div
          className={`relative transition-all duration-1000 delay-300 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}
        >
          <div className='bg-white p-4 rounded-2xl shadow-xl overflow-hidden'>
            <img
              src='/images/four-hats.webp'
              alt='Разнообразные товары'
              className='w-full h-[400px] object-cover rounded-xl'
            />
          </div>
          <div className='absolute -bottom-8 -left-8 bg-shop-peach p-4 rounded-xl shadow-lg animate-bounce-light'>
            <div className='flex items-center gap-3'>
              <div className='bg-white rounded-full p-2'>
                <svg
                  className='w-6 h-6 text-shop-blue-dark'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M5 13l4 4L19 7'
                  ></path>
                </svg>
              </div>
              <div>
                <p className='font-semibold'>{t('hero.freeShipping')}</p>
                <p className='text-sm'>{t('hero.freeShippingCondition')}</p>
              </div>
            </div>
          </div>
          <div
            className='absolute -top-8 -right-8 bg-shop-blue p-4 rounded-xl shadow-lg animate-bounce-light'
            style={{ animationDelay: '1s' }}
          >
            <div className='flex items-center gap-3'>
              <div className='bg-white rounded-full p-2'>
                <svg
                  className='w-6 h-6 text-shop-blue-dark'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
                  ></path>
                </svg>
              </div>
              <div>
                <p className='font-semibold'>{t('hero.fastDelivery')}</p>
                <p className='text-sm'>{t('hero.fastDeliveryTime')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
/*
inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 h-10 px-4 py-2 bg-shop-blue-dark hover:bg-shop-blue-dark/90 text-white
*/
