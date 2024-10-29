'use client'

import MDXContent from '@/app/components/atoms/MDXContent'
import Tags from '@/app/components/molecules/Tags'
import { useRouter } from 'next/navigation'
import React from 'react'
import styles from './ArticleContent.module.css'

interface BlogContentProps {
  blogArticle: any
  SidebarComponents: React.ReactNode[]
}

const BlogContent: React.FC<BlogContentProps> = ({
  blogArticle,
  SidebarComponents,
}) => {
  const router = useRouter()

  const handleTagClick = (tag: string) => {
    router.push(`/blog?tag=${encodeURIComponent(tag)}`)
  }

  return (
    <div className="mb-10 flex min-h-screen w-full max-w-screen-lg justify-start md:max-w-full">
      <div
        className={`w-full max-w-full rounded-lg bg-white p-10 pb-24 shadow-sm xl:px-[4em] ${styles.articleContent}`}
      >
        <p>{blogArticle.date}</p>
        <h1>{blogArticle.title}</h1>
        {blogArticle.tags && (
          <Tags tags={blogArticle.tags} onClickTag={handleTagClick} />
        )}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/katex@0.12.0/dist/katex.min.css"
          integrity="sha384-AfEj0r4/OFrOo5t7NnNe46zW/tFgW6x/bCJG8FqQCEo3+Aro6EYUG4+cU+KJWu/X"
          crossOrigin="anonymous"
        />
        {/* 目次表示に必要 */}
        <div className="target-toc">
          <MDXContent content={blogArticle.content} />
        </div>
      </div>
      <div className="flex-grow lg:ml-10">{SidebarComponents}</div>
    </div>
  )
}

export default BlogContent
