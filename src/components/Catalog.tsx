
import React, { useState, useEffect, useRef } from 'react';
import ProductCard, { Product } from './ProductCard';
import { Button } from '@/components/ui/button';

// Mock products data
const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Шапка с логотипом",
    price: 12990,
    image: "/hamed-darzi-6dILIIipKHk-unsplash.jpg",
    category: "Шапки",
    isNew: true
  },
  {
    id: 2,
    name: "Шапка теплая",
    price: 8990,
    image: "/abdur-ahmanus-ZKxxR7fCiWQ-unsplash.jpg",
    category: "Шапки",
    isSale: true,
    salePrice: 7490
  },
  {
    id: 3,
    name: "Шапка бини",
    price: 5990,
    image: "/erik-mclean-CSlBUY-R6dY-unsplash.jpg",
    category: "Шапки"
  },
  {
    id: 4,
    name: "Шарфы вязаные",
    price: 18990,
    image: "/kelly-sikkema-scarfs-unsplash.jpg",
    category: "Шарфы и снуды"
  },
  {
    id: 5,
    name: "Комплект 1",
    price: 21990,
    image: "/abdur-ahmanus-ZKxxR7fCiWQ-unsplash.jpg",
    category: "Комплекты",
    isNew: true
  },
  {
    id: 6,
    name: "Шарф вязаный",
    price: 4990,
    image: "/hamed-darzi-6dILIIipKHk-unsplash.jpg",
    category: "Шарфы и снуды",
    isSale: true,
    salePrice: 3990
  },
  {
    id: 7,
    name: "Комплект шапочка и шарф",
    price: 3490,
    image: "/public/maria-kovalets-e0mkwiV22Mk-unsplash.jpg",
    category: "Комплекты"
  },
  {
    id: 8,
    name: "Комплект бини и снуд",
    price: 2990,
    image: "/public/kerim-ayar-WWpJViNdatc-unsplash.jpg",
    category: "Комплекты"
  }
];

// Filter category options
const CATEGORIES = ["Все", "Шапки", "Шарфы и снуды", "Комплекты"];

const Catalog = () => {
  const [selectedCategory, setSelectedCategory] = useState("Все");
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const catalogRef = useRef<HTMLDivElement>(null);

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

    if (catalogRef.current) {
      observer.observe(catalogRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (selectedCategory === "Все") {
      setDisplayedProducts(PRODUCTS);
    } else {
      setDisplayedProducts(PRODUCTS.filter(product => product.category === selectedCategory));
    }
  }, [selectedCategory]);

  return (
    <section id="catalog" className="py-20">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-shop-text">Каталог товаров</h2>
          <div className="w-24 h-1 bg-shop-blue-dark mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Мы предлагаем только качественные товары связанные вручную с быстрой доставкой по всей Европе
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {CATEGORIES.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              className={selectedCategory === category 
                ? "bg-shop-blue-dark hover:bg-shop-blue-dark/90 text-white"
                : "text-shop-text border-shop-blue hover:bg-shop-blue/10"
              }
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>

        <div 
          ref={catalogRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8"
        >
          {displayedProducts.map((product, index) => (
            <div 
              key={product.id}
              className={`transition-all duration-500 transform ${
                isVisible 
                ? 'translate-y-0 opacity-100' 
                : 'translate-y-10 opacity-0'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button 
            className="bg-shop-peach text-shop-text hover:bg-shop-peach-dark hover:text-white px-8 py-6 text-lg rounded-full"
          >
            Показать больше товаров
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Catalog;
