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
    <div className="mb-16 mt-8 flex flex-wrap gap-2">
      {tags.map((tag: string, index: number) => (
        <span
          key={index}
          className="inline-block cursor-pointer rounded bg-teal px-2.5 py-1.5 text-xs text-main-white"
          onClick={() => handleClickTag(tag)}
        >
          {tag}
        </span>
      ))}
    </div>
  )
}

export default Tags
