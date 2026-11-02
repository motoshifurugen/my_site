'use client'

import { useI18n } from '@/i18n'
import type { PostMeta } from '@/types/posts'
import Link from 'next/link'
import React from 'react'

interface RelatedArticlesProps {
  posts: PostMeta[]
}

// 素の <a> では basePath（/my_site）が付かないため next/link を使う。
// 親の .articleContent ul に list-style が当たるため ul / li を使わない。
const RelatedArticles: React.FC<RelatedArticlesProps> = ({ posts }) => {
  const { t } = useI18n()

  if (posts.length === 0) {
    return null
  }

  return (
    <section>
      <h2>{t.blog.relatedArticles}</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="block rounded-lg border border-gray p-4 text-main-black transition-colors duration-300 hover:border-teal dark:border-night-black dark:text-night-white dark:hover:border-night-teal"
          >
            <span className="block text-sm">{post.date}</span>
            <span className="mt-2 block font-bold">{post.title}</span>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default RelatedArticles
