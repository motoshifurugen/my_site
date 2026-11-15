'use client'

import React from 'react'

const TankaSkeleton: React.FC = () => {
  return (
    <div className="from-gray-100 via-gray-50 to-gray-200 dark:from-gray-800 dark:via-gray-850 dark:to-gray-900 relative flex min-h-[500px] animate-pulse flex-col justify-between overflow-hidden rounded-xl bg-gradient-to-br p-3 shadow-lg sm:min-h-[580px] sm:p-4 lg:min-h-[650px] lg:p-6">
      {/* 上部の装飾線 */}
      <div className="bg-gray-300 dark:bg-gray-600 absolute left-1/2 top-0 h-1 w-12 -translate-x-1/2 transform sm:w-16"></div>

      {/* 短歌テキスト部分のスケルトン */}
      <div className="flex flex-1 items-center justify-center py-16 sm:py-20">
        <div className="flex flex-row-reverse space-x-6 space-x-reverse sm:space-x-8 lg:space-x-12">
          {/* 5行の短歌スケルトン */}
          {Array.from({ length: 5 }, (_, lineIndex) => (
            <div
              key={lineIndex}
              className="flex flex-col space-y-4 sm:space-y-5"
            >
              {/* 各行の文字スケルトン */}
              {Array.from({ length: 7 }, (_, charIndex: number) => (
                <div
                  key={charIndex}
                  className="bg-gray-300 dark:bg-gray-600 size-4 rounded-sm sm:size-5 lg:size-6"
                  style={{
                    animationDelay: `${lineIndex * 0.1 + charIndex * 0.05}s`,
                  }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* 下部固定エリア */}
      <div className="mt-auto">
        {/* 下部の装飾線 */}
        <div className="bg-gray-300 dark:bg-gray-600 mb-3 h-px w-full"></div>

        {/* 日付部分のスケルトン */}
        <div className="text-center">
          <div className="bg-gray-300 dark:bg-gray-600 mx-auto h-3 w-32 rounded"></div>
        </div>
      </div>

      {/* 微細な光沢エフェクト */}
      <div className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-br from-white/10 to-transparent"></div>
    </div>
  )
}

export default TankaSkeleton
