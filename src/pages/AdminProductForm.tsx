import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import FormField from "@/components/FormField";
import { Product, SupportedLanguage, MultilingualString, RegionalPrice, CURRENCY_SYMBOLS } from "@/types/Product";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { mapProductFromAPI, mapProductToAPI } from "@/lib/mappers/products";
import { useTranslation } from 'react-i18next';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const initialForm: Product = {
  id: "",
  name: {
    en: "",
    ru: "",
    ua: "",
    pl: ""
  } as MultilingualString,
  // description: "",
  price: {
    en: 0,
    ru: 0,
    ua: 0,
    pl: 0
  } as RegionalPrice,
  quantity: 0,
  category: "",
  images: [],
  isNew: false,
  isSale: false,
  salePrice: undefined,
};

const supportedLanguages: SupportedLanguage[] = ['en', 'ru', 'ua', 'pl'];
const languageLabels: Record<SupportedLanguage, string> = {
  en: 'English',
  ru: 'Русский',
  ua: 'Українська',
  pl: 'Polski'
};

export default function AdminProductForm() {
  const { id } = useParams(); // если есть, значит редактируем
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [form, setForm] = useState<Product>(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});
  const [activeTab, setActiveTab] = useState<SupportedLanguage>('en');

  const isEdit = !!id;

  useEffect(() => {
    if (!id) return;
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:3010/api/products/${id}`);
        if (!res.ok) throw new Error("Ошибка загрузки товара");
        const data = await res.json();
        const mappedData = mapProductFromAPI(data);
        setForm(mappedData);
      } catch (err) {
        setError('Не удалось загрузить товар');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const target = e.target;
    const { name, value, type } = target;
    const checked = (target as HTMLInputElement).checked;
    
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : name === "quantity" ? Number(value) : value,
    }));
  };

  const handleMultilingualChange = (field: 'name' | 'price' | 'salePrice', lang: SupportedLanguage, value: string) => {
    setForm((prev) => {
      const currentValue = prev[field] || (field === 'name' ? {} : {});
      const newValue = typeof currentValue === 'object' 
        ? { ...currentValue, [lang]: field === 'name' ? value : Number(value) } 
        : { [lang]: field === 'name' ? value : Number(value) };
      
      return {
        ...prev,
        [field]: newValue
      };
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const method = isEdit ? "PATCH" : "POST";
      const url = isEdit
        ? `http://localhost:3010/api/products/${id}`
        : "http://localhost:3010/api/products";

      // Create a clean copy of the form data
      const cleanForm = { ...form };
      
      // Handle salePrice properly - if not on sale, set to undefined
      if (!cleanForm.isSale) {
        cleanForm.salePrice = undefined;
      } else if (cleanForm.salePrice) {
        // Remove any undefined values from salePrice object
        if (typeof cleanForm.salePrice === 'object') {
          Object.keys(cleanForm.salePrice).forEach(key => {
            const typedKey = key as SupportedLanguage;
            if (cleanForm.salePrice && 
                typeof cleanForm.salePrice === 'object' && 
                cleanForm.salePrice[typedKey] === undefined) {
              delete cleanForm.salePrice[typedKey];
            }
          });
          
          // If salePrice object is empty, set it to undefined
          if (Object.keys(cleanForm.salePrice).length === 0) {
            cleanForm.salePrice = undefined;
          }
        }
      }
      
      const payload = mapProductToAPI(cleanForm);
      console.log('[AdminProductForm] handleSubmit', payload);
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        console.error('Server error:', errorData);
        throw new Error(errorData.error || 'Ошибка сохранения');
      }

      navigate("/admin/products");
    } catch (err) {
      console.error('Error saving product:', err);
      setError(err instanceof Error ? err.message : 'Не удалось сохранить товар');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !isEdit) return <div className="p-6">Загрузка...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className='p-6 max-w-2xl mx-auto'>
      <h1 className='text-2xl font-bold mb-4'>{isEdit ? 'Редактировать товар' : 'Новый товар'}</h1>

      <div className='space-y-4'>
        <Tabs defaultValue={activeTab} onValueChange={(value) => setActiveTab(value as SupportedLanguage)}>
          <TabsList className="mb-4">
            {supportedLanguages.map(lang => (
              <TabsTrigger 
                key={lang} 
                value={lang}
                className={activeTab === lang ? 'bg-shop-blue text-white' : ''}
              >
                {languageLabels[lang]}
              </TabsTrigger>
            ))}
          </TabsList>

          {supportedLanguages.map(lang => (
            <TabsContent key={lang} value={lang}>
              {/* Название товара */}
              <FormField label={`Название (${languageLabels[lang]})`} error={formErrors.name}>
                <Input
                  value={typeof form.name === 'object' ? form.name[lang] || '' : form.name}
                  onChange={(e) => handleMultilingualChange('name', lang, e.target.value)}
                  placeholder={`Название товара на ${languageLabels[lang]}`}
                />
              </FormField>

              {/* Цена */}
              <FormField label={`Цена (${CURRENCY_SYMBOLS[lang]})`} error={formErrors.price}>
                <Input
                  type='number'
                  value={typeof form.price === 'object' ? form.price[lang] || 0 : form.price}
                  onChange={(e) => handleMultilingualChange('price', lang, e.target.value)}
                  placeholder={`0.00 ${CURRENCY_SYMBOLS[lang]}`}
                />
              </FormField>

              {/* Цена со скидкой - показывается только если включена скидка */}
              {form.isSale && (
                <FormField label={`Цена со скидкой (${CURRENCY_SYMBOLS[lang]})`}>
                  <Input
                    type='number'
                    value={
                      form.salePrice 
                        ? (typeof form.salePrice === 'object' 
                          ? form.salePrice[lang] || 0 
                          : form.salePrice) 
                        : ''
                    }
                    onChange={(e) => handleMultilingualChange('salePrice', lang, e.target.value)}
                    placeholder={`0.00 ${CURRENCY_SYMBOLS[lang]}`}
                  />
                </FormField>
              )}
            </TabsContent>
          ))}
        </Tabs>

        {/* Категория - общая для всех языков */}
        <FormField label='Категория' error={formErrors.category}>
          <Input
            name='category'
            value={form.category}
            onChange={handleChange}
            placeholder='Категория товара'
          />
        </FormField>

        {/* Количество - общее для всех языков */}
        <FormField label='Количество' error={formErrors.quantity}>
          <Input
            type='number'
            name='quantity'
            value={form.quantity}
            onChange={handleChange}
            placeholder='0'
          />
        </FormField>

        {/* Изображения - общие для всех языков */}
        <FormField label='Изображения'>
          <Input
            name='images'
            value={form.images.join(', ')}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                images: e.target.value.split(',').map((s) => s.trim()),
              }))
            }
            placeholder='Изображения через запятую'
          />
        </FormField>
        
        {/* Новинка */}
        <label className='flex items-center space-x-2'>
          <input
            type='checkbox'
            name='isNew'
            checked={form.isNew || false}
            onChange={handleChange}
          />
          <span>Новинка</span>
        </label>

        {/* Скидка */}
        <label className='flex items-center space-x-2'>
          <input
            type='checkbox'
            name='isSale'
            checked={form.isSale || false}
            onChange={handleChange}
          />
          <span>Скидка</span>
        </label>
      </div>

      <button
        onClick={handleSubmit}
        className='mt-6 w-full bg-shop-blue-dark text-white py-2 rounded hover:bg-shop-blue-dark/90'
      >
        {isEdit ? 'Сохранить изменения' : 'Создать товар'}
      </button>
    </div>
  );
}
