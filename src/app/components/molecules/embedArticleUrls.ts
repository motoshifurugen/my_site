import type { OgImage } from '@/types/openGraph'

export const embedLinkUrl = (
  ogUrl: string | undefined,
  requestUrl: string | undefined,
): string | undefined => ogUrl || requestUrl

const parseUrl = (url: string, base?: string): string | null => {
  try {
    return new URL(url, base).toString()
  } catch {
    return null
  }
}

// favicon とリンク先は外部サイトの値なので、URL として読めないときは favicon を出さない
export const embedFaviconUrl = (
  favicon: string | undefined,
  linkUrl: string | undefined,
): string | null => {
  if (!favicon || !linkUrl) {
    return null
  }
  return parseUrl(favicon, linkUrl) ?? parseUrl(favicon)
}

export const embedOgImageUrl = (
  ogImage: OgImage | undefined,
): string | undefined =>
  Array.isArray(ogImage) ? ogImage[0]?.url : ogImage?.url
