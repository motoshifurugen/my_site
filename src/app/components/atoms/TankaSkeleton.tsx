'use client';

import React from 'react';

const TankaSkeleton: React.FC = () => {
  return (
    <div className="bg-gradient-to-br from-gray-100 via-gray-50 to-gray-200 dark:from-gray-800 dark:via-gray-850 dark:to-gray-900 rounded-xl shadow-lg p-3 sm:p-4 lg:p-6 relative overflow-hidden flex flex-col justify-between min-h-[200px] sm:min-h-[220px] lg:min-h-[280px] animate-pulse">
      {/* 上部の装飾線 */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-12 sm:w-16 h-1 bg-gray-300 dark:bg-gray-600"></div>

      {/* 短歌テキスト部分のスケルトン */}
      <div className="flex-1 flex justify-center items-center py-6 sm:py-8">
        <div className="flex flex-row-reverse space-x-reverse space-x-2 sm:space-x-3 lg:space-x-4">
          {/* 5行の短歌スケルトン */}
          {Array.from({ length: 5 }, (_, lineIndex) => (
            <div key={lineIndex} className="flex flex-col space-y-1">
              {/* 各行の文字スケルトン */}
              {Array.from({ length: 7 }, (_, charIndex) => (
                <div
                  key={charIndex}
                  className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 bg-gray-300 dark:bg-gray-600 rounded-sm"
                  style={{
                    animationDelay: `${(lineIndex * 0.1) + (charIndex * 0.05)}s`
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
        <div className="w-full h-px bg-gray-300 dark:bg-gray-600 mb-3"></div>
        
        {/* 日付部分のスケルトン */}
        <div className="text-center">
          <div className="h-3 w-32 bg-gray-300 dark:bg-gray-600 rounded mx-auto"></div>
        </div>
      </div>

      {/* 微細な光沢エフェクト */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none rounded-xl"></div>
    </div>
  );
};

export default TankaSkeleton;
