'use client'

import { useRouter } from 'next/navigation'
import React from 'react'

interface TagsProps {
  tags: string[]
}

const Tags: React.FC<TagsProps> = ({ tags }) => {
  const router = useRouter()

  const handleClickTag = (tag: string) => {
    router.push(`/blog?tag=${encodeURIComponent(tag)}`)
  }

  return (
    <div className="my-6 flex flex-wrap gap-2">
      {tags.map((tag: string, index: number) => (
        <span
          key={index}
          className={`inline-block cursor-pointer rounded px-2.5 py-1.5 text-xxs text-main-white md:text-xs ${
            tag === 'ブログ' || tag === '短編小説'
              ? 'bg-orange dark:bg-night-orange'
              : 'bg-teal dark:bg-night-teal'
          }`}
          onClick={() => handleClickTag(tag)}
        >
          {tag}
        </span>
      ))}
    </div>
  )
}

export default Tags
