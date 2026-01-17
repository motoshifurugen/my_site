'use client'

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { chapter1 } from "../data/chapter1"
import stationMorning from "../../../../../img/rpg/station_morning.png"
import officeMorning from "../../../../../img/rpg/office_morning.png"
import meetingRoom from "../../../../../img/rpg/meeting_room.png"
import barNight from "../../../../../img/rpg/bar_night.png"

// 1文字ずつフェードインするテキストコンポーネント
const FadeInText = ({ 
  text, 
  delay = 20, 
  onComplete 
}: { 
  text: string
  delay?: number
  onComplete?: () => void
}) => {
  const [visibleChars, setVisibleChars] = useState(0)
  const [isReady, setIsReady] = useState(false)
  const onCompleteRef = useRef(onComplete)

  // onCompleteをrefに保存（依存配列から除外するため）
  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])

  useEffect(() => {
    // テキストが変更されたら即座にリセット
    setVisibleChars(0)
    setIsReady(false)
    
    let timer: NodeJS.Timeout | null = null
    let timeoutId: NodeJS.Timeout | null = null
    let rafId: number | null = null
    
    // requestAnimationFrameを使って確実に次のフレームまで待つ
    rafId = requestAnimationFrame(() => {
      // さらに次のフレームまで待つ（確実に非表示状態を維持）
      rafId = requestAnimationFrame(() => {
        setIsReady(true)
        const chars = text.split('')
        let currentIndex = 0

        timer = setInterval(() => {
          currentIndex++
          setVisibleChars(currentIndex)
          if (currentIndex >= chars.length) {
            if (timer) clearInterval(timer)
            // 全て表示されたらコールバックを呼ぶ
            if (onCompleteRef.current) {
              // 最後の文字のアニメーションが完了するまで少し待つ
              timeoutId = setTimeout(() => {
                onCompleteRef.current?.()
              }, delay + 300) // delay + アニメーション時間(0.3s)
            }
          }
        }, delay)
      })
    })

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId)
      if (timer) clearInterval(timer)
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [text, delay])

  // isReadyがfalseの時は何も表示しない
  if (!isReady) {
    return <span style={{ visibility: 'hidden' }}>{text}</span>
  }

  return (
    <span>
      {text.split('').map((char, index) => {
        // 改行文字の場合は<br />タグを返す
        if (char === '\n') {
          return (
            <br
              key={index}
              style={{
                opacity: index < visibleChars ? 1 : 0,
                transition: `opacity 0.1s ease-out`,
              }}
            />
          )
        }
        return (
          <span
            key={index}
            className="inline-block"
            style={{
              opacity: index < visibleChars ? 1 : 0,
              transition: `opacity 0.1s ease-out`,
            }}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        )
      })}
    </span>
  )
}

const ChapterPlayer = () => {
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0)
  const [currentLineIndex, setCurrentLineIndex] = useState(0)
  const [isTextComplete, setIsTextComplete] = useState(false)

  const currentScene = chapter1.scenes[currentSceneIndex]
  const currentBackground =
    currentScene.background === "station_morning" ? stationMorning :
    currentScene.background === "office_morning" ? officeMorning :
    currentScene.background === "meeting_room" ? meetingRoom :
    currentScene.background === "bar_night" ? barNight :
    stationMorning

  const currentLine = currentScene.lines[currentLineIndex] || currentScene.lines[0]

  // テキストが変更されたら完了状態をリセット
  useEffect(() => {
    setIsTextComplete(false)
  }, [currentLine.text])

  // 話者名から振り仮名を取得
  const getFurigana = (speaker: string): string => {
    const furiganaMap: Record<string, string> = {
      "赤羽": "あかばね",
      "青葉": "あおば",
      "黄瀬": "きせ",
    }
    return furiganaMap[speaker] || ""
  }

  const handleClick = () => {
    // 現在のシーンのテキストがまだ残っている場合
    if (currentLineIndex < currentScene.lines.length - 1) {
      setCurrentLineIndex(currentLineIndex + 1)
    } else {
      // 現在のシーンのテキストが最後の場合、次のシーンに進む
      if (currentSceneIndex < chapter1.scenes.length - 1) {
        setCurrentSceneIndex(currentSceneIndex + 1)
        setCurrentLineIndex(0)
      }
      // すべてのシーンが終わった場合は何もしない（将来的にエンド画面などを表示）
    }
  }

  return (
    <div 
      className="relative h-full w-full overflow-hidden cursor-pointer select-none"
      onClick={handleClick}
    >
      {/* 背景画像 */}
      <div className="absolute inset-0">
        <Image
          src={currentBackground}
          alt={currentScene.background}
          fill
          className="object-cover"
          priority
          quality={90}
        />
      </div>
      
      {/* ゲーム画面のコンテンツエリア */}
      <div className="relative z-10 flex h-full w-full flex-col">
        {/* 上部エリア（将来的にUIなどを配置） */}
        <div className="flex-1" />
        
        {/* 下部エリア：テキストボックス */}
        <div className="relative h-32 mb-12 bg-black/70 backdrop-blur-sm border-t-2 border-white/20">
          {/* 話者名（左上に飛び出した領域） */}
          {currentLine.speaker && (
            <div className="absolute bottom-full left-4 md:left-6 px-6 py-1.5 bg-black/70 backdrop-blur-sm border-2 border-white/20 rounded-t-md">
              {/* 振り仮名 */}
              <div className="text-[9px] text-white/70 leading-tight">
                {getFurigana(currentLine.speaker)}
              </div>
              {/* 話者名 */}
              <div className="text-base md:text-lg font-bold text-white">
                {currentLine.speaker}
              </div>
            </div>
          )}
          <div className="container mx-auto px-4 py-6">
            {/* テキスト */}
            <div className="text-sm md:text-base leading-relaxed text-white">
              <FadeInText 
                text={currentLine.text} 
                delay={20} 
                onComplete={() => setIsTextComplete(true)}
              />
            </div>
          </div>
          {/* クリックを促す■（右下） */}
          {isTextComplete && (
            <div className="absolute bottom-6 right-4 md:bottom-4 md:right-6">
              <div className="w-3 h-1.5 bg-white/60 rounded-sm" />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ChapterPlayer

