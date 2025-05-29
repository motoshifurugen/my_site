import { MDXRemote } from 'next-mdx-remote/rsc'
import rehypeKatex from 'rehype-katex'
import rehypePrism from 'rehype-prism'
import rehypeSlug from 'rehype-slug'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'

import Highlight from '@/app/components/atoms/Highlight'
import CodeBlock from '@/app/components/molecules/CodeBlock'
import LikeButton from '@/app/components/molecules/LikeButton'
import Tags from '@/app/components/molecules/Tags'
import Sidebar from '@/app/components/templates/Sidebar'

import EmbedArticle from '@/app/components/molecules/EmbedArticle'
import 'prismjs/components/prism-python.js'
import 'prismjs/themes/prism-tomorrow.css'
import React, { ReactNode } from 'react'

import styles from './ArticleContent.module.css'

interface ArticleContentProps {
  blogArticle: any
  SidebarComponents: React.ReactNode[]
}

const codeBlockComponents = {
  code: (
    props: JSX.IntrinsicAttributes & {
      className?: string
      children?: ReactNode
    },
  ) => {
    // インラインコードの場合（preタグでラップされていない場合）
    if (!props.className) {
      return (
        <code className="bg-slate-100 text-rose-600 dark:bg-slate-800 dark:text-rose-400 rounded px-1.5 py-0.5 text-[0.9em] font-mono">
          {String(props.children)}
        </code>
      )
    }

    // コードブロックの場合
    const content = String(props.children || '')
    const [lang, file] = (props.className || '')
      .replace('language-', '')
      .split(':')

    return (
      <CodeBlock className={props.className} fileName={file}>
        {content}
      </CodeBlock>
    )
  },
  pre: (props: JSX.IntrinsicAttributes & { children?: ReactNode }) => {
    return <div {...props} />
  },
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

const ArticleContent: React.FC<ArticleContentProps> = ({
  blogArticle,
  SidebarComponents,
}) => {
  return (
    <div className="mb-10 flex min-h-screen w-full max-w-screen-lg justify-start md:max-w-full">
      <div
        className={`w-full max-w-full rounded-lg bg-white p-2 pb-24 text-main-black shadow-sm dark:bg-night-gray dark:text-night-white md:p-10 xl:px-[4em] ${styles.articleContent}`}
      >
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <p className="text-main-black dark:text-night-white">
            {blogArticle.date}
          </p>
          <LikeButton articleId={blogArticle.id || blogArticle.slug} />
        </div>
        <h1 className="text-main-black dark:text-night-white">
          {blogArticle.title}
        </h1>
        {blogArticle.tags && <Tags tags={blogArticle.tags} />}
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

export default ArticleContent
