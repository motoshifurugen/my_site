import Tags from '@/app/components/molecules/Tags'
import styles from '@/app/components/templates/ArticleContent.module.css'
import Link from 'next/link'

interface BlogPostProps {
  post: any
}

const BlogPost: React.FC<BlogPostProps> = ({ post }) => {
  return (
    <div className="relative mx-auto h-[210px] w-full rounded bg-white p-5 shadow-sm">
      <Link href={`/blog/${post.slug}`}>
        <span>{post.date}</span>
        <div className={`mt-4 text-2xl font-bold ${styles.truncate2Lines}`}>
          {post.title}
        </div>
      </Link>
      {post.tags && <Tags tags={post.tags} />}
    </div>
  )
}

export default BlogPost
