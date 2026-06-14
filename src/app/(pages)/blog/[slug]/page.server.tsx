import { getAllPostsMeta, getPostBySlug } from '@/app/api/utils/getPostData'

// SSG: 静的パラメータはローカルの記事（src/posts/*.mdx）から生成する。
// 外部 API への fetch をやめ、API 障害・URL 変更でビルドが落ちる依存を排除する（Issue #157）。
// getAllPostsMeta は限定公開を除外するため、従来の /blog/ fetch と同じ公開記事集合になる。
export async function generateStaticParams() {
  const posts = await getAllPostsMeta()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

// 記事本文もローカルから直接読み込む（ビルド時のリモート依存なし）。
export const getBlogArticle = async (slug: string) => {
  return await getPostBySlug(slug)
}
