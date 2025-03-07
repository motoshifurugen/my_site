import BlogCard from '@/app/components/molecules/BlogCard'
import { useEffect, useState } from 'react'

interface BlogGridProps {
  blogData: any
}

const BlogGrid: React.FC<BlogGridProps> = ({ blogData }) => {
  const [loadIndex, setLoadIndex] = useState(10)
  const [isEmpty, setIsEmpty] = useState(false)
  const [currentPost, setCurrentPost] = useState<any[]>([])

  useEffect(() => {
    if (blogData.length <= 10) {
      setIsEmpty(true)
    }
  }, [blogData])

  const displayMore = () => {
    const newLoadIndex = loadIndex + 10
    setLoadIndex(newLoadIndex)
    if (newLoadIndex >= blogData.length) {
      setIsEmpty(true)
    }
  }

  useEffect(() => {
    // 日付の新しい順にソート
    const sortedData = [...blogData].sort((a, b) => {
      const dateA = new Date(a.date).getTime()
      const dateB = new Date(b.date).getTime()
      return dateB - dateA
    })

    // 現在の表示件数分のデータを取得
    const currentData = sortedData.slice(0, loadIndex)
    setCurrentPost(currentData)
  }, [blogData, loadIndex])

  return (
    <>
      <div className="grid auto-rows-fr grid-cols-1 gap-6 md:grid-cols-2">
        {currentPost.map((post: any) => (
          <div key={post.slug} className="h-full">
            <BlogCard post={post} />
          </div>
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
