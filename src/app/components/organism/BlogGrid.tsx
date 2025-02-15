import BlogCard from '@/app/components/molecules/BlogCard'
import { useEffect, useState } from 'react'

interface BlogGridProps {
  blogData: any
}

const BlogGrid: React.FC<BlogGridProps> = ({ blogData }) => {
  const [loadIndex, setLoadIndex] = useState(10)
  const [isEmpty, setIsEmpty] = useState(false)
  const [currentPost, setCurrentPost] = useState(blogData.slice(0, 10))

  useEffect(() => {
    if (blogData.length <= 10) {
      setIsEmpty(true)
    }
  }, [blogData])

  const displayMore = () => {
    const newLoadIndex = loadIndex + 10
    const newPosts = blogData.slice(0, newLoadIndex)
    setCurrentPost(newPosts)
    setLoadIndex(newLoadIndex)
    if (newLoadIndex >= blogData.length) {
      setIsEmpty(true)
    }
  }

  useEffect(() => {
    const sortedData = blogData
      .slice(0, loadIndex)
      .sort(
        (a: any, b: any) =>
          new Date(b.date).getTime() - new Date(a.date).getTime(),
      )
    setCurrentPost(sortedData)
  }, [blogData, loadIndex])

  return (
    <>
      <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-2">
        {currentPost.map((post: any) => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </div>
      <div className="mt-4 flex justify-center">
        {!isEmpty && (
          <button
            onClick={displayMore}
            className="relative rounded px-6 py-3 text-lg text-main-black transition-all duration-300 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-teal after:transition-all after:duration-300 hover:after:w-full dark:text-night-white dark:after:bg-night-teal"
          >
            Find Out More
          </button>
        )}
      </div>
    </>
  )
}

export default BlogGrid
