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
  // 短歌を行に分割
  const tankaLines = tanka.split('\n').filter(line => line.trim());
  
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
    <motion.div
      className="bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-800 dark:via-gray-850 dark:to-gray-900 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 p-3 sm:p-4 lg:p-6 relative overflow-hidden flex flex-col justify-between min-h-[200px] sm:min-h-[220px] lg:min-h-[280px]"
      style={{
        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 30%, #f1f5f9 70%, #e2e8f0 100%)',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.6)'
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.1,
        ease: "easeOut",
        // ホバーアウト時の高速化設定
        y: { duration: 0.15, ease: "easeOut" },
        scale: { duration: 0.15, ease: "easeOut" }
      }}
      whileHover={{ 
        y: -8, 
        scale: 1.02, 
        transition: { duration: 0.2 },
        boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.15), 0 15px 15px -5px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.8)'
      }}
    >
      {/* 上部コンテナ */}
      <div className="flex-1 flex flex-col">
        {/* 上部の装飾線 */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-12 sm:w-16 h-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>

        {/* 短歌テキスト（縦書き・中央揃え） */}
        <div className="flex-1 flex justify-center items-center py-6 sm:py-8">
          <div className="flex flex-row-reverse space-x-reverse space-x-2 sm:space-x-3 lg:space-x-4 select-none">
            {tankaLines.map((line, lineIndex) => (
              <motion.div
                key={lineIndex}
                className="text-xs sm:text-sm lg:text-base text-main-black dark:text-night-white leading-relaxed sm:leading-tight font-medium tracking-wider select-none"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ 
                  delay: index * 0.1 + lineIndex * 0.1,
                  duration: 0.4
                }}
                style={{ 
                  writingMode: 'vertical-rl',
                  textOrientation: 'upright',
                  fontFamily: '"Hiragino Mincho ProN", "Yu Mincho", "YuMincho", "Noto Serif JP", "BIZ UDPMincho", serif',
                  userSelect: 'none'
                }}
              >
                {line}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      
      {/* 下部固定エリア */}
      <div className="mt-auto">
        {/* 下部の装飾線 */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent mb-3"></div>
        
        {/* 日付とサイト名 */}
        <div className="text-center text-xs sm:text-xs lg:text-xs text-gray-400 dark:text-gray-600 font-light opacity-60" style={{ fontSize: '10px' }}>
          {formatDate(createdAt)} / ココアハーツ
        </div>
      </div>

      {/* 微細な光沢エフェクト */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none rounded-xl"></div>
    </motion.div>
  );
};

export default TankaCard;
