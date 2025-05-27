import { useState, useEffect, useRef } from 'react';
import ProductCard  from './ProductCard';
import { Button } from '@/components/ui/button';
import { Product } from '@/types/Product';
import { mapProductFromAPI } from "@/lib/mappers/products";
import { useTranslation } from 'react-i18next';
import { log } from 'console';

// Конфигурация категорий:
// filterKey: ключ, который хранится в product.category и используется для фильтрации
// translationKeySuffix: суффикс ключа для файла переводов (например, catalogPage.allCategories)
const CATEGORIES_CONFIG = [
  { filterKey: 'all', translationKeySuffix: 'allCategories' },
  { filterKey: 'hats', translationKeySuffix: 'hatsCategory' },
  { filterKey: 'scarves', translationKeySuffix: 'scarvesCategory' },
  { filterKey: 'combinations', translationKeySuffix: 'combinationsCategory' },
];

const Catalog = () => {
  const { t } = useTranslation();
  const [selectedFilterKey, setSelectedFilterKey] = useState<string>(
    CATEGORIES_CONFIG[0].filterKey
  );
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const catalogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Важно отключать наблюдатель после первого срабатывания
        }
      },
      {
        root: null,
        threshold: 0.1,
      }
    );

    const currentCatalogRef = catalogRef.current;

    // Начинаем наблюдение только если загрузка завершена и ref существует
    if (!loading && currentCatalogRef) {
      observer.observe(currentCatalogRef);
    }

    return () => {
      // Очистка: отключаем наблюдатель при размонтировании компонента
      // или перед повторным запуском эффекта из-за изменения loading
      if (currentCatalogRef) {
        // Убедимся, что наблюдатель был применен к элементу
        observer.disconnect();
      }
    };
  }, [loading]); // Добавляем loading в зависимости, чтобы эффект перезапустился после загрузки

  useEffect(() => {
    setLoading(true);
    setError(null);
    // Подгружаем с бэкенда
    fetch('http://localhost:3010/api/products')
      .then((res) => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        return res.json();
      })
      .then((res) => {
        const mapped: Product[] = res.data.map(mapProductFromAPI);
        setAllProducts(mapped);
        // setDisplayedProducts(mapped); // Удаляем эту строку
      })
      // .catch(err => console.error("Ошибка загрузки товаров:", err));
      .catch((err) => {
        console.error('Ошибка загрузки товаров:', err);
        setError(err.message || 'Не удалось загрузить каталог товаров.');
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    // Фильтрация на основе selectedFilterKey, который теперь является языконезависимым ключом
    if (selectedFilterKey === 'all') {
      setDisplayedProducts(allProducts);
    } else {
      setDisplayedProducts(allProducts.filter((product) => product.category === selectedFilterKey));
    }
    // Зависимость от `t` здесь больше не нужна, так как сама фильтрация от перевода не зависит
  }, [selectedFilterKey, allProducts]);

  return (
    <section id='catalog' className='py-16 scroll-mt-24'>
      <div className='container mx-auto'>
        <div className='text-center mb-16'>
          <h2 className='text-3xl md:text-4xl font-bold mb-4 text-shop-text'>
            {t('catalogPage.title')}
          </h2>
          <div className='w-24 h-1 bg-shop-blue-dark mx-auto mb-6'></div>
          <p className='text-lg text-gray-600 max-w-2xl mx-auto'>{t('catalogPage.description')}</p>
        </div>

        <div className='flex flex-wrap justify-center gap-3 mb-10'>
          {CATEGORIES_CONFIG.map(({ filterKey, translationKeySuffix }) => (
            <Button
              key={filterKey}
              variant={selectedFilterKey === filterKey ? 'default' : 'outline'}
              className={
                selectedFilterKey === filterKey
                  ? 'bg-shop-blue-dark hover:bg-shop-blue-dark/90 text-white'
                  : 'text-shop-text border-shop-blue hover:bg-shop-blue/50 hover:text-shop-blue-dark'
              }
              onClick={() => setSelectedFilterKey(filterKey)}
            >
              {t(`catalogPage.${translationKeySuffix}`)}
            </Button>
          ))}
        </div>
        {loading && <div className='text-center py-10'>{t('catalogPage.loading')}</div>}
        {error && (
          <div className='text-center py-10 text-red-500'>
            {t('catalogPage.error', { errorMessage: error })}
          </div>
        )}

        {!loading && !error && (
          <div
            ref={catalogRef}
            className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8'
          >
            {displayedProducts.map((product, index) => (
              <div
                key={product.id}
                className={`transition-all duration-700 transform ${
                  isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                {/* Упрощаем: ProductCard рендерится всегда, анимация контролируется родительским div */}
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
        <div className='mt-12 text-center'>
          <Button className='bg-shop-peach text-shop-text hover:bg-shop-peach-dark hover:text-white px-8 py-6 text-lg rounded-full'>
            {t('catalogPage.showMore')}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Catalog;
