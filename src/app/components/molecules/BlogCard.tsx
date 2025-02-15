import LoadingCircle from '@/app/components/atoms/LoadingCircle'
import Tags from '@/app/components/molecules/Tags'
import styles from '@/app/components/templates/ArticleContent.module.css'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

interface BlogPostProps {
  post: any
}

const BlogPost: React.FC<BlogPostProps> = ({ post }) => {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault()
    setIsLoading(true)
    router.push(`/blog/${post.slug}`)
  }

  return (
    <>
      {isLoading && <LoadingCircle isLoading={isLoading} />}
      <div className="relative mx-auto h-[210px] w-full rounded bg-white p-5 text-main-black shadow-sm dark:bg-night-gray dark:text-night-white">
        <a href={`/blog/${post.slug}`} onClick={handleClick}>
          <span>{post.date}</span>
          <div
            className={`mt-4 text-xl font-bold md:text-2xl ${styles.truncate2Lines}`}
          >
            {post.title}
          </div>
        </a>
        {post.tags && <Tags tags={post.tags} />}
      </div>
    </>
  )
}

export default BlogPost
