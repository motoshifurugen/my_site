import { AUTHOR_NAME, SITE_URL, articleUrl } from '@/config/site'
import type { Post } from '@/types/posts'
import { articleOgImagePath } from './ogImage'

export function buildBlogPostingJsonLd(post: Post): Record<string, unknown> {
  const url = articleUrl(post.slug)

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    datePublished: post.date,
    url,
    mainEntityOfPage: url,
    author: {
      '@type': 'Person',
      name: AUTHOR_NAME,
      url: `${SITE_URL}/profile`,
    },
    image: `${SITE_URL}${articleOgImagePath(post.slug)}`,
    keywords: post.tags,
    inLanguage: 'ja',
  }
}

// dangerouslySetInnerHTML に入れるため、`<` をエスケープして `</script>` で
// script 要素から抜け出されるのを防ぐ。
export function serializeJsonLd(data: Record<string, unknown>): string {
  return JSON.stringify(data).replace(/</g, '\\u003c')
}
