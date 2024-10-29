import BlogCard from '@/app/components/molecules/BlogCard'
import { useEffect, useState } from 'react'

interface BlogGridProps {
  blogData: any
  onTagClick: (tag: string) => void
}

const BlogGrid: React.FC<BlogGridProps> = ({ blogData, onTagClick }) => {
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
    setCurrentPost(blogData.slice(0, loadIndex))
  }, [blogData, loadIndex])

  return (
    <>
      <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-2">
        {currentPost.map((post: any) => (
          <BlogCard key={post.id} post={post} onTagClick={onTagClick} />
        ))}
      </div>
      <div className="mt-4 flex justify-center">
        {!isEmpty && (
          <button
            onClick={displayMore}
            className="relative rounded px-6 py-3 text-lg text-main-black transition-all duration-300 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-teal after:transition-all after:duration-300 hover:after:w-full"
          >
            Find Out More
          </button>
        )}
      </div>
    </>
  )
}

export default BlogGrid
