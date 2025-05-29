import Toc from '@/app/components/molecules/Toc'
import ArticleContent from '@/app/components/templates/ArticleContent'
import { Metadata } from 'next'
import { getBlogArticle } from './page.server'

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const blogArticle = await getBlogArticle(params.slug)
  const description = blogArticle.content.slice(0, 50)

  // noindexタグが含まれている場合はrobotsにnoindexを追加
  const robots =
    blogArticle.tags && blogArticle.tags.includes('noindex')
      ? { index: false, follow: false }
      : undefined

  return {
    title: blogArticle.title,
    description: description,
    robots,
  }
}

export default async function BlogArticlePage({
  params,
}: {
  params: { slug: string }
}) {
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
