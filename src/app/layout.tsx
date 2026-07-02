import ClientWrapper from '@/app/components/templates/ClientWrapper'
import '@fortawesome/fontawesome-svg-core/styles.css'
import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google'
import type { Metadata } from 'next'
import { ThemeProvider } from 'next-themes'
import { DM_Sans, Noto_Sans_JP, Noto_Serif_JP } from 'next/font/google'
import 'tailwindcss/tailwind.css'
import './globals.css'

const dmSans = DM_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-dm-sans',
})

const notoSansJP = Noto_Sans_JP({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-noto-sans-jp',
})

// book / tanka の縦書き明朝スタックが名指し参照するため next/font で読み込む。
// 非可変フォントのため実際に使う weight（book:300/400, TankaCard:500）を明示する
const notoSerifJP = Noto_Serif_JP({
  weight: ['300', '400', '500'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-noto-serif-jp',
})

export const metadata: Metadata = {
  title:
    'Furugen Island | 古堅基史（なんくるないさ系エンジニア）の開発ポートフォリオサイト',
  description:
    '古堅基史（ふるげんもとし）のポートフォリオサイト。Furugen Motoshi, フロントエンドエンジニアの開発実績やブログを掲載。情熱と遊び心を持って日々挑戦しています。',
  icons: [
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '16x16',
      url: '/my_site/favicon/icon-16x16.png',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '32x32',
      url: '/my_site/favicon/icon-32x32.png',
    },
    {
      rel: 'apple-touch-icon',
      url: '/my_site/favicon/apple-icon.png',
    },
    {
      rel: 'shortcut icon',
      url: '/my_site/favicon/favicon.ico',
    },
    {
      rel: 'manifest',
      url: '/my_site/favicon/site.webmanifest',
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
      <body
        className={`${dmSans.variable} ${notoSansJP.variable} ${notoSerifJP.variable}`}
      >
        <ThemeProvider attribute="class">
          <ClientWrapper>{children}</ClientWrapper>
        </ThemeProvider>
      </body>
      <GoogleTagManager gtmId="G-3B88D979NP" />
      <GoogleAnalytics gaId="G-3B88D979NP" />
    </html>
  )
}
