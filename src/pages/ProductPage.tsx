import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Product, SupportedLanguage, CURRENCY_SYMBOLS } from "@/types/Product";
import { Button } from "@/components/ui/button";
import { Loader2, ShoppingCart } from 'lucide-react';
import { useCart } from '@/hooks/use-cart';
import { ProductInCart } from '@/types/cart';
import Header from "@/components/Header";
import { getLocalizedValue, formatPrice } from '@/lib/mappers/products';
import { useTranslation } from 'react-i18next';
 
export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [mainImage, setMainImage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const { i18n, t } = useTranslation();
  
  // Получаем текущий язык и преобразуем его в SupportedLanguage
  const currentLang = i18n.language.split('-')[0] as SupportedLanguage;

  // Получаем символ валюты для текущего языка
  const currencySymbol = CURRENCY_SYMBOLS[currentLang];

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`http://localhost:3010/api/products/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Ошибка HTTP: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setProduct(data);
        setMainImage(data.images?.[0] || "/placeholder.png");
      })
      .catch((err) => {
        console.error("Ошибка загрузки товара:", err);
        setError(err.message || "Не удалось загрузить информацию о товаре.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    const productToAdd: ProductInCart = {
      id: product.id, // Убедитесь, что product.id существует и имеет тип string
      name: product.name,
      price: product.isSale && product.salePrice ? product.salePrice : product.price,
      images: product.images && product.images.length > 0 ? product.images : ["/images/placeholder.png"], // Пример, если ProductInCart ожидает одно изображение
      quantity: 1, // Начальное количество
    };
    addToCart(productToAdd);
  };

  if (loading)
    return (
      <div className='p-4 text-center'>
        <Loader2 className='h-8 w-8 animate-spin text-shop-blue-dark' />
        <p className=''>Загрузка...</p>
      </div>
    );
  if (error) return <div className="p-4 text-center text-red-500">Ошибка: {error}</div>;
  if (!product) return <div className="p-4 text-center">Товар не найден.</div>;

  // Получаем локализованные значения
  const localizedName = getLocalizedValue(product.name, currentLang);
  const localizedPrice = getLocalizedValue(product.price, currentLang);
  const localizedSalePrice = product.salePrice 
    ? getLocalizedValue(product.salePrice, currentLang) 
    : undefined;

  return (
    // Если Header имеет фиксированное или "липкое" позиционирование,
    // секции нужен достаточный верхний отступ (padding-top),
    // чтобы контент (grid) не перекрывался хедером.
    // Значение отступа (например, pt-16, pt-20) должно соответствовать высоте хедера.
    // Пример: если хедер высотой ~4rem (h-16), то pt-16 или больше.

    <section className="container mx-auto px-4 pt20 pb-6 md:pt-24 md:pb-8 my-8 md:my-12">
      <Header showBackButton onBackClick={() => navigate("/#catalog")} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Галерея */}
        <div>
          <img
            src={mainImage}
            alt={localizedName}
            className="w-full h-auto object-cover rounded shadow mb-4"
          />
          <div className="flex flex-wrap gap-2">
            {product.images?.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`preview-${idx}`}
                onClick={() => setMainImage(img)}
                className={`h-20 w-20 object-cover cursor-pointer rounded-lg border ${
                  img === mainImage ? "border-blue-500" : "border-transparent"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Описание */}
        <div>
          <h1 className="text-2xl font-bold mb-2">{localizedName}</h1>
          {/* <p className="text-gray-500 mb-4">{product.description}</p> */}

          {product.isSale && localizedSalePrice ? (
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl font-bold text-red-500">
                {formatPrice(localizedSalePrice, currentLang)}
              </span>
              <span className="line-through text-gray-400">{formatPrice(localizedPrice, currentLang)}</span>
            </div>
          ) : (
            <p className="text-2xl font-bold text-shop-text mb-4">
              {formatPrice(localizedPrice, currentLang)}
            </p>
          )}
          <Button
            onClick={handleAddToCart} 
            className="w-full sm:w-auto bg-shop-blue-dark hover:bg-shop-blue-dark/80 text-white font-bold py-3 px-6 sm:py-4 sm:px-8 border border-blue-300 rounded-full flex items-center justify-center text-base sm:text-lg"
            aria-label="Добавить в корзину"
          >
            <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 mr-2" color="white" />
             <span className="text-lg font-bold ml-1">{t('product.addToCart')}</span>
          </Button>
        </div>
      </div>
    </section>
  );
}
