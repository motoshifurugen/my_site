import type { Post, PostMeta } from '@/types/posts'
import fs from 'fs'
import matter from 'gray-matter'
import path from 'path'

// 一覧・サイトマップから除外する非公開記事のタグ
const LIMITED_TAG = '限定公開'

// posts ディレクトリのパスを取得
const postsDirectoryPath = path.join(process.cwd(), 'src', 'posts')

// パストラバーサル対策: slug に許可する文字（英数字・ハイフン・アンダースコアのみ）
const VALID_SLUG = /^[a-zA-Z0-9_-]+$/

// slug が安全（パストラバーサルを含まない）かを判定
export function isValidSlug(slug: string): boolean {
  return VALID_SLUG.test(slug.replace(/\.mdx$/, ''))
}

// ディレクトリが存在しない場合に作成
if (!fs.existsSync(postsDirectoryPath)) {
  fs.mkdirSync(postsDirectoryPath, { recursive: true })
}

export async function getPostBySlug(slug: string): Promise<Post> {
  const realSlug = slug.replace(/\.mdx$/, '')

  // パストラバーサル対策: `../` や `/` を含む不正な slug を拒否
  if (!isValidSlug(realSlug)) {
    throw new Error(`Invalid slug: ${slug}`)
  }

  const fullPath = path.join(postsDirectoryPath, `${realSlug}.mdx`)

  // ファイルが存在するか確認
  if (!fs.existsSync(fullPath)) {
    throw new Error(`File not found: ${fullPath}`)
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8')

  // gray-matter を使用してメタデータを解析
  const matterResult = matter(fileContents)

  return {
    slug: realSlug,
    title: matterResult.data.title,
    date: matterResult.data.date,
    tags: matterResult.data.tags || [],
    content: matterResult.content,
  }
}

export async function getAllPosts(): Promise<Post[]> {
  const slugs = fs.readdirSync(postsDirectoryPath)
  const posts = await Promise.all(slugs.map((slug) => getPostBySlug(slug)))
  // 限定公開タグを持つ記事を除外
  return posts.filter((post) => !post.tags.includes(LIMITED_TAG))
}

// 無効な日付は最小値（エポック）として扱い、ソートを安全にする
const parseDateMs = (value: string): number => {
  const time = new Date(value).getTime()
  return Number.isNaN(time) ? 0 : time
}

// 一覧表示用の軽量メタ（本文 content を含まない）。
// 限定公開を除外し、日付の新しい順に整列して返す。
export async function getAllPostsMeta(): Promise<PostMeta[]> {
  const fileNames = fs
    .readdirSync(postsDirectoryPath)
    .filter((name) => name.endsWith('.mdx'))

  const metas: PostMeta[] = fileNames.map((name) => {
    const slug = name.replace(/\.mdx$/, '')
    const { data } = matter(
      fs.readFileSync(path.join(postsDirectoryPath, name), 'utf8'),
    )
    return {
      slug,
      title: data.title,
      date: data.date,
      tags: data.tags || [],
    }
  })

  return metas
    .filter((meta) => !meta.tags.includes(LIMITED_TAG))
    .sort((a, b) => parseDateMs(b.date) - parseDateMs(a.date))
}

export async function getAllSlugs() {
  const slugs = fs.readdirSync(postsDirectoryPath)
  return slugs.map((slug) => slug.replace(/\.mdx$/, '')) // 拡張子を削除してスラッグに変換
}
