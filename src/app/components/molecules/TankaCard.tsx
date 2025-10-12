'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import TankaLikeButton from './TankaLikeButton';

interface Tag {
  id: number;
  name: string;
  slug: string;
  category: string;
  description?: string;
  score: number;
  assignedBy: string;
  assignedAt: string;
}

interface TankaCardProps {
  tanka: string;
  createdAt: string;
  index: number;
  tags?: Tag[];
  tweetId?: string;
}

const TankaCard: React.FC<TankaCardProps> = ({ 
  tanka, 
  createdAt, 
  index,
  tags = [],
  tweetId
}) => {
  // 波打ち演出の状態管理
  const [isWaving, setIsWaving] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // ダークモードの検出（メモ化）
  const darkModeObserver = useMemo(() => {
    const checkDarkMode = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    };
    
    checkDarkMode();
    
    // MutationObserverでダークモードの変更を監視
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
    
    return observer;
  }, []);
  
  useEffect(() => {
    return () => darkModeObserver.disconnect();
  }, [darkModeObserver]);
  
  // 短歌を行に分割（メモ化）
  const tankaLines = useMemo(() => 
    tanka.split('\n').filter(line => line.trim()), 
    [tanka]
  );
  
  // クリック時の降下演出（デバウンス）
  const handleClick = useMemo(() => {
    let timeoutId: NodeJS.Timeout;
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      setIsWaving(true);
      timeoutId = setTimeout(() => setIsWaving(false), 2500); // 文字アニメーション完了まで待機
    };
  }, []);
  
  // 日付をフォーマット（メモ化）
  const formattedDate = useMemo(() => {
    const date = new Date(createdAt);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }, [createdAt]);

  // タグをカテゴリ別にグループ化（メモ化）
  const groupedTags = useMemo(() => {
    const groups: { [key: string]: Tag[] } = {};
    tags.forEach(tag => {
      if (!groups[tag.category]) {
        groups[tag.category] = [];
      }
      groups[tag.category].push(tag);
    });
    return groups;
  }, [tags]);

  // カテゴリの表示名を取得
  const getCategoryDisplayName = (category: string) => {
    const categoryNames: { [key: string]: string } = {
      'kigo': '季語',
      'emotion': '感情',
      'theme': 'テーマ',
      'place': '場所'
    };
    return categoryNames[category] || category;
  };

  // 統一されたタグの色を取得
  const getTagColor = () => {
    return 'bg-gray-400/95 text-gray-400 dark:bg-gray-600/90 dark:text-slate-300';
  };

  return (
    <div
      className="bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 p-3 sm:p-4 lg:p-6 relative overflow-hidden flex flex-col justify-between min-h-[200px] sm:min-h-[220px] lg:min-h-[280px] cursor-pointer"
      style={!isDarkMode ? {
        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 30%, #f1f5f9 70%, #e2e8f0 100%)',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.6)'
      } : {}}
      onClick={handleClick}
    >

      {/* 上部コンテナ */}
      <div className="flex-1 flex flex-col">
        {/* 上部の装飾線 */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-12 sm:w-16 h-1 bg-gradient-to-r from-transparent via-gray-300 dark:via-slate-400 to-transparent"></div>
        
        {/* 右上のいいねボタン */}
        {tweetId && (
          <div className="absolute top-3 right-3 z-10">
            <TankaLikeButton tweetId={tweetId} />
          </div>
        )}

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
                    key={`${char}-${charIndex}-${isWaving ? 'animate' : 'static'}`}
                    initial={isWaving ? { 
                      y: -8, 
                      opacity: 0, 
                      rotateZ: Math.random() * 10 - 5,
                      scale: 0.9
                    } : { 
                      y: 0, 
                      opacity: 1, 
                      rotateZ: 0,
                      scale: 1
                    }}
                    animate={{
                      y: 0,
                      opacity: 1,
                      rotateZ: 0,
                      scale: 1
                    }}
                    transition={isWaving ? {
                      duration: 0.5,
                      delay: (lineIndex * 0.15) + (charIndex * 0.05),
                      ease: "easeOut"
                    } : {
                      duration: 0
                    }}
                    style={{ 
                      display: 'inline-block',
                      transformOrigin: 'center center',
                      willChange: isWaving ? 'transform, opacity' : 'auto'
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
        
        {/* タグ表示エリア */}
        {tags.length > 0 && (
          <div className="mb-3">
            <div className="flex flex-wrap gap-1 justify-center">
              {Object.entries(groupedTags).map(([category, categoryTags]) => (
                <div key={category} className="flex flex-wrap gap-1">
                  {categoryTags.map(tag => (
                    <span
                      key={tag.id}
                      className={`px-1.5 py-0.5 sm:px-2 sm:py-1 text-[10px] sm:text-xs rounded-md font-medium ${getTagColor()} transition-all duration-200 hover:scale-105 shadow-sm opacity-60`}
                      title={`${getCategoryDisplayName(category)}: ${tag.description || tag.name}`}
                    >
                      #{tag.name}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* 日付とサイト名 */}
        <div className="text-center text-xs sm:text-xs lg:text-xs text-gray-400 dark:text-slate-300 font-light opacity-60" style={{ fontSize: '10px' }}>
          {formattedDate} / ココアハーツ
        </div>
      </div>

      {/* 微細な光沢エフェクト */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 dark:from-slate-200/10 to-transparent pointer-events-none rounded-xl"></div>
    </div>
  );
};

export default TankaCard;
