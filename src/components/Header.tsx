
import React, { useState, useEffect } from 'react';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // This would normally be connected to your cart state
    // For demo purposes, we'll just set a random number
    setCartItemCount(3);
  }, []);

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
      isScrolled 
        ? "bg-white shadow-md py-3" 
        : "bg-transparent py-5"
    )}>
      <div className="container mx-auto flex justify-between items-center">
        <a href="#" className="text-2xl font-bold text-shop-text">
          ШапкаШоп
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8">
          <a href="#" className="text-shop-text hover:text-shop-blue-dark transition-colors">
            Главная
          </a>
          <a href="#catalog" className="text-shop-text hover:text-shop-blue-dark transition-colors">
            Каталог
          </a>
          <a href="#benefits" className="text-shop-text hover:text-shop-blue-dark transition-colors">
            Преимущества
          </a>
          <a href="#reviews" className="text-shop-text hover:text-shop-blue-dark transition-colors">
            Отзывы
          </a>
          <a href="#contact" className="text-shop-text hover:text-shop-blue-dark transition-colors">
            Контакты
          </a>
        </nav>

        <div className="flex items-center space-x-4">
          <Button variant="ghost" className="relative p-2">
            <ShoppingCart className="h-6 w-6" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-shop-blue-dark text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </Button>
          <Button className="hidden md:inline-flex bg-shop-blue-dark text-white hover:bg-shop-blue-dark/90">
            Войти
          </Button>
          <button 
            className="md:hidden text-shop-text" 
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg py-4 px-6 animate-fade-in">
          <nav className="flex flex-col space-y-4">
            <a 
              href="#" 
              className="text-shop-text hover:text-shop-blue-dark transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Главная
            </a>
            <a 
              href="#catalog" 
              className="text-shop-text hover:text-shop-blue-dark transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Каталог
            </a>
            <a 
              href="#benefits" 
              className="text-shop-text hover:text-shop-blue-dark transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Преимущества
            </a>
            <a 
              href="#reviews" 
              className="text-shop-text hover:text-shop-blue-dark transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Отзывы
            </a>
            <a 
              href="#contact" 
              className="text-shop-text hover:text-shop-blue-dark transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Контакты
            </a>
            <Button className="bg-shop-blue-dark text-white hover:bg-shop-blue-dark/90 w-full">
              Войти
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
