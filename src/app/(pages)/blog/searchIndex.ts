import { getAllPostsMeta, getPostBySlug } from '@/app/api/utils/getPostData'
import type { PostSearchEntry } from '@/types/posts'
import { toPlainText } from './[slug]/articleDescription'

// 本文全体を載せると JSON が記事数に比例して膨らむため、冒頭だけを検索対象にする
const EXCERPT_LENGTH = 200

export async function buildPostSearchIndex(): Promise<PostSearchEntry[]> {
  const metas = await getAllPostsMeta()
  return Promise.all(
    metas.map(async (meta) => {
      const { content } = await getPostBySlug(meta.slug)
      return {
        ...meta,
        excerpt: toPlainText(content).slice(0, EXCERPT_LENGTH),
      }
    }),
  )
}
