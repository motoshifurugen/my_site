'use client'

import React, { useEffect, useRef, useState } from 'react'

// STEP1: 本をめくる機能の最小実装（完了）
// STEP2: 縦書き・明朝体フォントの導入（完了）
// STEP3A: 表紙・目次ページの追加（完了）
// STEP3B: 栞ページの追加（完了）
// STEP4: 章本文ページの追加（完了）

// STEP3B: 栞データ構造
type BookmarkData = {
  title: string // 表：栞タイトル
  content: string // 裏：コンテンツ
}

// STEP4: 章本文データ構造
type ChapterContent = {
  title: string // 章タイトル（例：「第1章」「はじめに」）
  pages: string[] // 章内の各ページのテキスト
  bookmark?: BookmarkData | null // 章末の栞（オプション）
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
        paddingLeft: '1rem',
        paddingRight: '1rem',
        paddingTop: '1.5rem',
        paddingBottom: '1.5rem',
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

  // STEP4: 章ごとの本文データ（サンプルテキスト）
  const chapters: ChapterContent[] = [
    {
      title: 'はじめに',
      pages: [
        'はじめに、この一年を振り返る。',
        '様々な出来事があった。',
        'それらを言葉にしてみたい。',
      ],
    },
    {
      title: '第1章　春の朝',
      pages: [
        '春の朝、窓の外から小鳥のさえずりが聞こえてくる。静かな時間が流れていく。',
        '本を開くと、新しい世界が広がる。言葉が紡がれ、物語が始まる。',
        '遠くの山々が朝日に照らされて、美しい光景を見せてくれる。',
      ],
      bookmark: {
        title: 'この頃よく聴いていた曲',
        content: '春の朝に流れる静かなメロディ。心が落ち着く時間。',
      },
    },
    {
      title: '第2章　静かな時間',
      pages: [
        '時間はゆっくりと過ぎていく。心が落ち着き、穏やかな気持ちになる。',
        '読書の時間は、日常から離れる特別な瞬間だ。静寂の中で、自分と向き合う。',
        '新しい発見があった。それは小さな気づきかもしれない。',
      ],
    },
    {
      title: '第3章　季節の移り変わり',
      pages: [
        '季節が移り変わる。それぞれに美しさがある。',
        '人との出会いも大切なものだ。',
        '感謝の気持ちを忘れずにいたい。',
      ],
    },
    {
      title: '終わりに',
      pages: [
        '一年が終わろうとしている。',
        '振り返ると、多くの学びがあった。',
        'これからも歩み続けたい。',
      ],
    },
  ]

  // STEP4: ページマッピングを生成（表紙→目次→各章→栞の順）
  const buildPageMapping = () => {
    const mapping: Array<{
      type: 'cover' | 'table-of-contents' | 'content' | 'bookmark'
      chapterIndex?: number
      pageIndex?: number
      bookmark?: BookmarkData
    }> = []

    // 表紙
    mapping.push({ type: 'cover' })

    // 目次
    mapping.push({ type: 'table-of-contents' })

    // 各章の本文ページと栞
    chapters.forEach((chapter, chapterIndex) => {
      // 章の本文ページ
      chapter.pages.forEach((_, pageIndex) => {
        mapping.push({
          type: 'content',
          chapterIndex,
          pageIndex,
        })
      })

      // 章末の栞（存在する場合）
      if (chapter.bookmark) {
        mapping.push({
          type: 'bookmark',
          bookmark: chapter.bookmark,
        })
      }
    })

    return mapping
  }

  const pageMapping = buildPageMapping()
  const totalPages = pageMapping.length

  // STEP3A: 目次項目
  const tableOfContentsItems = [
    'はじめに',
    '第1章',
    '第2章',
    '第3章',
    '終わりに',
  ]

  // STEP4: 現在のページ情報を取得
  const currentPageInfo = pageMapping[currentPage] || pageMapping[0]
  const pageType = currentPageInfo.type

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
      <div className="flex h-full w-full items-center justify-center p-4">
        {/* 本の形の枠（縦横比2:3.5、紙の質感） */}
        <div
          className="relative flex items-center justify-center"
          style={{
            aspectRatio: '2/3.5',
            width: '100%',
            maxWidth: 'min(90vw, calc(90vh * 2 / 3.5))',
            height: 'auto',
            maxHeight: '90vh',
            backgroundColor: '#FEFEFE',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(0, 0, 0, 0.08)',
            borderRadius: '2px',
            padding: '1rem',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* 本の上部（中央）：章タイトル */}
          {pageType === 'content' &&
          currentPageInfo.chapterIndex !== undefined ? (
            <div
              className="absolute top-4 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
              style={{
                fontFamily:
                  '"Hiragino Mincho ProN", "Yu Mincho", "YuMincho", "Noto Serif JP", "BIZ UDPMincho", serif',
                fontSize: '0.7rem',
                color: 'rgba(0, 0, 0, 0.6)',
                writingMode: 'horizontal-tb',
              }}
            >
              <div>{chapters[currentPageInfo.chapterIndex].title}</div>
              <div
                style={{
                  width: '3rem',
                  height: '1px',
                  backgroundColor: 'rgba(0, 0, 0, 0.3)',
                  marginTop: '0.25rem',
                }}
              />
            </div>
          ) : null}

          {/* 本の下部（中央）：ページ数 */}
          <div
            className="absolute bottom-4 left-1/2 transform -translate-x-1/2"
            style={{
              fontFamily:
                '"Hiragino Mincho ProN", "Yu Mincho", "YuMincho", "Noto Serif JP", "BIZ UDPMincho", serif',
              fontSize: '0.65rem',
              color: 'rgba(0, 0, 0, 0.5)',
              writingMode: 'horizontal-tb',
            }}
          >
            - {currentPage + 1} -
          </div>

          <div className="relative w-full h-full flex items-center justify-center">
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
                fontSize: '1.5rem',
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
              paddingLeft: '1rem',
              paddingRight: '1rem',
              paddingTop: '1.5rem',
              paddingBottom: '1.5rem',
              fontFamily:
                '"Hiragino Mincho ProN", "Yu Mincho", "YuMincho", "Noto Serif JP", "BIZ UDPMincho", serif',
            }}
          >
            <div
              className="text-main-black dark:text-night-white"
              style={{
                fontFamily:
                  '"Hiragino Mincho ProN", "Yu Mincho", "YuMincho", "Noto Serif JP", "BIZ UDPMincho", serif',
                fontSize: '0.85rem',
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
          <BookmarkPage bookmark={currentPageInfo.bookmark!} />
        ) : pageType === 'content' ? (
          // STEP4: 章本文ページ
          <div
            className="flex h-full w-full items-start justify-start"
            style={{
              writingMode: 'vertical-rl',
              textOrientation: 'upright',
              paddingLeft: '1rem',
              paddingRight: '1rem',
              paddingTop: '2.5rem',
              paddingBottom: '2.5rem',
              fontFamily:
                '"Hiragino Mincho ProN", "Yu Mincho", "YuMincho", "Noto Serif JP", "BIZ UDPMincho", serif',
            }}
          >
            <div
              className="text-main-black dark:text-night-white"
              style={{
                fontFamily:
                  '"Hiragino Mincho ProN", "Yu Mincho", "YuMincho", "Noto Serif JP", "BIZ UDPMincho", serif',
                fontSize: '0.75rem',
                lineHeight: '2.8',
                letterSpacing: '0.08em',
                maxHeight: 'calc(100vh - 6rem)',
                maxWidth: 'calc(100vw - 4rem)',
                paddingTop: '1.5rem',
                paddingBottom: '1.5rem',
              }}
            >
              <div>
                {currentPageInfo.chapterIndex !== undefined &&
                currentPageInfo.pageIndex !== undefined
                  ? chapters[currentPageInfo.chapterIndex].pages[
                      currentPageInfo.pageIndex
                    ]
                  : ''}
              </div>
            </div>
          </div>
        ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}


