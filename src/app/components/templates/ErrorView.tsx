'use client'

import React from 'react'
import nextConfig from '../../../../next.config.mjs'
import PageFace from '../organisms/PageFace'

const BASE_PATH = nextConfig.basePath || ''

interface ErrorViewProps {
  title: string
  message: string
  retryLabel: string
  onRetry: () => void
}

// context 非依存（props のみ）。global-error.tsx は I18nProvider/ThemeProvider/Router
// context が存在しない crash path で使うため、useI18n/useTheme/usePathname を使わない。
// 画像は素の <img>。next/image はランタイム/loader 依存があり crash path での堅牢性を優先する。
const ErrorView: React.FC<ErrorViewProps> = ({
  title,
  message,
  retryLabel,
  onRetry,
}) => {
  return (
    <section>
      <PageFace title={title} subtitle={message} />

      <div className="mt-10 flex w-full justify-center">
        <img
          src={`${BASE_PATH}/images/cats/page_not_found.png`}
          alt={title}
          width={500}
          height={500}
          className="rounded-2xl"
        />
      </div>

      <div className="mt-8 flex justify-center">
        <button
          type="button"
          onClick={onRetry}
          className="rounded-lg bg-main-black px-6 py-3 font-medium text-white transition-shadow hover:shadow-lg"
        >
          {retryLabel}
        </button>
      </div>
    </section>
  )
}

export default ErrorView
