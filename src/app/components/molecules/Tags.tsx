'use client'

import { useRouter } from 'next/navigation'
import React from 'react'

interface TagsProps {
  tags: string[]
}

const TAG_BASE_CLASS =
  'inline-block cursor-pointer rounded-full px-3 py-1 text-xs font-semibold'

// タグ種別ごとの淡色地＋濃色文字トークン。ここに無いタグは DEFAULT_TAG_COLOR。
const TAG_COLOR_CLASSES: Record<string, string> = {
  ブログ:
    'bg-orange/10 text-orange dark:bg-night-orange/20 dark:text-night-orange',
  短編小説:
    'bg-orange/10 text-orange dark:bg-night-orange/20 dark:text-night-orange',
}

const DEFAULT_TAG_COLOR =
  'bg-teal-50 text-teal-700 dark:bg-night-teal/20 dark:text-night-teal'

const Tags: React.FC<TagsProps> = ({ tags }) => {
  const router = useRouter()

  const handleClickTag = (tag: string) => {
    router.push(`/blog?tag=${encodeURIComponent(tag)}`)
  }

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag: string, index: number) => (
        <span
          key={index}
          className={`${TAG_BASE_CLASS} ${TAG_COLOR_CLASSES[tag] ?? DEFAULT_TAG_COLOR}`}
          onClick={() => handleClickTag(tag)}
        >
          {tag}
        </span>
      ))}
    </div>
  )
}

export default Tags
