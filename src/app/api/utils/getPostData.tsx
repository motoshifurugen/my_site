import fs from 'fs'
import matter from 'gray-matter'
import path from 'path'

const postsDirectoryPath = path.join(process.cwd(), 'src', 'posts')

export async function getPostBySlug(slug: string) {
  const realSlug = slug.replace(/\.mdx$/, '')
  const fullPath = path.join(postsDirectoryPath, `${realSlug}.mdx`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const matterResult = matter(fileContents)
  return {
    ...matterResult.data,
    content: matterResult.content,
    slug: realSlug,
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
