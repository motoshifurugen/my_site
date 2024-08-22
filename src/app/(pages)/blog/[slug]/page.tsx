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
  const res = await fetch('http://localhost:3000/my_site/api/blog/', {
    cache: 'force-cache',
  })
  const blogData = await res.json()
  return blogData.map((blog: Post) => ({
    slug: blog.slug,
  }))
}

const getBlogArticle = async (slug: string) => {
  const res = await fetch(`http://localhost:3000/my_site/api/blog/${slug}`, {
    cache: 'force-cache',
  })
  const blogArticle = await res.json()
  return blogArticle
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
