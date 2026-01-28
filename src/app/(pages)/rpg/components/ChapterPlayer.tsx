'use client'

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
import { chapter1 } from '../data/chapter1'
import { chapter1 as chapter1Eng } from '../data/chapter1_eng'
import { chapter2 } from '../data/chapter2'
import { chapter2 as chapter2Eng } from '../data/chapter2_eng'
import { chapter3 } from '../data/chapter3'
import { chapter3 as chapter3Eng } from '../data/chapter3_eng'
import { chapter4 } from '../data/chapter4'
import { chapter4 as chapter4Eng } from '../data/chapter4_eng'
import { chapter5 } from '../data/chapter5'
import { chapter5 as chapter5Eng } from '../data/chapter5_eng'
import { chapter6a } from '../data/chapter6a'
import { chapter6a as chapter6aEng } from '../data/chapter6a_eng'
import { chapter6b } from '../data/chapter6b'
import { chapter6b as chapter6bEng } from '../data/chapter6b_eng'
import { chapter6c } from '../data/chapter6c'
import { chapter6c as chapter6cEng } from '../data/chapter6c_eng'

// 第6章のルート選択を管理するための型
type Chapter6Route = 'bad_end' | 'true_end' | 'another_end' | null

// 言語の型
type Language = 'ja' | 'en'

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
  const searchParams = useSearchParams()
  const chapterParam = searchParams.get('chapter')

  // クエリパラメータから章番号を取得（1-6、無効な値の場合は0）
  const getInitialChapterIndex = () => {
    if (!chapterParam) return 0
    const chapterNum = parseInt(chapterParam, 10)
    // 1-5の範囲で、かつ有効な数値の場合のみ
    if (!isNaN(chapterNum) && chapterNum >= 1 && chapterNum <= 5) {
      return chapterNum - 1 // 0ベースのインデックスに変換
    }
    // 第6章が指定された場合、第5章の最後のシーンから開始
    if (chapterNum === 6) {
      return 4 // 第5章のインデックス
    }
    return 0
  }

  const initialChapterIndex = getInitialChapterIndex()
  // 第6章が指定された場合、第5章の最後のシーンから開始
  const getInitialSceneIndex = () => {
    if (chapterParam) {
      const chapterNum = parseInt(chapterParam, 10)
      if (chapterNum === 6) {
        // 第5章の最後のシーン（選択肢があるシーン）から開始
        return chapter5.scenes.length - 1
      }
    }
    return 0
  }

  const [showTitleScreen, setShowTitleScreen] = useState(!chapterParam) // クエリパラメータがある場合はタイトル画面をスキップ
  const [titleScreenOpacity, setTitleScreenOpacity] = useState(
    !chapterParam ? 1 : 0,
  )
  const [showLoading, setShowLoading] = useState(false)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [currentChapterIndex, setCurrentChapterIndex] =
    useState(initialChapterIndex)
  const [currentSceneIndex, setCurrentSceneIndex] = useState(
    getInitialSceneIndex(),
  )
  const [currentLineIndex, setCurrentLineIndex] = useState(0)
  const [isTextComplete, setIsTextComplete] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [transitionPhase, setTransitionPhase] = useState<
    'idle' | 'fadeOut' | 'white' | 'waiting' | 'fadeIn'
  >('idle')
  const [showChapterTitle, setShowChapterTitle] = useState(false)
  const [chapterTitleOpacity, setChapterTitleOpacity] = useState(0)
  const [chapterTitleTransform, setChapterTitleTransform] =
    useState('translateX(100px)')
  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null)
  const [chapter6Route, setChapter6Route] = useState<Chapter6Route>(null)
  const [shouldTransitionToChapter6, setShouldTransitionToChapter6] =
    useState(false)
  const [showProceedButton, setShowProceedButton] = useState(false)
  const [showEnding, setShowEnding] = useState(false)
  // サーバーとクライアントで一致させるため、初期値は常に'ja'にする
  const [language, setLanguage] = useState<Language>('ja')
  const [showSettingsModal, setShowSettingsModal] = useState(false)

  // クライアントサイドでのみlocalStorageから言語設定を読み込む
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem('rpg_language') as Language
      if (savedLang === 'en' || savedLang === 'ja') {
        setLanguage(savedLang)
      }
    }
  }, [])
  const currentSceneIndexRef = useRef(currentSceneIndex)
  const currentChapterIndexRef = useRef(currentChapterIndex)
  const prevChapterIndexRef = useRef(currentChapterIndex)
  const isMountedRef = useRef(false)

  // 第6章のルートに応じて章を動的に構築
  const getChapters = () => {
    // 言語に応じて適切な章データを選択
    if (language === 'en') {
      const baseChapters = [
        chapter1Eng,
        chapter2Eng,
        chapter3Eng,
        chapter4Eng,
        chapter5Eng,
      ]
      if (chapter6Route === 'bad_end') {
        return [...baseChapters, chapter6aEng]
      } else if (chapter6Route === 'true_end') {
        return [...baseChapters, chapter6bEng]
      } else if (chapter6Route === 'another_end') {
        return [...baseChapters, chapter6cEng]
      }
      return baseChapters
    } else {
      const baseChapters = [chapter1, chapter2, chapter3, chapter4, chapter5]
      if (chapter6Route === 'bad_end') {
        return [...baseChapters, chapter6a]
      } else if (chapter6Route === 'true_end') {
        return [...baseChapters, chapter6b]
      } else if (chapter6Route === 'another_end') {
        return [...baseChapters, chapter6c]
      }
      return baseChapters
    }
  }

  const chapters = getChapters()

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

  // 言語選択ハンドラー
  const handleLanguageSelect = (lang: Language) => {
    setLanguage(lang)
    if (typeof window !== 'undefined') {
      localStorage.setItem('rpg_language', lang)
    }
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

  // 章、シーン、またはテキストが変更されたら完了状態をリセット
  useEffect(() => {
    if (!currentChapter) return
    const currentScene = currentChapter.scenes[currentSceneIndex]
    if (!currentScene) return
    const currentLine =
      currentScene.lines[currentLineIndex] || currentScene.lines[0]
    setIsTextComplete(false)
    // シーンが変わったら選択状態をリセット
    setSelectedChoiceId(null)
    setShowProceedButton(false)
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
      // 最新のchapters配列を取得
      const currentChapters = getChapters()
      const chapter = currentChapters[chapterIndex]

      if (chapter && sceneIndex < chapter.scenes.length - 1) {
        // 同じ章内の次のシーンへ
        setCurrentSceneIndex(sceneIndex + 1)
        setCurrentLineIndex(0)
      } else if (chapter && chapterIndex < currentChapters.length - 1) {
        // 次の章の最初のシーンへ
        setCurrentChapterIndex(chapterIndex + 1)
        setCurrentSceneIndex(0)
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

  // 選択が解除されたら決定ボタンを非表示
  useEffect(() => {
    if (!selectedChoiceId) {
      setShowProceedButton(false)
    }
  }, [selectedChoiceId])

  // 決定ボタンのクリックハンドラー
  const handleChoiceConfirm = () => {
    if (selectedChoiceId) {
      // 第5章の最後のシーンの選択の場合、第6章のルートを決定
      if (
        currentChapterIndex === 4 &&
        currentSceneIndex === currentChapter?.scenes.length - 1
      ) {
        if (selectedChoiceId === 'bad_end') {
          setChapter6Route('bad_end')
        } else if (selectedChoiceId === 'true_end') {
          setChapter6Route('true_end')
        } else if (selectedChoiceId === 'another_end') {
          setChapter6Route('another_end')
        }
        // 選択状態をリセット
        setSelectedChoiceId(null)
        // 第6章への遷移フラグを設定
        setShouldTransitionToChapter6(true)
      }
    }
  }

  // chapter6Routeが設定されたら遷移アニメーションを開始
  useEffect(() => {
    if (shouldTransitionToChapter6 && chapter6Route) {
      setShouldTransitionToChapter6(false)
      setIsTransitioning(true)
    }
  }, [chapter6Route, shouldTransitionToChapter6])

  // キャラクター画像を取得
  const getCharacterImage = (imagePath: string) => {
    const characterImageMap: Record<string, any> = {
      'aoba_1.png': aoba1,
      'aoba_2.png': aoba2,
      'aoba_3.png': aoba3,
      'aoba_4.png': aoba4,
      'kise_1.png': kise1,
      'kise_2.png': kise2,
      'kise_3.png': kise3,
      'saegusa_1.png': saegusa1,
    }
    return characterImageMap[imagePath] || null
  }

  // 話者名から振り仮名を取得
  const getFurigana = (speaker: string): string => {
    const furiganaMap: Record<string, string> = {
      赤羽: 'あかばね',
      青葉: 'あおば',
      黄瀬: 'きせ',
      三枝: 'さえぐさ',
    }
    return furiganaMap[speaker] || ''
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

    // 現在のシーンのテキストがまだ残っている場合
    if (currentLineIndex < currentScene.lines.length - 1) {
      setCurrentLineIndex(currentLineIndex + 1)
    } else {
      // 第6章の最後のシーンの最後の行がクリックされたらエンディングページを表示
      if (
        currentChapterIndex === 5 &&
        currentSceneIndex === currentChapter.scenes.length - 1
      ) {
        setShowEnding(true)
        return
      }

      // 現在のシーンのテキストが最後の場合、遷移アニメーションを開始
      // シーンの切り替えは遷移アニメーション中（白画面で覆われている間）に行う
      if (
        currentSceneIndex < currentChapter.scenes.length - 1 ||
        currentChapterIndex < chapters.length - 1
      ) {
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
      <div className="relative h-full w-full overflow-hidden flex items-center justify-center">
        {/* 背景画像 */}
        <div className="absolute inset-0">
          <Image
            src={endingBackground}
            alt={endingBackgroundAlt}
            fill
            className="object-cover"
            priority
            quality={90}
          />
        </div>
        {/* オーバーレイ */}
        <div className="absolute inset-0 bg-black/40" />

        {/* エンディングコンテンツ */}
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-3xl md:text-5xl font-bold mb-2 md:mb-4 tracking-wide text-white">
            {endingLabel}
          </h1>
          <p className="text-lg md:text-2xl mb-8 md:mb-12 opacity-90 font-light text-white">
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
              setSelectedChoiceId(null)
              setShowProceedButton(false)
            }}
            className="group relative min-h-[52px] px-10 py-3 md:px-12 md:py-3.5 rounded-full font-medium text-sm md:text-base tracking-wide transition-all duration-300 touch-manipulation bg-white/95 text-black hover:bg-white hover:scale-[1.02] active:scale-[0.98] shadow-[0_4px_20px_rgba(255,255,255,0.3)] hover:shadow-[0_6px_30px_rgba(255,255,255,0.4)] backdrop-blur-sm border border-white/20"
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            <span className="relative z-10">Return to the Choice</span>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-white to-white/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>
        </div>
      </div>
    )
  }

  // 章が存在しない場合はエンド画面を表示
  if (!currentChapter) {
    return (
      <div className="relative h-full w-full overflow-hidden flex items-center justify-center bg-black">
        <div className="text-center text-white">
          <h1 className="text-2xl md:text-4xl font-bold mb-4">つづく</h1>
          <p className="text-sm md:text-base opacity-70">
            遊んでいただきありがとうございます
          </p>
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
          <p className="text-sm md:text-base opacity-70">
            遊んでいただきありがとうございます
          </p>
        </div>
      </div>
    )
  }

  const currentScene = currentChapter.scenes[currentSceneIndex]
  const currentBackground =
    currentScene.background === 'station_morning'
      ? stationMorning
      : currentScene.background === 'office_morning'
        ? officeMorning
        : currentScene.background === 'meeting_room'
          ? meetingRoom
          : currentScene.background === 'bar_night'
            ? barNight
            : currentScene.background === 'cafe_lunch'
              ? cafeLunch
              : currentScene.background === 'blue_leaf'
                ? blueLeaf
                : currentScene.background === 'rain_road'
                  ? rainRoad
                  : currentScene.background === 'night_coffee'
                    ? nightCoffee
                    : currentScene.background === 'aoba_room'
                      ? aobaRoom
                      : currentScene.background === 'after_cafe'
                        ? afterCafe
                        : currentScene.background === 'client_room'
                          ? clientRoom
                          : currentScene.background === 'night_platform'
                            ? nightPlatform
                            : stationMorning

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
    setSelectedChoiceId(choiceId)
    // 選択時に決定ボタンを表示
    setShowProceedButton(true)
  }

  // ローディング画面を表示
  if (showLoading) {
    return (
      <div className="relative h-full w-full overflow-hidden select-none">
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
        {/* オーバーレイ */}
        <div className="absolute inset-0 bg-black/50" />

        {/* ローディングコンテンツ */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 px-8">
          {/* ローディングテキスト */}
          <p className="text-white text-lg md:text-xl font-medium mb-6 tracking-wide">
            Now Loading...
          </p>

          {/* プログレスバー */}
          <div className="w-full max-w-xs md:max-w-sm">
            <div className="h-2 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
              <div
                className="h-full bg-white rounded-full transition-all duration-200 ease-out"
                style={{ width: `${loadingProgress}%` }}
              />
            </div>
            {/* パーセンテージ表示 */}
            <p className="text-white/80 text-sm mt-3 text-center">
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
        className="relative h-full w-full overflow-hidden select-none cursor-pointer"
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
        {/* ロゴ画像（画面中央に完全に配置） */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 px-4 py-8 md:py-12">
          <Image
            src={blueLeafLogo}
            alt="Blue Leaf Logo"
            width={800}
            height={400}
            className="w-auto h-auto max-w-[98vw] md:max-w-6xl max-h-[90vh] object-contain"
            priority
            quality={90}
          />
        </div>
        {/* 設定ボタン（画面右上） */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            setShowSettingsModal(true)
          }}
          className="absolute top-6 md:top-8 right-4 md:right-8 z-30 min-h-[48px] px-6 py-2.5 md:px-8 md:py-3 rounded-full font-medium text-sm md:text-base tracking-wide transition-all duration-300 touch-manipulation bg-black/70 text-white border-2 border-white/20 hover:bg-black/80 hover:border-white/30 backdrop-blur-sm"
          style={{ WebkitTapHighlightColor: 'transparent' }}
          aria-label="Settings"
        >
          <span className="relative z-10 flex items-center gap-2">
            <svg
              className="w-5 h-5"
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
        <div className="absolute bottom-8 md:bottom-12 left-1/2 transform -translate-x-1/2 z-20 flex items-end justify-center gap-2 pointer-events-none">
          <p
            className="text-lg md:text-xl font-semibold animate-pulse"
            style={{ color: '#000000' }}
          >
            Press to Start
          </p>
          <div
            className="w-3 h-1.5 m-1 rounded-sm animate-pulse"
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
              className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl shadow-2xl border border-slate-600/50 p-8 md:p-10 max-w-md w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              {/* モーダルヘッダー */}
              <div className="flex items-center justify-between mb-10">
                <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
                  Settings
                </h2>
                <button
                  onClick={() => setShowSettingsModal(false)}
                  className="text-slate-400 hover:text-white transition-colors p-2 -mr-2"
                  aria-label="Close"
                >
                  <svg
                    className="w-6 h-6"
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
                <label className="block text-sm font-medium text-slate-400 mb-6 tracking-wide uppercase">
                  Language / 言語
                </label>
                <div className="flex gap-1 bg-slate-700/30 p-1 rounded-2xl">
                  <button
                    onClick={() => handleLanguageSelect('ja')}
                    className={`flex-1 px-6 py-4 rounded-xl text-sm md:text-base font-medium transition-colors duration-300 border-2 ${
                      language === 'ja'
                        ? 'text-white border-white/30 bg-slate-600/40'
                        : 'text-slate-400 border-transparent hover:text-slate-300'
                    }`}
                  >
                    日本語
                  </button>
                  <button
                    onClick={() => handleLanguageSelect('en')}
                    className={`flex-1 px-6 py-4 rounded-xl text-sm md:text-base font-medium transition-colors duration-300 border-2 ${
                      language === 'en'
                        ? 'text-white border-white/30 bg-slate-600/40'
                        : 'text-slate-400 border-transparent hover:text-slate-300'
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
                  key={`${character.image}-${character.position ?? 'center'}`}
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
                      className="object-contain h-full w-auto"
                      priority={index === 0}
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
          className="absolute top-4 right-4 md:top-6 md:right-6 z-40 px-5 py-2.5 md:px-8 md:py-3 bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-sm border border-slate-600/50 rounded-lg shadow-[0_2px_12px_rgba(0,0,0,0.4)]"
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
            <div className="text-[10px] md:text-xs font-medium text-slate-400 tracking-widest uppercase whitespace-nowrap">
              Chapter {currentChapterIndex + 1}
            </div>
            <div className="h-4 w-px bg-slate-600/50"></div>
            <div className="text-sm md:text-base font-semibold text-slate-200 whitespace-nowrap">
              {currentChapter.title}
            </div>
          </div>
        </div>
      )}

      {/* ゲーム画面のコンテンツエリア */}
      <div className="relative z-10 flex h-full w-full flex-col">
        {/* 選択肢ボタン表示エリア（全画面表示） */}
        {shouldShowChoices ? (
          <div className="flex-1 flex flex-col items-center justify-center px-4 md:px-8 py-8 md:py-12 overflow-y-auto">
            <div className="container mx-auto max-w-xl w-full flex flex-col gap-3 md:gap-4 pb-20 md:pb-4">
              {choices.map((choice, index) => {
                const isSelected = selectedChoiceId === choice.choiceId
                return (
                  <button
                    key={choice.choiceId || index}
                    onClick={(e) => {
                      e.stopPropagation()
                      handleChoiceSelect(choice.choiceId || '')
                    }}
                    className={`group relative w-full min-h-[56px] px-5 py-4 md:px-6 md:py-4 backdrop-blur-md border rounded-lg text-left transition-all duration-200 touch-manipulation ${
                      isSelected
                        ? 'bg-white/20 border-white/40 shadow-[0_0_20px_rgba(255,255,255,0.2)]'
                        : 'bg-black/70 border-white/20 hover:bg-black/80 hover:border-white/30 hover:shadow-[0_0_20px_rgba(255,255,255,0.15)]'
                    } active:scale-[0.97]`}
                    style={{ WebkitTapHighlightColor: 'transparent' }}
                  >
                    <div className="flex items-center justify-between">
                      <div
                        className={`text-base md:text-base leading-relaxed font-medium transition-colors drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] pr-8 ${
                          isSelected
                            ? 'text-white'
                            : 'text-white group-hover:text-white'
                        }`}
                      >
                        {choice.text}
                      </div>
                      <div
                        className={`ml-4 transition-opacity duration-200 flex-shrink-0 ${
                          isSelected
                            ? 'opacity-100'
                            : 'opacity-0 md:opacity-0 group-hover:opacity-100 md:group-hover:opacity-100'
                        }`}
                      >
                        {isSelected ? (
                          <svg
                            className="w-5 h-5 md:w-4 md:h-4 text-white"
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
                            className="w-5 h-5 md:w-4 md:h-4 text-white"
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
            {showProceedButton && selectedChoiceId && (
              <div
                className="fixed bottom-6 md:bottom-8 left-0 right-0 px-4 md:px-8 flex justify-center z-20"
                style={{
                  opacity: showProceedButton ? 1 : 0,
                  transform: showProceedButton
                    ? 'translateY(0)'
                    : 'translateY(20px)',
                  transition: 'opacity 0.4s ease-out, transform 0.4s ease-out',
                }}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleChoiceConfirm()
                  }}
                  className="group relative min-h-[52px] px-10 py-3 md:px-12 md:py-3.5 rounded-full font-medium text-sm md:text-base tracking-wide transition-all duration-300 touch-manipulation bg-white/95 text-black hover:bg-white hover:scale-[1.02] active:scale-[0.98] shadow-[0_4px_20px_rgba(255,255,255,0.3)] hover:shadow-[0_6px_30px_rgba(255,255,255,0.4)] backdrop-blur-sm border border-white/20"
                  style={{ WebkitTapHighlightColor: 'transparent' }}
                >
                  <span className="relative z-10">Proceed</span>
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-white to-white/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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
              className="relative h-32 mb-4 bg-slate-900/70 backdrop-blur-md border-t-2 border-white/20"
              style={getTextBoxStyle()}
            >
              {/* 話者名（左上に飛び出した領域） */}
              {currentLine.speaker && (
                <div className="absolute bottom-full left-4 md:left-6 px-6 py-1.5 bg-slate-900/70 backdrop-blur-md border-2 border-white/20 rounded-t-md">
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
          </>
        )}
      </div>
    </div>
  )
}

export default ChapterPlayer
