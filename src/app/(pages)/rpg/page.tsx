'use client'

import { useEffect, useState } from "react"
import ChapterPlayer from "./components/ChapterPlayer"

export default function Rpg() {
  const [isPortrait, setIsPortrait] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // モバイルデバイスかどうかを判定
    const checkMobile = () => {
      const isMobileDevice = window.innerWidth < 768 // md breakpoint
      setIsMobile(isMobileDevice)
      return isMobileDevice
    }

    // 画面の向きを判定
    const checkOrientation = () => {
      if (!checkMobile()) {
        setIsPortrait(false)
        return
      }

      // 画面の向きを判定（縦向き = portrait）
      const isPortraitMode = window.innerHeight > window.innerWidth
      setIsPortrait(isPortraitMode)
    }

    // 初回チェック
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
      <div className="fixed inset-0 h-screen w-screen flex items-center justify-center bg-black text-white">
        <div className="text-center px-4">
          <h2 className="text-xl font-bold mb-2">画面を横にしてください</h2>
          <p className="text-sm opacity-80">このゲームは横画面でプレイできます</p>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 h-screen w-screen overflow-hidden">
      <ChapterPlayer />
    </div>
  )
}
