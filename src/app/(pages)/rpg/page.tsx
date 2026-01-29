'use client'

import { Suspense, useEffect, useState } from 'react'
import ChapterPlayer from './components/ChapterPlayer'

export default function Rpg() {
  const [isPortrait, setIsPortrait] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // モバイルブラウザのアドレスバーに対応するため、実際のビューポート高さを取得してCSS変数に設定
    const setViewportHeight = () => {
      const vh = window.innerHeight * 0.01
      document.documentElement.style.setProperty('--vh', `${vh}px`)
    }

    // モバイルデバイスかどうかを判定
    const checkMobile = () => {
      const isMobileDevice = window.innerWidth < 768 // md breakpoint
      setIsMobile(isMobileDevice)
      return isMobileDevice
    }

    // 画面の向きを判定
    const checkOrientation = () => {
      // ビューポート高さを更新（アドレスバーの表示/非表示に対応）
      setViewportHeight()

      if (!checkMobile()) {
        setIsPortrait(false)
        return
      }

      // 画面の向きを判定（縦向き = portrait）
      const isPortraitMode = window.innerHeight > window.innerWidth
      setIsPortrait(isPortraitMode)
    }

    // 初回設定
    setViewportHeight()
    checkOrientation()

    // リサイズと向き変更を監視
    window.addEventListener('resize', checkOrientation)
    window.addEventListener('orientationchange', checkOrientation)

    return () => {
      window.removeEventListener('resize', checkOrientation)
      window.removeEventListener('orientationchange', checkOrientation)
    }
  }, [])

  // モバイルで縦向きの場合は回転を促すメッセージを表示
  if (isMobile && isPortrait) {
    return (
      <div
        className="fixed inset-0 w-screen flex items-center justify-center bg-black text-white"
        style={{ height: 'calc(var(--vh, 1vh) * 100)' }}
      >
        <div className="text-center px-4">
          <h2 className="text-xl font-bold mb-2">画面を横にしてください</h2>
          <p className="text-sm opacity-80 mb-2">
            このゲームは横画面でプレイできます
          </p>
          <p className="text-sm opacity-60">
            Please rotate to landscape
          </p>
        </div>
      </div>
    )
  }

  return (
    <div
      className="fixed inset-0 w-screen overflow-hidden"
      style={{ height: 'calc(var(--vh, 1vh) * 100)' }}
    >
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-full">
            <div className="text-white">読み込み中...</div>
          </div>
        }
      >
        <ChapterPlayer />
      </Suspense>
    </div>
  )
}
