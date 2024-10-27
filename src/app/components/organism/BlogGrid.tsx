import Tags from '@/app/components/molecules/Tags'
import Link from 'next/link'

import styles from '@/app/components/templates/ArticleContent.module.css'

interface BlogGridProps {
  blogData: any
}

const BlogGrid: React.FC<BlogGridProps> = async ({ blogData }) => {
  return (
    <>
      <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-2">
        {blogData &&
          blogData.length > 0 &&
          blogData.map((post: any, index: number) => (
            <div
              key={index}
              className="relative mx-auto h-[210px] w-full rounded bg-white p-5 shadow-sm"
            >
              <Link href={`/blog/${post.slug}`}>
                <span>{post.date}</span>
                <div
                  className={`mt-4 text-2xl font-bold ${styles.truncate2Lines}`}
                >
                  {post.title}
                </div>
              </Link>
              {post.tags && <Tags tags={post.tags} />}
            </div>
          ))}
      </div>
    </>
  )
}

export default BlogGrid
