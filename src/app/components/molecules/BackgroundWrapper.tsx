// import ParticleBackground from '@/app/components/atoms/ParticlesBackground'
'use client'

import SketchCloud from '@/app/components/atoms/SketchCloud'
import SketchNight from '@/app/components/atoms/SketchNight'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import nextConfig from '../../../../next.config.mjs'
const BASE_PATH = nextConfig.basePath || ''

// p5 の背景は PC 幅（Tailwind の md 以上）だけで描く。モバイルは CSS の雲と星を使う。
const DESKTOP_QUERY = '(min-width: 768px)'
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'

type DesktopSketch = 'cloud' | 'night' | null

// どの p5 背景を描くかを決める。描かない場合は null。
// 以前は昼と夜の 2 枚を display:none の親の下で同時に起動していた。canvas は
// 非表示でも draw ループと p.filter(BLUR) が毎フレーム走り、モバイルでも
// メインスレッドを占有していた（モバイル Lighthouse で TBT 170 秒）。
function useDesktopSketch(enabled: boolean): DesktopSketch {
  const [sketch, setSketch] = useState<DesktopSketch>(null)

  useEffect(() => {
    if (!enabled) {
      return
    }
    const desktop = window.matchMedia(DESKTOP_QUERY)
    const reducedMotion = window.matchMedia(REDUCED_MOTION_QUERY)
    const root = document.documentElement

    const update = () => {
      if (!desktop.matches || reducedMotion.matches) {
        setSketch(null)
        return
      }
      setSketch(root.classList.contains('dark') ? 'night' : 'cloud')
    }
    update()

    // テーマ切替（ThemeSwitch）は html の class を直接書き換えるので class の変化を見る
    const observer = new MutationObserver(update)
    observer.observe(root, { attributes: true, attributeFilter: ['class'] })
    desktop.addEventListener('change', update)
    reducedMotion.addEventListener('change', update)
    return () => {
      observer.disconnect()
      desktop.removeEventListener('change', update)
      reducedMotion.removeEventListener('change', update)
    }
  }, [enabled])

  return enabled ? sketch : null
}

const BackgroundWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const pathname = usePathname()
  const isRootPath = pathname === `${BASE_PATH}/` || pathname === '/'
  const desktopSketch = useDesktopSketch(isRootPath)

  return (
    <div className="relative">
      {isRootPath && (
        <>
          {/* PC用の背景。p5 を読み込む前と reduced-motion のときは同じ色の無地にする */}
          <div className="fixed inset-0 z-0 hidden bg-sky-mobile dark:bg-night-mobile md:block">
            {desktopSketch === 'cloud' && <SketchCloud mode="normal" />}
            {desktopSketch === 'night' && <SketchNight mode="normal" />}
          </div>

          {/* モバイル用の背景 */}
          <div className="fixed inset-0 z-0 block overflow-hidden bg-sky-mobile dark:bg-night-mobile md:hidden">
            {/* 昼モードの雲 */}
            <div className="block dark:hidden">
              <div className="cloud animate-cloud-move-1" />
              <div className="cloud animate-cloud-move-2" />
              <div className="cloud animate-cloud-move-3" />
              <div className="cloud animate-cloud-move-4" />
            </div>

            {/* 夜モードの星 */}
            <div className="hidden dark:block">
              <div className="star animate-twinkle-1" />
              <div className="star animate-twinkle-2" />
              <div className="star animate-twinkle-3" />
              <div className="star animate-twinkle-4" />
              <div className="star animate-twinkle-5" />
              <div className="shooting-star animate-shooting-star-1" />
              <div className="shooting-star animate-shooting-star-2" />
            </div>
          </div>
        </>
      )}
      <div
        className={`${isRootPath ? 'relative min-h-screen bg-transparent pb-32' : 'bg-transparent'}`}
      >
        {children}
      </div>
    </div>
  )
}

export default BackgroundWrapper
