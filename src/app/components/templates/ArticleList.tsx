'use client'

import AnimatedLine from '@/app/components/atoms/AnimatedLine'
import BlogGrid from '@/app/components/organisms/BlogGrid'
import PageFace from '@/app/components/organisms/PageFace'
import styles from '@/app/components/templates/ArticleContent.module.css'
import MaintenanceTemplate from '@/app/components/templates/MaintenanceTemplate'
import Sidebar from '@/app/components/templates/Sidebar'
import { useI18n } from '@/i18n'
import { PostMeta } from '@/types/posts'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { Suspense } from 'react'
import { FiRefreshCw } from 'react-icons/fi'
import nextConfig from '../../../../next.config.mjs'

const BASE_PATH = nextConfig.basePath || ''
const public_flag = true

interface ArticleListProps {
  initialPosts: PostMeta[]
}

interface PostListViewProps {
  posts: PostMeta[]
  selectedTag: string | null
}

const PostListView: React.FC<PostListViewProps> = ({ posts, selectedTag }) => {
  const { t } = useI18n()
  const router = useRouter()

  return (
    <div className="flex justify-center">
      <div className="my-5 flex min-h-screen w-full max-w-screen-lg justify-start md:max-w-full">
        <div className={`w-full max-w-full md:px-10 ${styles.articleContent}`}>
          <div className="mb-4 flex items-center justify-between text-main-black dark:text-night-white">
            {selectedTag ? (
              <>
                <div className="text-xl font-bold">『{selectedTag}』</div>
                <button
                  onClick={() => router.push('/blog')}
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
          <BlogGrid blogData={posts} />
        </div>
        <div className="mt-16 flex-grow lg:ml-10">
          <Sidebar SidebarComponents={[]} />
        </div>
      </div>
    </div>
  )
}

// useSearchParams は静的書き出しで <Suspense> 境界が必須のため、
// タグ絞り込みはこの子コンポーネントに隔離する。
const FilterablePostList: React.FC<ArticleListProps> = ({ initialPosts }) => {
  const searchParams = useSearchParams()
  const selectedTag = searchParams.get('tag')
  const posts = selectedTag
    ? initialPosts.filter((post) => post.tags.includes(selectedTag))
    : initialPosts

  return <PostListView posts={posts} selectedTag={selectedTag} />
}

const ArticleList: React.FC<ArticleListProps> = ({ initialPosts }) => {
  const { t } = useI18n()

  if (!public_flag) {
    return (
      <MaintenanceTemplate
        title={t.blog.title}
        imagePath={`${BASE_PATH}/images/cats/coming_soon.png`}
      />
    )
  }

  return (
    <>
      <section>
        <PageFace title={t.blog.title} subtitle="" mainMessage={<></>} />
      </section>

      <AnimatedLine />

      <section>
        <Suspense
          fallback={<PostListView posts={initialPosts} selectedTag={null} />}
        >
          <FilterablePostList initialPosts={initialPosts} />
        </Suspense>
      </section>
    </>
  )
}

export default ArticleList
