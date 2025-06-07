import Stripe from 'stripe';
import dotenv from 'dotenv';

// Загружаем переменные окружения из .env файла
dotenv.config();

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
console.log('Secret Key доступен:', !!stripeSecretKey); // Для отладки (не выводит сам ключ)

// Убедитесь, что используется правильный секретный ключ
export const stripe = new Stripe(stripeSecretKey || '', {
  apiVersion: '2025-05-28.basil', // Используйте актуальную версию API
});

// Добавьте проверку наличия ключа при инициализации
if (!stripeSecretKey) {
  console.error('ВНИМАНИЕ: Переменная окружения STRIPE_SECRET_KEY не установлена!');
}
