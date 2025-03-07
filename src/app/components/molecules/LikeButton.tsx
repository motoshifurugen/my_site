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
    const likes = JSON.parse(localStorage.getItem('article_likes') || '{}')
    setIsLiked(!!likes[articleId])
    // APIから現在のいいね数を取得
    // 今回はローカル実装としてランダムな数字を設定
    const savedLikeCount = localStorage.getItem(`like_count_${articleId}`)
    setLikeCount(
      savedLikeCount
        ? parseInt(savedLikeCount)
        : Math.floor(Math.random() * 50),
    )
  }, [articleId])

  const handleToggleLike = async () => {
    try {
      // ローカルストレージにいいね状態を保存
      const likes = JSON.parse(localStorage.getItem('article_likes') || '{}')
      if (isLiked) {
        delete likes[articleId]
        setLikeCount((prev) => prev - 1)
      } else {
        likes[articleId] = true
        setLikeCount((prev) => prev + 1)
      }

      localStorage.setItem('article_likes', JSON.stringify(likes))
      localStorage.setItem(`like_count_${articleId}`, likeCount.toString())
      setIsLiked(!isLiked)

      // ここで実際のAPIリクエストを送信する場合
      // await fetch('/api/likes', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json'},
      //   body: JSON.stringify({ articleId, liked: !isLiked })
      // })
    } catch (error) {
      console.error(error)
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
