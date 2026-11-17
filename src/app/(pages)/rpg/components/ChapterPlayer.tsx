'use client'

import { useLocalStorageValue } from '@/app/hooks/useLocalStorageValue'
import type { StaticImageData } from 'next/image'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import afterCafe from '../../../../../img/rpg/after_cafe.png'
import aobaRoom from '../../../../../img/rpg/aoba_room.png'
import barNight from '../../../../../img/rpg/bar_night.png'
import blueLeaf from '../../../../../img/rpg/blue_leaf.png'
import blueSky from '../../../../../img/rpg/blue_sky.png'
import cafeLunch from '../../../../../img/rpg/cafe_lunch.png'
import clientRoom from '../../../../../img/rpg/client_room.png'
import blueLeafLogo from '../../../../../img/rpg/logo/blue_leaf_logo.png'
import meetingRoom from '../../../../../img/rpg/meeting_room.png'
import nightCoffee from '../../../../../img/rpg/night_coffee.png'
import nightPlatform from '../../../../../img/rpg/night_platform.png'
import officeMorning from '../../../../../img/rpg/office_morning.png'
import aoba1 from '../../../../../img/rpg/person/aoba_1.png'
import aoba2 from '../../../../../img/rpg/person/aoba_2.png'
import aoba3 from '../../../../../img/rpg/person/aoba_3.png'
import aoba4 from '../../../../../img/rpg/person/aoba_4.png'
import kise1 from '../../../../../img/rpg/person/kise_1.png'
import kise2 from '../../../../../img/rpg/person/kise_2.png'
import kise3 from '../../../../../img/rpg/person/kise_3.png'
import saegusa1 from '../../../../../img/rpg/person/saegusa_1.png'
import rainRoad from '../../../../../img/rpg/rain_road.png'
import stationMorning from '../../../../../img/rpg/station_morning.png'
import { chapter5 } from '../data/chapter5'
import { chapter5 as chapter5Eng } from '../data/chapter5_eng'
import {
  type Chapter6Route,
  getChapters,
  type Language,
} from '../data/chapters'
import {
  getInitialChapterIndex,
  getInitialSceneIndex,
  isChapter6Route,
  parseLanguage,
} from '../data/chapterStart'
import {
  type BackgroundKey,
  type CharacterImageKey,
  getFurigana,
  isBackgroundKey,
  isCharacterImageKey,
} from '../data/sceneAssets'
import { getClickResult, getNextScenePosition } from '../data/sceneProgress'
import TapRipple from './TapRipple'

const LANGUAGE_STORAGE_KEY = 'rpg_language'

const BACKGROUND_IMAGES: Record<BackgroundKey, StaticImageData> = {
  station_morning: stationMorning,
  office_morning: officeMorning,
  meeting_room: meetingRoom,
  bar_night: barNight,
  cafe_lunch: cafeLunch,
  blue_leaf: blueLeaf,
  rain_road: rainRoad,
  night_coffee: nightCoffee,
  aoba_room: aobaRoom,
  after_cafe: afterCafe,
  client_room: clientRoom,
  night_platform: nightPlatform,
}

const CHARACTER_IMAGES: Record<CharacterImageKey, StaticImageData> = {
  'aoba_1.png': aoba1,
  'aoba_2.png': aoba2,
  'aoba_3.png': aoba3,
  'aoba_4.png': aoba4,
  'kise_1.png': kise1,
  'kise_2.png': kise2,
  'kise_3.png': kise3,
  'saegusa_1.png': saegusa1,
}

const getBackgroundImage = (background: string): StaticImageData =>
  isBackgroundKey(background) ? BACKGROUND_IMAGES[background] : stationMorning

const getCharacterImage = (image: string): StaticImageData | null =>
  isCharacterImageKey(image) ? CHARACTER_IMAGES[image] : null

