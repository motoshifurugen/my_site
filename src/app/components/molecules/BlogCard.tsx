import Tags from '@/app/components/molecules/Tags'
import styles from '@/app/components/templates/ArticleContent.module.css'
import Link from 'next/link'

interface BlogPostProps {
  post: any
  onTagClick: (tag: string) => void
}

const BlogPost: React.FC<BlogPostProps> = ({ post, onTagClick }) => {
  return (
    <div className="relative mx-auto h-[210px] w-full rounded bg-white p-5 shadow-sm">
      <Link href={`/blog/${post.slug}`}>
        <span>{post.date}</span>
        <div className={`mt-4 text-2xl font-bold ${styles.truncate2Lines}`}>
          {post.title}
        </div>
      </Link>
      {post.tags && <Tags tags={post.tags} onClickTag={onTagClick} />}
    </div>
  )
}

export default BlogPost
