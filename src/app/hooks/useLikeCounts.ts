import { useEffect, useState } from 'react'

// 記事一覧のいいね数を 1 リクエストでまとめて取得する（Issue #166: N+1 解消）。
// 親が毎レンダー新しい配列を生成するため、配列参照ではなく join 文字列を依存キーにし、
// slug の内容が変わったときのみ再取得する（「もっと見る」で追加 fetch を起こさない）。
export const useLikeCounts = (slugs: string[]): Record<string, number> => {
  const [likeCounts, setLikeCounts] = useState<Record<string, number>>({})
  const slugsKey = slugs.join(',')

  useEffect(() => {
    if (slugsKey === '') {
      return
    }

    const fetchLikeCounts = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/likes/bulk?articleIds=${slugsKey}`,
        )
        if (response.ok) {
          const data = await response.json()
          setLikeCounts(data.likes)
        }
      } catch (error) {
        console.error('いいね数の取得に失敗しました:', error)
      }
    }

    fetchLikeCounts()
  }, [slugsKey])

  return likeCounts
}
