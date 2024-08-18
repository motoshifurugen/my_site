import { serialize } from 'next-mdx-remote/serialize'
import rehypeKatex from 'rehype-katex'
import rehypePrism from 'rehype-prism'
import rehypeSlug from 'rehype-slug'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'

interface BlogArticle {
  title: string
  date: string
  content: any // `content` の型は、`MDXRemote` に渡す適切な型に変更してください
}

export const getBlogArticle = async (
  slug: string,
): Promise<BlogArticle | null> => {
  const res = await fetch(`http://localhost:3000/my_site/api/blog/${slug}`, {
    cache: 'force-cache',
  })
  if (!res.ok) {
    return null
  }
  const data = await res.json()
  const content = await serialize(data.content, {
    mdxOptions: {
      remarkPlugins: [remarkGfm, remarkMath],
      rehypePlugins: [rehypePrism, rehypeKatex, rehypeSlug],
    },
  })
  return {
    title: data.title,
    date: data.date,
    content,
  }
}

export async function generateStaticParams() {
  const res = await fetch('http://localhost:3000/my_site/api/blog')
  const slugs = await res.json()

  return slugs.map((slug: string) => ({
    params: {
      slug,
    },
  }))
}
