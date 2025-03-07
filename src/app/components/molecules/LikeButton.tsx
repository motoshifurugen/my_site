'use client'

import { Heart } from 'lucide-react'
import { useEffect, useState } from 'react'

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

  useEffect(() => {
    const fetchLikeInfo = async () => {
      try {
        const userLikes = JSON.parse(
          localStorage.getItem('article_likes') || '{}',
        )
        const hasLiked = !!userLikes[articleId]
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
    try {
      const newLikedState = !isLiked
      // ローカルストレージにいいね状態を保存
      const userLikes = JSON.parse(
        localStorage.getItem('article_likes') || '{}',
      )
      if (newLikedState) {
        userLikes[articleId] = true
      } else {
        delete userLikes[articleId]
      }

      localStorage.setItem('article_likes', JSON.stringify(userLikes))

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
      const userLikes = JSON.parse(
        localStorage.getItem('article_likes') || '{}',
      )
      if (isLiked) {
        userLikes[articleId] = true
      } else {
        delete userLikes[articleId]
      }
      localStorage.setItem('article_likes', JSON.stringify(userLikes))
    }
  }

  return (
    <button
      onClick={handleToggleLike}
      className="group flex items-center gap-2 rounded-md p-2"
      aria-label={isLiked ? 'いいねを取り消す' : 'いいねする'}
    >
      <Heart
        size={20}
        className={`transition-all ${
          isLiked
            ? 'fill-like-pink text-like-pink'
            : 'fill-none text-black group-hover:text-like-pink dark:text-night-white dark:group-hover:text-like-pink'
        }`}
      />
      <span className="text-sm text-black dark:text-night-white">
        {likeCount}
      </span>
    </button>
  )
}

export default LikeButton
