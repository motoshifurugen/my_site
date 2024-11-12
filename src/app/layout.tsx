'use client'

import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google'
import { Inter } from 'next/font/google'
import 'tailwindcss/tailwind.css'
import './globals.css'

config.autoAddCss = false

import LoadingCircle from '@/app/components/atoms/LoadingCircle'
import siteConfig from '@/app/config/siteConfig'
import React, { useEffect, useState } from 'react'
import BackgroundWrapper from './components/molecules/BackgroundWrapper'
import Footer from './components/templates/Footer'
import Header from './components/templates/Header'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false)
    }, 2000) // 2秒後にローディングを終了
  }, [])

  return (
    <html lang="ja" suppressHydrationWarning={true}>
      <head>
        {/* Google Fonts読み込み */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Noto+Sans+JP:wght@100..900&display=swap"
          rel="stylesheet"
        />
        <link rel="manifest" href="/my_site/manifest.json" />
        <title>{siteConfig.title}</title>
        <meta name="description" content={siteConfig.description} />
      </head>
      <body className={inter.className}>
        <LoadingCircle isLoading={isLoading} />
        <BackgroundWrapper>
          <Header />
          <main>{children}</main>
        </BackgroundWrapper>
        <Footer />
      </body>
      <GoogleTagManager gtmId="G-3B88D979NP" />
      <GoogleAnalytics gaId="G-3B88D979NP" />
    </html>
  )
}
