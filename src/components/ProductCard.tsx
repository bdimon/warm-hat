
import React from 'react';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom'; // or 'next/link';
import { useCart } from '@/hooks/use-cart';
import { ProductInCart } from "@/types/cart";
import { Product, SupportedLanguage } from '@/types/Product';
import { getLocalizedValue, formatPrice } from "@/lib/mappers/products";
import { useTranslation } from 'react-i18next';
 
interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { i18n, t } = useTranslation();
  const currentLang = i18n.language.split('-')[0] as SupportedLanguage;
  const { addToCart } = useCart();
  
  // Получаем локализованные значения
  const localizedName = getLocalizedValue(product.name, currentLang);
  const localizedPrice = getLocalizedValue(product.price, currentLang);
  const localizedSalePrice = product.salePrice
    ? getLocalizedValue(product.salePrice, currentLang)
    : undefined;
  // const localizedDescription = getLocalizedValue(product.description, currentLang);
  
  // Убедимся, что все значения - строки, а не объекты
  const displayName = typeof localizedName === 'string' ? localizedName : '';
  // const displayDescription = typeof localizedDescription === 'string' ? localizedDescription : '';
  
  // Форматируем цену
  // const formattedPrice = new Intl.NumberFormat(i18n.language, {
  //   style: 'currency',
  //   currency: 'PLN',
  // }).format(product.price);
  const handleAddToCart = () => {
    if (!product) return;
    const productToAdd: ProductInCart = {
      id: product.id, // Убедитесь, что product.id существует и имеет тип string
      name: product.name,
      price: product.isSale && product.salePrice ? product.salePrice : product.price,
      images:
        product.images && product.images.length > 0 ? product.images : ['/images/placeholder.png'], // Пример, если ProductInCart ожидает одно изображение
      quantity: 1, // Начальное количество
    };
    addToCart(productToAdd);
  };
  
  return (
    <div className='bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group'>
      <div className='relative h-64 overflow-hidden'>
        <Link to={`/catalog/${product.id}`}>
          <img
            src={product.images?.[0] || '/placeholder.svg'}
            alt={displayName || t('adminOrderDetail.noItemsInfo')}
            className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-110'
          />
        </Link>
        {product.isNew && (
          <div className='absolute top-3 left-3 bg-shop-blue-dark text-white text-xs font-bold uppercase py-1 px-2 rounded'>
            {t('adminProductForm.isNewLabel')}
          </div>
        )}
        {product.isSale && (
          <div className='absolute top-3 right-3 bg-[#FF5252] text-white text-xs font-bold uppercase py-1 px-2 rounded'>
            {t('adminProductForm.isSaleLabel')}
          </div>
        )}
      </div>

      <div className='p-4'>
        <h3 className='text-lg font-semibold mb-2 text-shop-text'>{displayName}</h3>
        <div className='flex justify-between items-center'>
          {product.isSale && localizedSalePrice ? (
            <div className='flex items-center gap-2 mb-4'>
              <span className='text-xl font-bold text-red-500'>
                {formatPrice(localizedSalePrice, currentLang)}
              </span>
              <span className='line-through text-gray-400'>
                {formatPrice(localizedPrice, currentLang)}
              </span>
            </div>
          ) : (
            <p className='text-2xl font-bold text-shop-text mb-4'>
              {formatPrice(localizedPrice, currentLang)}
            </p>
          )}
          <button
            onClick={handleAddToCart}
            aria-label={t('catalogPage.addToCart')}
            className='bg-shop-blue text-shop-text hover:bg-shop-blue-dark hover:text-white transition-colors py-2 px-4 rounded-full text-sm'
          >
            {t('catalogPage.addToCart')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
