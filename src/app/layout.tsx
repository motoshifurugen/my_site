import ClientWrapper from '@/app/components/templates/ClientWrapper'
import '@fortawesome/fontawesome-svg-core/styles.css'
import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import 'tailwindcss/tailwind.css'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title:
    "Furugen's Island | なんくるないさ系エンジニアの開発ポートフォリオサイト",
  description:
    'ワクワクを届けたいフロントエンドエンジニア Furugen のポートフォリオサイトです。開発への情熱と遊び心を込めたプロジェクトやブログをぜひご覧ください。',
  icons: [
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '16x16',
      url: '/favicon/icon-16x16.png',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '32x32',
      url: '/favicon/icon-32x32.png',
    },
    {
      rel: 'apple-touch-icon',
      url: '/favicon/apple-icon.png',
    },
    {
      rel: 'shortcut icon',
      url: '/favicon/favicon.ico',
    },
    {
      rel: 'manifest',
      url: '/favicon/site.webmanifest',
    },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
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
      </head>
      <body className={inter.className}>
        <ClientWrapper>{children}</ClientWrapper>
      </body>
      <GoogleTagManager gtmId="G-3B88D979NP" />
      <GoogleAnalytics gaId="G-3B88D979NP" />
    </html>
  )
}
