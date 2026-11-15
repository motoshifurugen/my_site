'use client'

import { useIsDarkMode } from '@/app/hooks/useIsDarkMode'
import type { TankaTag } from '@/types/tanka'
import { motion } from 'framer-motion'
import React, { useCallback, useMemo, useRef, useState } from 'react'
import TankaLikeButton from './TankaLikeButton'

interface TankaCardProps {
  tanka: string
  createdAt: string
  index: number
  tags?: TankaTag[]
  tweetId?: string
}

const TankaCard: React.FC<TankaCardProps> = ({
  tanka,
  createdAt,
  index,
  tags = [],
  tweetId,
}) => {
  // 波打ち演出の状態管理
  const [isWaving, setIsWaving] = useState(false)
  const isDarkMode = useIsDarkMode()
  const waveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // 短歌を行に分割（メモ化）
  const tankaLines = useMemo(
    () => tanka.split('\n').filter((line) => line.trim()),
    [tanka],
  )

  // クリック時の降下演出（デバウンス）
  const handleClick = useCallback(() => {
    if (waveTimeoutRef.current) clearTimeout(waveTimeoutRef.current)
    setIsWaving(true)
    waveTimeoutRef.current = setTimeout(() => setIsWaving(false), 2500) // 文字アニメーション完了まで待機
  }, [])

  // 日付をフォーマット（メモ化）
  const formattedDate = useMemo(() => {
    const date = new Date(createdAt)
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }, [createdAt])

  // タグをカテゴリ別にグループ化（メモ化）
  const groupedTags = useMemo(() => {
    const groups: { [key: string]: TankaTag[] } = {}
    tags.forEach((tag) => {
      if (!groups[tag.category]) {
        groups[tag.category] = []
      }
      groups[tag.category].push(tag)
    })
    return groups
  }, [tags])

  // カテゴリの表示名を取得
  const getCategoryDisplayName = (category: string) => {
    const categoryNames: { [key: string]: string } = {
      kigo: '季語',
      emotion: '感情',
      theme: 'テーマ',
      place: '場所',
    }
    return categoryNames[category] || category
  }

  // 統一されたタグの色を取得
  const getTagColor = () => {
    return 'bg-gray-400/95 text-gray-400 dark:bg-gray-600/90 dark:text-slate-300'
  }

  return (
    <div
      className="relative flex min-h-[200px] cursor-pointer flex-col justify-between overflow-hidden rounded-xl bg-gradient-to-br from-white p-3 shadow-lg transition-all duration-300 hover:shadow-2xl dark:from-slate-900 dark:via-slate-800 dark:to-slate-700 sm:min-h-[220px] sm:p-4 lg:min-h-[280px] lg:p-6"
      style={
        !isDarkMode
          ? {
              background:
                'linear-gradient(135deg, #ffffff 0%, #f8fafc 30%, #f1f5f9 70%, #e2e8f0 100%)',
              boxShadow:
                '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
            }
          : {}
      }
      onClick={handleClick}
    >
      {/* 上部コンテナ */}
      <div className="flex flex-1 flex-col">
        {/* 上部の装飾線 */}
        <div className="absolute left-1/2 top-0 h-1 w-12 -translate-x-1/2 transform bg-gradient-to-r from-transparent to-transparent dark:via-slate-400 sm:w-16"></div>

        {/* 右上のいいねボタン */}
        {tweetId && (
          <div className="absolute right-3 top-3 z-10">
            <TankaLikeButton tweetId={tweetId} />
          </div>
        )}

        {/* 短歌テキスト（縦書き・中央揃え） */}
        <div className="flex flex-1 items-center justify-center py-6 sm:py-8">
          <div className="flex select-none flex-row-reverse space-x-2 space-x-reverse sm:space-x-3 lg:space-x-4">
            {tankaLines.map((line, lineIndex) => (
              <div
                key={lineIndex}
                className="select-none text-xs font-medium leading-relaxed tracking-wider text-main-black dark:text-night-white sm:text-sm sm:leading-tight lg:text-base"
                style={{
                  writingMode: 'vertical-rl',
                  textOrientation: 'upright',
                  fontFamily:
                    '"Hiragino Mincho ProN", "Yu Mincho", "YuMincho", var(--font-noto-serif-jp), "BIZ UDPMincho", serif',
                  userSelect: 'none',
                }}
              >
                {line.split('').map((char, charIndex) => (
                  <motion.span
                    key={`${char}-${charIndex}-${isWaving ? 'animate' : 'static'}`}
                    initial={
                      isWaving
                        ? {
                            y: -8,
                            opacity: 0,
                            rotateZ: Math.random() * 10 - 5,
                            scale: 0.9,
                          }
                        : {
                            y: 0,
                            opacity: 1,
                            rotateZ: 0,
                            scale: 1,
                          }
                    }
                    animate={{
                      y: 0,
                      opacity: 1,
                      rotateZ: 0,
                      scale: 1,
                    }}
                    transition={
                      isWaving
                        ? {
                            duration: 0.5,
                            delay: lineIndex * 0.15 + charIndex * 0.05,
                            ease: 'easeOut',
                          }
                        : {
                            duration: 0,
                          }
                    }
                    style={{
                      display: 'inline-block',
                      transformOrigin: 'center center',
                      willChange: isWaving ? 'transform, opacity' : 'auto',
                    }}
                  >
                    {char}
                  </motion.span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 下部固定エリア */}
      <div className="mt-auto">
        {/* 下部の装飾線 */}
        <div className="mb-3 h-px w-full bg-gradient-to-r from-transparent to-transparent dark:via-slate-400"></div>

        {/* タグ表示エリア */}
        {tags.length > 0 && (
          <div className="mb-3">
            <div className="flex flex-wrap justify-center gap-1">
              {Object.entries(groupedTags).map(([category, categoryTags]) => (
                <div key={category} className="flex flex-wrap gap-1">
                  {categoryTags.map((tag) => (
                    <span
                      key={tag.id}
                      className={`rounded-md px-1.5 py-0.5 text-xs font-medium sm:px-2 sm:py-1 ${getTagColor()} opacity-60 shadow-sm transition-all duration-200 hover:scale-105`}
                      title={`${getCategoryDisplayName(category)}: ${tag.description || tag.name}`}
                    >
                      #{tag.name}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 日付とサイト名 */}
        <div
          className="text-center text-xs font-light opacity-60 dark:text-slate-300 sm:text-xs lg:text-xs"
          style={{ fontSize: '10px' }}
        >
          {formattedDate} / Motoshi
        </div>
      </div>

      {/* 微細な光沢エフェクト */}
      <div className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-br from-white/20 to-transparent dark:from-slate-200/10"></div>
    </div>
  )
}

export default TankaCard
