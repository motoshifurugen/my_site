// import Sidebar from '@/app/components/Sidevar'
import { MDXRemote } from 'next-mdx-remote/rsc'
import dynamic from 'next/dynamic'
import rehypeKatex from 'rehype-katex'
import rehypePrism from 'rehype-prism'
import rehypeSlug from 'rehype-slug'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'

// クライアントサイドでのみPrismJSを読み込む
const Highlight = dynamic(() => import('@/app/components/atoms/Highlight'), {
  ssr: false,
})

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
    <div className="flex justify-center">
      <div className="section-style2 mt-20 flex min-h-screen w-full justify-between px-9">
        <section className="section-style bg-white p-8">
          <h1 className="text-gray-800 text-3xl font-bold">
            {blogArticle.title}
          </h1>
          <br />
          <div className="text-gray-600">{blogArticle.date}</div>
          <br />
          <link
            rel="stylesheet"
            href="https://cdn.jsdelivr.net/npm/katex@0.12.0/dist/katex.min.css"
            integrity="sha384-AfEj0r4/OFrOo5t7NnNe46zW/tFgW6x/bCJG8FqQCEo3+Aro6EYUG4+cU+KJWu/X"
            crossOrigin="anonymous"
          />
          {/* 目次表示に必要 */}
          <div className="target-toc">
            <div>
              <MDXRemote
                source={blogArticle.content}
                components={{ Highlight }}
                options={{
                  mdxOptions: {
                    remarkPlugins: [remarkGfm, remarkMath],
                    rehypePlugins: [rehypePrism, rehypeKatex, rehypeSlug],
                  },
                }}
              />
            </div>
          </div>
        </section>
        {/* <Sidebar TocComponent={<Toc />} /> */}
      </div>
    </div>
  )
}

export default BlogArticlePage
