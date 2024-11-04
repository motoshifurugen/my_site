import { getAllPosts } from '@/app/api/utils/getPostData'
import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const defaultPages: MetadataRoute.Sitemap = [
    {
      url: 'https://furugen-island.com/my_site/',
      lastModified: new Date(),
    },
    {
      url: 'https://furugen-island.com/my_site/profile',
      lastModified: new Date(),
    },
    {
      url: 'https://furugen-island.com/my_site/blog',
      lastModified: new Date(),
    },
    {
      url: 'https://furugen-island.com/my_site/skills',
      lastModified: new Date(),
    },
    {
      url: 'https://furugen-island.com/my_site/contact',
      lastModified: new Date(),
    },
  ]

  const posts = await getAllPosts()

  const blogPages: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `https://furugen-island.com/my_site/api/blog/${post.slug}`,
    lastModified: new Date(post.date),
  }))

  return [...defaultPages, ...blogPages]
}
