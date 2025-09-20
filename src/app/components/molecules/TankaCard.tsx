'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface TankaCardProps {
  id: string;
  tanka: string;
  originalText: string;
  createdAt: string;
  index: number;
}

const TankaCard: React.FC<TankaCardProps> = ({ 
  id, 
  tanka, 
  originalText, 
  createdAt, 
  index 
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

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

  // グラデーションカラーのバリエーション
  const gradients = [
    'from-pink-400 via-purple-500 to-indigo-600',
    'from-blue-400 via-cyan-500 to-teal-600',
    'from-green-400 via-emerald-500 to-cyan-600',
    'from-yellow-400 via-orange-500 to-red-600',
    'from-purple-400 via-pink-500 to-rose-600',
    'from-indigo-400 via-blue-500 to-cyan-600',
  ];

  const cardGradient = gradients[index % gradients.length];

  return (
    <motion.div
      className="relative w-full h-80 perspective-1000"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.1,
        ease: "easeOut"
      }}
      whileHover={{ y: -8 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* カードコンテナ */}
      <motion.div
        className="relative w-full h-full cursor-pointer preserve-3d"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        {/* 表面 */}
        <div className={`absolute inset-0 w-full h-full backface-hidden rounded-2xl bg-gradient-to-br ${cardGradient} p-6 shadow-xl`}>
          {/* ホバー時の光沢エフェクト */}
          <motion.div
            className="absolute inset-0 rounded-2xl bg-white opacity-0"
            animate={{ opacity: isHovered ? 0.1 : 0 }}
            transition={{ duration: 0.3 }}
          />
          
          {/* 和風の装飾 */}
          <div className="absolute top-4 right-4 w-8 h-8 opacity-30">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full text-white">
              <path d="M12 2L13.09 8.26L19 7L14.74 11.26L21 12L14.74 12.74L19 17L13.09 15.74L12 22L10.91 15.74L5 17L9.26 12.74L3 12L9.26 11.26L5 7L10.91 8.26L12 2Z"/>
            </svg>
          </div>

          {/* 短歌テキスト */}
          <div className="flex flex-col justify-center h-full text-white">
            <div className="text-center space-y-3">
              {tankaLines.map((line, lineIndex) => (
                <motion.div
                  key={lineIndex}
                  className="text-lg font-medium leading-relaxed"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ 
                    delay: index * 0.1 + lineIndex * 0.1,
                    duration: 0.4
                  }}
                >
                  {line}
                </motion.div>
              ))}
            </div>
            
            {/* 日付 */}
            <motion.div 
              className="mt-8 text-center text-white/80 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.1 + 0.5 }}
            >
              {formatDate(createdAt)}
            </motion.div>
          </div>

          {/* フリップヒント */}
          <motion.div
            className="absolute bottom-4 left-4 text-white/60 text-xs"
            animate={{ opacity: isHovered ? 1 : 0.6 }}
            transition={{ duration: 0.3 }}
          >
            タップで詳細表示
          </motion.div>
        </div>

        {/* 裏面 */}
        <div className="absolute inset-0 w-full h-full backface-hidden rotateY-180 rounded-2xl bg-white p-6 shadow-xl border border-gray-200">
          <div className="flex flex-col h-full">
            {/* ヘッダー */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">元のツイート</h3>
              <motion.button
                className="text-gray-400 hover:text-gray-600"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFlipped(false);
                }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>
            </div>

            {/* 元のテキスト */}
            <div className="flex-1 overflow-y-auto">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {originalText}
              </p>
            </div>

            {/* フッター */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>Tweet ID: {id.slice(-8)}</span>
                <span>{formatDate(createdAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TankaCard;
