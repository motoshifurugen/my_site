'use client'

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { chapter1 } from "../data/chapter1"
import { chapter2 } from "../data/chapter2"
import { chapter3 } from "../data/chapter3"
import { chapter4 } from "../data/chapter4"
import stationMorning from "../../../../../img/rpg/station_morning.png"
import officeMorning from "../../../../../img/rpg/office_morning.png"
import meetingRoom from "../../../../../img/rpg/meeting_room.png"
import barNight from "../../../../../img/rpg/bar_night.png"
import cafeLunch from "../../../../../img/rpg/cafe_lunch.png"
import blueLeaf from "../../../../../img/rpg/blue_leaf.png"
import rainRoad from "../../../../../img/rpg/rain_road.png"
import nightCoffee from "../../../../../img/rpg/night_coffee.png"

// すべての章を配列で管理（新しい章を追加する場合はここに追加するだけ）
const chapters = [chapter1, chapter2, chapter3, chapter4]

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
  const [showTitleScreen, setShowTitleScreen] = useState(true)
  const [titleScreenOpacity, setTitleScreenOpacity] = useState(1)
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0)
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0)
  const [currentLineIndex, setCurrentLineIndex] = useState(0)
  const [isTextComplete, setIsTextComplete] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [transitionPhase, setTransitionPhase] = useState<'idle' | 'fadeOut' | 'white' | 'waiting' | 'fadeIn'>('idle')
  const [showChapterTitle, setShowChapterTitle] = useState(false)
  const [chapterTitleOpacity, setChapterTitleOpacity] = useState(0)
  const [chapterTitleTransform, setChapterTitleTransform] = useState('translateX(100px)')
  const currentSceneIndexRef = useRef(currentSceneIndex)
  const currentChapterIndexRef = useRef(currentChapterIndex)
  const prevChapterIndexRef = useRef(currentChapterIndex)
  const isMountedRef = useRef(false)

  // 現在の章を取得
  const currentChapter = chapters[currentChapterIndex]

  // currentSceneIndexの変更をrefに反映
  useEffect(() => {
    currentSceneIndexRef.current = currentSceneIndex
  }, [currentSceneIndex])

  // currentChapterIndexの変更をrefに反映
  useEffect(() => {
    currentChapterIndexRef.current = currentChapterIndex
  }, [currentChapterIndex])

  // タイトル画面からゲーム開始
  const handleTitleScreenClick = () => {
    if (showTitleScreen) {
      setTitleScreenOpacity(0)
      const hideTimer = setTimeout(() => {
        setShowTitleScreen(false)
        // タイトル画面が消えたら第1章のタイトルを表示
        if (currentChapter) {
          setShowChapterTitle(true)
          setChapterTitleOpacity(0)
          setChapterTitleTransform('translateX(100px)')
          
          const rafIds: number[] = []
          
          // フェードイン（横からスッと）
          const rafId1 = requestAnimationFrame(() => {
            const rafId2 = requestAnimationFrame(() => {
              setChapterTitleOpacity(1)
              setChapterTitleTransform('translateX(0)')
            })
            rafIds.push(rafId2)
          })
          rafIds.push(rafId1)
          
          // 3秒表示してからフェードアウト
          const fadeOutTimer = setTimeout(() => {
            setChapterTitleOpacity(0)
          }, 3000)
          
          // フェードアウト完了後に要素を非表示
          const hideChapterTitleTimer = setTimeout(() => {
            setShowChapterTitle(false)
          }, 4500)
          
          // クリーンアップは不要（コンポーネントがアンマウントされるまで実行される）
        }
      }, 800) // フェードアウト時間
    }
  }

  // 初回マウント時に第1章のタイトルを表示（タイトル画面が表示されていない場合のみ）
  useEffect(() => {
    if (!isMountedRef.current && currentChapter && !showTitleScreen) {
      isMountedRef.current = true
      setShowChapterTitle(true)
      setChapterTitleOpacity(0)
      setChapterTitleTransform('translateX(100px)')
      
      const rafIds: number[] = []
      
      // フェードイン（横からスッと）- requestAnimationFrameで確実に次のフレームで実行
      const rafId1 = requestAnimationFrame(() => {
        const rafId2 = requestAnimationFrame(() => {
          setChapterTitleOpacity(1)
          setChapterTitleTransform('translateX(0)')
        })
        rafIds.push(rafId2)
      })
      rafIds.push(rafId1)
      
      // 3秒表示してからフェードアウト（ゆっくりその場で）
      const fadeOutTimer = setTimeout(() => {
        setChapterTitleOpacity(0)
        // フェードアウト時は位置はそのまま（transformは変更しない）
      }, 3000)
      
      // フェードアウト完了後に要素を非表示
      const hideTimer = setTimeout(() => {
        setShowChapterTitle(false)
      }, 4500) // フェードアウトが1.5秒かかるので、3000 + 1500 = 4500
      
      return () => {
        rafIds.forEach(id => cancelAnimationFrame(id))
        clearTimeout(fadeOutTimer)
        clearTimeout(hideTimer)
      }
    }
  }, [currentChapter, showTitleScreen])

  // 章が変わったときにタイトルを表示（第2章以降）
  useEffect(() => {
    // 章が変わったときのみ表示（初回マウント時は除外）
    if (currentChapterIndex !== prevChapterIndexRef.current && isMountedRef.current) {
      setShowChapterTitle(true)
      setChapterTitleOpacity(0)
      setChapterTitleTransform('translateX(100px)')
      
      // 遷移アニメーション完了後0.5秒待つ
      const delay = 500
      
      // フェードイン（横からスッと）
      const showTimer = setTimeout(() => {
        setChapterTitleOpacity(1)
        setChapterTitleTransform('translateX(0)')
      }, delay)
      
      // 3秒表示してからフェードアウト（ゆっくりその場で）
      const fadeOutTimer = setTimeout(() => {
        setChapterTitleOpacity(0)
        // フェードアウト時は位置はそのまま（transformは変更しない）
      }, delay + 3000) // 待機時間 + 3秒表示
      
      // フェードアウト完了後に要素を非表示
      const hideTimer = setTimeout(() => {
        setShowChapterTitle(false)
      }, delay + 4500) // 待機時間 + 3秒表示 + 1.5秒フェードアウト
      
      return () => {
        clearTimeout(showTimer)
        clearTimeout(fadeOutTimer)
        clearTimeout(hideTimer)
      }
    }
    prevChapterIndexRef.current = currentChapterIndex
  }, [currentChapterIndex])

  // 章、シーン、またはテキストが変更されたら完了状態をリセット
  useEffect(() => {
    if (!currentChapter) return
    const currentScene = currentChapter.scenes[currentSceneIndex]
    if (!currentScene) return
    const currentLine = currentScene.lines[currentLineIndex] || currentScene.lines[0]
    setIsTextComplete(false)
  }, [currentChapterIndex, currentSceneIndex, currentLineIndex, currentChapter])

  // シーン遷移アニメーション
  useEffect(() => {
    if (!isTransitioning) return

    const fadeOutDuration = 800 // テキストフェードアウト時間（ミリ秒）
    const whiteFadeDuration = 400 // 白へのフェード時間（ミリ秒）
    const waitDuration = 800 // 無音時間（0.6〜1.0秒の間で0.8秒）
    const fadeInDuration = 400 // 白からのフェードイン時間（ミリ秒）

    // フェーズ1: テキストフェードアウト
    setTransitionPhase('fadeOut')
    
    // フェーズ2: 白へのフェード
    setTimeout(() => {
      setTransitionPhase('white')
    }, fadeOutDuration)

    // フェーズ3: 無音時間（この間に次のシーンに切り替える）
    setTimeout(() => {
      setTransitionPhase('waiting')
      // 次のシーンに切り替え（白画面で覆われているので見えない）
      // refを使用して最新の値を参照
      const sceneIndex = currentSceneIndexRef.current
      const chapterIndex = currentChapterIndexRef.current
      const chapter = chapters[chapterIndex]
      
      if (chapter && sceneIndex < chapter.scenes.length - 1) {
        // 同じ章内の次のシーンへ
        setCurrentSceneIndex(sceneIndex + 1)
        setCurrentLineIndex(0)
      } else if (chapter && chapterIndex < chapters.length - 1) {
        // 次の章の最初のシーンへ
        setCurrentChapterIndex(chapterIndex + 1)
        setCurrentSceneIndex(0)
        setCurrentLineIndex(0)
      }
    }, fadeOutDuration + whiteFadeDuration)

    // フェーズ4: 白画面からのフェードイン
    setTimeout(() => {
      setTransitionPhase('fadeIn')
    }, fadeOutDuration + whiteFadeDuration + waitDuration)

    // 遷移完了
    setTimeout(() => {
      setIsTransitioning(false)
      setTransitionPhase('idle')
    }, fadeOutDuration + whiteFadeDuration + waitDuration + fadeInDuration)
  }, [isTransitioning])

  // 章が存在しない場合はエンド画面を表示
  if (!currentChapter) {
    return (
      <div className="relative h-full w-full overflow-hidden flex items-center justify-center bg-black">
        <div className="text-center text-white">
          <h1 className="text-2xl md:text-4xl font-bold mb-4">つづく</h1>
          <p className="text-sm md:text-base opacity-70">遊んでいただきありがとうございます</p>
        </div>
      </div>
    )
  }

  // シーンが存在しない場合はエンド画面を表示
  if (!currentChapter.scenes[currentSceneIndex]) {
    return (
      <div className="relative h-full w-full overflow-hidden flex items-center justify-center bg-black">
        <div className="text-center text-white">
          <h1 className="text-2xl md:text-4xl font-bold mb-4">つづく</h1>
          <p className="text-sm md:text-base opacity-70">遊んでいただきありがとうございます</p>
        </div>
      </div>
    )
  }

  const currentScene = currentChapter.scenes[currentSceneIndex]
  const currentBackground =
    currentScene.background === "station_morning" ? stationMorning :
    currentScene.background === "office_morning" ? officeMorning :
    currentScene.background === "meeting_room" ? meetingRoom :
    currentScene.background === "bar_night" ? barNight :
    currentScene.background === "cafe_lunch" ? cafeLunch :
    currentScene.background === "blue_leaf" ? blueLeaf :
    currentScene.background === "rain_road" ? rainRoad :
    currentScene.background === "night_coffee" ? nightCoffee :
    stationMorning

  const currentLine = currentScene.lines[currentLineIndex] || currentScene.lines[0]

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
    // タイトル画面が表示されている場合は、タイトル画面のクリックハンドラーを呼ぶ
    if (showTitleScreen) {
      handleTitleScreenClick()
      return
    }

    // 遷移中はクリックを無視
    if (isTransitioning) return

    // 現在のシーンのテキストがまだ残っている場合
    if (currentLineIndex < currentScene.lines.length - 1) {
      setCurrentLineIndex(currentLineIndex + 1)
    } else {
      // 現在のシーンのテキストが最後の場合、遷移アニメーションを開始
      // シーンの切り替えは遷移アニメーション中（白画面で覆われている間）に行う
      if (currentSceneIndex < currentChapter.scenes.length - 1 || currentChapterIndex < chapters.length - 1) {
        setIsTransitioning(true)
      }
      // すべての章が終わった場合は何もしない（エンド画面が表示される）
    }
  }

  // 遷移アニメーションのスタイルを計算
  const getTransitionOverlayStyle = (): React.CSSProperties => {
    if (transitionPhase === 'idle') {
      return { opacity: 0, pointerEvents: 'none' }
    }
    
    if (transitionPhase === 'fadeOut') {
      return { 
        opacity: 0,
        transition: 'opacity 0.8s ease-out',
        pointerEvents: 'none'
      }
    }
    
    if (transitionPhase === 'white') {
      return { 
        opacity: 1,
        backgroundColor: 'rgba(255, 255, 255, 1)',
        transition: 'opacity 0.4s ease-in',
        pointerEvents: 'none'
      }
    }
    
    if (transitionPhase === 'waiting') {
      return { 
        opacity: 1,
        backgroundColor: 'rgba(255, 255, 255, 1)',
        pointerEvents: 'none'
      }
    }
    
    // fadeIn phase
    return { 
      opacity: 0,
      backgroundColor: 'rgba(255, 255, 255, 1)',
      transition: 'opacity 0.4s ease-out',
      pointerEvents: 'none'
    }
  }

  // テキストボックスのフェードアウトスタイル
  const getTextBoxStyle = (): React.CSSProperties => {
    if (transitionPhase === 'fadeOut' || transitionPhase === 'white' || transitionPhase === 'waiting' || transitionPhase === 'fadeIn') {
      return {
        opacity: 0,
        transition: transitionPhase === 'fadeOut' ? 'opacity 0.8s ease-out' : 'none',
      }
    }
    return {}
  }

  // タイトル画面を表示
  if (showTitleScreen) {
    return (
      <div 
        className="relative h-full w-full overflow-hidden cursor-pointer select-none flex items-center justify-center"
        onClick={handleTitleScreenClick}
        style={{
          opacity: titleScreenOpacity,
          transition: 'opacity 0.8s ease-out',
        }}
      >
        {/* 背景画像 */}
        <div className="absolute inset-0">
          <Image
            src={blueLeaf}
            alt="Blue Leaf"
            fill
            className="object-cover"
            priority
            quality={90}
          />
        </div>
        {/* オーバーレイ（テキストの視認性向上） */}
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Blue Leaf
          </h1>
          <div className="flex items-end justify-center gap-2 mb-8">
            <p className="text-lg md:text-xl text-white/90">
              クリックして開始
            </p>
            <div className="w-3 h-1.5 m-1 bg-white/80 rounded-sm animate-pulse" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div 
      className="relative h-full w-full overflow-hidden select-none cursor-pointer"
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
      
      {/* 遷移オーバーレイ（白フェード用） */}
      <div 
        className="absolute inset-0 z-50"
        style={getTransitionOverlayStyle()}
      />
      
      {/* 章タイトル表示（右上） */}
      {showChapterTitle && (
        <div 
          className="absolute top-4 right-4 md:top-6 md:right-6 z-40 px-4 py-2 bg-teal-100/40 backdrop-blur-sm border border-teal-300/50 rounded-md"
          style={{
            opacity: chapterTitleOpacity,
            transform: chapterTitleTransform,
            transition: chapterTitleOpacity === 0 
              ? 'opacity 1.5s ease-in-out' // フェードアウト時はゆっくり
              : 'opacity 0.5s ease-out, transform 0.5s ease-out', // フェードイン時はスッと
          }}
        >
          <div className="text-black text-sm md:text-base">
            <span className="font-bold">第{currentChapterIndex + 1}章</span>
            <span className="ml-2">{currentChapter.title}</span>
          </div>
        </div>
      )}
      
      {/* ゲーム画面のコンテンツエリア */}
      <div className="relative z-10 flex h-full w-full flex-col">
        {/* 上部エリア（将来的にUIなどを配置） */}
        <div className="flex-1" />
        
        {/* 下部エリア：テキストボックス */}
        <div 
          className="relative h-32 mb-12 bg-black/70 backdrop-blur-sm border-t-2 border-white/20"
          style={getTextBoxStyle()}
        >
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
          {isTextComplete && !isTransitioning && (
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

