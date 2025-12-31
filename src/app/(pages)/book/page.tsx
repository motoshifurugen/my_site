'use client'

import React, { useEffect, useRef, useState } from 'react'

// STEP1: 本をめくる機能の最小実装（完了）
// STEP2: 縦書き・明朝体フォントの導入（完了）
// TODO: STEP3で表紙・目次デザイン等を実装予定
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

  // タップ検出（画面左側で次ページ、右側で前ページ）
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const screenWidth = rect.width
    const leftHalf = screenWidth / 2

    // 左側タップ：次ページ、右側タップ：前ページ
    if (clickX < leftHalf) {
      setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))
    } else {
      setCurrentPage((prev) => Math.max(prev - 1, 0))
    }
  }

  // STEP2: 縦書き向けのダミーページコンテンツ（短めの文章）
  const pageContents = [
    '春の朝、窓の外から小鳥のさえずりが聞こえてくる。静かな時間が流れていく。',
    '本を開くと、新しい世界が広がる。言葉が紡がれ、物語が始まる。',
    '遠くの山々が朝日に照らされて、美しい光景を見せてくれる。',
    '時間はゆっくりと過ぎていく。心が落ち着き、穏やかな気持ちになる。',
    '読書の時間は、日常から離れる特別な瞬間だ。静寂の中で、自分と向き合う。',
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
      <div className="flex h-full w-full items-center justify-center">
        {/* STEP2: 縦書き表示エリア */}
        {/* TODO: STEP3で表紙・目次を追加予定 */}
        <div
          className="flex h-full w-full items-center justify-center"
          style={{
            writingMode: 'vertical-rl',
            textOrientation: 'mixed',
            paddingLeft: '2rem',
            paddingRight: '2rem',
            paddingTop: '3rem',
            paddingBottom: '3rem',
            fontFamily:
              '"Hiragino Mincho ProN", "Yu Mincho", "YuMincho", "Noto Serif JP", "BIZ UDPMincho", serif',
          }}
        >
          <div
            className="text-main-black dark:text-night-white"
            style={{
              fontFamily:
                '"Hiragino Mincho ProN", "Yu Mincho", "YuMincho", "Noto Serif JP", "BIZ UDPMincho", serif',
              fontSize: '1rem',
              lineHeight: '2.8',
              letterSpacing: '0.08em',
              maxHeight: 'calc(100vh - 6rem)',
              maxWidth: 'calc(100vw - 4rem)',
              paddingTop: '1.5rem',
              paddingBottom: '1.5rem',
            }}
          >
            <div>{pageContents[currentPage]}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

