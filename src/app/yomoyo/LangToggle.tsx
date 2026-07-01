'use client'

import { useI18n } from '../../i18n'

// Yomoyo の紹介・規約系ページ用の言語切替え UI。
// サイト共通の i18n locale（Header の言語切替とも連動）を切り替える。
export default function LangToggle() {
  const { locale, setLocale } = useI18n()

  const baseClass = 'rounded px-3 py-1 transition-colors'
  const activeClass = 'bg-teal-500 text-white dark:bg-night-teal'
  const inactiveClass =
    'border border-teal-500 text-teal-500 dark:border-night-teal dark:text-night-teal'

  return (
    <div
      role="group"
      aria-label="Language / 言語"
      className="mb-6 flex justify-end gap-2 text-sm"
    >
      <button
        type="button"
        onClick={() => setLocale('ja')}
        aria-pressed={locale === 'ja'}
        className={`${baseClass} ${locale === 'ja' ? activeClass : inactiveClass}`}
      >
        日本語
      </button>
      <button
        type="button"
        onClick={() => setLocale('en')}
        aria-pressed={locale === 'en'}
        className={`${baseClass} ${locale === 'en' ? activeClass : inactiveClass}`}
      >
        English
      </button>
    </div>
  )
}
