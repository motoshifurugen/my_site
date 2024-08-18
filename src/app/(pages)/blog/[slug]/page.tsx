// import Highlight from '@/app/components/HighRight'
// import { Post } from "@/types/post";
// import ProfileCard from '@/app/components/ProfileCard'
// import { Toc } from '@/app/components/toc' // Tocコンポーネントを追加
// import 'prismjs/components/prism-python.js'
// import 'prismjs/themes/prism-tomorrow.css'

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

  // レスポンスの内容をログに出力
  const text = await res.text()
  console.log('Response text:', text)

  try {
    const blogArticle = JSON.parse(text)
    return blogArticle
  } catch (error) {
    console.error('Failed to parse JSON:', error)
    return null
  }
}

const BlogArticlePage = async ({ params }: { params: { slug: string } }) => {
  const blogArticle = await getBlogArticle(params.slug)

  if (!blogArticle) {
    return <div>記事が見つかりませんでした。</div>
  }

  return (
    <div className="container mx-auto flex w-full justify-end px-2 py-5 lg:px-10">
      <div className="flex w-full max-w-5xl flex-col">
        <div className="bg-gray-100 min-h-screen w-full max-w-5xl rounded-lg bg-white p-5 lg:w-4/5">
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
          <div className="prose prose-lg text-gray-700 target-toc max-w-5xl">
            {/* <MDXRemote
              source={blogArticle.content}
              components={{ Highlight }}
              options={{
                mdxOptions: {
                  remarkPlugins: [remarkGfm, remarkMath],
                  rehypePlugins: [rehypePrism, rehypeKatex, rehypeSlug],
                },
              }}
            /> */}
          </div>
        </div>
      </div>
      <aside className="bg-gray-200 mt-5 hidden w-full rounded-lg p-5 lg:mt-0 lg:block lg:w-1/5">
        {/* <ProfileCard /> */}
        <div className="sticky top-5 max-h-[80vh] overflow-y-auto">
          {/* <Toc /> */}
        </div>
      </aside>
    </div>
  )
}

export default BlogArticlePage
