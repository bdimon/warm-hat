
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom'; // or 'next/link';
import { useCart } from "@/context/CartContext";
import { Product } from "@/types/Product";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group">
      <div className="relative h-64 overflow-hidden">
        <Link to={`/catalog/${product.id}`}>
        <img 
          src={product.images?.[0] || "/placeholder.svg"} 
          alt={product.name || "Без названия"}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        </Link >
        {product.isNew && (
          <div className="absolute top-3 left-3 bg-shop-blue-dark text-white text-xs font-bold uppercase py-1 px-2 rounded">
            Новинка
          </div>
        )}
        {product.isSale && (
          <div className="absolute top-3 right-3 bg-[#FF5252] text-white text-xs font-bold uppercase py-1 px-2 rounded">
            Скидка
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="text-sm text-gray-500 mb-1">{product.category || "Категория"}</div>
        <h3 className="text-lg font-semibold mb-2 text-shop-text transition-colors group-hover:text-shop-blue-dark">
          {product.name}
        </h3>
        <div className="flex justify-between items-center">
          <div>
            {product.isSale && product.salePrice ? (
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-shop-text">{product.salePrice}₽</span>
                <span className="text-sm text-gray-500 line-through">{product.price}₽</span>
              </div>
            ) : (
              <span className="text-xl font-bold text-shop-text">{product.price}₽</span>
            )}
          </div>
          <Button
            onClick={() => addToCart(product)} 
            className="bg-shop-blue-dark text-white hover:bg-shop-blue-dark/90 rounded-full p-2 h-10 w-10"
            aria-label="Добавить в корзину"
          >
            <ShoppingCart className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
