// canonical・OG / Twitter メタ・robots.txt・記事の JSON-LD が共有するサイト情報。
// SITE_URL は `${SITE_URL}/blog/${slug}` のように連結するため末尾スラッシュを持たない。

import type { Metadata } from 'next'

export const SITE_URL = 'https://furugen-island.com/my_site'

export const SITE_NAME = 'Furugen Island'

export const AUTHOR_NAME = '古堅基史'

export const articleUrl = (slug: string): string => `${SITE_URL}/blog/${slug}`

export const OG_IMAGE = {
  url: '/images/island.png',
  width: 500,
  height: 500,
}

// url は './' にして Next に表示中ページの URL で解決させる（絶対 URL だと全ページ同じになる）。
// title / description を持たせると全ページの og:title などが固定されるので持たせない。
export const baseOpenGraph: NonNullable<Metadata['openGraph']> = {
  url: './',
  siteName: SITE_NAME,
  locale: 'ja_JP',
  type: 'website',
  images: [OG_IMAGE],
}
