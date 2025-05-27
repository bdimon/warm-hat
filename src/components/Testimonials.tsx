
import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, ArrowRight, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

interface Testimonial {
  id: number;
  nameKey: string; // Ключ для имени
  avatar: string;
  rating: number;
  textKey: string; // Ключ для текста отзыва
  productKey: string; // Ключ для названия товара
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    nameKey: 'testimonials.customer1.name',
    avatar: 'https://randomuser.me/api/portraits/women/33.jpg',
    rating: 5,
    textKey: 'testimonials.customer1.text',
    productKey: 'testimonials.customer1.product',
  },
  {
    id: 2,
    nameKey: 'testimonials.customer2.name',
    avatar: 'https://randomuser.me/api/portraits/men/54.jpg',
    rating: 4,
    textKey: 'testimonials.customer2.text',
    productKey: 'testimonials.customer2.product',
  },
  {
    id: 3,
    nameKey: 'testimonials.customer3.name',
    avatar: 'https://randomuser.me/api/portraits/women/67.jpg',
    rating: 5,
    textKey: 'testimonials.customer3.text',
    productKey: 'testimonials.customer3.product',
  },
  {
    id: 4,
    nameKey: 'testimonials.customer4.name',
    avatar: 'https://randomuser.me/api/portraits/men/36.jpg',
    rating: 5,
    textKey: 'testimonials.customer4.text',
    productKey: 'testimonials.customer4.product',
  },
  {
    id: 5,
    nameKey: 'testimonials.customer5.name',
    avatar: 'https://randomuser.me/api/portraits/women/12.jpg',
    rating: 4,
    textKey: 'testimonials.customer5.text',
    productKey: 'testimonials.customer5.product',
  },
];

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const testimonialsRef = useRef<HTMLDivElement>(null);
  const slideRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

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
        threshold: 0.1,
      }
    );

    if (testimonialsRef.current) {
      observer.observe(testimonialsRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  const goToNext = () => {
    setActiveIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const goToPrev = () => {
    setActiveIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  // Autoplay
  useEffect(() => {
    const timer = setInterval(() => {
      goToNext();
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section
      id='reviews'
      className='py-12 bg-gradient-to-b from-shop-blue/10 to-white scroll-mt-24'
    >
      <div className='container mx-auto'>
        <div className='text-center mb-16'>
          <h2 className='text-3xl md:text-4xl font-bold mb-4 text-shop-text'>
            {t('testimonials.sectionTitle')}
          </h2>
          <div className='w-24 h-1 bg-shop-blue-dark mx-auto mb-6'></div>
          <p className='text-lg text-gray-600 max-w-2xl mx-auto'>
            {t('testimonials.sectionDescription')}
          </p>
        </div>

        <div
          ref={testimonialsRef}
          className={`max-w-4xl mx-auto transition-all duration-1000 ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className='relative'>
            <div className='overflow-hidden'>
              <div
                ref={slideRef}
                className='flex transition-transform duration-500 ease-in-out'
                style={{ transform: `translateX(-${activeIndex * 100}%)` }}
              >
                {testimonials.map((testimonial) => (
                  <div key={testimonial.id} className='w-full flex-shrink-0 p-4'>
                    <div className='bg-white rounded-xl shadow-lg p-8'>
                      <div className='flex items-center mb-6'>
                        <img
                          src={testimonial.avatar}
                          alt={testimonial.nameKey}
                          className='w-16 h-16 rounded-full object-cover mr-4'
                        />
                        <div>
                          <h3 className='text-xl font-semibold text-shop-text'>
                            {t(testimonial.nameKey)}
                          </h3>
                          <div className='flex items-center mt-1'>
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={16}
                                className={
                                  i < testimonial.rating
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-300'
                                }
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className='text-gray-600 mb-4 italic'>"{t(testimonial.textKey)}"</p>
                      <div className='pt-4 border-t border-gray-100'>
                        <p className='text-shop-blue-dark font-medium'>
                          {t('testimonials.productLabel')}: {t(testimonial.productKey)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Button
              variant='outline'
              onClick={goToPrev}
              className='absolute top-1/2 -left-4 transform -translate-y-1/2 bg-white border-gray-200 rounded-full p-2 shadow-md hover:bg-shop-blue hover:border-shop-blue md:-left-6'
              aria-label={t('testimonials.prevAriaLabel')}
            >
              <ArrowLeft className='h-5 w-5' />
            </Button>

            <Button
              variant='outline'
              onClick={goToNext}
              className='absolute top-1/2 -right-4 transform -translate-y-1/2 bg-white border-gray-200 rounded-full p-2 shadow-md hover:bg-shop-blue hover:border-shop-blue md:-right-6'
              aria-label={t('testimonials.nextAriaLabel')}
            >
              <ArrowRight className='h-5 w-5' />
            </Button>
          </div>

          <div className='flex justify-center mt-8 space-x-2'>
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  activeIndex === index ? 'bg-shop-blue-dark w-6' : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={t('testimonials.goToAriaLabel', { number: index + 1 })}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
