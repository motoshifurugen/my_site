import Toc from '@/app/components/molecules/Toc'
import ArticleContent from '@/app/components/templates/ArticleContent'

type Post = {
  slug: string
  title: string
  date: string
  blogContentsHTML: string
}

// SSG
export async function generateStaticParams() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  if (!apiUrl) {
    throw new Error('API URL is not defined')
  }
  console.log('API URL:', apiUrl) // 環境変数をコンソールに出力
  const res = await fetch(`${apiUrl}/blog/`, {
    cache: 'force-cache',
  })
  if (!res.ok) {
    throw new Error(`Failed to fetch data from ${apiUrl}/blog/`)
  }
  try {
    const blogData = await res.json()
    return blogData.map((blog: Post) => ({
      slug: blog.slug,
    }))
  } catch (error) {
    console.error('Failed to parse JSON:', error)
    throw new Error('Invalid JSON response')
  }
}

const getBlogArticle = async (slug: string) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  if (!apiUrl) {
    throw new Error('API URL is not defined')
  }
  console.log('API URL:', apiUrl) // 環境変数をコンソールに出力
  const res = await fetch(`${apiUrl}/blog/${slug}`, {
    cache: 'force-cache',
  })
  if (!res.ok) {
    throw new Error(`Failed to fetch data from ${apiUrl}/blog/${slug}`)
  }
  try {
    const blogArticle = await res.json()
    return blogArticle
  } catch (error) {
    console.error('Failed to parse JSON:', error)
    throw new Error('Invalid JSON response')
  }
}

const BlogArticlePage = async ({ params }: { params: { slug: string } }) => {
  const blogArticle = await getBlogArticle(params.slug)

  return (
    <section>
      <ArticleContent
        blogArticle={blogArticle}
        SidebarComponents={[<Toc key="toc" />]}
      />
    </section>
  )
}

export default BlogArticlePage
