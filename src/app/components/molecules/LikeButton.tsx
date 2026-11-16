'use client'

import { Heart } from 'lucide-react'
import { useEffect, useState } from 'react'
import {
  ARTICLE_LIKES_STORAGE_KEY,
  isArticleLiked,
  nextArticleLikes,
} from './articleLikesStorage'

interface LikeButtonProps {
  articleId: string
  initialLiked?: boolean
}

const LikeButton: React.FC<LikeButtonProps> = ({
  articleId,
  initialLiked = false,
}) => {
  const [isLiked, setIsLiked] = useState(initialLiked)
  const [likeCount, setLikeCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  const saveArticleLiked = (liked: boolean) => {
    localStorage.setItem(
      ARTICLE_LIKES_STORAGE_KEY,
      nextArticleLikes(
        localStorage.getItem(ARTICLE_LIKES_STORAGE_KEY),
        articleId,
        liked,
      ),
    )
  }

  useEffect(() => {
    const fetchLikeInfo = async () => {
      try {
        const hasLiked = isArticleLiked(
          localStorage.getItem(ARTICLE_LIKES_STORAGE_KEY),
          articleId,
        )
        setIsLiked(hasLiked)

        // APIからいいね数を取得
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/likes?articleId=${articleId}`,
        )

        if (response.ok) {
          const data = await response.json()
          setLikeCount(data.likeCount)
        }
      } catch (error) {
        console.error(error)
      }
    }
    fetchLikeInfo()
  }, [articleId])

  const handleToggleLike = async () => {
    if (isLoading) return

    try {
      setIsLoading(true)
      setIsAnimating(true)
      const newLikedState = !isLiked

      // ローカルストレージにいいね状態を保存
      saveArticleLiked(newLikedState)

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/likes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ articleId, liked: newLikedState }),
      })

      if (response.ok) {
        const data = await response.json()
        setLikeCount(data.likeCount)
        setIsLiked(newLikedState)
      } else {
        throw new Error('APIリクエストが失敗しました')
      }
    } catch (error) {
      console.error(error)

      // 失敗時にローカルストレージを元に戻す
      saveArticleLiked(isLiked)
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
      className="group relative flex items-center gap-2 rounded-md p-2 transition-all duration-300 hover:scale-105 disabled:opacity-50"
      aria-label={isLiked ? 'いいねを取り消す' : 'いいねする'}
    >
      <div className="relative">
        <Heart
          size={20}
          className={`transition-all duration-300 ${
            isLiked
              ? 'fill-like-pink text-like-pink'
              : 'fill-none text-black group-hover:text-like-pink dark:text-night-white dark:group-hover:text-like-pink'
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
        className={`text-sm transition-all duration-300 ${
          isLiked ? 'text-like-pink' : 'text-black dark:text-night-white'
        }`}
      >
        {isLoading ? '...' : likeCount}
      </span>
    </button>
  )
}

export default LikeButton
