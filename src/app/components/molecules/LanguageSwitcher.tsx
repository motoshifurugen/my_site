'use client'

import { Locale, localeNames, locales, useI18n } from '@/i18n'
import { useState } from 'react'
import { FaGlobe } from 'react-icons/fa'

export default function LanguageSwitcher() {
  const { locale, setLocale, t } = useI18n()
  const [isOpen, setIsOpen] = useState(false)

  const handleLanguageChange = (newLocale: Locale) => {
    setLocale(newLocale)
    setIsOpen(false)
  }

  return (
    <div
      className="relative inline-block cursor-pointer"
      onMouseEnter={() => window.innerWidth >= 768 && setIsOpen(true)}
      onMouseLeave={() => window.innerWidth >= 768 && setIsOpen(false)}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 flex cursor-pointer items-center space-x-1 rounded-lg p-2 text-sm font-medium transition-colors sm:space-x-2 sm:px-3"
        aria-label={t.common.language}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <FaGlobe className="size-4" />
        <span className="hidden sm:inline">{localeNames[locale]}</span>
        <span className="sm:hidden">{locale.toUpperCase()}</span>
        <svg
          className={`size-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-1 min-w-[120px] rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 dark:bg-night-black dark:ring-white dark:ring-opacity-10">
          <div className="py-1">
            {locales.map((lang) => (
              <button
                key={lang}
                onClick={() => handleLanguageChange(lang)}
                className={`hover:bg-gray-100 block w-full px-4 py-2 text-right text-sm transition-colors dark:hover:bg-night-gray md:text-center ${
                  locale === lang
                    ? 'bg-gray-100 text-gray-900 font-medium dark:bg-night-gray dark:text-night-white'
                    : 'text-gray-700 dark:text-night-white'
                }`}
              >
                {localeNames[lang]}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* クリック外でメニューを閉じるためのオーバーレイ */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}
    </div>
  )
}
