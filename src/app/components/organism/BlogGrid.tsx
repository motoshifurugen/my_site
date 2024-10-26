import Tags from '@/app/components/molecules/Tags'
import Sidebar from '@/app/components/templates/Sidebar'
import Link from 'next/link'
import React, { useState } from 'react'

import styles from '@/app/components/templates/ArticleContent.module.css'

interface BlogGridProps {
  blogData: any
}

const BlogGrid: React.FC<BlogGridProps> = async ({ blogData }) => {
  const [filteredData, setFilteredData] = useState(blogData)
  const [selectedTag, setSelectedTag] = useState<string | null>(null)

  const filterByTag = (tag: string) => {
    const filtered = blogData.filter((post: any) => post.tags.includes(tag))
    setFilteredData(filtered)
    setSelectedTag(tag)
  }

  const resetFilter = () => {
    setFilteredData(blogData)
    setSelectedTag(null)
  }

  return (
    <>
      <section>
        <div className="my-5 flex min-h-screen w-full max-w-screen-lg justify-start md:max-w-full">
          <div className={`w-full max-w-full px-10 ${styles.articleContent}`}>
            {selectedTag && (
              <div className="mb-4 flex items-center justify-between">
                <div className="text-xl font-bold">
                  『{selectedTag}』の記事一覧
                </div>
                <button
                  onClick={resetFilter}
                  className="ml-4 rounded px-4 py-2 text-main-black hover:bg-gray"
                >
                  最新記事一覧
                </button>
              </div>
            )}
            <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-2">
              {filteredData &&
                filteredData.length > 0 &&
                filteredData.map((post: any, index: number) => (
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
                    {post.tags && (
                      <Tags tags={post.tags} onClickTag={filterByTag} />
                    )}
                  </div>
                ))}
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
