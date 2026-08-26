import { Locale } from './types'

export const defaultLocale: Locale = 'ja'
export const locales: Locale[] = ['ja', 'en']

export const localeNames: Record<Locale, string> = {
  ja: '日本語',
  en: 'English',
}

// URLパスから言語を判定するヘルパー関数
export function getLocaleFromPath(pathname: string): Locale {
  const segments = pathname.split('/').filter(Boolean)
  const firstSegment = segments[0]

  if (locales.includes(firstSegment as Locale)) {
    return firstSegment as Locale
  }

  return defaultLocale
}
