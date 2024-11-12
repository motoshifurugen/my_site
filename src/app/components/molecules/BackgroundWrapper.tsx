'use client'

// import ParticleBackground from '@/app/components/atoms/ParticlesBackground'
import SketchCloud from '@/app/components/atoms/SketchCloud'
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
    <div className="relative min-h-screen">
      {isRootPath && (
        <>
          <div className="hidden md:block md:min-h-screen"></div>
          <div className="fixed inset-0 z-0 hidden md:block">
            <SketchCloud mode="normal" />
          </div>
          <div className="fixed inset-0 z-0 md:hidden">
            {/* <ParticleBackground /> */}
            <div
              className="absolute inset-0"
              style={{ backgroundColor: '#86b3e0' }}
            ></div>
          </div>
        </>
      )}
      <div
        className={`${isRootPath ? 'relative z-10 min-h-screen pb-32' : ''}`}
        style={{
          backgroundColor: isRootPath
            ? 'rgba(246, 246, 246, 0.5)'
            : 'transparent',
        }}
      >
        {children}
      </div>
    </div>
  )
}

export default BackgroundWrapper
