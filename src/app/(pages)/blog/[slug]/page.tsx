import { getAllPostsMeta } from '@/app/api/utils/getPostData'
import Toc from '@/app/components/molecules/Toc'
import ArticleContent from '@/app/components/templates/ArticleContent'
import { baseOpenGraph } from '@/config/site'
import { Metadata } from 'next'
import { buildArticleDescription } from './articleDescription'
import { buildBlogPostingJsonLd, serializeJsonLd } from './blogPostingJsonLd'
import { getBlogArticle } from './page.server'
import { selectRelatedPosts } from './relatedPosts'

// 静的書き出し（output: export）で [slug] を事前生成するため、route セグメントから
// generateStaticParams を公開する（Next は page.server.tsx 側の export を拾わない）。
export { generateStaticParams } from './page.server'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const blogArticle = await getBlogArticle(slug)
  const description = buildArticleDescription(blogArticle.content)

  // noindexタグが含まれている場合はrobotsにnoindexを追加
  const robots =
    blogArticle.tags && blogArticle.tags.includes('noindex')
      ? { index: false, follow: false }
      : undefined

  return {
    title: blogArticle.title,
    description: description,
    robots,
    // Next は openGraph を親とマージせず丸ごと置き換えるため、共通部分を展開してから上書きする。
    openGraph: {
      ...baseOpenGraph,
      type: 'article',
      publishedTime: blogArticle.date,
      tags: blogArticle.tags,
    },
  }
}

export default async function BlogArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const blogArticle = await getBlogArticle(slug)
  // 関連記事はビルド時にローカルの記事一覧から選ぶ（実行時 API を増やさない）
  const relatedPosts = selectRelatedPosts(blogArticle, await getAllPostsMeta())

  return (
    <section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(buildBlogPostingJsonLd(blogArticle)),
        }}
      />
      <ArticleContent
        blogArticle={blogArticle}
        relatedPosts={relatedPosts}
        SidebarComponents={[<Toc key="toc" />]}
      />
    </section>
  )
}