// プリロードする全画像のリスト（静的なためコンポーネント外に定義）
const ALL_IMAGES_TO_PRELOAD = [
  // 背景画像
  afterCafe,
  aobaRoom,
  barNight,
  blueLeaf,
  blueSky,
  cafeLunch,
  clientRoom,
  meetingRoom,
  nightCoffee,
  nightPlatform,
  officeMorning,
  rainRoad,
  stationMorning,
  // キャラクター画像
  aoba1,
  aoba2,
  aoba3,
  aoba4,
  kise1,
  kise2,
  kise3,
  saegusa1,
] as const

// 画像プリロード関数
const preloadAllImages = (
  onProgress: (progress: number) => void,
): Promise<void> => {
  const totalImages = ALL_IMAGES_TO_PRELOAD.length
  let loadedCount = 0

  const loadImage = (imageSrc: { src: string } | string): Promise<void> => {
    return new Promise((resolve) => {
      const img = new window.Image()
      const src = typeof imageSrc === 'string' ? imageSrc : imageSrc.src
      img.onload = () => {
        loadedCount++
        onProgress(Math.round((loadedCount / totalImages) * 100))
        resolve()
      }
      img.onerror = () => {
        loadedCount++
        onProgress(Math.round((loadedCount / totalImages) * 100))
        resolve()
      }
      img.src = src
    })
  }

  return Promise.all(ALL_IMAGES_TO_PRELOAD.map(loadImage)).then(() => {})
}

