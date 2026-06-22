'use client'

import { useI18n } from '@/i18n'
import { useEffect } from 'react'
import ErrorView from './components/templates/ErrorView'

// 配下ページのレンダリング例外を捕捉する root エラー境界。
// I18nProvider は layout.tsx → ClientWrapper → I18nProvider 配下にあるため利用可。
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const { t } = useI18n()

  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <ErrorView
      title={t.errors.title}
      message={t.errors.message}
      retryLabel={t.errors.retry}
      onRetry={reset}
    />
  )
}
