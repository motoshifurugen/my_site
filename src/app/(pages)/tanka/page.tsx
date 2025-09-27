'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TankaCard from '../../components/molecules/TankaCard';
import TankaSkeleton from '../../components/atoms/TankaSkeleton';
import LoadingCircle from '../../components/atoms/LoadingCircle';
import AnimatedLine from '../../components/atoms/AnimatedLine';
import PageFace from '../../components/organisms/PageFace';
import { useI18n } from '../../../i18n/context';

interface TankaData {
  id: string;
  tanka: string;
  originalText: string;
  createdAt: string;
  extractedAt: string;
}

interface InfiniteScrollState {
  currentPage: number;
  totalItems: number;
  hasNext: boolean;
  isLoading: boolean;
  isLoadingMore: boolean;
}

const TankaPage: React.FC = () => {
  const { t } = useI18n();
  const [tankaList, setTankaList] = useState<TankaData[]>([]);
  const [scrollState, setScrollState] = useState<InfiniteScrollState>({
    currentPage: 1,
    totalItems: 0,
    hasNext: true,
    isLoading: true,
    isLoadingMore: false
  });
  const [error, setError] = useState<string | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const scrollStateRef = useRef(scrollState);

  const fetchTankaData = useCallback(async (page: number = 1, isLoadMore: boolean = false) => {
    try {
      if (isLoadMore) {
        setScrollState(prev => ({ ...prev, isLoadingMore: true }));
      } else {
        setScrollState(prev => ({ ...prev, isLoading: true }));
      }
      setError(null);
      
      const response = await fetch(`/my_site/api/tanka?page=${page}&limit=12`);
      if (!response.ok) {
        throw new Error('短歌データの取得に失敗しました');
      }
      
      const data = await response.json();
      
      if (isLoadMore) {
        // 既存のデータに追加
        setTankaList(prev => [...prev, ...data.tanka]);
      } else {
        // 初期データとして設定
        setTankaList(data.tanka);
      }
      
      setScrollState(prev => ({
        ...prev,
        currentPage: page,
        totalItems: data.pagination.totalItems,
        hasNext: data.pagination.hasNext,
        isLoading: false,
        isLoadingMore: false
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : '予期しないエラーが発生しました');
      setScrollState(prev => ({
        ...prev,
        isLoading: false,
        isLoadingMore: false
      }));
    }
  }, []);

  // scrollStateRefを更新
  useEffect(() => {
    scrollStateRef.current = scrollState;
  }, [scrollState]);

  // 初期データ読み込み
  useEffect(() => {
    fetchTankaData(1);
  }, [fetchTankaData]);

  // Intersection Observer設定
  const setupObserver = useCallback(() => {
    if (!scrollState.hasNext || scrollState.isLoadingMore) {
      return;
    }

    if (!loadMoreRef.current) {
      return;
    }

    // 既存のObserverをクリーンアップ
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const currentState = scrollStateRef.current;
        
        if (entries[0].isIntersecting && currentState.hasNext && !currentState.isLoadingMore) {
          fetchTankaData(currentState.currentPage + 1, true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '100px'
      }
    );

    observerRef.current = observer;
    observer.observe(loadMoreRef.current);
  }, [scrollState.hasNext, scrollState.isLoadingMore, scrollState.currentPage, fetchTankaData]);

  // Observer設定の実行
  useEffect(() => {
    setupObserver();
  }, [setupObserver]);

  // クリーンアップ
  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  if (scrollState.isLoading && scrollState.currentPage === 1) {
    return (
      <>
        <section className="content-wrapper container mx-auto">
          <PageFace
            title={t.common.tanka}
          />
        </section>

        <AnimatedLine />

        <section className="content-wrapper container mx-auto">
          {/* スケルトンローディング */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-8 lg:gap-12 mb-12 max-w-5xl mx-auto px-6 md:px-0">
            {Array.from({ length: 12 }, (_, index) => (
              <TankaSkeleton key={index} />
            ))}
          </div>
        </section>
      </>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div 
          className="text-center p-8 bg-white rounded-2xl shadow-lg"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-2">エラーが発生しました</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <motion.button
            className="px-6 py-3 bg-main-black text-white rounded-lg font-medium hover:shadow-lg transition-shadow"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => fetchTankaData(scrollState.currentPage)}
          >
            再試行
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <section className="content-wrapper container mx-auto">
        <PageFace
          title={t.common.tanka}
        />
      </section>

      <AnimatedLine />

      <section className="content-wrapper container mx-auto"
        >
        {tankaList.length === 0 ? (
          <motion.div 
            className="text-center py-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-2xl font-bold text-gray-700 mb-2">短歌がまだありません</h2>
            <p className="text-gray-500">短歌収集システムが動作すると、ここに短歌が表示されます。</p>
          </motion.div>
        ) : (
          <>
                {/* 短歌カードグリッド */}
                <div 
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-8 lg:gap-12 mb-12 max-w-5xl mx-auto px-6 md:px-0"
                >
                {tankaList.map((tanka, index) => (
                  <TankaCard
                    key={`${tanka.id}-${index}`}
                    tanka={tanka.tanka}
                    createdAt={tanka.createdAt}
                    index={index}
                  />
                ))}
            </div>

            {/* 無限スクロール用のローディング要素 */}
            {scrollState.hasNext && (
              <div 
                ref={(el) => {
                  loadMoreRef.current = el;
                  // refが設定された後にObserverを設定
                  if (el) {
                    setTimeout(() => setupObserver(), 0);
                  }
                }} 
                className="py-8"
              >
                {scrollState.isLoadingMore ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-8 lg:gap-12 max-w-5xl mx-auto px-6 md:px-0">
                    {Array.from({ length: 6 }, (_, index) => (
                      <TankaSkeleton key={`loading-${index}`} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-gray-400">
                    <p>スクロールして続きを読み込む</p>
                  </div>
                )}
              </div>
            )}

            {/* 全データ読み込み完了 */}
            {!scrollState.hasNext && tankaList.length > 0 && (
              <motion.div 
                className="text-center py-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <p className="text-gray-500">すべての短歌を表示しました</p>
              </motion.div>
            )}
          </>
        )}
      </section>

    </>
  );
};

export default TankaPage;
