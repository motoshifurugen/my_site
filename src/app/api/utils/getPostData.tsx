import fs from 'fs'
import matter from 'gray-matter'
import path from 'path'

// posts ディレクトリのパスを取得
const postsDirectoryPath = path.join(process.cwd(), 'src', 'posts')

// ディレクトリが存在しない場合に作成
if (!fs.existsSync(postsDirectoryPath)) {
  fs.mkdirSync(postsDirectoryPath, { recursive: true })
}

export async function getPostBySlug(slug: string) {
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
    date: matterResult.data.date.toISOString(),
  }
}

export async function getAllPosts() {
  const slugs = fs.readdirSync(postsDirectoryPath)
  const posts = await Promise.all(slugs.map((slug) => getPostBySlug(slug)))
  return posts
}

export async function getAllSlugs() {
  const slugs = fs.readdirSync(postsDirectoryPath)
  return slugs.map((slug) => slug.replace(/\.mdx$/, '')) // 拡張子を削除してスラッグに変換
}
