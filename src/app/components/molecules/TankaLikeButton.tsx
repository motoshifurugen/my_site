'use client'

import { Heart } from 'lucide-react'
import { useEffect, useState } from 'react'

interface TankaLikeButtonProps {
  tweetId: number
  initialLiked?: boolean
  initialLikeCount?: number
}

const TankaLikeButton: React.FC<TankaLikeButtonProps> = ({
  tweetId,
  initialLiked = false,
  initialLikeCount = 0,
}) => {
  const [isLiked, setIsLiked] = useState(initialLiked)
  const [likeCount, setLikeCount] = useState(initialLikeCount)
  const [isLoading, setIsLoading] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    const fetchLikeInfo = async () => {
      try {
        const response = await fetch(
          `/api/tanka-likes?tweetId=${tweetId}`,
        )

        if (response.ok) {
          const data = await response.json()
          setLikeCount(data.likeCount)
          setIsLiked(data.isLiked)
        }
      } catch (error) {
        console.error('いいね情報の取得に失敗しました:', error)
      }
    }
    fetchLikeInfo()
  }, [tweetId])

  const handleToggleLike = async () => {
    if (isLoading) return

    try {
      setIsLoading(true)
      setIsAnimating(true)
      const newLikedState = !isLiked

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tanka-likes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tweetId, liked: newLikedState }),
      })

      if (response.ok) {
        const data = await response.json()
        setLikeCount(data.likeCount)
        setIsLiked(data.isLiked)
      } else {
        throw new Error('APIリクエストが失敗しました')
      }
    } catch (error) {
      console.error('いいねの更新に失敗しました:', error)
    } finally {
      setIsLoading(false)
      // アニメーション終了後に状態をリセット
      setTimeout(() => {
        setIsAnimating(false)
      }, 300)
    }
  }

  return (
    <button
      onClick={handleToggleLike}
      disabled={isLoading}
      className="group relative flex items-center gap-1.5 rounded-md p-1.5 transition-all duration-300 hover:scale-105 disabled:opacity-50"
      aria-label={isLiked ? 'いいねを取り消す' : 'いいねする'}
    >
      <div className="relative">
        <Heart
          size={16}
          className={`transition-all duration-300 ${
            isLiked
              ? 'fill-like-pink text-like-pink'
              : 'fill-none text-gray-400 group-hover:text-like-pink dark:text-slate-300 dark:group-hover:text-like-pink'
          }`}
        />
        {isAnimating && (
          <div
            className={`absolute inset-0 animate-ping rounded-full bg-like-pink/30 transition-all duration-300 ${
              isLiked ? 'opacity-100' : 'opacity-0'
            }`}
          />
        )}
      </div>
      <span
        className={`text-xs transition-all duration-300 ${
          isLiked ? 'text-like-pink' : 'text-gray-500 dark:text-slate-400'
        }`}
      >
        {isLoading ? '...' : likeCount}
      </span>
    </button>
  )
}

export default TankaLikeButton
