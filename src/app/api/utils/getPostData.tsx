import fs from 'fs'
import matter from 'gray-matter'
import path from 'path'

interface PostData {
  slug: string
  title?: string
  date?: string
  tags?: string[]
  content: string
  [key: string]: any  // その他のメタデータに対応
}

// posts ディレクトリのパスを取得
const postsDirectoryPath = path.join(process.cwd(), 'src', 'posts')

// ディレクトリが存在しない場合に作成
if (!fs.existsSync(postsDirectoryPath)) {
  fs.mkdirSync(postsDirectoryPath, { recursive: true })
}

export async function getPostBySlug(slug: string): Promise<PostData> {
  const realSlug = slug.replace(/\.mdx$/, '')
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
    ...matterResult.data,
    content: matterResult.content,
    date: matterResult.data.date,
  }
}

export async function getAllPosts(): Promise<PostData[]> {
  const slugs = fs.readdirSync(postsDirectoryPath)
  const posts = await Promise.all(slugs.map((slug) => getPostBySlug(slug)))
  // 限定公開タグを持つ記事を除外
  return posts.filter((post) => {
    const tags = post.tags || []
    return !tags.includes('限定公開')
  })
}

export async function getAllSlugs() {
  const slugs = fs.readdirSync(postsDirectoryPath)
  return slugs.map((slug) => slug.replace(/\.mdx$/, '')) // 拡張子を削除してスラッグに変換
}
