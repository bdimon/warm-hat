// src/i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Файлы переводов мы создадим на следующем шаге
import translationEN from '@/locales/en/translation.json';
import translationRU from '@/locales/ru/translation.json';
import translationUA from '@/locales/ua/translation.json';
import translationPL from '@/locales/pl/translation.json';

const resources = {
  en: {
    translation: translationEN,
  },
  ru: {
    translation: translationRU,
  },
  ua: {
    translation: translationUA,
  },
  pl: {
    translation: translationPL,
  },
  // Добавьте другие языки здесь
};

i18n
  .use(LanguageDetector) // Обнаруживает язык пользователя
  .use(initReactI18next) // Передает экземпляр i18n в react-i18next
  .init({
    resources,
    fallbackLng: 'en', // Язык по умолчанию, если язык пользователя недоступен
    lng: 'en', // Язык по умолчанию (можно также положиться на LanguageDetector)
    debug: process.env.NODE_ENV === 'development', // Включает логи в консоль в режиме разработки

    interpolation: {
      escapeValue: false, // React уже защищает от XSS-атак
    },

    detection: {
      // Порядок и откуда определять язык
      order: ['localStorage', 'navigator', 'htmlTag', 'path', 'subdomain'],
      // Места для кеширования определенного языка
      caches: ['localStorage'],
    },
  });

export default i18n;
