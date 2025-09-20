'use client';

import { useI18n } from '@/i18n';
import { Locale, locales, localeNames } from '@/i18n';
import { useState } from 'react';
import { FaGlobe } from 'react-icons/fa';

export default function LanguageSwitcher() {
  const { locale, setLocale, t } = useI18n();
  const [isOpen, setIsOpen] = useState(false);

  const handleLanguageChange = (newLocale: Locale) => {
    setLocale(newLocale);
    setIsOpen(false);
  };

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => window.innerWidth >= 768 && setIsOpen(true)}
      onMouseLeave={() => window.innerWidth >= 768 && setIsOpen(false)}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1 rounded-lg bg-gray-200 px-2 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 sm:space-x-2 sm:px-3"
        aria-label={t.common.language}
      >
        <FaGlobe className="h-4 w-4" />
        <span className="hidden sm:inline">{localeNames[locale]}</span>
        <span className="sm:hidden">{locale.toUpperCase()}</span>
        <svg
          className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
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
        <div className="absolute right-0 top-full z-50 mt-1 min-w-[120px] rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 dark:bg-gray-800 dark:ring-white dark:ring-opacity-10">
          <div className="py-1">
            {locales.map((lang) => (
              <button
                key={lang}
                onClick={() => handleLanguageChange(lang)}
                className={`block w-full px-4 py-2 text-right md:text-center text-sm transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 ${
                  locale === lang
                    ? 'bg-gray-100 font-medium text-gray-900 dark:bg-gray-700 dark:text-white'
                    : 'text-gray-700 dark:text-gray-300'
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
  );
} 