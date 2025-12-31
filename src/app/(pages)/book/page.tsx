'use client'

import React, { useEffect, useRef, useState } from 'react'

// STEP1: 本をめくる機能の最小実装
// TODO: STEP2以降で縦書き・フォント・表紙デザイン等を実装予定
export default function BookPage() {
  const [currentPage, setCurrentPage] = useState(0)
  const totalPages = 5
  const touchStartX = useRef<number | null>(null)
  const touchStartY = useRef<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // 縦スクロールを完全に無効化し、親要素のスタイルをリセット
  useEffect(() => {
    const html = document.documentElement
    const body = document.body
    const root = document.getElementById('__next') || document.body
    const main = document.querySelector('main')

    // スクロール無効化
    html.style.overflowY = 'hidden'
    html.style.height = '100vh'
    body.style.overflowY = 'hidden'
    body.style.height = '100vh'
    if (root) {
      ;(root as HTMLElement).style.overflowY = 'hidden'
      ;(root as HTMLElement).style.height = '100vh'
    }
    // main要素のパディングをリセット
    if (main) {
      ;(main as HTMLElement).style.paddingTop = '0'
      ;(main as HTMLElement).style.height = '100vh'
    }

    return () => {
      html.style.overflowY = ''
      html.style.height = ''
      body.style.overflowY = ''
      body.style.height = ''
      if (root) {
        ;(root as HTMLElement).style.overflowY = ''
        ;(root as HTMLElement).style.height = ''
      }
      if (main) {
        ;(main as HTMLElement).style.paddingTop = ''
        ;(main as HTMLElement).style.height = ''
      }
    }
  }, [])

  // スワイプ検出（誤爆防止のため閾値設定）
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
    touchStartY.current = e.touches[0].clientY
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return

    const touchEndX = e.changedTouches[0].clientX
    const touchEndY = e.changedTouches[0].clientY
    const deltaX = touchEndX - touchStartX.current
    const deltaY = touchEndY - touchStartY.current

    // 縦方向の動きが横方向より大きい場合は無視（縦スクロールと誤認しないため）
    if (Math.abs(deltaY) > Math.abs(deltaX)) {
      touchStartX.current = null
      touchStartY.current = null
      return
    }

    // スワイプの閾値（50px以上で有効）
    const swipeThreshold = 50
    if (Math.abs(deltaX) < swipeThreshold) {
      touchStartX.current = null
      touchStartY.current = null
      return
    }

    // 右開きの本：左→右で次ページ、右→左で前ページ
    if (deltaX > swipeThreshold) {
      // 左→右スワイプ：次ページ
      setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))
    } else if (deltaX < -swipeThreshold) {
      // 右→左スワイプ：前ページ
      setCurrentPage((prev) => Math.max(prev - 1, 0))
    }

    touchStartX.current = null
    touchStartY.current = null
  }

  // タップ検出（画面右側で次ページ、左側で前ページ）
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const screenWidth = rect.width
    const leftHalf = screenWidth / 2

    // 左側タップ：次ページ、右側タップ：前ページ
    if (clickX >= leftHalf) {
      setCurrentPage((prev) => Math.max(prev + 1, 0))
    } else {
      setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))
    }
  }

  // ダミーページコンテンツ
  const pageContents = [
    'これは1ページ目のダミーテキストです。本をめくる体験を確認するための最小実装です。',
    '2ページ目の内容です。右開きの本として、左から右へとページが進んでいきます。',
    '3ページ目です。スワイプやタップで自然にページをめくることができます。',
    '4ページ目のダミーテキストです。縦スクロールは完全に無効化されています。',
    '最後の5ページ目です。STEP1ではページング機能のみを実装しています。',
  ]

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 h-screen w-screen overflow-hidden bg-main-white dark:bg-night-black"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onClick={handleClick}
      style={{
        touchAction: 'pan-y',
        height: '100vh',
        width: '100vw',
      }}
    >
      <div className="flex h-full w-full items-center justify-center px-6 py-8">
        <div className="w-full max-w-md">
          <div className="text-center text-main-black dark:text-night-white">
            <p className="text-base leading-relaxed md:text-lg">
              {pageContents[currentPage]}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

