import { useEffect, useState } from 'react'

export const fetchLikeCounts = async (
  slugs: string[],
): Promise<Record<string, number> | null> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/likes/bulk?articleIds=${slugs.join(',')}`,
    )
    if (!response.ok) {
      return null
    }
    const data: { likes: Record<string, number> } = await response.json()
    return data.likes
  } catch (error) {
    console.error('いいね数の取得に失敗しました:', error)
    return null
  }
}

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

    fetchLikeCounts(slugsKey.split(',')).then((likes) => {
      if (likes !== null) {
        setLikeCounts(likes)
      }
    })
  }, [slugsKey])

  return likeCounts
}
