'use client'

import { tagFilterHref } from '@/app/components/molecules/tagFilterHref'
import { useI18n } from '@/i18n'
import type { TagCount } from '@/types/posts'
import Link from 'next/link'
import React from 'react'

interface TagCountListProps {
  tagCounts: TagCount[]
}

// 素の <a> では basePath（/my_site）が付かないため next/link を使う。
// 親の .articleContent ul に list-style が当たるため ul / li を使わない。
const TagCountList: React.FC<TagCountListProps> = ({ tagCounts }) => {
  const { t } = useI18n()

  return (
    <nav className="mb-6">
      <h3 className="mb-2 text-sm text-main-black dark:text-night-white md:text-base">
        {t.blog.tagList}
      </h3>
      <div className="flex flex-wrap gap-2">
        {tagCounts.map(({ tag, count }) => (
          <Link
            key={tag}
            href={tagFilterHref(tag)}
            className="inline-block rounded-full border border-gray px-3 py-1 text-xs font-semibold text-main-black transition-colors duration-300 hover:border-teal dark:border-night-black dark:text-night-white dark:hover:border-night-teal"
          >
            {tag} ({count})
          </Link>
        ))}
      </div>
    </nav>
  )
}

export default TagCountList
