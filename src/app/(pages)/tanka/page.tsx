'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TankaCard from '../../components/molecules/TankaCard';
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

interface PaginationData {
  currentPage: number;
  totalItems: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

const TankaPage: React.FC = () => {
  const { t } = useI18n();
  const [tankaList, setTankaList] = useState<TankaData[]>([]);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTankaData = async (page: number = 1) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/my_site/api/tanka?page=${page}&limit=12`);
      if (!response.ok) {
        throw new Error('短歌データの取得に失敗しました');
      }
      
      const data = await response.json();
      setTankaList(data.tanka);
      setPagination(data.pagination);
      setCurrentPage(page);
    } catch (err) {
      setError(err instanceof Error ? err.message : '予期しないエラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTankaData(1);
  }, []);

  const handlePageChange = (page: number) => {
    if (page >= 1 && pagination && page <= pagination.totalPages) {
      fetchTankaData(page);
      // スムーズスクロール
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (loading && currentPage === 1) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingCircle isLoading={true} />
          <motion.p 
            className="mt-4 text-gray-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            短歌を読み込み中...
          </motion.p>
        </div>
      </div>
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
          <div className="text-red-500 text-6xl mb-4">😔</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">エラーが発生しました</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <motion.button
            className="px-6 py-3 bg-main-black text-white rounded-lg font-medium hover:shadow-lg transition-shadow"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => fetchTankaData(currentPage)}
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
            <div className="text-6xl mb-4">🌸</div>
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
                    key={`${tanka.id}-${currentPage}`}
                    tanka={tanka.tanka}
                    createdAt={tanka.createdAt}
                    index={index}
                  />
                ))}
            </div>

            {/* ページネーション */}
            {pagination && pagination.totalPages > 1 && (
              <motion.div 
                className="flex justify-center items-center space-x-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {/* 前のページ */}
                <motion.button
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    pagination.hasPrev
                      ? 'bg-white text-main-black hover:bg-gray-50 shadow-md hover:shadow-lg'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                  whileHover={pagination.hasPrev ? { scale: 1.05 } : {}}
                  whileTap={pagination.hasPrev ? { scale: 0.95 } : {}}
                  onClick={() => pagination.hasPrev && handlePageChange(currentPage - 1)}
                  disabled={!pagination.hasPrev || loading}
                >
                  ← 前へ
                </motion.button>

                {/* ページ番号 */}
                <div className="flex space-x-1">
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    let pageNum;
                    if (pagination.totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= pagination.totalPages - 2) {
                      pageNum = pagination.totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <motion.button
                        key={pageNum}
                        className={`w-10 h-10 rounded-lg font-medium transition-all ${
                          currentPage === pageNum
                            ? 'bg-main-black text-white shadow-lg'
                            : 'bg-white text-gray-600 hover:bg-gray-50 shadow-md hover:shadow-lg'
                        }`}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handlePageChange(pageNum)}
                        disabled={loading}
                      >
                        {pageNum}
                      </motion.button>
                    );
                  })}
                </div>

                {/* 次のページ */}
                <motion.button
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    pagination.hasNext
                      ? 'bg-white text-main-black hover:bg-gray-50 shadow-md hover:shadow-lg'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                  whileHover={pagination.hasNext ? { scale: 1.05 } : {}}
                  whileTap={pagination.hasNext ? { scale: 0.95 } : {}}
                  onClick={() => pagination.hasNext && handlePageChange(currentPage + 1)}
                  disabled={!pagination.hasNext || loading}
                >
                  次へ →
                </motion.button>
              </motion.div>
            )}
          </>
        )}
      </section>

      {/* ローディングオーバーレイ */}
      <AnimatePresence>
        {loading && currentPage > 1 && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="bg-white rounded-2xl p-8 text-center">
              <LoadingCircle isLoading={true} />
              <p className="mt-4 text-gray-600">読み込み中...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default TankaPage;
