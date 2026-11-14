import { Locale } from './types'

export const defaultLocale: Locale = 'ja'
export const locales: Locale[] = ['ja', 'en']

export const localeNames: Record<Locale, string> = {
  ja: '日本語',
  en: 'English',
}

export function isLocale(value: unknown): value is Locale {
  return locales.some((locale) => locale === value)
}

export function getLocaleFromPath(pathname: string): Locale {
  const segments = pathname.split('/').filter(Boolean)
  const firstSegment = segments[0]

  if (isLocale(firstSegment)) {
    return firstSegment
  }

  return defaultLocale
}
