import { Locale } from './types';

export const defaultLocale: Locale = 'ja';
export const locales: Locale[] = ['ja', 'en'];

export const localeNames: Record<Locale, string> = {
  ja: '日本語',
  en: 'English',
};

// URLパスから言語を判定するヘルパー関数
export function getLocaleFromPath(pathname: string): Locale {
  const segments = pathname.split('/').filter(Boolean);
  const firstSegment = segments[0];
  
  if (locales.includes(firstSegment as Locale)) {
    return firstSegment as Locale;
  }
  
  return defaultLocale;
}

// 言語付きのパスを生成するヘルパー関数
export function getLocalizedPath(pathname: string, locale: Locale): string {
  const segments = pathname.split('/').filter(Boolean);
  const firstSegment = segments[0];
  
  // 既に言語プレフィックスがある場合は置き換え
  if (locales.includes(firstSegment as Locale)) {
    segments[0] = locale;
  } else {
    // 言語プレフィックスがない場合は追加
    segments.unshift(locale);
  }
  
  return '/' + segments.join('/');
} 