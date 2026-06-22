'use client'

import { defaultLocale } from '@/i18n/config'
import { translations } from '@/i18n/translations'
import { useEffect } from 'react'
import 'tailwindcss/tailwind.css'
import ErrorView from './components/templates/ErrorView'
import './globals.css'

// root レイアウト自体の例外・全境界を抜けた例外を捕捉する最終境界。
// root layout を置換するため <html><body> と CSS import を自前で持つ。
// I18nProvider/ThemeProvider は不在のため、固定言語（defaultLocale=ja）の
// 静的翻訳オブジェクトを直接参照し、ライトテーマで描画する。
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const errors = translations[defaultLocale].errors

  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <html lang={defaultLocale}>
      <body>
        <ErrorView
          title={errors.title}
          message={errors.message}
          retryLabel={errors.retry}
          onRetry={reset}
        />
      </body>
    </html>
  )
}
