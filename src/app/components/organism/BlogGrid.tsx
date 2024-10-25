import Tags from '@/app/components/molecules/Tags'
import Sidebar from '@/app/components/templates/Sidebar'
import Link from 'next/link'

import styles from '@/app/components/templates/ArticleContent.module.css'

interface BlogGridProps {
  blogData: any
}

const BlogGrid: React.FC<BlogGridProps> = async ({ blogData, label }) => {
  return (
    <>
      <section>
        <div className="my-5 flex min-h-screen w-full max-w-screen-lg justify-start md:max-w-full">
          <div className={`w-full max-w-full px-10 ${styles.articleContent}`}>
            <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-2">
              {await Promise.all(
                blogData.map(async (post: any, index: number) => {
                  return (
                    <>
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
                    </>
                  )
                }),
              )}
            </div>
          </div>
          <div className="flex-grow lg:ml-10">
            <Sidebar SidebarComponents={[]} />
          </div>
        </div>
      </section>
    </>
  )
}

export default BlogGrid
