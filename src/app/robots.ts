import { SITE_URL } from '@/config/site'
import { MetadataRoute } from 'next'

// output: export ではビルド時に robots.txt として書き出す。
export const dynamic = 'force-static'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
