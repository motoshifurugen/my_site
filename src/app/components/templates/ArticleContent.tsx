import { MDXRemote } from 'next-mdx-remote/rsc'
import rehypeKatex from 'rehype-katex'
import rehypePrism from 'rehype-prism'
import rehypeSlug from 'rehype-slug'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'

import Highlight from '@/app/components/atoms/Highlight'
import CodeBlock from '@/app/components/molecules/CodeBlock'
import Sidebar from '@/app/components/templates/Sidebar'

import EmbedArticle from '@/app/components/molecules/EmbedArticle'
import 'prismjs/components/prism-python.js'
import 'prismjs/themes/prism-tomorrow.css'
import React, { ReactNode } from 'react'

import styles from './ArticleContent.module.css'

interface BlogContentProps {
  blogArticle: any
  SidebarComponents: React.ReactNode[]
}

const codeBlockComponents = {
  code: (props: JSX.IntrinsicAttributes & { children?: ReactNode }) => (
    <CodeBlock {...props} />
  ),
  p: (props: JSX.IntrinsicAttributes & { children?: ReactNode }) => (
    <div {...props} />
  ),
  a: (
    props: JSX.IntrinsicAttributes & { href?: string; children?: ReactNode },
  ) => {
    const { href, children } = props
    if (href && href.startsWith('http')) {
      return <EmbedArticle url={href} />
    }
    return <a {...props}>{children}</a>
  },
}

const BlogContent: React.FC<BlogContentProps> = ({
  blogArticle,
  SidebarComponents,
}) => {
  return (
    <div className="mb-10 flex min-h-screen w-full max-w-screen-lg justify-start md:max-w-full">
      <div
        className={`w-full max-w-full rounded-lg bg-white p-10 shadow-sm ${styles.articleContent}`}
      >
        <h1>{blogArticle.title}</h1>
        <br />
        <p>更新日：{blogArticle.date}</p>
        <br />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/katex@0.12.0/dist/katex.min.css"
          integrity="sha384-AfEj0r4/OFrOo5t7NnNe46zW/tFgW6x/bCJG8FqQCEo3+Aro6EYUG4+cU+KJWu/X"
          crossOrigin="anonymous"
        />
        {/* 目次表示に必要 */}
        <div className="target-toc">
          <MDXRemote
            source={blogArticle.content}
            components={{ ...codeBlockComponents, Highlight }}
            options={{
              mdxOptions: {
                remarkPlugins: [remarkGfm, remarkMath],
                rehypePlugins: [rehypePrism, rehypeKatex, rehypeSlug],
              },
            }}
          />
        </div>
      </div>
      <div className="flex-grow lg:ml-10">
        <Sidebar SidebarComponents={SidebarComponents} />
      </div>
    </div>
  )
}

export default BlogContent
