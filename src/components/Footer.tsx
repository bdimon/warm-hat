
import React from 'react';
import { Facebook, Instagram, Twitter, Telescope } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-shop-text text-white pt-16 pb-8">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-6">ШапкаШоп</h2>
            <p className="mb-6 text-gray-300 max-w-md">
              Интернет-магазин качественных вязанных вручную изделий с быстрой доставкой по всей Европе.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="bg-white/10 p-3 rounded-full hover:bg-shop-blue-dark transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="bg-white/10 p-3 rounded-full hover:bg-shop-blue-dark transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="bg-white/10 p-3 rounded-full hover:bg-shop-blue-dark transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="bg-white/10 p-3 rounded-full hover:bg-shop-blue-dark transition-colors">
                <Telescope className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6">Каталог</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Шапки</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Шарфы и снуды</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Комплекты</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6">Информация</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">О компании</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Доставка и оплата</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Возврат и обмен</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Гарантия</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Блог</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6">Контакты</h3>
            <ul className="space-y-3">
              <li className="text-gray-300">08-110, Warszawa, Polska, ul. Warszawska 2</li>
              <li><a href="tel:+78001234567" className="text-gray-300 hover:text-white transition-colors">+48 536 223 178</a></li>
              <li><a href="mailto:info@bystromarket.ru" className="text-gray-300 hover:text-white transition-colors">support@shapkashop.com</a></li>
              <li className="text-gray-300">Пн-Пт: 9:00 - 20:00</li>
              <li className="text-gray-300">Сб-Вс: 10:00 - 18:00</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} ШапкаШоп. Все права защищены.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 text-sm hover:text-white transition-colors">
                Политика конфиденциальности
              </a>
              <a href="#" className="text-gray-400 text-sm hover:text-white transition-colors">
                Пользовательское соглашение
              </a>
              <a href="#" className="text-gray-400 text-sm hover:text-white transition-colors">
                Карта сайта
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
