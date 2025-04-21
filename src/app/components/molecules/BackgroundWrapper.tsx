// import ParticleBackground from '@/app/components/atoms/ParticlesBackground'
'use client'

import SketchCloud from '@/app/components/atoms/SketchCloud'
import SketchNight from '@/app/components/atoms/SketchNight'
import { usePathname } from 'next/navigation'
import React from 'react'
import nextConfig from '../../../../next.config.mjs'
const BASE_PATH = nextConfig.basePath || ''

const BackgroundWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const pathname = usePathname()
  const isRootPath = pathname === `${BASE_PATH}/` || pathname === '/'

  return (
    <div className="relative">
      {isRootPath && (
        <>
          {/* PC用の背景 */}
          <div className="fixed inset-0 z-0 hidden md:block">
            <div className="block dark:hidden">
              <SketchCloud mode="normal" />
            </div>
            <div className="hidden dark:block">
              <SketchNight mode="normal" />
            </div>
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
