import LoadingCircle from '@/app/components/atoms/LoadingCircle'
import Tags from '@/app/components/molecules/Tags'
import styles from '@/app/components/templates/ArticleContent.module.css'
import { useLikeCount } from '@/app/hooks/useLikeCount'
import { Heart } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

interface BlogPostProps {
  post: any
}

const BlogPost: React.FC<BlogPostProps> = ({ post }) => {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const likeCount = useLikeCount(post.slug)

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault()
    setIsLoading(true)
    router.push(`/blog/${post.slug}`)
  }

  return (
    <>
      {isLoading && <LoadingCircle isLoading={isLoading} />}
      <div className="relative mx-auto w-full rounded bg-white p-5 text-main-black shadow-sm dark:bg-night-gray dark:text-night-white">
        <a href={`/blog/${post.slug}`} onClick={handleClick} className="block">
          <div className="flex items-center justify-between">
            <span>{post.date}</span>
            <div className="flex items-center gap-1">
              <Heart size={16} className="text-black dark:text-night-white" />
              <span className="text-sm text-black dark:text-night-white">
                {likeCount}
              </span>
            </div>
          </div>
          <div
            className={`mt-4 text-xl font-bold md:text-2xl ${styles.truncate2Lines}`}
          >
            {post.title}
          </div>
        </a>
        <div className="mt-4">{post.tags && <Tags tags={post.tags} />}</div>
      </div>
    </>
  )
}

export default BlogPost
