'use client'

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
          <div className="min-h-screen"></div>
          <div className="fixed inset-0 z-0">
            <SketchCloud />
          </div>
        </>
      )}
      <div
        className={`${isRootPath ? 'relative z-10 pb-32' : ''}`}
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
