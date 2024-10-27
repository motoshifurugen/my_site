'use client'

import BlogGrid from '@/app/components/organism/BlogGrid'
import Sidebar from '@/app/components/templates/Sidebar'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import styles from '@/app/components/templates/ArticleContent.module.css'

const getBlogData = async () => {
  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/my_site/api'
  console.log('API URL:', apiUrl) // 環境変数をコンソールに出力
  try {
    const res = await fetch(`${apiUrl}/blog/`, {
      cache: 'force-cache',
    })
    const blogData = await res.json()
    return blogData
  } catch (error) {
    console.error('Error fetching blog data:', error)
    throw new Error('Failed to fetch blog data')
  }
}

const ArticleList: React.FC = () => {
  const [blogData, setBlogData] = useState<any[]>([])
  const [filteredData, setFilteredData] = useState<any[]>([])
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const serchParams = useSearchParams()
  const tagName = serchParams.get('tag')
  const router = useRouter()

  useEffect(() => {
    getBlogData().then((data) => {
      // 日付の新しい順に並び替え
      const sortedData = data.sort(
        (a: any, b: any) =>
          new Date(b.date).getTime() - new Date(a.date).getTime(),
      )
      setBlogData(sortedData)
      setFilteredData(sortedData)
    })
  }, [])

  useEffect(() => {
    if (tagName) {
      setSelectedTag(tagName)
      setFilteredData(blogData.filter((post) => post.tags.includes(tagName)))
    } else {
      setSelectedTag(null)
      setFilteredData(blogData)
    }
  }, [tagName, blogData])

  const resetFilter = () => {
    setSelectedTag(null)
    setFilteredData(blogData)
    router.push('/blog')
  }

  return (
    <div className="flex justify-center">
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
          <BlogGrid blogData={filteredData} />
        </div>
        <div className="flex-grow lg:ml-10">
          <Sidebar SidebarComponents={[]} />
        </div>
      </div>
    </div>
  )
}

export default ArticleList
