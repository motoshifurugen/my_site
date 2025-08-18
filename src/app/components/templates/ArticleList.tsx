'use client'

import BlogGrid from '@/app/components/organisms/BlogGrid'
import Sidebar from '@/app/components/templates/Sidebar'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { FiRefreshCw } from 'react-icons/fi'

import LoadingCircle from '@/app/components/atoms/LoadingCircle'
import styles from '@/app/components/templates/ArticleContent.module.css'
import { useI18n } from '@/i18n'

const getBlogData = async () => {
  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/my_site/api'
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

const parseDate = (dateString: string): Date => {
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) {
      console.error('Invalid date:', dateString)
      return new Date(0) // 無効な日付の場合は最小値を返す
    }
    return date
  } catch (error) {
    console.error('Error parsing date:', dateString)
    return new Date(0)
  }
}

const ArticleList: React.FC = () => {
  const { t } = useI18n()
  const [blogData, setBlogData] = useState<any[]>([])
  const [filteredData, setFilteredData] = useState<any[]>([])
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const searchParams = useSearchParams()
  const tagName = searchParams.get('tag')
  const router = useRouter()

  useEffect(() => {
    getBlogData().then((data) => {
      // 日付の新しい順に並び替え（新しい配列を作成）
      const sortedData = [...data].sort((a: any, b: any) => {
        const dateA = parseDate(a.date)
        const dateB = parseDate(b.date)
        return dateB.getTime() - dateA.getTime()
      })
      setBlogData(sortedData)
      setFilteredData(sortedData)
      setIsLoading(false)
    })
  }, [])

  useEffect(() => {
    if (tagName) {
      setSelectedTag(tagName)
      const filtered = blogData.filter((post) => post.tags.includes(tagName))
      setFilteredData(filtered)
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

  if (isLoading) {
    return <LoadingCircle isLoading={isLoading} />
  }

  return (
    <div className="flex justify-center">
      <div className="my-5 flex min-h-screen w-full max-w-screen-lg justify-start md:max-w-full">
        <div className={`w-full max-w-full md:px-10 ${styles.articleContent}`}>
          <div className="mb-4 flex items-center justify-between text-main-black dark:text-night-white">
            {selectedTag ? (
              <>
                <div className="text-xl font-bold">『{selectedTag}』</div>
                <button
                  onClick={resetFilter}
                  className="relative flex items-center rounded px-6 py-3 text-lg text-main-black transition-all duration-300 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-teal after:transition-all after:duration-300 hover:after:w-full dark:text-night-white dark:after:bg-night-teal"
                >
                  {t.blog.all}
                  <FiRefreshCw className="ml-2" />
                </button>
              </>
            ) : (
              <div className="py-3 text-xl font-bold">{t.blog.all}</div>
            )}
          </div>
          <BlogGrid blogData={filteredData} />
        </div>
        <div className="mt-16 flex-grow lg:ml-10">
          <Sidebar SidebarComponents={[]} />
        </div>
      </div>
    </div>
  )
}

export default ArticleList
