'use client'

import { useI18n } from '@/i18n'
import React, { useId } from 'react'

interface PostSearchBoxProps {
  value: string
  onChange: (value: string) => void
}

const PostSearchBox: React.FC<PostSearchBoxProps> = ({ value, onChange }) => {
  const { t } = useI18n()
  const inputId = useId()

  return (
    <div className="mb-4">
      <label
        htmlFor={inputId}
        className="mb-2 block text-sm font-bold text-main-black dark:text-night-white md:text-base"
      >
        {t.blog.search.label}
      </label>
      <input
        id={inputId}
        type="search"
        value={value}
        placeholder={t.blog.search.placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="block w-full rounded-md border border-gray bg-white px-3 py-2 text-sm text-main-black focus:border-main-black focus:outline-none dark:border-night-black dark:bg-main-white md:text-base"
      />
    </div>
  )
}

export default PostSearchBox
