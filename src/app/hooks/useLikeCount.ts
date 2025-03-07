import { useEffect, useState } from 'react'

export const useLikeCount = (articleId: string) => {
  const [likeCount, setLikeCount] = useState(0)

  useEffect(() => {
    const fetchLikeCount = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/likes?articleId=${articleId}`,
        )
        if (response.ok) {
          const data = await response.json()
          setLikeCount(data.likeCount)
        }
      } catch (error) {
        console.error('いいね数の取得に失敗しました:', error)
      }
    }

    fetchLikeCount()
  }, [articleId])

  return likeCount
}
