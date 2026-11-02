import type { PostSearchEntry } from '@/types/posts'
import { useEffect, useState } from 'react'

export const fetchPostSearchIndex = async (
  url: string,
): Promise<PostSearchEntry[]> => {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`)
  }
  const data: PostSearchEntry[] = await response.json()
  return data
}

export const usePostSearchIndex = (url: string): PostSearchEntry[] | null => {
  const [entries, setEntries] = useState<PostSearchEntry[] | null>(null)

  useEffect(() => {
    fetchPostSearchIndex(url)
      .then(setEntries)
      .catch((error: unknown) => {
        console.error('検索インデックスの取得に失敗しました:', error)
      })
  }, [url])

  return entries
}
