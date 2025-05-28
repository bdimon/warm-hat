// src/components/LanguageSwitcher.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
// import { Button } from '@/components/ui/button'; // Предполагая, что у вас есть компонент Button

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  // const changeLanguage = (lng: string) => {
  //   i18n.changeLanguage(lng);
  const changeLanguage = (event: React.ChangeEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(event.target.value);
  };
  const currentLang = i18n.language.split('-')[0];
  return (
  
    <div className='relative'>
      <select
        value={currentLang}
        onChange={changeLanguage}
        className='bg-white border border-shop-blue text-shop-text text-sm rounded-md py-1.5 pl-2 pr-8 focus:outline-none focus:ring-1 focus:ring-shop-blue-dark focus:border-shop-blue-dark appearance-none cursor-pointer'
        aria-label='Выбрать язык'
      >
        <option value='en' className='text-black bg-white'>
          EN
        </option>
        <option value='ru' className='text-black bg-white'>
          RU
        </option>
        <option value='ua' className='text-black bg-white'>
          UA
        </option>
        <option value='pl' className='text-black bg-white'>
          PL
        </option>
      </select>
      <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-shop-text'>
        <svg
          className='fill-current h-4 w-4'
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 20 20'
        >
          <path d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z' />
        </svg>
      </div>
    </div>
  );
};

export default LanguageSwitcher;
