import { renderArticleOgImage } from '../ogImageRender'
import { getBlogArticle } from '../page.server'

// output: export ではビルド時に out/blog/{slug}/og.png として書き出す。
// Pages 向けビルドは src/app/api の route を消すため、この route は api の外に置く。
export const dynamic = 'force-static'
export const dynamicParams = false

// route handler は自分のファイルが export した generateStaticParams だけを使う。
export { generateStaticParams } from '../page.server'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
): Promise<Response> {
  const { slug } = await params
  const blogArticle = await getBlogArticle(slug)
  return renderArticleOgImage(blogArticle.title)
}
