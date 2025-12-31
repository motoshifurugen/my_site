'use client'

import React, { useEffect, useRef, useState } from 'react'

// STEP1: 本をめくる機能の最小実装（完了）
// STEP2: 縦書き・明朝体フォントの導入（完了）
// STEP3A: 表紙・目次ページの追加（完了）
// STEP3B: 栞ページの追加（完了）

// STEP3B: 栞データ構造
type BookmarkData = {
  title: string // 表：栞タイトル
  content: string // 裏：コンテンツ
}

// STEP3B: 栞コンポーネント（表/裏反転機能付き）
const BookmarkPage = ({ bookmark }: { bookmark: BookmarkData }) => {
  const [isFlipped, setIsFlipped] = useState(false)
  const bookmarkRef = useRef<HTMLDivElement>(null)

  const handleBookmarkClick = (e: React.MouseEvent | React.TouchEvent) => {
    // ページ遷移を妨げないため、イベント伝播とデフォルト動作を停止
    e.stopPropagation()
    e.preventDefault()
    setIsFlipped((prev) => !prev)
  }

  return (
    <div
      className="relative flex h-full w-full items-center justify-center"
      style={{
        writingMode: 'vertical-rl',
        textOrientation: 'upright',
        paddingLeft: '2rem',
        paddingRight: '2rem',
        paddingTop: '3rem',
        paddingBottom: '3rem',
        fontFamily: '"Noto Sans JP", sans-serif',
      }}
    >
      {/* STEP3B: 栞エリア（本の間に挟まっている感覚） */}
      <div
        ref={bookmarkRef}
        className="absolute right-8 top-0 flex h-full items-center justify-center cursor-pointer"
        style={{
          width: '80px',
          backgroundColor: 'rgba(0, 128, 128, 0.1)', // 一時的な色付け（わかりやすくするため）
          borderLeft: '2px solid rgba(0, 128, 128, 0.3)',
          writingMode: 'vertical-rl',
          textOrientation: 'upright',
          zIndex: 10, // 他の要素より前面に表示
        }}
        onClick={(e) => {
          e.stopPropagation()
          e.preventDefault()
          setIsFlipped((prev) => !prev)
        }}
        onTouchStart={(e) => {
          // タッチ開始時にもイベント伝播を停止
          e.stopPropagation()
        }}
        onTouchEnd={(e) => {
          // タッチイベントでも表裏切り替え（ページ遷移を妨げない）
          e.stopPropagation()
          e.preventDefault()
          setIsFlipped((prev) => !prev)
        }}
      >
        <div
          className="text-main-black dark:text-night-white"
          style={{
            fontFamily: '"Noto Sans JP", sans-serif',
            fontSize: '0.9rem',
            lineHeight: '2.5',
            letterSpacing: '0.05em',
            padding: '2rem 0.5rem',
            maxHeight: 'calc(100vh - 6rem)',
          }}
        >
          <div>{isFlipped ? bookmark.content : bookmark.title}</div>
        </div>
      </div>
    </div>
  )
}

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

  // STEP3B: 栞データ（章末に挿入）
  const bookmarks: (BookmarkData | null)[] = [
    null, // 0: 表紙
    null, // 1: 目次
    null, // 2: 本文1
    null, // 3: 本文2
    {
      title: 'この頃よく聴いていた曲',
      content: '春の朝に流れる静かなメロディ。心が落ち着く時間。',
    }, // 4: 第1章末の栞
    null, // 5: 本文3
    null, // 6: 本文4
  ]

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
  // STEP3B: 栞ページの判定を追加
  const getPageType = (page: number) => {
    if (page === PAGE_TYPE.COVER) return 'cover'
    if (page === PAGE_TYPE.TABLE_OF_CONTENTS) return 'table-of-contents'
    if (bookmarks[page] !== null) return 'bookmark'
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
        ) : pageType === 'bookmark' ? (
          // STEP3B: 栞ページ
          <BookmarkPage bookmark={bookmarks[currentPage]!} />
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

