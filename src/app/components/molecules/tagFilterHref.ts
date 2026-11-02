export const tagFilterHref = (tag: string): string =>
  `/blog?tag=${encodeURIComponent(tag)}`
