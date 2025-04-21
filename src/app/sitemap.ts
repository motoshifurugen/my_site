import { getAllPosts } from '@/app/api/utils/getPostData'
import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://furugen-island.com/my_site'
  const currentDate = new Date().toISOString()

  const defaultPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: currentDate,
    },
    {
      url: `${baseUrl}/profile`,
      lastModified: currentDate,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: currentDate,
    },
    {
      url: `${baseUrl}/skills`,
      lastModified: currentDate,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
    },
  ]

  const posts = await getAllPosts()

  const blogPages: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.date ? new Date(post.date).toISOString() : currentDate,
  }))

  return [...defaultPages, ...blogPages]
}