// 1文字ずつフェードインするテキストコンポーネント
const FadeInText = ({
  text,
  delay = 20,
  onComplete,
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

  // 行が変わると呼び出し元が key で作り直すので、表示の状態は初期値から始まる
  useEffect(() => {
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
  const searchParams = useSearchParams()
  const chapterParam = searchParams.get('chapter')

  const [showTitleScreen, setShowTitleScreen] = useState(!chapterParam) // クエリパラメータがある場合はタイトル画面をスキップ
  const [titleScreenOpacity, setTitleScreenOpacity] = useState(
    !chapterParam ? 1 : 0,
  )
  const [showLoading, setShowLoading] = useState(false)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [currentChapterIndex, setCurrentChapterIndex] = useState(
    getInitialChapterIndex(chapterParam),
  )
  const [currentSceneIndex, setCurrentSceneIndex] = useState(
    getInitialSceneIndex(chapterParam),
  )
  const [currentLineIndex, setCurrentLineIndex] = useState(0)
  const [completedLineKey, setCompletedLineKey] = useState<string | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [transitionPhase, setTransitionPhase] = useState<
    'idle' | 'fadeOut' | 'white' | 'waiting' | 'fadeIn'
  >('idle')
  const [showChapterTitle, setShowChapterTitle] = useState(false)
  const [chapterTitleOpacity, setChapterTitleOpacity] = useState(0)
  const [chapterTitleTransform, setChapterTitleTransform] =
    useState('translateX(100px)')
  const [selectedChoice, setSelectedChoice] = useState<{
    lineKey: string
    choiceId: string
  } | null>(null)
  const [chapter6Route, setChapter6Route] = useState<Chapter6Route>(null)
  const [showEnding, setShowEnding] = useState(false)
  // サーバーとクライアントで一致させるため、サーバーでは常に'ja'にする
  const [language, setLanguage] = useLocalStorageValue<Language>(
    LANGUAGE_STORAGE_KEY,
    parseLanguage,
    'ja',
  )
  const [showSettingsModal, setShowSettingsModal] = useState(false)

  // 完了状態と選択状態は表示中の行に結びつけ、行・章・言語が変わったら外れるようにする
  const lineKey = `${language}-${currentChapterIndex}-${currentSceneIndex}-${currentLineIndex}`
  const isTextComplete = completedLineKey === lineKey
  const selectedChoiceId =
    selectedChoice?.lineKey === lineKey ? selectedChoice.choiceId : null
  const currentSceneIndexRef = useRef(currentSceneIndex)
  const currentChapterIndexRef = useRef(currentChapterIndex)
  const languageRef = useRef(language)
  const prevChapterIndexRef = useRef(currentChapterIndex)
  const isMountedRef = useRef(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const chapters = getChapters(language, chapter6Route)

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

  // 遷移 effect が言語の変更で走り直すと、シーンが 2 回進むので ref で読む
  useEffect(() => {
    languageRef.current = language
  }, [language])

  // 言語選択ハンドラー
  const handleLanguageSelect = (lang: Language) => {
    setLanguage(lang)
    // モーダルは自動で閉じない（×ボタンまたはモーダル外クリックで閉じる）
  }

  // ローディング完了後にゲームを開始
  const startGameAfterLoading = () => {
    setShowLoading(false)
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
      setTimeout(() => {
        setChapterTitleOpacity(0)
      }, 3000)

      // フェードアウト完了後に要素を非表示
      setTimeout(() => {
        setShowChapterTitle(false)
      }, 4500)
    }
  }

  // タイトル画面からゲーム開始
  const handleTitleScreenClick = async () => {
    // 設定モーダルが開いている場合は何もしない
    if (showSettingsModal) return
    // 既にローディング中の場合は何もしない
    if (showLoading) return

    if (showTitleScreen) {
      // ローディング画面を表示
      setShowLoading(true)
      setLoadingProgress(0)

      // 画像をプリロード
      await preloadAllImages(setLoadingProgress)

      // プリロード完了後、少し待ってからゲーム開始
      setTimeout(() => {
        startGameAfterLoading()
      }, 300)
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
        rafIds.forEach((id) => cancelAnimationFrame(id))
        clearTimeout(fadeOutTimer)
        clearTimeout(hideTimer)
      }
    }
  }, [currentChapter, showTitleScreen])

  // 章が変わったときにタイトルを表示（第2章以降）
  useEffect(() => {
    // 章が変わったときのみ表示（初回マウント時は除外）
    if (
      currentChapterIndex !== prevChapterIndexRef.current &&
      isMountedRef.current
    ) {
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

  const beginSceneTransition = () => {
    setIsTransitioning(true)
    setTransitionPhase('fadeOut')
  }

  // シーン遷移アニメーション
  useEffect(() => {
    if (!isTransitioning) return

    const fadeOutDuration = 800 // テキストフェードアウト時間（ミリ秒）
    const whiteFadeDuration = 400 // 白へのフェード時間（ミリ秒）
    const waitDuration = 800 // 無音時間（0.6〜1.0秒の間で0.8秒）
    const fadeInDuration = 400 // 白からのフェードイン時間（ミリ秒）

    // フェーズ1（テキストフェードアウト）は beginSceneTransition で始めている

    // フェーズ2: 白へのフェード
    setTimeout(() => {
      setTransitionPhase('white')
    }, fadeOutDuration)

    // フェーズ3: 無音時間（この間に次のシーンに切り替える）
    setTimeout(() => {
      setTransitionPhase('waiting')
      // 次のシーンに切り替え（白画面で覆われているので見えない）
      // refを使用して最新の値を参照
      const nextPosition = getNextScenePosition(
        getChapters(languageRef.current, chapter6Route),
        currentChapterIndexRef.current,
        currentSceneIndexRef.current,
      )
      if (nextPosition) {
        setCurrentChapterIndex(nextPosition.chapterIndex)
        setCurrentSceneIndex(nextPosition.sceneIndex)
        setCurrentLineIndex(0)
      }
    }, fadeOutDuration + whiteFadeDuration)

    // フェーズ4: 白画面からのフェードイン
    setTimeout(
      () => {
        setTransitionPhase('fadeIn')
      },
      fadeOutDuration + whiteFadeDuration + waitDuration,
    )

    // 遷移完了
    setTimeout(
      () => {
        setIsTransitioning(false)
        setTransitionPhase('idle')
      },
      fadeOutDuration + whiteFadeDuration + waitDuration + fadeInDuration,
    )
  }, [isTransitioning, chapter6Route])

  // 決定ボタンのクリックハンドラー
  const handleChoiceConfirm = () => {
    // 第5章の最後のシーンの選択の場合、第6章のルートを決定
    const isChapter6Choice =
      currentChapterIndex === 4 &&
      currentSceneIndex === currentChapter?.scenes.length - 1
    if (
      selectedChoiceId &&
      isChapter6Choice &&
      isChapter6Route(selectedChoiceId)
    ) {
      setChapter6Route(selectedChoiceId)
      setSelectedChoice(null)
      // ルートと同じ描画で遷移を始めるので、遷移の effect は第6章を含む章の一覧を読む
      beginSceneTransition()
    }
  }

  const handleClick = () => {
    // タイトル画面が表示されている場合は、タイトル画面のクリックハンドラーを呼ぶ
    if (showTitleScreen) {
      handleTitleScreenClick()
      return
    }

    // 遷移中はクリックを無視
    if (isTransitioning) return

    // 選択肢が表示されている場合は、通常のクリック処理を無視
    if (shouldShowChoices) return

    const result = getClickResult(
      chapters,
      currentChapterIndex,
      currentSceneIndex,
      currentLineIndex,
    )
    if (result.type === 'nextLine') {
      setCurrentLineIndex(result.lineIndex)
    } else if (result.type === 'ending') {
      setShowEnding(true)
    } else if (result.type === 'startTransition') {
      // シーンの切り替えは遷移アニメーション中（白画面で覆われている間）に行う
      beginSceneTransition()
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
        pointerEvents: 'none',
      }
    }

    if (transitionPhase === 'white') {
      return {
        opacity: 1,
        backgroundColor: 'rgba(220, 220, 220, 1)',
        transition: 'opacity 0.4s ease-in',
        pointerEvents: 'none',
      }
    }

    if (transitionPhase === 'waiting') {
      return {
        opacity: 1,
        backgroundColor: 'rgba(220, 220, 220, 1)',
        pointerEvents: 'none',
      }
    }

    // fadeIn phase
    return {
      opacity: 0,
      backgroundColor: 'rgba(220, 220, 220, 1)',
      transition: 'opacity 0.4s ease-out',
      pointerEvents: 'none',
    }
  }

  // テキストボックスのフェードアウトスタイル
  const getTextBoxStyle = (): React.CSSProperties => {
    if (
      transitionPhase === 'fadeOut' ||
      transitionPhase === 'white' ||
      transitionPhase === 'waiting' ||
      transitionPhase === 'fadeIn'
    ) {
      return {
        opacity: 0,
        transition:
          transitionPhase === 'fadeOut' ? 'opacity 0.8s ease-out' : 'none',
      }
    }
    return {}
  }

  // エンディングページを表示
  if (showEnding) {
    const endingLabel =
      chapter6Route === 'bad_end'
        ? 'Bad End'
        : chapter6Route === 'true_end'
          ? 'True End'
          : 'Another End'

    // エンディングルートに応じて背景画像を選択
    const getEndingBackground = () => {
      if (chapter6Route === 'bad_end') {
        return rainRoad // Bad End用の暗い雰囲気の背景
      } else if (chapter6Route === 'true_end') {
        return nightPlatform // True End用の明るい背景
      } else if (chapter6Route === 'another_end') {
        return afterCafe // Another End用のカフェ背景
      }
      return blueSky // デフォルト
    }

    const endingBackground = getEndingBackground()
    const endingBackgroundAlt =
      chapter6Route === 'bad_end'
        ? 'Rain Road'
        : chapter6Route === 'true_end'
          ? 'Blue Sky'
          : 'After Cafe'

    return (
      <div
        ref={containerRef}
        className="relative flex size-full items-center justify-center overflow-hidden"
      >
        {/* タップエフェクト */}
        <TapRipple containerRef={containerRef} />

        {/* 背景画像 */}
        <div className="absolute inset-0">
          <Image
            src={endingBackground}
            alt={endingBackgroundAlt}
            fill
            className="object-cover"
            preload
            fetchPriority="high"
            quality={90}
          />
        </div>
        {/* オーバーレイ */}
        <div className="absolute inset-0 bg-black/40" />

        {/* エンディングコンテンツ */}
        <div className="relative z-10 px-4 text-center text-white">
          <h1 className="mb-2 text-3xl font-bold tracking-wide text-white md:mb-4 md:text-5xl">
            {endingLabel}
          </h1>
          <p className="mb-8 text-lg font-light text-white opacity-90 md:mb-12 md:text-2xl">
            Thank you for playing
          </p>

          {/* Return to the Choice ボタン */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              // 第5章の最後のシーン（選択肢の場面）に戻る
              setCurrentChapterIndex(4)
              const chapter5Data = language === 'en' ? chapter5Eng : chapter5
              setCurrentSceneIndex(chapter5Data.scenes.length - 1)
              setCurrentLineIndex(0)
              setShowEnding(false)
              setChapter6Route(null)
              setSelectedChoice(null)
              setCompletedLineKey(null)
            }}
            className="group relative min-h-[52px] touch-manipulation rounded-full border border-white/20 bg-white/95 px-10 py-3 text-sm font-medium tracking-wide text-black shadow-[0_4px_20px_rgba(255,255,255,0.3)] backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:bg-white hover:shadow-[0_6px_30px_rgba(255,255,255,0.4)] active:scale-[0.98] md:px-12 md:py-3.5 md:text-base"
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            <span className="relative z-10">Return to the Choice</span>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-white to-white/90 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </button>
        </div>
      </div>
    )
  }

  // 章が存在しない場合はエンド画面を表示
  if (!currentChapter) {
    return (
      <div className="relative flex size-full items-center justify-center overflow-hidden bg-black">
        <div className="text-center text-white">
          <h1 className="mb-4 text-2xl font-bold md:text-4xl">つづく</h1>
          <p className="text-sm opacity-70 md:text-base">
            遊んでいただきありがとうございます
          </p>
        </div>
      </div>
    )
  }

  // シーンが存在しない場合はエンド画面を表示
  if (!currentChapter.scenes[currentSceneIndex]) {
    return (
      <div className="relative flex size-full items-center justify-center overflow-hidden bg-black">
        <div className="text-center text-white">
          <h1 className="mb-4 text-2xl font-bold md:text-4xl">つづく</h1>
          <p className="text-sm opacity-70 md:text-base">
            遊んでいただきありがとうございます
          </p>
        </div>
      </div>
    )
  }

  const currentScene = currentChapter.scenes[currentSceneIndex]
  const currentBackground = getBackgroundImage(currentScene.background)

  const currentLine =
    currentScene.lines[currentLineIndex] || currentScene.lines[0]

  // 現在のシーンの選択肢を取得
  const choices = currentScene.options || []
  // シーンの最後の行が表示され、テキストが完了したときに選択肢を表示
  const shouldShowChoices =
    choices.length > 0 &&
    currentLineIndex === currentScene.lines.length - 1 &&
    isTextComplete

  // 選択肢ボタンのクリックハンドラー（選択状態を更新）
  const handleChoiceSelect = (choiceId: string) => {
    setSelectedChoice({ lineKey, choiceId })
  }

  // ローディング画面を表示
  if (showLoading) {
    return (
      <div
        ref={containerRef}
        className="relative size-full select-none overflow-hidden"
      >
        {/* タップエフェクト */}
        <TapRipple containerRef={containerRef} />

        {/* 背景画像 */}
        <div className="absolute inset-0">
          <Image
            src={blueLeaf}
            alt="Blue Leaf"
            fill
            className="object-cover"
            preload
            fetchPriority="high"
            quality={90}
          />
        </div>
        {/* オーバーレイ */}
        <div className="absolute inset-0 bg-black/50" />

        {/* ローディングコンテンツ */}
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-8">
          {/* ローディングテキスト */}
          <p className="mb-6 text-lg font-medium tracking-wide text-white md:text-xl">
            Now Loading...
          </p>

          {/* プログレスバー */}
          <div className="w-full max-w-xs md:max-w-sm">
            <div className="h-2 overflow-hidden rounded-full bg-white/20 backdrop-blur-sm">
              <div
                className="h-full rounded-full bg-white transition-all duration-200 ease-out"
                style={{ width: `${loadingProgress}%` }}
              />
            </div>
            {/* パーセンテージ表示 */}
            <p className="mt-3 text-center text-sm text-white/80">
              {loadingProgress}%
            </p>
          </div>
        </div>
      </div>
    )
  }

  // タイトル画面を表示
  if (showTitleScreen) {
    return (
      <div
        ref={containerRef}
        className="relative size-full cursor-pointer select-none overflow-hidden"
        onClick={handleTitleScreenClick}
        style={{
          opacity: titleScreenOpacity,
          transition: 'opacity 0.8s ease-out',
        }}
      >
        {/* タップエフェクト */}
        <TapRipple containerRef={containerRef} />

        {/* 背景画像 */}
        <div className="absolute inset-0">
          <Image
            src={blueLeaf}
            alt="Blue Leaf"
            fill
            className="object-cover"
            preload
            fetchPriority="high"
            quality={90}
          />
        </div>
        {/* オーバーレイ（テキストの視認性向上） */}
        <div className="absolute inset-0 bg-black/30" />
        {/* ロゴ画像（画面中央に完全に配置） */}
        <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 transform px-4 py-8 md:py-12">
          <Image
            src={blueLeafLogo}
            alt="Blue Leaf Logo"
            width={800}
            height={400}
            className="size-auto max-h-[90vh] max-w-[98vw] object-contain md:max-w-6xl"
            preload
            fetchPriority="high"
            quality={90}
          />
        </div>
        {/* 設定ボタン（画面右上） */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            setShowSettingsModal(true)
          }}
          className="absolute right-4 top-6 z-30 min-h-[48px] touch-manipulation rounded-full border-2 border-white/20 bg-black/70 px-6 py-2.5 text-sm font-medium tracking-wide text-white backdrop-blur-sm transition-all duration-300 hover:border-white/30 hover:bg-black/80 md:right-8 md:top-8 md:px-8 md:py-3 md:text-base"
          style={{ WebkitTapHighlightColor: 'transparent' }}
          aria-label="Settings"
        >
          <span className="relative z-10 flex items-center gap-2">
            <svg
              className="size-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span>Settings</span>
          </span>
        </button>
        {/* クリックして開始テキスト（画面下部に固定） */}
        <div className="pointer-events-none absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 transform items-end justify-center gap-2 md:bottom-12">
          <p
            className="animate-pulse text-lg font-semibold md:text-xl"
            style={{ color: '#000000' }}
          >
            Press to Start
          </p>
          <div
            className="m-1 h-1.5 w-3 animate-pulse rounded-sm"
            style={{ backgroundColor: '#000000' }}
          />
        </div>
        {/* 設定モーダル */}
        {showSettingsModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={(e) => {
              e.stopPropagation()
              setShowSettingsModal(false)
            }}
          >
            <div
              className="relative mx-4 w-full max-w-md rounded-3xl border border-slate-600/50 bg-gradient-to-br from-slate-800 to-slate-900 p-8 shadow-2xl md:p-10"
              onClick={(e) => e.stopPropagation()}
            >
              {/* モーダルヘッダー */}
              <div className="mb-10 flex items-center justify-between">
                <h2 className="text-xl font-bold tracking-tight text-white md:text-2xl">
                  Settings
                </h2>
                <button
                  onClick={() => setShowSettingsModal(false)}
                  className="-mr-2 p-2 text-slate-400 transition-colors hover:text-white"
                  aria-label="Close"
                >
                  <svg
                    className="size-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              {/* 言語選択セクション */}
              <div>
                <label className="mb-6 block text-sm font-medium uppercase tracking-wide text-slate-400">
                  Language / 言語
                </label>
                <div className="flex gap-1 rounded-2xl bg-slate-700/30 p-1">
                  <button
                    onClick={() => handleLanguageSelect('ja')}
                    className={`flex-1 rounded-xl border-2 px-6 py-4 text-sm font-medium transition-colors duration-300 md:text-base ${
                      language === 'ja'
                        ? 'border-white/30 bg-slate-600/40 text-white'
                        : 'border-transparent text-slate-400 hover:text-slate-300'
                    }`}
                  >
                    日本語
                  </button>
                  <button
                    onClick={() => handleLanguageSelect('en')}
                    className={`flex-1 rounded-xl border-2 px-6 py-4 text-sm font-medium transition-colors duration-300 md:text-base ${
                      language === 'en'
                        ? 'border-white/30 bg-slate-600/40 text-white'
                        : 'border-transparent text-slate-400 hover:text-slate-300'
                    }`}
                  >
                    English
                  </button>
                </div>
              </div>
              {/* 将来的に他の設定をここに追加 */}
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className="relative size-full cursor-pointer select-none overflow-hidden"
      onClick={handleClick}
    >
      {/* タップエフェクト */}
      <TapRipple containerRef={containerRef} />

      {/* 背景画像 */}
      <div className="absolute inset-0">
        <Image
          src={currentBackground}
          alt={currentScene.background}
          fill
          className="object-cover"
          preload
          fetchPriority="high"
          quality={90}
        />
      </div>

      {/* 遷移オーバーレイ（白フェード用） */}
      <div
        className="absolute inset-0 z-50"
        style={getTransitionOverlayStyle()}
      />

      {/* キャラクター画像 */}
      {((currentLine.characters && currentLine.characters.length > 0) ||
        (currentScene.characters && currentScene.characters.length > 0)) && (
        <div className="absolute inset-0 z-[5] flex items-center justify-center">
          {(currentLine.characters || currentScene.characters || []).map(
            (character, index) => {
              const characterImage = getCharacterImage(character.image)
              if (!characterImage) return null

              const positionClass =
                character.position === 'left'
                  ? 'justify-start'
                  : character.position === 'right'
                    ? 'justify-end'
                    : 'justify-center'

              return (
                <div
                  key={index}
                  className={`absolute flex w-full ${positionClass}`}
                  style={{
                    top: '2rem',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    opacity:
                      transitionPhase === 'fadeOut' ||
                      transitionPhase === 'white' ||
                      transitionPhase === 'waiting' ||
                      transitionPhase === 'fadeIn'
                        ? 0
                        : 1,
                    transition:
                      transitionPhase === 'fadeOut'
                        ? 'opacity 0.8s ease-out'
                        : 'opacity 0.4s ease-out',
                  }}
                >
                  <div className="relative h-full" style={{ maxWidth: '50%' }}>
                    <Image
                      src={characterImage}
                      alt={character.image}
                      width={800}
                      height={1200}
                      className="h-full w-auto object-contain"
                      preload={index === 0}
                      fetchPriority={index === 0 ? 'high' : undefined}
                      quality={90}
                    />
                  </div>
                </div>
              )
            },
          )}
        </div>
      )}

      {/* 章タイトル表示（右上） */}
      {showChapterTitle && (
        <div
          className="absolute right-4 top-4 z-40 rounded-lg border border-slate-600/50 bg-gradient-to-br from-slate-800/95 to-slate-900/95 px-5 py-2.5 shadow-[0_2px_12px_rgba(0,0,0,0.4)] backdrop-blur-sm md:right-6 md:top-6 md:px-8 md:py-3"
          style={{
            opacity: chapterTitleOpacity,
            transform: chapterTitleTransform,
            transition:
              chapterTitleOpacity === 0
                ? 'opacity 1.5s ease-in-out' // フェードアウト時はゆっくり
                : 'opacity 0.5s ease-out, transform 0.5s ease-out', // フェードイン時はスッと
          }}
        >
          <div className="flex items-center gap-3">
            <div className="whitespace-nowrap text-[10px] font-medium uppercase tracking-widest text-slate-400 md:text-xs">
              Chapter {currentChapterIndex + 1}
            </div>
            <div className="h-4 w-px bg-slate-600/50"></div>
            <div className="whitespace-nowrap text-sm font-semibold text-slate-200 md:text-base">
              {currentChapter.title}
            </div>
          </div>
        </div>
      )}

      {/* ゲーム画面のコンテンツエリア */}
      <div className="relative z-10 flex size-full flex-col">
        {/* 選択肢ボタン表示エリア（全画面表示） */}
        {shouldShowChoices ? (
          <div className="flex flex-1 flex-col items-center justify-center overflow-y-auto px-4 py-8 md:px-8 md:py-12">
            <div className="container mx-auto flex w-full max-w-xl flex-col gap-3 pb-20 md:gap-4 md:pb-4">
              {choices.map((choice, index) => {
                const isSelected = selectedChoiceId === choice.choiceId
                return (
                  <button
                    key={choice.choiceId || index}
                    onClick={(e) => {
                      e.stopPropagation()
                      handleChoiceSelect(choice.choiceId || '')
                    }}
                    className={`group relative min-h-[56px] w-full touch-manipulation rounded-lg border px-5 py-4 text-left backdrop-blur-md transition-all duration-200 md:px-6 md:py-4 ${
                      isSelected
                        ? 'border-white/40 bg-white/20 shadow-[0_0_20px_rgba(255,255,255,0.2)]'
                        : 'border-white/20 bg-black/70 hover:border-white/30 hover:bg-black/80 hover:shadow-[0_0_20px_rgba(255,255,255,0.15)]'
                    } active:scale-[0.97]`}
                    style={{ WebkitTapHighlightColor: 'transparent' }}
                  >
                    <div className="flex items-center justify-between">
                      <div
                        className={`pr-8 text-base font-medium leading-relaxed drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] transition-colors md:text-base ${
                          isSelected
                            ? 'text-white'
                            : 'text-white group-hover:text-white'
                        }`}
                      >
                        {choice.text}
                      </div>
                      <div
                        className={`ml-4 flex-shrink-0 transition-opacity duration-200 ${
                          isSelected
                            ? 'opacity-100'
                            : 'opacity-0 group-hover:opacity-100 md:opacity-0 md:group-hover:opacity-100'
                        }`}
                      >
                        {isSelected ? (
                          <svg
                            className="size-5 text-white md:size-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        ) : (
                          <svg
                            className="size-5 text-white md:size-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        )}
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
            {/* 決定ボタン（選択時にのみ表示） */}
            {selectedChoiceId && (
              <div className="fixed inset-x-0 bottom-6 z-20 flex justify-center px-4 md:bottom-8 md:px-8">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleChoiceConfirm()
                  }}
                  className="group relative min-h-[52px] touch-manipulation rounded-full border border-white/20 bg-white/95 px-10 py-3 text-sm font-medium tracking-wide text-black shadow-[0_4px_20px_rgba(255,255,255,0.3)] backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:bg-white hover:shadow-[0_6px_30px_rgba(255,255,255,0.4)] active:scale-[0.98] md:px-12 md:py-3.5 md:text-base"
                  style={{ WebkitTapHighlightColor: 'transparent' }}
                >
                  <span className="relative z-10">Proceed</span>
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-white to-white/90 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            {/* 上部エリア（将来的にUIなどを配置） */}
            <div className="flex-1" />

            {/* 下部エリア：テキストボックス */}
            <div
              className="relative mb-4 h-32 border-t-2 border-white/20 bg-gradient-to-br from-slate-800 to-slate-900"
              style={getTextBoxStyle()}
            >
              {/* 話者名（左上に飛び出した領域） */}
              {currentLine.speaker && (
                <div className="absolute bottom-full left-4 rounded-t-md border-2 border-white/20 bg-gradient-to-br from-slate-800 to-slate-900 px-6 py-1.5 md:left-6">
                  {/* 振り仮名 */}
                  <div className="text-[9px] leading-tight text-white/70">
                    {getFurigana(currentLine.speaker)}
                  </div>
                  {/* 話者名 */}
                  <div className="text-base font-bold text-white md:text-lg">
                    {currentLine.speaker}
                  </div>
                </div>
              )}
              <div className="container mx-auto px-4 py-6">
                {/* テキスト */}
                <div className="text-sm leading-relaxed text-white md:text-base">
                  <FadeInText
                    key={lineKey}
                    text={currentLine.text}
                    delay={20}
                    onComplete={() => setCompletedLineKey(lineKey)}
                  />
                </div>
              </div>
              {/* クリックを促す■（右下） */}
              {isTextComplete && !isTransitioning && (
                <div className="absolute bottom-6 right-4 md:bottom-4 md:right-6">
                  <div className="h-1.5 w-3 rounded-sm bg-white/60" />
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default ChapterPlayer
