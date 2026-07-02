import en from '../../data/locales/en.json';
import fr from '../../data/locales/fr.json';

const translations: Record<string, any> = { en, fr };

export function useTranslations(locale: string) {
  const lang = locale === 'fr' ? 'fr' : 'en';
  const dict = translations[lang] || translations['en'];
  
  return (key: string): string => {
    return dict[key] || translations['en'][key] || key;
  };
}

export function getLocaleFromUrl(url: URL | string): string {
  const pathname = typeof url === 'string' ? url : url.pathname;
  const parts = pathname.split('/');
  if (parts[1] === 'fr') return 'fr';
  return 'en';
}

/**
 * Generates a standard path with the locale prefix.
 * e.g., getLocalizedPath("/about", "fr") => "/fr/about"
 */
export function getLocalizedPath(path: string, locale: string): string {
  const cleanPath = path.replace(/^\/(en|fr)/, '').replace(/^\/+/, '/');
  return `/${locale}${cleanPath === '/' ? '' : cleanPath}`;
}

/**
 * Resolves localized URL for a calculator page.
 */
export function getCalculatorPath(
  locale: string,
  categoryKey: string,
  categorySlug: string,
  calculatorSlug: string
): string {
  const toolsSlug = locale === 'fr' ? 'calculateurs' : 'calculators';
  return `/${locale}/${toolsSlug}/${categorySlug}/${calculatorSlug}/`;
}
