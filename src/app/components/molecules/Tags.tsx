'use client'

import React from 'react'

interface TagsProps {
  tags: string[]
  onClickTag?: (tag: string) => void
}

const Tags: React.FC<TagsProps> = ({ tags, onClickTag }) => {
  const handleClick = (tag: string) => {
    if (onClickTag) {
      onClickTag(tag)
    }
  }

  return (
    <div className="mb-16 mt-8 flex flex-wrap gap-2">
      {tags.map((tag: string, index: number) => (
        <span
          key={index}
          className="inline-block cursor-pointer rounded bg-teal px-2.5 py-1.5 text-xs text-main-white"
          onClick={() => handleClick(tag)}
        >
          {tag}
        </span>
      ))}
    </div>
  )
}

export default Tags
