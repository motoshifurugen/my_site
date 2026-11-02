const DESCRIPTION_LENGTH = 50

// 本文（MDX の raw content）から見出し記号・HTML タグ・リンク記法を落としたプレーンテキストを作る。
// meta description と検索インデックスの excerpt が同じ整形を使う。
export function toPlainText(content: string): string {
  return content
    .replace(/<[^>]+>/g, '')
    .replace(/!?\[([^[\]]*)\]\([^()]*\)/g, '$1')
    .replace(/[#*_`>[\]()]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

// meta description / og:description / twitter:description 用の文を切り出す。
export function buildArticleDescription(content: string): string {
  return toPlainText(content).slice(0, DESCRIPTION_LENGTH)
}
