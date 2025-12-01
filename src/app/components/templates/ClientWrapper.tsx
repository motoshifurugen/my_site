'use client'

import HtmlLangUpdater from '@/app/components/atoms/HtmlLangUpdater'
import LoadingCircle from '@/app/components/atoms/LoadingCircle'
import BackgroundWrapper from '@/app/components/molecules/BackgroundWrapper'
import Footer from '@/app/components/templates/Footer'
import Header from '@/app/components/templates/Header'
import { I18nProvider } from '@/i18n'
import React, { useEffect, useState } from 'react'

const ClientWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false)
    }, 2000) // 2秒後にローディングを終了
  }, [])

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
