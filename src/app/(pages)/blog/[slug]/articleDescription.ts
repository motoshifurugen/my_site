// 本文（MDX の raw content）から meta description / og:description /
// twitter:description 用のプレーンテキストを切り出す。
export function buildArticleDescription(content: string): string {
  return content
    .replace(/<[^>]+>/g, '')
    .replace(/!?\[([^[\]]*)\]\([^()]*\)/g, '$1')
    .replace(/[#*_`>[\]()]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 50)
}
