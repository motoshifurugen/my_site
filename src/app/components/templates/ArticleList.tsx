'use client'

import AnimatedLine from '@/app/components/atoms/AnimatedLine'
import PostSearchBox from '@/app/components/molecules/PostSearchBox'
import TagCountList from '@/app/components/molecules/TagCountList'
import BlogGrid from '@/app/components/organisms/BlogGrid'
import ChannelLinks from '@/app/components/organisms/ChannelLinks'
import PageFace from '@/app/components/organisms/PageFace'
import styles from '@/app/components/templates/ArticleContent.module.css'
import MaintenanceTemplate from '@/app/components/templates/MaintenanceTemplate'
import Sidebar from '@/app/components/templates/Sidebar'
import { countTags, searchPosts } from '@/app/components/templates/postSearch'
import { useLikeCounts } from '@/app/hooks/useLikeCounts'
import { usePostSearchIndex } from '@/app/hooks/usePostSearchIndex'
import { useI18n } from '@/i18n'
import { PostMeta } from '@/types/posts'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { Suspense, useState } from 'react'
import { FiRefreshCw } from 'react-icons/fi'
import nextConfig from '../../../../next.config.mjs'

const BASE_PATH = nextConfig.basePath || ''
const public_flag = true

interface ArticleListProps {
  initialPosts: PostMeta[]
}

interface PostListViewProps {
  searchablePosts: PostMeta[]
  query: string
  selectedTag: string | null
  likeCounts: Record<string, number>
  searchControls: React.ReactNode
}

const PostListView: React.FC<PostListViewProps> = ({
  searchablePosts,
  query,
  selectedTag,
  likeCounts,
  searchControls,
}) => {
  const { t } = useI18n()
  const router = useRouter()
  const posts = searchPosts(searchablePosts, { query, tag: selectedTag })

  return (
    <div className="flex justify-center">
      <div className="my-5 flex min-h-screen w-full max-w-screen-lg justify-start md:max-w-full">
        <div className={`w-full max-w-full md:px-10 ${styles.articleContent}`}>
          <div className="mb-4 flex items-center justify-between text-main-black dark:text-night-white">
            {selectedTag ? (
              <>
                <h2>『{selectedTag}』</h2>
                <button
                  onClick={() => router.push('/blog')}
                  className="relative flex items-center rounded px-6 py-3 text-lg text-main-black transition-all duration-300 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-teal after:transition-all after:duration-300 hover:after:w-full dark:text-night-white dark:after:bg-night-teal"
                >
                  {t.blog.all}
                  <FiRefreshCw className="ml-2" />
                </button>
              </>
            ) : (
              <h2>{t.blog.all}</h2>
            )}
          </div>
          {searchControls}
          {posts.length === 0 ? (
            <p className="text-main-black dark:text-night-white">
              {t.blog.search.noResults}
            </p>
          ) : (
            <BlogGrid blogData={posts} likeCounts={likeCounts} />
          )}
        </div>
        <div className="mt-16 flex-grow lg:ml-10">
          <Sidebar SidebarComponents={[]} />
        </div>
      </div>
    </div>
  )
}

// useSearchParams は静的書き出しで Suspense 境界が必須のため、
// タグの読み取りはこの子コンポーネントに隔離する。
const TagFilteredPostList: React.FC<Omit<PostListViewProps, 'selectedTag'>> = (
  props,
) => {
  const searchParams = useSearchParams()
  // 空の ?tag= は絞り込みなしとして扱う（見出しの真偽判定と揃える）
  return (
    <PostListView {...props} selectedTag={searchParams.get('tag') || null} />
  )
}

const ArticleList: React.FC<ArticleListProps> = ({ initialPosts }) => {
  const { t } = useI18n()
  const [query, setQuery] = useState('')
  const searchIndex = usePostSearchIndex(`${BASE_PATH}/blog/search-index.json`)
  const likeCounts = useLikeCounts(initialPosts.map((post) => post.slug))

  if (!public_flag) {
    return (
      <MaintenanceTemplate
        title={t.blog.title}
        imagePath={`${BASE_PATH}/images/cats/coming_soon.png`}
      />
    )
  }

  const listProps = {
    // インデックスの読み込みが終わるまでは excerpt の無い一覧でタイトルとタグだけを検索する
    searchablePosts: searchIndex ?? initialPosts,
    query,
    likeCounts,
    searchControls: (
      <>
        <PostSearchBox value={query} onChange={setQuery} />
        <TagCountList tagCounts={countTags(initialPosts)} />
      </>
    ),
  }

  return (
    <>
      <section>
        <PageFace title={t.blog.title} subtitle="" />
      </section>

      <AnimatedLine />

      <section className="mx-auto w-full max-w-screen-lg px-4 md:px-10">
        <ChannelLinks />
      </section>

      <section>
        <Suspense fallback={<PostListView {...listProps} selectedTag={null} />}>
          <TagFilteredPostList {...listProps} />
        </Suspense>
      </section>
    </>
  )
}

export default ArticleList
