import BlogCard from '@/app/components/molecules/BlogCard'
import { useLikeCounts } from '@/app/hooks/useLikeCounts'
import { useI18n } from '@/i18n'
import { PostMeta } from '@/types/posts'
import { useState } from 'react'

interface BlogGridProps {
  blogData: PostMeta[]
}

const BlogGrid: React.FC<BlogGridProps> = ({ blogData }) => {
  const { t } = useI18n()
  const [loadIndex, setLoadIndex] = useState(10)

  // 一覧全件のいいね数を 1 リクエストでまとめて取得する（Issue #166: N+1 解消）。
  // 「もっと見る」で表示が増えても再取得しないよう、currentPost ではなく全 blogData を渡す。
  const likeCounts = useLikeCounts(blogData.map((post) => post.slug))

  // blogData は getAllPostsMeta で日付降順に整列済み。state/useEffect を介すと
  // 静的プリレンダー時に初期HTMLのグリッドが空になるため props から直接派生する。
  const currentPost = blogData.slice(0, loadIndex)
  const isEmpty = loadIndex >= blogData.length

  const displayMore = () => {
    setLoadIndex(loadIndex + 10)
  }

  return (
    <>
      <div className="grid auto-rows-fr grid-cols-1 gap-6 md:grid-cols-2">
        {currentPost.map((post) => (
          <div key={post.slug} className="h-full">
            <BlogCard post={post} likeCount={likeCounts[post.slug] ?? 0} />
          </div>
        ))}
      </div>
      <div className="mt-4 flex justify-center">
        {!isEmpty && (
          <button
            onClick={displayMore}
            className="relative rounded px-6 py-3 text-lg text-main-black transition-all duration-300 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-teal after:transition-all after:duration-300 hover:after:w-full dark:text-night-white dark:after:bg-night-teal"
          >
            {t.blog.findOutMore}
          </button>
        )}
      </div>
    </>
  )
}

export default BlogGrid
