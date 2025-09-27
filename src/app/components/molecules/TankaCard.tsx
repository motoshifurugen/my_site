'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface TankaCardProps {
  tanka: string;
  createdAt: string;
  index: number;
}

const TankaCard: React.FC<TankaCardProps> = ({ 
  tanka, 
  createdAt, 
  index 
}) => {
  // 波打ち演出の状態管理
  const [isWaving, setIsWaving] = useState(false);
  
  // 短歌を行に分割
  const tankaLines = tanka.split('\n').filter(line => line.trim());
  
  // クリック時の降下演出
  const handleClick = () => {
    setIsWaving(true);
    // 演出終了後に状態をリセット
    setTimeout(() => setIsWaving(false), 3000);
  };
  
  // 日付をフォーマット
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div
      className="bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 p-3 sm:p-4 lg:p-6 relative overflow-hidden flex flex-col justify-between min-h-[200px] sm:min-h-[220px] lg:min-h-[280px] cursor-pointer"
      onClick={handleClick}
    >
      {/* 上部コンテナ */}
      <div className="flex-1 flex flex-col">
        {/* 上部の装飾線 */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-12 sm:w-16 h-1 bg-gradient-to-r from-transparent via-gray-300 dark:via-slate-400 to-transparent"></div>

        {/* 短歌テキスト（縦書き・中央揃え） */}
        <div className="flex-1 flex justify-center items-center py-6 sm:py-8">
          <div className="flex flex-row-reverse space-x-reverse space-x-2 sm:space-x-3 lg:space-x-4 select-none">
            {tankaLines.map((line, lineIndex) => (
              <div
                key={lineIndex}
                className="text-xs sm:text-sm lg:text-base text-main-black dark:text-night-white leading-relaxed sm:leading-tight font-medium tracking-wider select-none"
                style={{ 
                  writingMode: 'vertical-rl',
                  textOrientation: 'upright',
                  fontFamily: '"Hiragino Mincho ProN", "Yu Mincho", "YuMincho", "Noto Serif JP", "BIZ UDPMincho", serif',
                  userSelect: 'none'
                }}
              >
                {line.split('').map((char, charIndex) => (
                  <motion.span
                    key={`${char}-${charIndex}-${isWaving ? 'falling' : 'static'}`}
                    initial={isWaving ? { 
                      y: -10, 
                      opacity: 0, 
                      rotateZ: Math.random() * 20 - 10,
                      scale: 0.8
                    } : false}
                    animate={isWaving ? {
                      y: 0,
                      opacity: 1,
                      rotateZ: 0,
                      scale: 1
                    } : {}}
                    transition={isWaving ? {
                      duration: 0.8,
                      delay: (lineIndex * 0.2) + (charIndex * 0.08),
                      ease: [0.25, 0.46, 0.45, 0.94], // カスタムイージング（落下感）
                      type: "spring",
                      stiffness: 100,
                      damping: 15
                    } : {}}
                    style={{ 
                      display: 'inline-block',
                      transformOrigin: 'center center'
                    }}
                  >
                    {char}
                  </motion.span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* 下部固定エリア */}
      <div className="mt-auto">
        {/* 下部の装飾線 */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-slate-400 to-transparent mb-3"></div>
        
        {/* 日付とサイト名 */}
        <div className="text-center text-xs sm:text-xs lg:text-xs text-gray-400 dark:text-slate-300 font-light opacity-60" style={{ fontSize: '10px' }}>
          {formatDate(createdAt)} / ココアハーツ
        </div>
      </div>

      {/* 微細な光沢エフェクト */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 dark:from-slate-200/10 to-transparent pointer-events-none rounded-xl"></div>
    </div>
  );
};

export default TankaCard;
