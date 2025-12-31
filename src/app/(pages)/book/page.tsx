'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Bookmark } from 'lucide-react'

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
// STEP6: 裏返しアクションに最小限のトランジションを追加
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
        className="flex items-center justify-center cursor-pointer"
        style={{
          width: '80px',
          height: '60%',
          writingMode: 'vertical-rl',
          textOrientation: 'upright',
          zIndex: 10, // 他の要素より前面に表示
          position: 'relative',
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
        {/* リボンアイコン（栞の中央上部、はみ出すように配置） */}
        <div
          style={{
            position: 'absolute',
            left: 'calc(50% + 1px)',
            top: '-12px',
            transform: 'translateX(-50%)',
            zIndex: 12,
            color: '#FFB366', // リボンの色（少し濃いオレンジ）
          }}
        >
          <Bookmark size={28} fill="#FFB366" strokeWidth={1.5} />
        </div>
        {/* 栞本体 */}
        <div
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: '#FFE5CC', // 薄いオレンジ系の色
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}
        >
          <div
            className="text-main-black dark:text-night-white relative w-full h-full flex items-center justify-center"
            style={{
              fontFamily: '"Noto Sans JP", sans-serif',
              fontSize: '0.65rem',
              lineHeight: '2',
              letterSpacing: '0.05em',
              padding: '1rem 0.5rem',
            }}
          >
            {/* STEP6: 表と裏を別要素として配置し、フェードトランジションを適用 */}
            <div
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                whiteSpace: 'pre-line',
                opacity: isFlipped ? 0 : 1,
                transition: 'opacity 0.2s ease-in-out',
                pointerEvents: isFlipped ? 'none' : 'auto',
              }}
            >
              {bookmark.title}
            </div>
            <div
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                whiteSpace: 'pre-line',
                opacity: isFlipped ? 1 : 0,
                transition: 'opacity 0.2s ease-in-out',
                pointerEvents: isFlipped ? 'auto' : 'none',
              }}
            >
              {bookmark.content}
            </div>
          </div>
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

  // STEP5: 本文を10行ごとに分割する関数
  const splitTextIntoPages = (text: string, maxLines: number = 10): string[] => {
    const lines = text.split('\n')
    const pages: string[] = []
    let currentPage: string[] = []

    for (const line of lines) {
      currentPage.push(line)
      if (currentPage.length >= maxLines) {
        pages.push(currentPage.join('\n'))
        currentPage = []
      }
    }

    // 残りの行がある場合は最後のページに追加
    if (currentPage.length > 0) {
      pages.push(currentPage.join('\n'))
    }

    return pages
  }

  // STEP5: 章ごとの本文データ（実際のコンテンツ、改行を保持）
  // 各章の本文を1つの文字列として保持し、10行ごとに自動分割
  const chaptersRaw: Array<{
    title: string
    content: string
    bookmark?: BookmarkData | null
  }> = [
    {
      title: '第1章　退けば老いるぞ臆せば死ぬぞ',
      content: `充実感と好奇心に満たされていた。
仕事は3年目。自信だけは先に進んでいた。
もっと自分の可能性を信じたい。とう思いはどんどん膨らんでいった。
昇進、転職、海外キャリア。
いろんな人の話を聞いて回った。
副業先の先輩エンジニアから聞いたカナダ渡航実経験。

これだ！と思った以上、戻れなかった。

そのあとは早かった。
海外渡航エージェント（そんなものあるのか）の相談会へ参加。
個人面談の後、退職とカナダ渡航を決断した。`,
      bookmark: {
        title: 'よく考え事をした場所',
        content: `・住宅街を抜ける散歩道
朝昼晩歩いていた。4畳の部屋からの非難`,
      },
    },
    {
      title: '第2章　夜は短し、やり切れ全部',
      content: `退職までは、半年の時間があった。
後悔は残したくない。
辞めると決めてから、仕事ではさらにタスクを巻き取った。
夜も眠らずに個人でアプリを作ってリリース。
英語の勉強もスタート。
手を休める理由はどこにもなかった。`,
      bookmark: {
        title: 'なくして困ったもの',
        content: `・財布
あれどこ行ったんだろう。なぜ無くしたのかも忘れた`,
      },
    },
    {
      title: '第3章　新卒失格',
      content: `上司に「辞めます」と伝えるときが来てしまった。
気持ちの良いものではない。
言葉にする度に覚悟と不安が同時に強くなっていく。

嬉しい言葉を言われたとき、心が戻されそうになる。
厳しい言葉を言われたとき、心が折れそうになる。

5月に全てが決着した。
対戦ありがとうございました。

本当にこれで良いの？と考えた日々。
そこから得られたエネルギーは、後の推進力になる。
カナダ渡航には英語力が必要。
古堅の英語力は、ミジンコ未満。
そのくらいが朝鮮にはちょうど良い。
4ヶ月のフィリピン語学留学を決めた。`,
      bookmark: {
        title: 'この頃よく開いていたアプリ',
        content: `・ChatGPT
相談に乗ってくれた。ありがとう`,
      },
    },
    {
      title: '第4章　Re:ゼロから始める留学生活',
      content: `フィリピンは想像していたより日本と近い。
距離も、環境も、人の温かさも。
授業は平日8時から18時まで。
学ぶのは楽しい。めっちゃ楽しい。
一方で、聞けない・話せないことに毎秒悔しさを感じた。
どんなテストにも、傾向と対策が存在する。
スコアは徐々に上がっていったが、実感とは噛み合っていなかった。`,
      bookmark: {
        title: 'この頃よく聴いていた曲',
        content: `・Don't Look Back in Anger / Oasis
リスニングの練習にはならなかった。おしゃれ`,
      },
    },
    {
      title: '第5章　書を捨てよ街へ出よう',
      content: `少しできるようになってきた時が、一番美味しい。
留学生活は2ヶ月が経過。
ここにきて、英語での会話が楽しくて仕方ない。
授業時間内のエネルギーは、いくらか外で遊ぶことにも注いだ。
模擬試験では目標スコアを達成。
笑い合える多くの友達にも出会うことができた。

4ヶ月。いや、4秒だったのかもしれない。
そのくらいあっといいう間だった。
キャリアが止まっている。
年齢は上がってる。
焦りはそりゃあるよ。人間だもの。
でも手に入れたものは、英語力だけではない。
自分の脳裏に焼き付く思い出。
結果オーライ。
多分これからも、こんな感じで生きていく。`,
      bookmark: {
        title: '無性に食べたくなった味',
        content: `・横浜家系ラーメン
満足感120％で忘れらんねぇよ。チャーシュー抜きで`,
      },
    },
    {
      title: '終わりに',
      content: `2025年。
一言で表すと、「後戻りできないボタンを押した1年」だった。
時間が進んでいく感覚。
夢の途中にいる自覚。
来年へ繋げたバトン。
前を向いて自分のペースで駆けていきたい。`,
    },
  ]

  // STEP5: 各章の本文を10行ごとに自動分割
  const chapters: ChapterContent[] = chaptersRaw.map((chapter) => ({
    title: chapter.title,
    pages: splitTextIntoPages(chapter.content, 10),
    bookmark: chapter.bookmark,
  }))

  // STEP4: ページマッピングを生成（表紙→目次→各章→栞→裏表紙の順）
  const buildPageMapping = () => {
    const mapping: Array<{
      type: 'cover' | 'table-of-contents' | 'content' | 'bookmark' | 'back-cover'
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

    // 裏表紙
    mapping.push({ type: 'back-cover' })

    return mapping
  }

  const pageMapping = buildPageMapping()
  const totalPages = pageMapping.length

  // STEP3A: 目次項目（STEP5: 実際の章タイトルから生成）
  const tableOfContentsItems = chapters.map((chapter) => chapter.title)

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
            backgroundColor:
              pageType === 'cover'
                ? '#2C3E50' // 表紙：濃いグレー
                : pageType === 'back-cover'
                  ? '#34495E' // 裏表紙：少し明るいグレー
                  : '#FEFEFE', // 本文：白っぽい紙の色
            boxShadow:
              pageType === 'cover' || pageType === 'back-cover'
                ? '0 4px 12px rgba(0, 0, 0, 0.3), inset 0 0 0 1px rgba(255, 255, 255, 0.1)'
                : '0 2px 8px rgba(0, 0, 0, 0.1)',
            border:
              pageType === 'cover' || pageType === 'back-cover'
                ? '2px solid rgba(0, 0, 0, 0.2)'
                : '1px solid rgba(0, 0, 0, 0.08)',
            borderRadius: '2px',
            padding: '1rem',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* 本の上部（中央）：章タイトルまたは本のタイトル */}
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
                width: '90%',
                maxWidth: '100%',
              }}
            >
              <div style={{ whiteSpace: 'nowrap' }}>
                {chapters[currentPageInfo.chapterIndex].title}
              </div>
              <div
                style={{
                  width: '5rem',
                  height: '1px',
                  backgroundColor: 'rgba(0, 0, 0, 0.3)',
                  marginTop: '0.5rem',
                }}
              />
            </div>
          ) : pageType === 'table-of-contents' ? (
            <div
              className="absolute top-4 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
              style={{
                fontFamily:
                  '"Hiragino Mincho ProN", "Yu Mincho", "YuMincho", "Noto Serif JP", "BIZ UDPMincho", serif',
                fontSize: '0.7rem',
                color: 'rgba(0, 0, 0, 0.6)',
                writingMode: 'horizontal-tb',
                width: '90%',
                maxWidth: '100%',
              }}
            >
              <div style={{ whiteSpace: 'nowrap' }}>2025</div>
              <div
                style={{
                  width: '5rem',
                  height: '1px',
                  backgroundColor: 'rgba(0, 0, 0, 0.3)',
                  marginTop: '0.5rem',
                }}
              />
            </div>
          ) : null}

          {/* 本の下部（中央）：ページ数（表紙・目次・栞・裏表紙を除く） */}
          {pageType !== 'cover' &&
          pageType !== 'table-of-contents' &&
          pageType !== 'bookmark' &&
          pageType !== 'back-cover' ? (
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
              - {currentPage - 1} -
            </div>
          ) : null}

          <div className="relative w-full h-full flex items-center justify-center">
            {/* STEP2: 縦書き表示エリア */}
            {/* STEP3A: ページタイプに応じて表示を切り替え */}
        {pageType === 'cover' ? (
          // STEP3A: 表紙ページ（横書き）
          <div
            className="relative flex h-full w-full flex-col items-center justify-center"
            style={{
              fontFamily:
                '"Hiragino Mincho ProN", "Yu Mincho", "YuMincho", "Noto Serif JP", "BIZ UDPMincho", serif',
            }}
          >
            {/* 右閉じの本を表現する縦線（右側） */}
            <div
              style={{
                position: 'absolute',
                right: '0',
                top: '0',
                bottom: '0',
                width: '3px',
                background: 'linear-gradient(to left, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.2), transparent)',
                boxShadow: 'inset -2px 0 4px rgba(0, 0, 0, 0.3)',
              }}
            />
            <div
              style={{
                fontFamily:
                  '"Hiragino Mincho ProN", "Yu Mincho", "YuMincho", "Noto Serif JP", "BIZ UDPMincho", serif',
                fontSize: 'clamp(2.5rem, 8vw, 4rem)',
                letterSpacing: '0.15em',
                color: '#ECF0F1',
                textShadow: '0 3px 6px rgba(0, 0, 0, 0.5), 0 0 20px rgba(255, 255, 255, 0.1)',
                fontWeight: '300',
                lineHeight: '1.2',
                position: 'relative',
                paddingBottom: '1rem',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  bottom: '0',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '3rem',
                  height: '2px',
                  background: 'linear-gradient(to right, transparent, #ECF0F1, transparent)',
                  opacity: 0.6,
                }}
              />
              2025
            </div>
            <div
              style={{
                fontFamily:
                  '"Hiragino Mincho ProN", "Yu Mincho", "YuMincho", "Noto Serif JP", "BIZ UDPMincho", serif',
                fontSize: '0.7rem',
                letterSpacing: '0.2em',
                color: '#BDC3C7',
                textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
                marginTop: '2rem',
                fontWeight: '300',
              }}
            >
              Motoshi
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
            className="flex h-full w-full"
            style={{
              writingMode: 'vertical-rl',
              textOrientation: 'upright',
              paddingLeft: '1rem',
              paddingRight: '1rem',
              paddingTop: '3.5rem',
              paddingBottom: '3.5rem',
              fontFamily:
                '"Hiragino Mincho ProN", "Yu Mincho", "YuMincho", "Noto Serif JP", "BIZ UDPMincho", serif',
            }}
          >
            <div
              className="text-main-black dark:text-night-white"
              style={{
                fontFamily:
                  '"Hiragino Mincho ProN", "Yu Mincho", "YuMincho", "Noto Serif JP", "BIZ UDPMincho", serif',
                fontSize: 'clamp(0.65rem, 3vw, 0.85rem)',
                letterSpacing: '0.08em',
                width: '100%',
                height: '100%',
                display: 'grid',
                gridTemplateRows: 'repeat(10, 1fr)',
                paddingTop: '1rem',
                paddingBottom: '1rem',
                gap: '0',
              }}
            >
              {currentPageInfo.chapterIndex !== undefined &&
              currentPageInfo.pageIndex !== undefined
                ? (() => {
                    const lines = chapters[
                      currentPageInfo.chapterIndex
                    ].pages[currentPageInfo.pageIndex].split('\n')
                    // 常に10行分のスペースを確保
                    return Array.from({ length: 10 }, (_, index) => (
                      <div
                        key={index}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                        }}
                      >
                        {lines[index] || ''}
                      </div>
                    ))
                  })()
                : Array.from({ length: 10 }, (_, index) => (
                    <div key={index}></div>
                  ))}
            </div>
          </div>
        ) : pageType === 'back-cover' ? (
          // 裏表紙ページ（何も表示しない）
          <div className="relative h-full w-full">
            {/* 右開きの本を表現する縦線（左側） */}
            <div
              style={{
                position: 'absolute',
                left: '0',
                top: '0',
                bottom: '0',
                width: '3px',
                background: 'linear-gradient(to right, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.2), transparent)',
                boxShadow: 'inset 2px 0 4px rgba(0, 0, 0, 0.3)',
              }}
            />
          </div>
        ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}


