import { Post } from '@/types/posts'

// SSG
export async function generateStaticParams() {
  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/my_site/api'
  try {
    const res = await fetch(`${apiUrl}/blog/`, {
      cache: 'force-cache',
    })
    if (!res.ok) {
      const errorText = await res.text()
      throw new Error(`Failed to fetch data from ${apiUrl}/blog/: ${errorText}`)
    }
    const blogData = await res.json()
    return blogData.map((blog: Post) => ({
      slug: blog.slug,
    }))
  } catch (error) {
    console.error('Error fetching blog data:', error)
    throw new Error('Failed to fetch blog data')
  }
}

export const getBlogArticle = async (slug: string) => {
  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/my_site/api'
  try {
    const res = await fetch(`${apiUrl}/blog/${slug}`, {
      cache: 'force-cache',
    })
    if (!res.ok) {
      const errorText = await res.text()
      throw new Error(
        `Failed to fetch data from ${apiUrl}/blog/${slug}: ${errorText}`,
      )
    }
    const blogArticle = await res.json()
    return blogArticle
  } catch (error) {
    console.error('Error fetching blog article:', error)
    throw new Error('Failed to fetch blog article')
  }
}
