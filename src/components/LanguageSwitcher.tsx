// src/components/LanguageSwitcher.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button'; // Предполагая, что у вас есть компонент Button

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className='flex space-x-2'>
      <Button
        variant={i18n.language.startsWith('ru') ? 'default' : 'outline'}
        onClick={() => changeLanguage('ru')}
        size='sm'
        aria-pressed={i18n.language.startsWith('ru')}
      >
        RU
      </Button>
      <Button
        variant={i18n.language.startsWith('en') ? 'default' : 'outline'}
        onClick={() => changeLanguage('en')}
        size='sm'
        aria-pressed={i18n.language.startsWith('en')}
      >
        EN
      </Button>
      <Button
        variant={i18n.language.startsWith('ua') ? 'default' : 'outline'}
        onClick={() => changeLanguage('ua')}
        size='sm'
        aria-pressed={i18n.language.startsWith('ua')}
      >
        UA
      </Button>
      <Button
        variant={i18n.language.startsWith('pl') ? 'default' : 'outline'}
        onClick={() => changeLanguage('pl')}
        size='sm'
        aria-pressed={i18n.language.startsWith('pl')}
      >
        PL
      </Button>
      {/* Добавьте другие языки по аналогии */}
    </div>
  );
};

export default LanguageSwitcher;
