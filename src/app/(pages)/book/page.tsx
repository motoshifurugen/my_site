'use client'

import React, { useEffect, useRef, useState } from 'react'

// STEP1: 本をめくる機能の最小実装（完了）
// STEP2: 縦書き・明朝体フォントの導入（完了）
// STEP3A: 表紙・目次ページの追加（完了）
// TODO: STEP3B以降で本文コンテンツ・栞ページ等を実装予定
export default function BookPage() {
  const [currentPage, setCurrentPage] = useState(0)
  // STEP3A: 表紙(0) + 目次(1) + 本文(2-6) = 7ページ
  const totalPages = 7
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

  // STEP3A: ページタイプの定義
  const PAGE_TYPE = {
    COVER: 0, // 表紙
    TABLE_OF_CONTENTS: 1, // 目次
    CONTENT: 2, // 本文開始
  } as const

  // STEP2: 縦書き向けのダミーページコンテンツ（短めの文章）
  // STEP3A: 本文は2ページ目以降に配置
  const contentPages = [
    '春の朝、窓の外から小鳥のさえずりが聞こえてくる。静かな時間が流れていく。',
    '本を開くと、新しい世界が広がる。言葉が紡がれ、物語が始まる。',
    '遠くの山々が朝日に照らされて、美しい光景を見せてくれる。',
    '時間はゆっくりと過ぎていく。心が落ち着き、穏やかな気持ちになる。',
    '読書の時間は、日常から離れる特別な瞬間だ。静寂の中で、自分と向き合う。',
  ]

  // STEP3A: 目次項目
  const tableOfContentsItems = [
    'はじめに',
    '第1章',
    '第2章',
    '第3章',
    '終わりに',
  ]

  // STEP3A: ページタイプを判定
  const getPageType = (page: number) => {
    if (page === PAGE_TYPE.COVER) return 'cover'
    if (page === PAGE_TYPE.TABLE_OF_CONTENTS) return 'table-of-contents'
    return 'content'
  }

  const pageType = getPageType(currentPage)

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
        {/* STEP3A: ページタイプに応じて表示を切り替え */}
        {pageType === 'cover' ? (
          // STEP3A: 表紙ページ（横書き）
          <div
            className="flex h-full w-full items-center justify-center"
            style={{
              fontFamily:
                '"Hiragino Mincho ProN", "Yu Mincho", "YuMincho", "Noto Serif JP", "BIZ UDPMincho", serif',
            }}
          >
            <div
              className="text-main-black dark:text-night-white"
              style={{
                fontFamily:
                  '"Hiragino Mincho ProN", "Yu Mincho", "YuMincho", "Noto Serif JP", "BIZ UDPMincho", serif',
                fontSize: '2rem',
                letterSpacing: '0.1em',
              }}
            >
              2025
            </div>
          </div>
        ) : pageType === 'table-of-contents' ? (
          // STEP3A: 目次ページ
          <div
            className="flex h-full w-full items-center justify-center"
            style={{
              writingMode: 'vertical-rl',
              textOrientation: 'upright',
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
                lineHeight: '3',
                letterSpacing: '0.08em',
                maxHeight: 'calc(100vh - 6rem)',
                maxWidth: 'calc(100vw - 4rem)',
              }}
            >
              {tableOfContentsItems.map((item, index) => (
                <div key={index} style={{ marginBottom: '1.5rem' }}>
                  {item}
                </div>
              ))}
            </div>
          </div>
        ) : (
          // STEP2: 本文ページ
          <div
            className="flex h-full w-full items-center justify-center"
            style={{
              writingMode: 'vertical-rl',
              textOrientation: 'upright',
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
              <div>
                {contentPages[currentPage - PAGE_TYPE.CONTENT] ||
                  contentPages[0]}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

