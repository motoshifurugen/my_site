import SideBarCategoryLists from '@/app/components/molecules/CategoryList'
import Sidebar from '@/app/components/templates/Sidebar'
import type { Categories } from '@/types/categories'
import Link from 'next/link'

import styles from '@/app/components/templates/ArticleContent.module.css'

interface BlogGridProps {
  blogData: any
  label: typeof Categories | string[] | undefined | string
}

const BlogGrid: React.FC<BlogGridProps> = async ({ blogData, label }) => {
  return (
    <>
      <section>
        <div className="mb-10 flex min-h-screen w-full max-w-screen-lg justify-start md:max-w-full">
          <div className={`w-full max-w-full px-10 ${styles.articleContent}`}>
            <div className="flex items-center justify-center pb-4">
              <h2 className="noto-sans-jp rounded px-4 pb-2 text-3xl font-medium text-main-black">
                {label}
              </h2>
            </div>
            <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-2">
              {await Promise.all(
                blogData.map(async (post: any, index: number) => {
                  return (
                    <>
                      <Link href={`/blog/${post.slug}`}>
                        <div
                          key={index}
                          className="relative mx-auto h-[200px] w-full rounded bg-white p-5 shadow-sm"
                        >
                          <span>{post.date}</span>
                          <div className="mt-4 text-2xl font-bold">
                            {post.title}
                          </div>
                          <div className="mb-2 flex items-center space-x-2 text-sm">
                            {/* タグがない場合でも対応できるようにする */}
                            {(post.tags || []).map(
                              (tag: string, tagIndex: number) => (
                                <span
                                  key={tagIndex}
                                  className="mr-2 inline-block rounded bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-800"
                                >
                                  {tag}
                                </span>
                              ),
                            )}
                          </div>
                        </div>
                      </Link>
                    </>
                  )
                }),
              )}
            </div>
          </div>
          <div className="flex-grow lg:ml-10">
            <Sidebar
              SidebarComponents={[<SideBarCategoryLists key="category" />]}
            />
          </div>
        </div>
      </section>
    </>
  )
}

export default BlogGrid
