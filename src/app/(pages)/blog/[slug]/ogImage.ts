// 記事ごとの OG 画像の大きさ・パス・タイトルの整形。描画（next/og）は ogImageRender.tsx に置く。

export const ARTICLE_OG_IMAGE_SIZE = { width: 1200, height: 630 }

// 拡張子 .png を付ける。GitHub Pages は拡張子で Content-Type を決めるため。
// basePath は metadataBase が付けるので含めない。
export const articleOgImagePath = (slug: string): string =>
  `/blog/${slug}/og.png`

// 絵文字を残すと next/og が twemoji を取りにネットへ出るので、画像のタイトルから除く。
// \p{Emoji} は 0-9 / # / * も含むため、\p{Extended_Pictographic} で絵文字だけを狙う。
const PICTOGRAPH =
  /\p{Extended_Pictographic}\uFE0F?(\u200D\p{Extended_Pictographic}\uFE0F?)*/gu

export const toOgTitle = (title: string): string =>
  title.replace(PICTOGRAPH, '').replace(/\s+/g, ' ').trim()

export const ogTitleFontSize = (title: string): number => {
  const length = [...title].length
  if (length <= 16) return 88
  if (length <= 28) return 76
  return 64
}
