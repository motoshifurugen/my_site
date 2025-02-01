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
          <div className="fixed inset-0 z-0 hidden md:block">
            <div className="block dark:hidden">
              <SketchCloud mode="normal" />
            </div>
            <div className="hidden dark:block">
              <SketchNight mode="normal" />
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
