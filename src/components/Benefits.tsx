
import React, { useRef, useEffect, useState } from 'react';

interface Benefit {
  icon: string;
  title: string;
  description: string;
}

const Benefits = () => {
  const benefitsRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  const benefits: Benefit[] = [
    {
      icon: "M16 11V7a4 4 0 0 0-8 0v4M5 9h14l1 12H4L5 9z",
      title: "Широкий выбор товаров",
      description: "Более 100 наименований товаров высокого качества для всей семьи"
    },
    {
      icon: "M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 6c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm8.39-6.56C19.85 5.31 16.18 4 12 4s-7.85 1.31-8.39 3.44A7.62 7.62 0 0 0 3 10.5C3 16.29 7.03 21 12 21s9-4.71 9-10.5c0-1.25-.2-2.45-.61-3.56z",
      title: "Гарантированное качество",
      description: "Мы тщательно отбираем поставщиков и контролируем качество всей продукции"
    },
    {
      icon: "M22 12h-4l-3 9L9 3l-3 9H2",
      title: "Быстрая доставка",
      description: "Доставляем заказы в течение 24 часов по городу и 1-3 дня по всей стране"
    },
    {
      icon: "M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z",
      title: "Круглосуточная поддержка",
      description: "Наши специалисты всегда на связи и готовы помочь вам с любым вопросом"
    },
    {
      icon: "M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6",
      title: "Выгодные цены",
      description: "Работаем напрямую с производителями, чтобы предложить лучшие цены"
    },
    {
      icon: "M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17",
      title: "Программа лояльности",
      description: "Накапливайте бонусы с каждой покупки и получайте персональные скидки"
    }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        root: null,
        threshold: 0.1
      }
    );

    if (benefitsRef.current) {
      observer.observe(benefitsRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section id="benefits" className="py-16 bg-gradient-to-b from-white to-shop-blue/10 scroll-mt-24">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-shop-text">Наши преимущества</h2>
          <div className="w-24 h-1 bg-shop-blue-dark mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Мы стремимся сделать ваши покупки максимально приятными и удобными
          </p>
        </div>

        <div 
          ref={benefitsRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {benefits.map((benefit, index) => (
            <div 
              key={index}
              className={`bg-white p-6 rounded-xl shadow-md transition-all duration-500 transform ${
                isVisible 
                ? 'translate-y-0 opacity-100' 
                : 'translate-y-10 opacity-0'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="bg-shop-peach/30 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                <svg 
                  className="w-8 h-8 text-shop-blue-dark" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d={benefit.icon}
                  ></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-shop-text">{benefit.title}</h3>
              <p className="text-gray-600">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Benefits;
