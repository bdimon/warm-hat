import React, { useState, useEffect } from 'react';
import { ShoppingCart, Menu, X, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {Link, useNavigate } from 'react-router-dom';
import { useCart } from "@/context/CartContext";
import CartModal from "./CartModal";// Assuming CartModal is a dialog
import AuthModal from './AuthModal';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js'
import { useSnackbar } from "@/context/SnackbarContext";
// import ProfileModal from './ProfileModal'; // for Modal

interface HeaderProps {
  showBackButton?: boolean;
  // Consider adding a prop to pass the current page's path for active link styling
  onBackClick?: () => void;
}

const Header : React.FC<HeaderProps> = ({ showBackButton = false, onBackClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const { cart } = useCart();
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const { showSnackbar } = useSnackbar();
  // const [openProfile, setOpenProfile] = useState(false); for Modal

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
    const getUser = async () => {
      // const { data: { user } } = await supabase.auth.getUser();
      // Можно также явно указать тип здесь для большей ясности
      const { data: { user: fetchedUser } } = await supabase.auth.getUser();

      setUser(fetchedUser);
    };

    getUser();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsAuthOpen(false);
    setIsOpen(false);
    showSnackbar("Вы вышли из аккаунта", "info");
    navigate('/');
  };

  const handleLogin = () => {
    setIsAuthOpen(true);
    setIsOpen(false);
  };


  const handleBack = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      navigate(-1);
    }
  };

  

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
      isScrolled 
        ? "bg-white shadow-md py-3" 
        : "bg-transparent py-5"
    )}>
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-shop-text hover:text-shop-blue-dark transition-colors">
          Шапка Шоп
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8">
        {showBackButton ? (
            <button
              onClick={handleBack}
              className="flex items-center text-shop-text hover:text-shop-blue-dark transition-colors"
            >
              <ArrowLeft className="mr-1" size={20} /> Назад
            </button>
          ) : (
            <>
              <Link to="/" className="text-shop-text hover:text-shop-blue-dark transition-colors">
                Главная
              </Link>
              <Link to="/#catalog" className="text-shop-text hover:text-shop-blue-dark transition-colors">
                Каталог
              </Link> 
              <Link to="/#benefits" className="text-shop-text hover:text-shop-blue-dark transition-colors">
                Преимущества
              </Link> 
              <Link to="/#reviews" className="text-shop-text hover:text-shop-blue-dark transition-colors">
                Отзывы
              </Link> 
              <Link to="/#contact" className="text-shop-text hover:text-shop-blue-dark transition-colors">
                Контакты
              </Link> 
            </>
          )}
        </nav>

        <div className="flex items-center space-x-4">
          <button onClick={() => setIsCartOpen(true)} className="relative p-2" aria-label="Открыть корзину"
            aria-haspopup="dialog">
            <ShoppingCart className="w-8 h-8 md:w-10 md:h-10" color="#33c4f0" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-shop-blue-dark text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cartItemCount}
              </span>
             )} 
          </button>
          {user ? (
            <>
              <Button
                variant="outline"
                className="hidden md:inline-flex text-shop-blue-dark border-shop-blue-dark hover:bg-shop-blue-dark hover:text-white"
                // for Modal
                // onClick={() => {
                //   console.log('Header:  Profile Button onClick triggered, setting openProfile to true. Current value:', openProfile);
                //   setOpenProfile(true);
                // }
                // }
                onClick={() => {
                  navigate('/profile');
                  setIsOpen(false);
                }}
              >
                Профиль
                {/*  for Modal <ProfileModal open={openProfile} onClose={() => {
                  console.log('Header: onClose called, setting openProfile to false. Current value:', openProfile);
                  setOpenProfile(false);
                }} /> */}
              </Button >
              <span className="text-sm text-shop-text mb-2">{user.email}</span>
              <Button onClick={handleLogout} className="hidden md:inline-flex bg-shop-blue-dark text-white hover:bg-shop-blue-dark/90">
                Выйти
              </Button> 
            </>
       
          ) : (
            <Button onClick={handleLogin} className="hidden md:inline-flex bg-shop-blue-dark text-white hover:bg-shop-blue-dark/90">
            Войти
          </Button>
          )}
          
          <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
          <button 
            className="md:hidden text-shop-text" 
            onClick={() => setIsOpen(!isOpen)} aria-label={isOpen ? "Закрыть меню навигации" : "Открыть меню навигации"}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div id="mobile-menu" className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg py-4 px-6 animate-fade-in" role="navigation">
          <nav className="flex flex-col space-y-4">
            {showBackButton ? (
            <button
              onClick={handleBack}
              className="flex items-center text-shop-text hover:text-shop-blue-dark transition-colors"
            >
              <ArrowLeft className="mr-1" size={20} /> Назад
            </button>
            ) : (
            <>
            <Link to="/" className="text-shop-text hover:text-shop-blue-dark transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Главная
            </Link>
            <Link to= "/#catalog" className="text-shop-text hover:text-shop-blue-dark transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Каталог
            </Link> 
            <Link to= "/#benefits" 
              className="text-shop-text hover:text-shop-blue-dark transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Преимущества
            </Link> 
            <Link to= "/#reviews" 
              className="text-shop-text hover:text-shop-blue-dark transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Отзывы
            </Link> 
            <Link to= "/#contact" 
              className="text-shop-text hover:text-shop-blue-dark transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Контакты
            </Link> 
            </>
          )
        }
        
        {user ? (
          <>
          <Button
            variant="outline"
            className="md:hidden text-shop-blue-dark border-shop-blue-dark hover:bg-shop-blue-dark hover:text-white w-full"
            onClick={() => {
              setIsOpen(false); // закрыть меню
              navigate('/profile');
            }}
          >
            Профиль
          </Button>
          <span className="md:hidden block text-sm text-shop-text text-center mt-2">
            {user.email}
          </span>
          <Button variant="ghost" onClick={handleLogout} className="bg-shop-blue-dark text-white hover:bg-shop-blue-dark/90 w-full">
            Выйти
          </Button>
          </>
          
          
        ) : (
          <Button variant="ghost" onClick={handleLogin} className="bg-shop-blue-dark text-white hover:bg-shop-blue-dark/90 w-full">
            Войти
          </Button>
          
          )
        }
          
          </nav>
        </div>
      )}

      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </header>
  );
};

export default Header;
