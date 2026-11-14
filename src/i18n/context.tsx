'use client'

import { useLocalStorageValue } from '@/app/hooks/useLocalStorageValue'
import { createContext, ReactNode, useContext } from 'react'
import { defaultLocale, getLocaleFromPath, isLocale } from './config'
import { translations } from './translations'
import { Locale, TranslationKeys } from './types'

const LOCALE_STORAGE_KEY = 'locale'

interface I18nContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: TranslationKeys
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

interface I18nProviderProps {
  children: ReactNode
  initialLocale?: Locale
}

export function I18nProvider({ children, initialLocale }: I18nProviderProps) {
  const parseStoredLocale = (raw: string | null): Locale =>
    isLocale(raw)
      ? raw
      : initialLocale || getLocaleFromPath(window.location.pathname)

  const [locale, setLocale] = useLocalStorageValue<Locale>(
    LOCALE_STORAGE_KEY,
    parseStoredLocale,
    initialLocale || defaultLocale,
  )

  const value: I18nContextType = {
    locale,
    setLocale,
    t: translations[locale],
  }

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n(): I18nContextType {
  const context = useContext(I18nContext)
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider')
  }
  return context
}
