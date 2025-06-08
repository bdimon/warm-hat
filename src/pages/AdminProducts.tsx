import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Product, SupportedLanguage, MultilingualString, CURRENCY_SYMBOLS } from "@/types/Product";
import { mapProductFromAPI } from "@/lib/mappers/products";
import { useTranslation } from "react-i18next";
import Header from "@/components/Header";
import { Loader2 } from "lucide-react";

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language as SupportedLanguage || 'en';

  // Получаем символ валюты для текущего языка
  const currencySymbol = CURRENCY_SYMBOLS[currentLanguage];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:3010/api/products");
        if (!res.ok) throw new Error(t('adminProducts.errorLoading'));
        const json = await res.json();
        const mappedProducts = json.data.map(mapProductFromAPI);
        setProducts(mappedProducts);
      } catch (err) {
        if (err instanceof Error) setError(err.message);
        else setError(t('adminProducts.errorUnknown'));
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [t]);

  // Функция для получения локализованного значения
  const getLocalizedName = (name: string | MultilingualString): string => {
    if (typeof name === 'string') return name;
    return name[currentLanguage] || name.en || Object.values(name)[0] || '';
  };

  // Функция для получения локализованной цены
  const getLocalizedPrice = (price: number | Record<SupportedLanguage, number>): number => {
    if (typeof price === 'number') return price;
    return price[currentLanguage] || price.en || Object.values(price)[0] || 0;
  };

  const handleDelete = async (id: string) => {
    const confirm = window.confirm(t('adminProducts.confirmDelete'));
    if (!confirm) return;

    try {
      const res = await fetch(`http://localhost:3010/api/products/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error(t('adminProducts.errorDeleting'));
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      alert(t('adminProducts.errorDeletingAlert'));
    }
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col">
      <Header showBackButton onBackClick={() => navigate('/admin/dashboard')} />
      <div className="flex-grow flex items-center justify-center min-h-[300px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-shop-blue-dark mx-auto mb-2" />
          <div>{t('adminProducts.loading')}</div>
        </div>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="min-h-screen flex flex-col">
      <Header showBackButton onBackClick={() => navigate('/admin/dashboard')} />
      <div className="flex-grow flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-red-600 mb-4">{t('adminProducts.error')}: {error}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header showBackButton onBackClick={() => navigate('/admin/dashboard')} />
      <div className="container mx-auto pt-24 pb-12 px-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">{t('adminProducts.title')}</h1>
          <button
            onClick={() => navigate("/admin/products/new")}
            className="bg-shop-blue-dark text-white px-4 py-2 rounded hover:bg-shop-blue-dark/90"
          >
            + {t('adminProducts.newProduct')}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <div key={product.id} className="border p-4 rounded shadow-sm space-y-2">
              <img
                src={product.images?.[0] || "/placeholder.jpg"}
                alt={getLocalizedName(product.name)}
                className="w-full h-40 object-cover rounded"
              />
              <h2 className="font-semibold">{getLocalizedName(product.name)}</h2>
              <p>{t('adminProducts.category')}: {product.category}</p>
              <p>{t('adminProducts.price')}: {getLocalizedPrice(product.price).toFixed(2)} {currencySymbol}</p>
              {product.isSale && product.salePrice && (
                <p className="mt-1 text-red-600 font-semibold">
                  {t('adminProducts.salePrice')}: {getLocalizedPrice(product.salePrice).toFixed(2)} {currencySymbol}
                </p>
              )}
              <p>{t('adminProducts.inStock')}: {product.quantity} {t('adminProducts.units', { count: product.quantity })}</p>

              <div className="flex gap-2">
                <button
                  onClick={() => navigate(`/admin/products/edit/${product.id}`)}
                  className="text-blue-600 hover:underline"
                >
                  {t('adminProducts.edit')}
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="text-red-600 hover:underline"
                >
                  {t('adminProducts.delete')}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
