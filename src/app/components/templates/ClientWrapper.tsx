'use client'

import HtmlLangUpdater from '@/app/components/atoms/HtmlLangUpdater'
import LoadingCircle from '@/app/components/atoms/LoadingCircle'
import BackgroundWrapper from '@/app/components/molecules/BackgroundWrapper'
import Footer from '@/app/components/templates/Footer'
import Header from '@/app/components/templates/Header'
import { I18nProvider } from '@/i18n'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import nextConfig from '../../../../next.config.mjs'

const BASE_PATH = nextConfig.basePath || ''

const ClientWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isLoading, setIsLoading] = useState(true)
  const pathname = usePathname()
  const isRpgPage = pathname?.startsWith(`${BASE_PATH}/rpg`) || pathname?.startsWith('/rpg')

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false)
    }, 2000) // 2秒後にローディングを終了
  }, [])

  // RPGページの場合は、ヘッダーとフッターを表示しない
  if (isRpgPage) {
    return (
      <I18nProvider>
        <HtmlLangUpdater />
        <LoadingCircle isLoading={isLoading} />
        {children}
      </I18nProvider>
    )
  }

  return (
    <I18nProvider>
      <HtmlLangUpdater />
      <LoadingCircle isLoading={isLoading} />
      <BackgroundWrapper>
        <Header />
        <main>{children}</main>
      </BackgroundWrapper>
      <Footer />
    </I18nProvider>
  )
}

export default ClientWrapper
