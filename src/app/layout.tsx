import ClientWrapper from '@/app/components/templates/ClientWrapper'
import '@fortawesome/fontawesome-svg-core/styles.css'
import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google'
import type { Metadata } from 'next'
import { ThemeProvider } from 'next-themes'
// フォントは Google Fonts へのビルド時フェッチをやめ @fontsource で自己ホストする
// （旧方式はネットワークが遅い環境で大量タイムアウトし dev/build を止めていた）。
// unicode-range 分割された CSS + woff2 が _next/static に同梱される。
// 各ファミリーと --font-* CSS 変数の対応は globals.css で定義する。
import '@fontsource-variable/dm-sans'
import '@fontsource-variable/noto-sans-jp'
// book / tanka の縦書き明朝スタック（weight 300/400/500）が可変フォント1面でまかなえる
import '@fontsource-variable/noto-serif-jp'
import 'tailwindcss/tailwind.css'
import './globals.css'

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
      <body>
        <ThemeProvider attribute="class">
          <ClientWrapper>{children}</ClientWrapper>
        </ThemeProvider>
      </body>
      <GoogleTagManager gtmId="G-3B88D979NP" />
      <GoogleAnalytics gaId="G-3B88D979NP" />
    </html>
  )
}
