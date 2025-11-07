import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import FormField from "./FormField";
import { useTranslation} from "react-i18next";
import { RegionalPrice, SupportedLanguage } from "@/types/Product";
import { formatOrderTotal } from "@/lib/mappers/orders";
import { formatPrice } from "@/lib/mappers/products";

interface OrderFormData {
  name: string;
  address: string;
  phone: string;
}

interface OrderFormErrors {
  name?: string;
  address?: string;
  phone?: string;
}

export interface OrderFormProps {
  form: OrderFormData;
  errors: OrderFormErrors;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
  onSubmit: () => void;
  loading: boolean;
  total: number | RegionalPrice;
  userEmail?: string;
  disabled?: boolean; // <-- добавь эту строку
  submitText?: string; // <-- если используешь кастомный текст кнопки
}
 
export default function OrderForm({
  form,
  errors,
  onChange,
  onSubmit,
  loading,
  total,
  userEmail,
  disabled = false,
}: OrderFormProps) {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language.split('-')[0] as SupportedLanguage;

  return (
    <div className='max-w-xl mx-auto p-4 sm:p-6 bg-white rounded-lg shadow-md'>
      <h2 className='text-2xl font-bold mb-6'>{t('orderFormModal.title')}</h2>

      <div className='space-y-4'>
        <FormField label={t('orderFormModal.labelName')} error={errors.name}>
          <input
            name='name'
            value={form.name}
            onChange={onChange}
            placeholder={t('orderFormModal.name')}
            className='w-full border p-2 rounded border-gray-300'
          />
        </FormField>

        {userEmail && (
          <div className='text-sm text-gray-500 pt-1'>
            Email: <span className='font-medium'>{userEmail}</span>
          </div>
        )}

        <FormField label={t('orderFormModal.labelAddress')} error={errors.address}>
          <textarea
            name='address'
            value={form.address}
            onChange={onChange}
            placeholder={t('orderFormModal.address')}
            className='w-full border p-2 rounded border-gray-300'
            rows={4}
          />
        </FormField>

        <FormField label={t('orderFormModal.labelPhone')} error={errors.phone}>
          <input
            name='phone'
            type='tel'
            value={form.phone}
            onChange={onChange}
            placeholder={t('orderFormModal.phone')}
            className='w-full border p-2 rounded border-gray-300'
          />
        </FormField>

       
      </div>

      <div className='mt-6 flex justify-between items-center'>
        <span className='font-semibold'>{t('orderFormModal.total')}:</span>
        <span className='text-lg font-bold'>{formatOrderTotal(total, currentLang)}</span>
      </div>

      <button
        onClick={onSubmit}
        disabled={loading || disabled}
        className={cn(
          'w-full mt-6 flex items-center justify-center bg-shop-blue-dark text-white py-2.5 rounded-md hover:bg-shop-blue-dark/90 transition-colors',
          'disabled:opacity-60 disabled:cursor-not-allowed'
        )}
      >
        {loading ? (
          <>
            <Loader2 className='mr-2 h-5 w-5 animate-spin' />
            {t('orderFormModal.loading')}
          </>
        ) : (
          t('orderFormModal.confirm')
        )}
      </button>
    </div>
  );
}
