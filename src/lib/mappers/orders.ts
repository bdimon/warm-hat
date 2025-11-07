
import { RegionalPrice, SupportedLanguage } from '@/types/Product';
import { formatPrice, getLocalizedValue } from './products';

/**
 * Ensures an order total is in RegionalPrice format
 * Handles backward compatibility with numeric totals
 * Rounds all values to 2 decimal places
 */
export function ensureRegionalTotal(total: number | RegionalPrice): RegionalPrice {
  if (typeof total === 'number') {
    // Convert number to RegionalPrice format with rounding
    const roundedTotal = Number(total.toFixed(2));
    return {
      en: roundedTotal,
      ru: roundedTotal,
      ua: roundedTotal,
      pl: roundedTotal
    };
  }
  
  // Round all values in the RegionalPrice object
  const roundedTotal: RegionalPrice = { en: 0, ru: 0, ua: 0, pl: 0 };
  Object.keys(total).forEach(key => {
    const lang = key as SupportedLanguage;
    roundedTotal[lang] = Number(total[lang].toFixed(2));
  });
  
  return roundedTotal;
}

/**
 * Formats an order total for display, handling both number and RegionalPrice formats
 * Ensures consistent rounding to 2 decimal places
 */
export function formatOrderTotal(total: number | RegionalPrice, language: SupportedLanguage = 'en'): string {
  return formatPrice(total, language);
}



/**
 * Translates an order status code to a localized string
 * @param status Order status code (new, pending, paid, delivered)
 * @param t Translation function from useTranslation
 * @returns Localized order status
 */
export function translateOrderStatus(status: string, t: unknown): string {
  return (t as (key: string) => string)(`orderStatuses.${status}`);
  // return t(`orderStatuses.${status}`);
}

